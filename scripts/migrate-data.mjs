// One-off migration: seeds Supabase `products`/`stacks` tables and ImageKit
// from the hardcoded src/data.js PRODUCTS array and StackBuilder.jsx BUNDLES.
// Run: node --env-file=.env scripts/migrate-data.mjs (or `npm run migrate:data`)
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'
import { PRODUCTS, PRODUCT_IMAGE_MAP, FALLBACK_IMAGES } from '../src/data.js'

// Node's ESM loader can't import .jsx directly, so this is inlined from
// src/components/StackBuilder.jsx's BUNDLES const (kept in sync manually
// for this one-off migration; StackBuilder.jsx's own copy is deleted once
// this script has been run and the storefront reads stacks from the DB).
const BUNDLES = [
  {
    id: 'vitality',
    name: "Daily Health Basics",
    description: "Your daily health essentials. Get the vitamins you need, probiotics for a happy gut, and Omega-3 fish oil for your heart and brain.",
    tagline: "Everyday wellness, heart, and gut health",
    productIds: [1, 6], // Multivitamin, Triple Fish Oil
    originalPrice: 1798, // 799 + 999
    comboPrice: 1499, // Save 299 (~17%)
    discountedItems: {
      1: 666,
      6: 833
    },
    badge: "Daily Basics",
    focus: ["Daily Health", "Gut Health", "Heart Support"],
    synergy: "The healthy fats in Fish Oil help your body absorb the vitamins in the Multivitamin much better.",
    schedule: {
      morning: "Take 1 Multivitamin tablet with breakfast.",
      afternoon: "Take 1 Triple Strength Fish Oil softgel with lunch.",
      evening: "None."
    }
  },
  {
    id: 'sleep-calm',
    name: "Deep Sleep & Calm",
    description: "Made to help you relax, lower stress, and get a deep, restful night's sleep so you wake up refreshed.",
    tagline: "Better sleep, less stress, and full relaxation",
    productIds: [2, 18, 19], // Magnesium, Melatonin, Ashwagandha
    originalPrice: 1947, // 699 + 449 + 799
    comboPrice: 1599, // Save 348 (~18%)
    discountedItems: {
      2: 569,
      18: 369,
      19: 661
    },
    badge: "Rest & Relax",
    focus: ["Relaxation", "Less Stress", "Better Sleep"],
    synergy: "Magnesium relaxes your body, Melatonin signals your brain it's time for bed, and Ashwagandha calms your mind so you don't wake up during the night.",
    schedule: {
      morning: "None.",
      afternoon: "Take 1 Ashwagandha capsule after lunch.",
      evening: "Take 2 Magnesium tablets & 1 Melatonin tablet 30-45 minutes before sleep."
    }
  },
  {
    id: 'longevity',
    name: "Healthy Aging Combo",
    description: "Helps boost your natural energy, protect your cells from damage, and keep you feeling young and active.",
    tagline: "More energy, healthy aging, and body protection",
    productIds: [12, 14, 17], // NAD+, Vitamin C, CoQ10
    originalPrice: 2897, // 1499 + 399 + 999
    comboPrice: 2399, // Save 498 (~17%)
    discountedItems: {
      12: 1249,
      14: 329,
      17: 821
    },
    badge: "Anti-Aging",
    focus: ["More Energy", "Cell Health", "Anti-Aging"],
    synergy: "NAD+ helps create energy in your body, CoQ10 carries that energy where it's needed, and Vitamin C acts as a shield to keep your cells healthy.",
    schedule: {
      morning: "Take 1 NAD+ tablet and 1 Vitamin C tablet first thing on an empty stomach.",
      afternoon: "Take 1 CoQ10 capsule with lunch (taking it with food helps absorption).",
      evening: "None."
    }
  },
  {
    id: 'detox-liver',
    name: "Liver & Body Detox",
    description: "A powerful mix to help your liver flush out toxins, digest food better, and keep your body clean and healthy.",
    tagline: "Protects your liver and improves digestion",
    productIds: [9, 10, 11], // Milk Thistle, NAC, TUDCA
    originalPrice: 2497, // 549 + 649 + 1299
    comboPrice: 2099, // Save 398 (~16%)
    discountedItems: {
      9: 459,
      10: 539,
      11: 1101
    },
    badge: "Detox",
    focus: ["Liver Health", "Digestion", "Flushing Toxins"],
    synergy: "NAC helps your body make its own natural antioxidants, Milk Thistle protects your liver, and TUDCA helps clear out waste so toxins can leave your body easily.",
    schedule: {
      morning: "Take 1 TUDCA capsule on an empty stomach.",
      afternoon: "Take 1 NAC capsule between meals.",
      evening: "Take 1 Milk Thistle capsule with dinner."
    }
  },
  {
    id: 'metabolic',
    name: "Weight Loss & Energy",
    description: "A great combo to help boost your metabolism, burn fat, and keep your blood sugar balanced throughout the day.",
    tagline: "Burns fat and balances sugar levels",
    productIds: [22, 23], // Fat Burner, Berberine HCL
    originalPrice: 1898, // 799 + 1099
    comboPrice: 1549, // Save 349 (~18%)
    discountedItems: {
      22: 649,
      23: 900
    },
    badge: "Weight Loss",
    focus: ["Fat Burning", "More Energy", "Sugar Balance"],
    synergy: "The Fat Burner helps your body start burning stored fat. Berberine makes sure that fat and sugar are used for energy instead of being stored again.",
    schedule: {
      morning: "Take 1 Fat Burner capsule 30 minutes before workout or breakfast.",
      afternoon: "Take 1 Berberine HCL capsule 15 minutes before your largest lunch.",
      evening: "None."
    }
  }
]

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const IMAGEKIT_PRIVATE_KEY = process.env.VITE_IMAGEKIT_PRIVATE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !IMAGEKIT_PRIVATE_KEY) {
  console.error('Missing VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or VITE_IMAGEKIT_PRIVATE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

function resolveLocalImagePath(productId) {
  return PRODUCT_IMAGE_MAP[productId] || FALLBACK_IMAGES[productId % FALLBACK_IMAGES.length]
}

const imageUrlCache = new Map()

async function uploadOnce(localPath) {
  if (imageUrlCache.has(localPath)) return imageUrlCache.get(localPath)
  const fileBuffer = readFileSync(new URL(`../public${localPath}`, import.meta.url))
  const form = new FormData()
  form.append('file', new Blob([fileBuffer]))
  form.append('fileName', localPath.split('/').pop())
  form.append('folder', 'kenwell/products')
  form.append('useUniqueFileName', 'false')
  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: { Authorization: `Basic ${Buffer.from(`${IMAGEKIT_PRIVATE_KEY}:`).toString('base64')}` },
    body: form,
  })
  if (!res.ok) throw new Error(`ImageKit upload failed for ${localPath}: ${await res.text()}`)
  const { url } = await res.json()
  imageUrlCache.set(localPath, url)
  console.log(`  uploaded ${localPath} -> ${url}`)
  return url
}

async function main() {
  console.log(`Uploading images for ${PRODUCTS.length} products (deduped)...`)
  const uniquePaths = [...new Set(PRODUCTS.map((p) => resolveLocalImagePath(p.id)))]
  await Promise.all(uniquePaths.map(uploadOnce))

  console.log('Clearing existing products/stacks...')
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('stacks').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  console.log(`Inserting ${PRODUCTS.length} products...`)
  const productIdMap = new Map() // data.js numeric id -> new Supabase UUID
  for (const p of PRODUCTS) {
    const imageUrl = await uploadOnce(resolveLocalImagePath(p.id))
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: p.name,
        slug: p.slug,
        short_description: p.tagline,
        description: p.description,
        price: p.price,
        images: [imageUrl],
        is_active: true,
        series: p.series,
        form: p.form,
        servings: p.servings,
        tagline: p.tagline,
        health_goals: p.healthGoals,
        benefits: p.benefits,
        accent_color: p.accentColor,
        how_to_use: p.howToUse,
        nutritional_facts: p.nutritionalFacts,
        science_text: p.scienceText,
      })
      .select('id')
      .single()
    if (error) throw error
    productIdMap.set(p.id, data.id)
    console.log(`  ${p.slug} -> ${data.id}`)
  }

  console.log(`Inserting ${BUNDLES.length} stacks...`)
  for (const b of BUNDLES) {
    const { data: stack, error } = await supabase
      .from('stacks')
      .insert({
        name: b.name,
        slug: b.id,
        description: b.description,
        tagline: b.tagline,
        badge: b.badge,
        focus: b.focus,
        synergy: b.synergy,
        schedule: b.schedule,
        is_active: true,
      })
      .select('id')
      .single()
    if (error) throw error

    const rows = b.productIds.map((pid, i) => ({
      stack_id: stack.id,
      product_id: productIdMap.get(pid),
      discounted_price: b.discountedItems?.[pid] ?? null,
      sort_order: i,
    }))
    const { error: spErr } = await supabase.from('stack_products').insert(rows)
    if (spErr) throw spErr
    console.log(`  ${b.id} -> ${stack.id} (${rows.length} products)`)
  }

  console.log(`\nMigrated ${PRODUCTS.length} products and ${BUNDLES.length} stacks.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

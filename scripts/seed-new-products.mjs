import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const newProducts = [
  { name: '3X Strength Fish Oil Caps', sku: 'SF', form: 'Capsules', series: 'Core Series' },
  { name: 'Ashwagandha Capsule', sku: 'AS', form: 'Capsules', series: 'Core Series' },
  { name: 'Catalyst Tablet', sku: 'CT', form: 'Tablets', series: 'Core Series' },
  { name: 'Fish Oil Softgel Capsule', sku: 'FO', form: 'Softgels', series: 'Core Series' },
  { name: 'Haddjod Tablet', sku: 'HJ', form: 'Tablets', series: 'Core Series' },
  { name: 'Hair Health Tablet', sku: 'HH', form: 'Tablets', series: 'Core Series' },
  { name: 'Hepavit Tablet', sku: 'HP', form: 'Tablets', series: 'Core Series' },
  { name: 'Integra Tablet', sku: 'IN', form: 'Tablets', series: 'Core Series' },
  { name: 'Liposomal Berberine Caps', sku: 'LB', form: 'Capsules', series: 'Liposomal Series' },
  { name: 'Liposomal CoQ10 Capsule', sku: 'CQ', form: 'Capsules', series: 'Liposomal Series' },
  { name: 'Liposomal Glutathione Tabs', sku: 'LG', form: 'Tablets', series: 'Liposomal Series' },
  { name: 'Liposomal NAC Tablet', sku: 'NA', form: 'Tablets', series: 'Liposomal Series' },
  { name: 'Liposomal Vitamin B12 Caps', sku: 'VB', form: 'Capsules', series: 'Liposomal Series' },
  { name: 'Liposomal Vitamin C Tablet', sku: 'VC', form: 'Tablets', series: 'Liposomal Series' },
  { name: 'Magnesium Glycinate Caps', sku: 'MG', form: 'Capsules', series: 'Core Series' },
  { name: 'Melatonin Tablet', sku: 'ME', form: 'Tablets', series: 'Core Series' },
  { name: 'Milk Thistle Capsule', sku: 'MT', form: 'Capsules', series: 'Core Series' },
  { name: 'Multivitamins Tablet', sku: 'MV', form: 'Tablets', series: 'Core Series' },
  { name: 'Revive Capsule', sku: 'RV', form: 'Capsules', series: 'Core Series' },
  { name: 'Salt Tabs Tablet', sku: 'ST', form: 'Tablets', series: 'Core Series' },
  { name: 'TUDCA Tablet', sku: 'TU', form: 'Tablets', series: 'Core Series' },
  { name: 'Vasopump Tablet', sku: 'VP', form: 'Tablets', series: 'Core Series' },
  { name: 'ZMA Capsule', sku: 'ZM', form: 'Capsules', series: 'Core Series' }
]

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function run() {
  // 1. Deactivate all existing products to avoid duplicate slugs / clutter
  console.log('Deactivating existing products...')
  await supabase.from('products').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000')

  // 2. Deactivate all stacks since their products might be deactivated
  await supabase.from('stacks').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000')

  // 3. Insert new products
  console.log('Inserting new products...')
  const toInsert = newProducts.map(p => ({
    name: p.name,
    slug: generateSlug(p.name),
    price: 999, // placeholder price
    is_active: true,
    series: p.series,
    form: p.form,
    stock_quantity: 500,
    short_description: 'Premium Kenwell Formulation',
    description: `Premium ${p.name} engineered for maximum absorption and clinical efficacy. Formulated with clean ingredients and full transparency.`,
    tagline: 'Feel Good. Live Well.',
    images: ['/bottle_' + generateSlug(p.name) + '.png'],
    how_to_use: { dosage: '1 per day', timing: 'With meals' },
    nutritional_facts: { servingSize: '1 ' + p.form, servingsPerContainer: 30 }
  }))

  const { data, error } = await supabase.from('products').insert(toInsert).select('id, name')
  if (error) {
    console.error('Error inserting:', error)
  } else {
    console.log('Successfully inserted', data.length, 'products.')
  }
}

run()

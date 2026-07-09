import { supabase } from './supabase'

export function normalizeProduct(row) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    series: row.series,
    form: row.form,
    price: Number(row.price),
    servings: row.servings,
    tagline: row.tagline,
    description: row.description,
    healthGoals: row.health_goals || [],
    benefits: row.benefits || [],
    image: row.images?.[0] || '',
    accentColor: row.accent_color,
    howToUse: row.how_to_use || {},
    nutritionalFacts: row.nutritional_facts || {},
    scienceText: row.science_text || '',
  }
}

export async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*').eq('is_active', true)
  if (error) throw error
  return data.map(normalizeProduct)
}

export function normalizeStack(row, products) {
  const byId = new Map(products.map((p) => [p.id, p]))
  const stackProducts = [...(row.stack_products || [])].sort((a, b) => a.sort_order - b.sort_order)
  const productIds = stackProducts.map((x) => x.product_id)

  const originalPrice = stackProducts.reduce((sum, x) => sum + (byId.get(x.product_id)?.price || 0), 0)
  const discountedItems = {}
  let comboPrice = 0
  for (const x of stackProducts) {
    const unitPrice = x.discounted_price ?? byId.get(x.product_id)?.price ?? 0
    if (x.discounted_price != null) discountedItems[x.product_id] = x.discounted_price
    comboPrice += unitPrice
  }

  return {
    id: row.slug,
    dbId: row.id,
    name: row.name,
    description: row.description,
    tagline: row.tagline,
    productIds,
    originalPrice,
    comboPrice,
    discountedItems,
    badge: row.badge,
    focus: row.focus || [],
    synergy: row.synergy,
    schedule: row.schedule || { morning: '', afternoon: '', evening: '' },
  }
}

export async function fetchStacks(products) {
  const { data, error } = await supabase
    .from('stacks')
    .select('*, stack_products(product_id, discounted_price, sort_order)')
    .eq('is_active', true)
  if (error) throw error
  return data.map((row) => normalizeStack(row, products))
}

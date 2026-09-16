import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'node:fs'
import path from 'node:path'

const BASE_URL = process.env.VITE_APP_URL || 'https://kenwell.com'

async function getActiveProducts() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  const { data, error } = await supabase.from('products').select('slug, updated_at').eq('is_active', true)
  if (error) throw error
  return data
}

async function main() {
  const products = await getActiveProducts()
  
  const staticRoutes = [
    { url: '/', priority: '1.0' },
    { url: '/shop', priority: '0.9' },
    { url: '/science', priority: '0.8' },
    { url: '/stack-builder', priority: '0.8' },
    { url: '/stores', priority: '0.7' },
    { url: '/partner', priority: '0.7' },
    { url: '/verify', priority: '0.6' },
    { url: '/track', priority: '0.6' },
  ]

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`

  // Add static routes
  for (const route of staticRoutes) {
    xml += `  <url>\n`
    xml += `    <loc>${BASE_URL}${route.url}</loc>\n`
    xml += `    <changefreq>weekly</changefreq>\n`
    xml += `    <priority>${route.priority}</priority>\n`
    xml += `  </url>\n`
  }

  // Add dynamic product routes
  for (const product of products) {
    xml += `  <url>\n`
    xml += `    <loc>${BASE_URL}/products/${product.slug}</loc>\n`
    xml += `    <lastmod>${new Date(product.updated_at).toISOString()}</lastmod>\n`
    xml += `    <changefreq>daily</changefreq>\n`
    xml += `    <priority>0.9</priority>\n`
    xml += `  </url>\n`
  }

  xml += `</urlset>`

  const outputPath = path.join('public', 'sitemap.xml')
  writeFileSync(outputPath, xml)
  console.log(`✅ Sitemap successfully generated at public/sitemap.xml`)
}

main().catch((err) => {
  console.error('Error generating sitemap:', err)
  process.exit(1)
})

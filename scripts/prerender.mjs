// Build-time prerendering: for each active product, visits the real CSR
// route in headless Chromium (after `vite build`), waits for the page's SEO
// meta effect to run, and snapshots the resulting HTML to
// dist/products/<slug>/index.html. Vercel serves that static file directly
// for that exact path (filesystem match takes priority over the SPA
// catch-all rewrite), so crawlers/link-preview bots see real content
// without executing JS — the normal CSR app still takes over once JS loads.
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { preview } from 'vite'
import { chromium } from 'playwright-core'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const DEFAULT_TITLE = 'Kenwell | Feel Good. Live Well.'

// Vercel's build container is a minimal Linux sandbox missing the shared
// libraries a normal downloaded Chromium needs to run (exits with code 127
// on launch). @sparticuz/chromium ships a Chromium build made specifically
// for these constrained serverless/CI environments. Locally, there's no
// such constraint — just reuse whatever Chrome is already installed on the
// machine (same one used for manual testing throughout this project).
async function launchBrowser() {
  if (process.env.VERCEL) {
    const sparticuzChromium = (await import('@sparticuz/chromium')).default
    return chromium.launch({
      args: sparticuzChromium.args,
      executablePath: await sparticuzChromium.executablePath(),
      headless: true,
    })
  }

  const localChromePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
  ]
  const executablePath = localChromePaths.find((p) => existsSync(p))
  if (!executablePath) {
    throw new Error(
      'No local Chrome install found for prerendering. Install Google Chrome, or add its path to localChromePaths in scripts/prerender.mjs.'
    )
  }
  return chromium.launch({ executablePath, headless: true })
}

async function getActiveSlugs() {
  const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY)
  const { data, error } = await supabase.from('products').select('slug').eq('is_active', true)
  if (error) throw error
  return data.map((p) => p.slug)
}

async function main() {
  const slugs = await getActiveSlugs()
  if (slugs.length === 0) {
    console.log('No active products found — skipping prerender.')
    return
  }
  console.log(`Prerendering ${slugs.length} product pages...`)

  const server = await preview({ preview: { port: 4173, host: '127.0.0.1' } })
  const baseUrl = `http://127.0.0.1:4173`

  const browser = await launchBrowser()
  const page = await browser.newPage()

  for (const slug of slugs) {
    const url = `${baseUrl}/products/${slug}`
    await page.goto(url, { waitUntil: 'networkidle' })
    try {
      await page.waitForFunction(
        (defaultTitle) => document.title !== defaultTitle,
        DEFAULT_TITLE,
        { timeout: 8000 }
      )
    } catch {
      console.warn(`  ! ${slug}: SEO title never updated (product not found or fetch failed) — skipping`)
      continue
    }

    const html = await page.content()
    const outDir = path.join('dist', 'products', slug)
    mkdirSync(outDir, { recursive: true })
    writeFileSync(path.join(outDir, 'index.html'), html)
    console.log(`  + dist/products/${slug}/index.html`)
  }

  await browser.close()
  await server.httpServer.close()
  console.log('Prerender complete.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

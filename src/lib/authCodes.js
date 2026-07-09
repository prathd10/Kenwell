import QRCode from 'qrcode'
import JSZip from 'jszip'
import { supabase } from './supabase'

const CODE_ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ' // Crockford base32, no 0/O/1/I/L
const CODE_LENGTH = 10
const INSERT_CHUNK_SIZE = 500
const QR_CHUNK_SIZE = 200

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function generateCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(CODE_LENGTH))
  let raw = ''
  for (let i = 0; i < CODE_LENGTH; i++) {
    raw += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length]
  }
  return `${raw.slice(0, 4)}-${raw.slice(4, 8)}-${raw.slice(8, 10)}`
}

export function verifyUrl(code) {
  return `${window.location.origin}/?code=${encodeURIComponent(code)}`
}

// Inserts `quantity` new codes for a product into a batch, in chunks,
// regenerating any that happen to collide with an existing code (astronomically
// rare given the alphabet/length, but handled as a hard safety net).
export async function insertCodesChunked(batchId, productId, quantity, onProgress) {
  let remaining = quantity
  let inserted = 0

  while (remaining > 0) {
    const chunkSize = Math.min(INSERT_CHUNK_SIZE, remaining)
    const rows = Array.from({ length: chunkSize }, () => ({
      code: generateCode(),
      product_id: productId,
      batch_id: batchId,
    }))

    const { data, error } = await supabase
      .from('product_auth_codes')
      .upsert(rows, { onConflict: 'code', ignoreDuplicates: true })
      .select('code')

    if (error) throw error

    const actuallyInserted = data?.length ?? 0
    inserted += actuallyInserted
    remaining -= actuallyInserted // shortfall (from rare collisions) loops back around

    onProgress?.(inserted)
  }

  return inserted
}

// Live progress for a batch: { [product_id]: count } of codes already in the DB.
export async function getBatchProgress(batchId) {
  const { data, error } = await supabase
    .from('product_auth_codes')
    .select('product_id')
    .eq('batch_id', batchId)

  if (error) throw error

  const counts = {}
  for (const row of data) {
    counts[row.product_id] = (counts[row.product_id] || 0) + 1
  }
  return counts
}

// Builds a downloadable ZIP of QR PNGs + a manifest CSV for one SKU's codes
// within a single batch (scoped by both product and batch, since the same
// SKU may appear across multiple future batches over time).
export async function buildSkuZip({ product, batchId, batchLabel, onProgress }) {
  const { data: codes, error } = await supabase
    .from('product_auth_codes')
    .select('code, created_at')
    .eq('product_id', product.id)
    .eq('batch_id', batchId)

  if (error) throw error

  const zip = new JSZip()
  const manifestRows = ['code,verify_url,product_name,sku_slug,batch_label,generated_at']

  for (let i = 0; i < codes.length; i += QR_CHUNK_SIZE) {
    const chunk = codes.slice(i, i + QR_CHUNK_SIZE)
    for (const { code, created_at } of chunk) {
      const url = verifyUrl(code)
      const dataUrl = await QRCode.toDataURL(url, { width: 400, margin: 2 })
      const base64 = dataUrl.split(',')[1]
      zip.file(`${code}.png`, base64, { base64: true })
      manifestRows.push(`${code},${url},"${product.name}",${product.slug},"${batchLabel}",${created_at}`)
    }
    onProgress?.(Math.min(i + QR_CHUNK_SIZE, codes.length), codes.length)
    await sleep(0) // yield to keep the tab responsive
  }

  zip.file('manifest.csv', manifestRows.join('\n'))

  return zip.generateAsync({ type: 'blob' })
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

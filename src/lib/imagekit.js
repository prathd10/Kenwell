export async function uploadToImageKit(file, folder = 'kenwell/products') {
  const privateKey = import.meta.env.VITE_IMAGEKIT_PRIVATE_KEY
  const credentials = btoa(`${privateKey}:`)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileName', `${Date.now()}_${file.name.replace(/\s+/g, '_')}`)
  formData.append('folder', folder)
  formData.append('useUniqueFileName', 'false')

  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: { Authorization: `Basic ${credentials}` },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Upload failed')
  }

  return await res.json()
}

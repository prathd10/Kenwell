import { supabase } from './supabase'

export async function uploadToImageKit(file, folder = 'kenwell/products') {
  // 1. Get authentication parameters securely from backend
  const { data: { session } } = await supabase.auth.getSession()
  
  const authRes = await fetch('/api/imagekit-auth', {
    headers: {
      'Authorization': `Bearer ${session?.access_token}`
    }
  })
  
  if (!authRes.ok) {
    throw new Error('Failed to fetch ImageKit authentication parameters')
  }
  const { token, expire, signature } = await authRes.json()

  // 1.5 Strict MIME type validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw new Error(`Invalid file type: ${file.type}. Only JPEG, PNG, and WEBP images are allowed.`)
  }

  // 2. Prepare upload payload using public key and auth parameters
  const formData = new FormData()
  formData.append('file', file)
  formData.append('fileName', `${Date.now()}_${file.name.replace(/\s+/g, '_')}`)
  formData.append('folder', folder)
  formData.append('useUniqueFileName', 'false')
  
  // These are safe for the client
  formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY)
  formData.append('signature', signature)
  formData.append('expire', expire)
  formData.append('token', token)

  // 3. Upload directly to ImageKit API
  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Upload failed')
  }

  return await res.json()
}

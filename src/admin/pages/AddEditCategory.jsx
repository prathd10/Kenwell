import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { uploadToImageKit } from '../../lib/imagekit'
import { ArrowLeft, Upload, X } from 'lucide-react'

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  border: '1.5px solid #DDD8CA', borderRadius: 8,
  fontSize: '0.9rem', color: '#1C2D1A', background: '#FAFAF8',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: '"DM Sans", sans-serif',
}

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

export default function AddEditCategory() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({ name: '', slug: '', description: '' })
  const [imageUrl, setImageUrl] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)

  useEffect(() => {
    if (isEdit) {
      supabase.from('categories').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setForm({ name: data.name, slug: data.slug, description: data.description || '' })
          setImageUrl(data.image_url || '')
          setImagePreview(data.image_url || '')
          setSlugEdited(true)
        }
      })
    }
  }, [id, isEdit])

  const set = (key, val) => {
    setForm(f => {
      const next = { ...f, [key]: val }
      if (key === 'name' && !slugEdited) next.slug = slugify(val)
      return next
    })
  }

  const handleImagePick = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    setUploading(true)
    setError('')
    try {
      const result = await uploadToImageKit(file, 'kenwell/categories')
      setImageUrl(result.url)
    } catch (err) {
      setError(`Image upload failed: ${err.message}`)
      setImagePreview(imageUrl)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Name is required.')
    if (!form.slug.trim()) return setError('Slug is required.')
    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      image_url: imageUrl || null,
      updated_at: new Date().toISOString(),
    }

    const { error: dbErr } = isEdit
      ? await supabase.from('categories').update(payload).eq('id', id)
      : await supabase.from('categories').insert(payload)

    if (dbErr) {
      setError(dbErr.message)
      setSaving(false)
    } else {
      navigate('/admin/categories')
    }
  }

  return (
    <div style={{ maxWidth: 600 }}>
      {/* Back */}
      <button
        onClick={() => navigate('/admin/categories')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#7A8C5A', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontFamily: '"DM Sans", sans-serif', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={15} /> Back to Categories
      </button>

      <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.875rem', color: '#1C2D1A', fontWeight: 600, marginBottom: '0.25rem' }}>
        {isEdit ? 'Edit Category' : 'New Category'}
      </h1>
      <p style={{ color: '#7A8C5A', fontSize: '0.875rem', marginBottom: '2rem' }}>
        {isEdit ? 'Update category details.' : 'Add a new product category to your store.'}
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ background: 'white', borderRadius: 12, padding: '1.75rem', boxShadow: '0 1px 8px rgba(28,45,26,0.06)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Image upload */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#1C2D1A', marginBottom: 8, fontWeight: 500 }}>
              Category Image
            </label>
            <div
              style={{
                width: '100%', height: 180, borderRadius: 10,
                border: '2px dashed #DDD8CA', background: '#F4F1EA',
                overflow: 'hidden', position: 'relative', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => { setImagePreview(''); setImageUrl('') }}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}
                  >
                    <X size={14} />
                  </button>
                </>
              ) : (
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '1rem' }}>
                  <Upload size={28} color="#C9B99A" />
                  <span style={{ fontSize: '0.8rem', color: '#7A8C5A' }}>
                    {uploading ? 'Uploading…' : 'Click to upload image'}
                  </span>
                  <input type="file" accept="image/*" onChange={handleImagePick} style={{ display: 'none' }} disabled={uploading} />
                </label>
              )}
            </div>
            {imagePreview && !uploading && (
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, cursor: 'pointer', fontSize: '0.8rem', color: '#7A8C5A' }}>
                <Upload size={13} /> Change image
                <input type="file" accept="image/*" onChange={handleImagePick} style={{ display: 'none' }} />
              </label>
            )}
          </div>

          {/* Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#1C2D1A', marginBottom: 6, fontWeight: 500 }}>
              Name <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Core Series"
              required
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#2E402B')}
              onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
            />
          </div>

          {/* Slug */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#1C2D1A', marginBottom: 6, fontWeight: 500 }}>
              Slug <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={e => { setSlugEdited(true); set('slug', slugify(e.target.value)) }}
              placeholder="e.g. core-series"
              required
              style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.85rem' }}
              onFocus={e => (e.target.style.borderColor = '#2E402B')}
              onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
            />
            <p style={{ fontSize: '0.75rem', color: '#C9B99A', marginTop: 4 }}>Used in URLs. Auto-generated from name.</p>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#1C2D1A', marginBottom: 6, fontWeight: 500 }}>
              Description
            </label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Brief description of this category…"
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = '#2E402B')}
              onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
            />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 8, borderTop: '1px solid #EAE5D9' }}>
            <button
              type="button"
              onClick={() => navigate('/admin/categories')}
              style={{ padding: '0.65rem 1.25rem', borderRadius: 8, border: '1.5px solid #DDD8CA', background: 'white', color: '#1C2D1A', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || uploading}
              style={{ padding: '0.65rem 1.5rem', borderRadius: 8, border: 'none', background: saving ? '#7A8C5A' : '#2E402B', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', fontWeight: 600 }}
            >
              {saving ? 'Saving…' : isEdit ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { uploadToImageKit } from '../../lib/imagekit'
import { ArrowLeft, Upload, X, GripVertical } from 'lucide-react'

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  border: '1.5px solid #DDD8CA', borderRadius: 8,
  fontSize: '0.9rem', color: '#1C2D1A', background: '#FAFAF8',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: '"DM Sans", sans-serif',
}

const labelStyle = {
  display: 'block', fontSize: '0.85rem',
  color: '#1C2D1A', marginBottom: 6, fontWeight: 500,
}

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function Section({ title, children }) {
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 1px 8px rgba(28,45,26,0.06)', marginBottom: 16 }}>
      {title && (
        <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', color: '#1C2D1A', fontWeight: 600, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #EAE5D9' }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export default function AddEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    name: '', slug: '', short_description: '', description: '',
    price: '', compare_price: '', stock_quantity: '0',
    is_active: true, tags: '',
  })
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState([])
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)

  useEffect(() => {
    supabase.from('categories').select('id, name').order('name').then(({ data }) => setCategories(data || []))

    if (isEdit) {
      supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
        if (!data) return
        setForm({
          name: data.name,
          slug: data.slug,
          short_description: data.short_description || '',
          description: data.description || '',
          price: String(data.price),
          compare_price: data.compare_price ? String(data.compare_price) : '',
          stock_quantity: String(data.stock_quantity ?? 0),
          is_active: data.is_active ?? true,
          tags: (data.tags || []).join(', '),
        })
        setCategoryId(data.category_id || '')
        setImages(data.images || [])
        setSlugEdited(true)
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

  const handleImages = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    setError('')
    try {
      const results = await Promise.all(files.map(f => uploadToImageKit(f, 'kenwell/products')))
      setImages(prev => [...prev, ...results.map(r => r.url)])
    } catch (err) {
      setError(`Image upload failed: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Product name is required.')
    if (!form.slug.trim()) return setError('Slug is required.')
    if (!form.price || isNaN(Number(form.price))) return setError('A valid price is required.')
    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      category_id: categoryId || null,
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      price: Number(form.price),
      compare_price: form.compare_price ? Number(form.compare_price) : null,
      stock_quantity: parseInt(form.stock_quantity, 10) || 0,
      is_active: form.is_active,
      images,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      updated_at: new Date().toISOString(),
    }

    const { error: dbErr } = isEdit
      ? await supabase.from('products').update(payload).eq('id', id)
      : await supabase.from('products').insert(payload)

    if (dbErr) {
      setError(dbErr.message)
      setSaving(false)
    } else {
      navigate('/admin/products')
    }
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <button
        onClick={() => navigate('/admin/products')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#7A8C5A', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontFamily: '"DM Sans", sans-serif', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={15} /> Back to Products
      </button>

      <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.875rem', color: '#1C2D1A', fontWeight: 600, marginBottom: 4 }}>
        {isEdit ? 'Edit Product' : 'New Product'}
      </h1>
      <p style={{ color: '#7A8C5A', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
        {isEdit ? 'Update product details and images.' : 'Fill in the details for your new product.'}
      </p>

      <form onSubmit={handleSubmit}>
        {/* Images */}
        <Section title="Product Images">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 12 }}>
            {images.map((url, i) => (
              <div key={i} style={{ position: 'relative', width: 100, height: 100, borderRadius: 8, overflow: 'hidden', border: '1.5px solid #DDD8CA' }}>
                <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {i === 0 && (
                  <span style={{ position: 'absolute', bottom: 4, left: 4, background: '#2E402B', color: 'white', fontSize: '0.6rem', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>Main</span>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.92)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            <label
              style={{
                width: 100, height: 100, borderRadius: 8,
                border: '2px dashed #DDD8CA', background: '#F4F1EA',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 6, cursor: uploading ? 'not-allowed' : 'pointer',
              }}
            >
              <Upload size={20} color={uploading ? '#C9B99A' : '#7A8C5A'} />
              <span style={{ fontSize: '0.65rem', color: '#7A8C5A', textAlign: 'center' }}>
                {uploading ? 'Uploading…' : 'Add image'}
              </span>
              <input type="file" accept="image/*" multiple onChange={handleImages} style={{ display: 'none' }} disabled={uploading} />
            </label>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#C9B99A' }}>First image will be used as the main product image. Supports multiple uploads.</p>
        </Section>

        {/* Basic info */}
        <Section title="Basic Information">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Name <span style={{ color: '#dc2626' }}>*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Vitamin D3 + K2"
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>

            <div>
              <label style={labelStyle}>Slug <span style={{ color: '#dc2626' }}>*</span></label>
              <input
                type="text"
                value={form.slug}
                onChange={e => { setSlugEdited(true); set('slug', slugify(e.target.value)) }}
                required
                style={{ ...inputStyle, fontFamily: 'monospace', fontSize: '0.85rem' }}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>

            <div>
              <label style={labelStyle}>Category</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              >
                <option value="">No category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Short Description</label>
              <input
                type="text"
                value={form.short_description}
                onChange={e => set('short_description', e.target.value)}
                placeholder="One-line summary shown on product cards"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>

            <div>
              <label style={labelStyle}>Full Description</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Detailed product description, benefits, ingredients…"
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>
          </div>
        </Section>

        {/* Pricing & Inventory */}
        <Section title="Pricing &amp; Inventory">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Price (₹) <span style={{ color: '#dc2626' }}>*</span></label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                placeholder="0.00"
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>
            <div>
              <label style={labelStyle}>Compare at Price (₹)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.compare_price}
                onChange={e => set('compare_price', e.target.value)}
                placeholder="Original price (for discounts)"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>
            <div>
              <label style={labelStyle}>Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={form.stock_quantity}
                onChange={e => set('stock_quantity', e.target.value)}
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>
            <div>
              <label style={labelStyle}>Tags</label>
              <input
                type="text"
                value={form.tags}
                onChange={e => set('tags', e.target.value)}
                placeholder="immunity, sleep, energy  (comma-separated)"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>
          </div>

          {/* Status toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', padding: '1rem', background: '#F4F1EA', borderRadius: 8 }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#1C2D1A', fontWeight: 500 }}>Active / Visible</div>
              <div style={{ fontSize: '0.75rem', color: '#7A8C5A', marginTop: 2 }}>Inactive products are hidden from the store.</div>
            </div>
            <button
              type="button"
              onClick={() => set('is_active', !form.is_active)}
              style={{
                width: 44, height: 24, borderRadius: 12,
                background: form.is_active ? '#2E402B' : '#DDD8CA',
                border: 'none', cursor: 'pointer', position: 'relative',
                transition: 'background 0.2s', flexShrink: 0,
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: 'white',
                position: 'absolute', top: 3,
                left: form.is_active ? 23 : 3,
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
        </Section>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.875rem', marginBottom: 16 }}>
            {error}
          </div>
        )}

        {/* Footer actions */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            style={{ padding: '0.7rem 1.5rem', borderRadius: 8, border: '1.5px solid #DDD8CA', background: 'white', color: '#1C2D1A', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || uploading}
            style={{ padding: '0.7rem 1.75rem', borderRadius: 8, border: 'none', background: saving ? '#7A8C5A' : '#2E402B', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', fontWeight: 600 }}
          >
            {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

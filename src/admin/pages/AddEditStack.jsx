import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, Check, Package } from 'lucide-react'

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

export default function AddEditStack() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    name: '', slug: '', description: '', tagline: '', badge: '', focus: '', synergy: '', is_active: true,
  })
  const [schedule, setSchedule] = useState({ morning: '', afternoon: '', evening: '' })
  const [products, setProducts] = useState([])
  const [selected, setSelected] = useState({}) // product_id -> { discounted_price }
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState('')
  const [slugEdited, setSlugEdited] = useState(false)

  useEffect(() => {
    supabase.from('products').select('id, name, price, images').eq('is_active', true).order('name')
      .then(({ data }) => setProducts(data || []))

    if (isEdit) {
      Promise.all([
        supabase.from('stacks').select('*').eq('id', id).single(),
        supabase.from('stack_products').select('product_id, discounted_price, sort_order').eq('stack_id', id).order('sort_order'),
      ]).then(([{ data: stack }, { data: stackProducts }]) => {
        if (stack) {
          setForm({
            name: stack.name,
            slug: stack.slug,
            description: stack.description || '',
            tagline: stack.tagline || '',
            badge: stack.badge || '',
            focus: (stack.focus || []).join(', '),
            synergy: stack.synergy || '',
            is_active: stack.is_active ?? true,
          })
          setSchedule({
            morning: stack.schedule?.morning || '',
            afternoon: stack.schedule?.afternoon || '',
            evening: stack.schedule?.evening || '',
          })
          setSlugEdited(true)
        }
        const sel = {}
        ;(stackProducts || []).forEach(sp => {
          sel[sp.product_id] = { discounted_price: sp.discounted_price != null ? String(sp.discounted_price) : '' }
        })
        setSelected(sel)
        setLoading(false)
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

  const toggleProduct = (productId) => {
    setSelected(prev => {
      const next = { ...prev }
      if (next[productId]) {
        delete next[productId]
      } else {
        next[productId] = { discounted_price: '' }
      }
      return next
    })
  }

  const setDiscount = (productId, val) => {
    setSelected(prev => ({ ...prev, [productId]: { ...prev[productId], discounted_price: val } }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Stack name is required.')
    if (!form.slug.trim()) return setError('Slug is required.')
    const productIds = Object.keys(selected)
    if (productIds.length < 2) return setError('Select at least 2 products for a stack.')
    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim() || null,
      tagline: form.tagline.trim() || null,
      badge: form.badge.trim() || null,
      focus: form.focus ? form.focus.split(',').map(t => t.trim()).filter(Boolean) : [],
      synergy: form.synergy.trim() || null,
      schedule,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    }

    const { data: stack, error: dbErr } = isEdit
      ? await supabase.from('stacks').update(payload).eq('id', id).select('id').single()
      : await supabase.from('stacks').insert(payload).select('id').single()

    if (dbErr) {
      setError(dbErr.message)
      setSaving(false)
      return
    }

    const stackId = stack.id
    if (isEdit) {
      await supabase.from('stack_products').delete().eq('stack_id', stackId)
    }
    const rows = productIds.map((productId, i) => ({
      stack_id: stackId,
      product_id: productId,
      discounted_price: selected[productId].discounted_price ? Number(selected[productId].discounted_price) : null,
      sort_order: i,
    }))
    const { error: spErr } = await supabase.from('stack_products').insert(rows)

    if (spErr) {
      setError(spErr.message)
      setSaving(false)
    } else {
      navigate('/admin/stacks')
    }
  }

  if (loading) return null

  return (
    <div style={{ maxWidth: 700 }}>
      <button
        onClick={() => navigate('/admin/stacks')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#7A8C5A', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontFamily: '"DM Sans", sans-serif', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={15} /> Back to Stacks
      </button>

      <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.875rem', color: '#1C2D1A', fontWeight: 600, marginBottom: 4 }}>
        {isEdit ? 'Edit Stack' : 'New Stack'}
      </h1>
      <p style={{ color: '#7A8C5A', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
        {isEdit ? 'Update combo details and products.' : 'Build a new product combo.'}
      </p>

      <form onSubmit={handleSubmit}>
        <Section title="Basic Information">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Name <span style={{ color: '#dc2626' }}>*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Deep Sleep & Calm"
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
              <label style={labelStyle}>Tagline</label>
              <input
                type="text"
                value={form.tagline}
                onChange={e => set('tagline', e.target.value)}
                placeholder="One-line summary shown on the stack card"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Badge</label>
                <input
                  type="text"
                  value={form.badge}
                  onChange={e => set('badge', e.target.value)}
                  placeholder="e.g. Rest & Relax"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#2E402B')}
                  onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
                />
              </div>
              <div>
                <label style={labelStyle}>Focus Areas</label>
                <input
                  type="text"
                  value={form.focus}
                  onChange={e => set('focus', e.target.value)}
                  placeholder="Sleep, Stress  (comma-separated)"
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#2E402B')}
                  onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Synergy</label>
              <textarea
                value={form.synergy}
                onChange={e => set('synergy', e.target.value)}
                placeholder="Explain why these products work well together"
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>
          </div>
        </Section>

        <Section title="Daily Schedule">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['morning', 'afternoon', 'evening'].map(period => (
              <div key={period}>
                <label style={{ ...labelStyle, textTransform: 'capitalize' }}>{period}</label>
                <input
                  type="text"
                  value={schedule[period]}
                  onChange={e => setSchedule(s => ({ ...s, [period]: e.target.value }))}
                  placeholder={`What to take in the ${period}`}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#2E402B')}
                  onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Products in this Stack">
          <p style={{ fontSize: '0.78rem', color: '#7A8C5A', marginBottom: '1rem' }}>
            Select at least 2 products. Optionally set a discounted per-unit price for when it's bought as part of this combo — leave blank to use the full price.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 360, overflowY: 'auto' }}>
            {products.map(p => {
              const isSelected = !!selected[p.id]
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '0.6rem 0.75rem', borderRadius: 8,
                    border: `1.5px solid ${isSelected ? '#2E402B' : '#DDD8CA'}`,
                    background: isSelected ? '#F4F1EA' : 'white',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleProduct(p.id)}
                    style={{
                      width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                      border: `1.5px solid ${isSelected ? '#2E402B' : '#DDD8CA'}`,
                      background: isSelected ? '#2E402B' : 'white',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {isSelected && <Check size={13} color="white" />}
                  </button>
                  <div style={{ width: 30, height: 30, borderRadius: 6, background: '#EAE5D9', overflow: 'hidden', flexShrink: 0 }}>
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                        <Package size={14} color="#C9B99A" />
                      </div>
                    )}
                  </div>
                  <span style={{ flex: 1, fontSize: '0.85rem', color: '#1C2D1A' }}>{p.name}</span>
                  <span style={{ fontSize: '0.78rem', color: '#7A8C5A' }}>₹{Number(p.price).toLocaleString('en-IN')}</span>
                  {isSelected && (
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={selected[p.id].discounted_price}
                      onChange={e => setDiscount(p.id, e.target.value)}
                      placeholder="Discount ₹"
                      style={{ ...inputStyle, width: 110, padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
                      onFocus={e => (e.target.style.borderColor = '#2E402B')}
                      onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </Section>

        {/* Status toggle */}
        <Section title={null}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#1C2D1A', fontWeight: 500 }}>Active / Visible</div>
              <div style={{ fontSize: '0.75rem', color: '#7A8C5A', marginTop: 2 }}>Inactive stacks are hidden from the store.</div>
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

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={() => navigate('/admin/stacks')}
            style={{ padding: '0.7rem 1.5rem', borderRadius: 8, border: '1.5px solid #DDD8CA', background: 'white', color: '#1C2D1A', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{ padding: '0.7rem 1.75rem', borderRadius: 8, border: 'none', background: saving ? '#7A8C5A' : '#2E402B', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', fontWeight: 600 }}
          >
            {saving ? 'Saving…' : isEdit ? 'Update Stack' : 'Create Stack'}
          </button>
        </div>
      </form>
    </div>
  )
}

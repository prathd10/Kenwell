import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { ArrowLeft } from 'lucide-react'

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

export default function AddEditStore() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id

  const [form, setForm] = useState({
    name: '',
    type: 'Official Store',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    phone: '',
    map_link: '',
    is_active: true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isEdit) {
      supabase
        .from('stores')
        .select('*')
        .eq('id', id)
        .single()
        .then(({ data, error }) => {
          if (data && !error) {
            setForm({
              name: data.name,
              type: data.type,
              address: data.address,
              city: data.city,
              state: data.state,
              postal_code: data.postal_code,
              phone: data.phone || '',
              map_link: data.map_link,
              is_active: data.is_active ?? true,
            })
          }
        })
    }
  }, [id, isEdit])

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Store name is required.')
    if (!form.address.trim()) return setError('Street address is required.')
    if (!form.city.trim()) return setError('City is required.')
    if (!form.state.trim()) return setError('State is required.')
    if (!form.postal_code.trim()) return setError('Postal code is required.')
    if (!form.map_link.trim()) return setError('Google Maps Link is required.')
    
    // Quick link check to ensure it points to google maps or is a url
    if (!form.map_link.toLowerCase().startsWith('http://') && !form.map_link.toLowerCase().startsWith('https://')) {
      return setError('Google Maps link must be a valid URL starting with http:// or https://')
    }

    setSaving(true)
    setError('')

    const payload = {
      name: form.name.trim(),
      type: form.type,
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postal_code: form.postal_code.trim(),
      phone: form.phone.trim() || null,
      map_link: form.map_link.trim(),
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    }

    const { error: dbErr } = isEdit
      ? await supabase.from('stores').update(payload).eq('id', id)
      : await supabase.from('stores').insert(payload)

    if (dbErr) {
      setError(dbErr.message)
      setSaving(false)
    } else {
      navigate('/admin/stores')
    }
  }

  return (
    <div style={{ maxWidth: 700 }}>
      <button
        onClick={() => navigate('/admin/stores')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#7A8C5A', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontFamily: '"DM Sans", sans-serif', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={15} /> Back to Stores
      </button>

      <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.875rem', color: '#1C2D1A', fontWeight: 600, marginBottom: 4 }}>
        {isEdit ? 'Edit Store Details' : 'New Store Listing'}
      </h1>
      <p style={{ color: '#7A8C5A', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
        {isEdit ? 'Update details, location details, and maps link.' : 'Create a new official store or authorized store partner.'}
      </p>

      <form onSubmit={handleSubmit}>
        <Section title="Store Information">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Store / Partner Name <span style={{ color: '#dc2626' }}>*</span></label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g. Kenwell Flagship Store - Bandra"
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>

            <div>
              <label style={labelStyle}>Store Type <span style={{ color: '#dc2626' }}>*</span></label>
              <select
                value={form.type}
                onChange={e => set('type', e.target.value)}
                style={{ ...inputStyle, cursor: 'pointer' }}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              >
                <option value="Official Store">Official Store</option>
                <option value="Store Partner">Store Partner</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Contact Phone Number</label>
              <input
                type="text"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="e.g. +91 98765 43210"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>
          </div>
        </Section>

        <Section title="Location &amp; Mapping">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Street Address <span style={{ color: '#dc2626' }}>*</span></label>
              <input
                type="text"
                value={form.address}
                onChange={e => set('address', e.target.value)}
                placeholder="e.g. Ground Floor, Hill Road, Bandra West"
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>City <span style={{ color: '#dc2626' }}>*</span></label>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => set('city', e.target.value)}
                  placeholder="Mumbai"
                  required
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#2E402B')}
                  onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
                />
              </div>
              <div>
                <label style={labelStyle}>State <span style={{ color: '#dc2626' }}>*</span></label>
                <input
                  type="text"
                  value={form.state}
                  onChange={e => set('state', e.target.value)}
                  placeholder="Maharashtra"
                  required
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#2E402B')}
                  onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
                />
              </div>
              <div>
                <label style={labelStyle}>Postal Code <span style={{ color: '#dc2626' }}>*</span></label>
                <input
                  type="text"
                  value={form.postal_code}
                  onChange={e => set('postal_code', e.target.value)}
                  placeholder="400050"
                  required
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#2E402B')}
                  onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Google Maps Sharing/Search Link <span style={{ color: '#dc2626' }}>*</span></label>
              <input
                type="text"
                value={form.map_link}
                onChange={e => set('map_link', e.target.value)}
                placeholder="e.g. https://maps.google.com/?q=Hill+Road+Bandra+West+Mumbai or sharing link https://goo.gl/maps/..."
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#2E402B')}
                onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
              />
              <p style={{ fontSize: '0.75rem', color: '#7A8C5A', marginTop: 4 }}>
                Go to Google Maps, find the location, copy the share link or browser URL, and paste it here.
              </p>
            </div>
          </div>

          {/* Status Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', padding: '1rem', background: '#F4F1EA', borderRadius: 8 }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#1C2D1A', fontWeight: 500 }}>Active / Visible</div>
              <div style={{ fontSize: '0.75rem', color: '#7A8C5A', marginTop: 2 }}>Inactive stores are hidden from the user-facing store locator.</div>
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
            onClick={() => navigate('/admin/stores')}
            style={{ padding: '0.7rem 1.5rem', borderRadius: 8, border: '1.5px solid #DDD8CA', background: 'white', color: '#1C2D1A', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            style={{ padding: '0.7rem 1.75rem', borderRadius: 8, border: 'none', background: saving ? '#7A8C5A' : '#2E402B', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', fontWeight: 600 }}
          >
            {saving ? 'Saving…' : isEdit ? 'Update Store' : 'Create Store'}
          </button>
        </div>
      </form>
    </div>
  )
}

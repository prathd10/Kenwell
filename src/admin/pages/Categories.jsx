import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, Tag, Layers } from 'lucide-react'

export default function Categories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [confirmId, setConfirmId] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('categories')
      .select('*, products(count)')
      .order('created_at', { ascending: false })
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    setDeleting(id)
    await supabase.from('categories').delete().eq('id', id)
    setConfirmId(null)
    setDeleting(null)
    load()
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 3, height: 20, background: '#7A8C5A', borderRadius: 2 }} />
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#1C2D1A', fontWeight: 600 }}>
              Categories
            </h1>
          </div>
          <p style={{ color: '#7A8C5A', fontSize: '0.875rem', paddingLeft: 13 }}>
            {categories.length} {categories.length === 1 ? 'category' : 'categories'} total
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/categories/new')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '0.65rem 1.25rem',
            background: '#2E402B', color: 'white', border: 'none',
            borderRadius: 9, cursor: 'pointer', fontSize: '0.875rem',
            fontWeight: 600, fontFamily: '"DM Sans", sans-serif',
            boxShadow: '0 2px 8px rgba(46,64,43,0.25)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#253C22'; e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#2E402B'; e.currentTarget.style.transform = 'none' }}
        >
          <Plus size={15} strokeWidth={2.5} /> Add Category
        </button>
      </div>

      {loading ? (
        <LoadingGrid />
      ) : categories.length === 0 ? (
        <EmptyState navigate={navigate} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
          {categories.map(cat => (
            <CategoryCard key={cat.id} cat={cat} navigate={navigate} onDelete={() => setConfirmId(cat.id)} />
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {confirmId && (
        <Modal
          title="Delete Category?"
          body="This action cannot be undone. Products in this category will become uncategorised."
          onCancel={() => setConfirmId(null)}
          onConfirm={() => handleDelete(confirmId)}
          confirmLabel={deleting === confirmId ? 'Deleting…' : 'Delete'}
          loading={!!deleting}
        />
      )}
    </div>
  )
}

function CategoryCard({ cat, navigate, onDelete }) {
  const [hovered, setHovered] = useState(false)
  const count = cat.products?.[0]?.count ?? 0

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: hovered ? '0 8px 28px rgba(28,45,26,0.12)' : '0 2px 10px rgba(28,45,26,0.06)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Image area */}
      <div style={{ height: 156, background: 'linear-gradient(135deg, #EAE5D9 0%, #DDD8CA 100%)', position: 'relative', overflow: 'hidden' }}>
        {cat.image_url ? (
          <img src={cat.image_url} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease', transform: hovered ? 'scale(1.04)' : 'scale(1)' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 8 }}>
            <Layers size={32} color="#C9B99A" />
            <span style={{ fontSize: '0.72rem', color: '#C9B99A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>No image</span>
          </div>
        )}
        {/* Product count badge */}
        <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(28,45,26,0.8)', backdropFilter: 'blur(4px)', color: '#F4F1EA', fontSize: '0.7rem', fontWeight: 600, padding: '4px 10px', borderRadius: 20, letterSpacing: '0.04em' }}>
          {count} {count === 1 ? 'product' : 'products'}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.125rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: '1rem', color: '#1C2D1A', fontWeight: 600, marginBottom: 4, fontFamily: '"DM Sans", sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {cat.name}
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#7A8C5A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {cat.description || 'No description'}
            </p>
            <div style={{ marginTop: 8, fontSize: '0.68rem', color: '#C9B99A', fontFamily: 'monospace' }}>
              /{cat.slug}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, flexShrink: 0 }}>
            <button
              onClick={() => navigate(`/admin/categories/${cat.id}/edit`)}
              title="Edit"
              style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #DDD8CA', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A8C5A', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F4F1EA'; e.currentTarget.style.borderColor = '#7A8C5A' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#DDD8CA' }}
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={onDelete}
              title="Delete"
              style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #fecaca', background: '#fef2f2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2' }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ navigate }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: '5rem 2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(28,45,26,0.06)' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
        <Tag size={28} color="#DDD8CA" />
      </div>
      <p style={{ color: '#7A8C5A', marginBottom: '1rem', fontSize: '0.95rem' }}>No categories yet</p>
      <button
        onClick={() => navigate('/admin/categories/new')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0.65rem 1.25rem', background: '#2E402B', color: 'white', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}
      >
        <Plus size={15} /> Create your first category
      </button>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 10px rgba(28,45,26,0.06)' }}>
          <div style={{ height: 156, background: 'linear-gradient(90deg, #EAE5D9 25%, #F4F1EA 50%, #EAE5D9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
          <div style={{ padding: '1.125rem 1.25rem' }}>
            <div style={{ height: 14, width: '60%', background: '#EAE5D9', borderRadius: 4, marginBottom: 8 }} />
            <div style={{ height: 12, width: '80%', background: '#F4F1EA', borderRadius: 4 }} />
          </div>
          <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
        </div>
      ))}
    </div>
  )
}

function Modal({ title, body, onCancel, onConfirm, confirmLabel, loading }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(3px)' }}>
      <div style={{ background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 380, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.375rem', color: '#1C2D1A', marginBottom: 10 }}>{title}</h3>
        <p style={{ color: '#7A8C5A', fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>{body}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '0.65rem 1.25rem', borderRadius: 9, border: '1.5px solid #DDD8CA', background: 'white', color: '#1C2D1A', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem' }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} style={{ padding: '0.65rem 1.25rem', borderRadius: 9, border: 'none', background: '#dc2626', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', fontWeight: 600 }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

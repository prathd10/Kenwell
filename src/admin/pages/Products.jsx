import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, Package, Search, SlidersHorizontal } from 'lucide-react'

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const load = async () => {
    setLoading(true)
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('id, name, price, stock_quantity, is_active, images, created_at, categories(id, name)').order('created_at', { ascending: false }),
      supabase.from('categories').select('id, name').order('name'),
    ])
    setProducts(prods || [])
    setCategories(cats || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    setDeleting(id)
    await supabase.from('products').delete().eq('id', id)
    setConfirmId(null)
    setDeleting(null)
    load()
  }

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat ? p.categories?.id === filterCat : true
    return matchSearch && matchCat
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 3, height: 20, background: '#2E402B', borderRadius: 2 }} />
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#1C2D1A', fontWeight: 600 }}>
              Products
            </h1>
          </div>
          <p style={{ color: '#7A8C5A', fontSize: '0.875rem', paddingLeft: 13 }}>
            {products.length} {products.length === 1 ? 'product' : 'products'} in catalogue
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/products/new')}
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
          <Plus size={15} strokeWidth={2.5} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#C9B99A', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: '0.65rem', paddingBottom: '0.65rem',
              border: '1.5px solid #DDD8CA', borderRadius: 9, fontSize: '0.875rem',
              background: 'white', color: '#1C2D1A', outline: 'none',
              fontFamily: '"DM Sans", sans-serif', boxSizing: 'border-box', transition: 'border-color 0.15s',
            }}
            onFocus={e => (e.target.style.borderColor = '#2E402B')}
            onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <SlidersHorizontal size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#C9B99A', pointerEvents: 'none' }} />
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            style={{
              paddingLeft: 28, paddingRight: 12, paddingTop: '0.65rem', paddingBottom: '0.65rem',
              border: '1.5px solid #DDD8CA', borderRadius: 9, fontSize: '0.875rem',
              background: 'white', color: filterCat ? '#1C2D1A' : '#C9B99A',
              outline: 'none', fontFamily: '"DM Sans", sans-serif', cursor: 'pointer', appearance: 'none',
            }}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {(search || filterCat) && (
          <button
            onClick={() => { setSearch(''); setFilterCat('') }}
            style={{ fontSize: '0.78rem', color: '#7A8C5A', background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', textDecoration: 'underline' }}
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState products={products} navigate={navigate} />
      ) : (
        <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(28,45,26,0.06)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#F4F1EA' }}>
                <th style={th()}>Product</th>
                <th style={th()} className="hide-sm">Category</th>
                <th style={{ ...th(), textAlign: 'right' }}>Price</th>
                <th style={{ ...th(), textAlign: 'right' }} className="hide-sm">Stock</th>
                <th style={{ ...th(), textAlign: 'center' }}>Status</th>
                <th style={{ ...th(), textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <ProductRow
                  key={p.id}
                  product={p}
                  isLast={i === filtered.length - 1}
                  navigate={navigate}
                  onDelete={() => setConfirmId(p.id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirm */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 380, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.375rem', color: '#1C2D1A', marginBottom: 10 }}>Delete Product?</h3>
            <p style={{ color: '#7A8C5A', fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
              This will permanently remove the product from your catalogue.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmId(null)} style={{ padding: '0.65rem 1.25rem', borderRadius: 9, border: '1.5px solid #DDD8CA', background: 'white', color: '#1C2D1A', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem' }}>Cancel</button>
              <button onClick={() => handleDelete(confirmId)} disabled={!!deleting} style={{ padding: '0.65rem 1.25rem', borderRadius: 9, border: 'none', background: '#dc2626', color: 'white', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', fontWeight: 600 }}>
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) { .hide-sm { display: none !important; } }
      `}</style>
    </div>
  )
}

function th() {
  return {
    padding: '0.875rem 1.25rem',
    textAlign: 'left',
    color: '#7A8C5A',
    fontWeight: 600,
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    whiteSpace: 'nowrap',
  }
}

function ProductRow({ product: p, isLast, navigate, onDelete }) {
  const [hovered, setHovered] = useState(false)
  return (
    <tr
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: isLast ? 'none' : '1px solid #F4F1EA',
        background: hovered ? '#FAFAF8' : 'white',
        transition: 'background 0.1s',
      }}
    >
      <td style={{ padding: '0.875rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 9, background: '#EAE5D9', overflow: 'hidden', flexShrink: 0, border: '1px solid #DDD8CA' }}>
            {p.images?.[0] ? (
              <img src={p.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Package size={16} color="#C9B99A" />
              </div>
            )}
          </div>
          <span style={{ fontWeight: 500, color: '#1C2D1A', fontSize: '0.875rem' }}>{p.name}</span>
        </div>
      </td>
      <td style={{ padding: '0.875rem 1.25rem' }} className="hide-sm">
        {p.categories?.name ? (
          <span style={{ background: '#F4F1EA', color: '#7A8C5A', fontSize: '0.72rem', fontWeight: 600, padding: '3px 9px', borderRadius: 20, letterSpacing: '0.03em' }}>
            {p.categories.name}
          </span>
        ) : (
          <span style={{ color: '#DDD8CA', fontSize: '0.8rem' }}>—</span>
        )}
      </td>
      <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
        <span style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.05rem', fontWeight: 600, color: '#1C2D1A' }}>
          ₹{Number(p.price).toLocaleString('en-IN')}
        </span>
      </td>
      <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }} className="hide-sm">
        <span style={{ fontSize: '0.875rem', color: p.stock_quantity <= 0 ? '#dc2626' : p.stock_quantity <= 5 ? '#d97706' : '#1C2D1A', fontWeight: p.stock_quantity <= 5 ? 600 : 400 }}>
          {p.stock_quantity}
        </span>
      </td>
      <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600,
          background: p.is_active ? '#dcfce7' : '#FEF3C7',
          color: p.is_active ? '#166534' : '#92400E',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.is_active ? '#166534' : '#d97706' }} />
          {p.is_active ? 'Active' : 'Inactive'}
        </span>
      </td>
      <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <button
            onClick={() => navigate(`/admin/products/${p.id}/edit`)}
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
            style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #fecaca', background: '#fef2f2', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', transition: 'background 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#fee2e2')}
            onMouseLeave={e => (e.currentTarget.style.background = '#fef2f2')}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  )
}

function EmptyState({ products, navigate }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: '5rem 2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(28,45,26,0.06)' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
        <Package size={28} color="#DDD8CA" />
      </div>
      <p style={{ color: '#7A8C5A', marginBottom: '1rem', fontSize: '0.95rem' }}>
        {products.length === 0 ? 'No products yet.' : 'No products match your search.'}
      </p>
      {products.length === 0 && (
        <button onClick={() => navigate('/admin/products/new')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0.65rem 1.25rem', background: '#2E402B', color: 'white', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
          <Plus size={15} /> Add your first product
        </button>
      )}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(28,45,26,0.06)' }}>
      <div style={{ height: 44, background: '#F4F1EA' }} />
      {[1, 2, 3, 4].map(i => (
        <div key={i} style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #F4F1EA', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 9, background: '#EAE5D9', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 13, width: '40%', background: '#EAE5D9', borderRadius: 4, marginBottom: 6 }} />
            <div style={{ height: 11, width: '25%', background: '#F4F1EA', borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

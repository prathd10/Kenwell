import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Plus, Pencil, Trash2, MapPin, Search, SlidersHorizontal, ExternalLink } from 'lucide-react'

export default function Stores() {
  const navigate = useNavigate()
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [toggling, setToggling] = useState(null)

  const loadStores = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error) {
      setStores(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadStores()
  }, [])

  const handleDelete = async (id) => {
    setDeleting(id)
    await supabase.from('stores').delete().eq('id', id)
    setConfirmId(null)
    setDeleting(null)
    loadStores()
  }

  const handleToggleActive = async (id, currentStatus) => {
    setToggling(id)
    await supabase
      .from('stores')
      .update({ is_active: !currentStatus })
      .eq('id', id)
    setToggling(null)
    loadStores()
  }

  const filteredStores = stores.filter(store => {
    const matchSearch = 
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.city.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
    
    const matchType = filterType ? store.type === filterType : true
    
    const matchStatus = filterStatus !== '' 
      ? (filterStatus === 'active' ? store.is_active : !store.is_active)
      : true

    return matchSearch && matchType && matchStatus
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 3, height: 20, background: '#2E402B', borderRadius: 2 }} />
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#1C2D1A', fontWeight: 600 }}>
              Stores &amp; Partners
            </h1>
          </div>
          <p style={{ color: '#7A8C5A', fontSize: '0.875rem', paddingLeft: 13 }}>
            {stores.length} {stores.length === 1 ? 'store' : 'stores'} registered in system
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/stores/new')}
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
          <Plus size={15} strokeWidth={2.5} /> Add Store
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#C9B99A', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by name, address, city…"
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
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            style={{
              paddingLeft: 28, paddingRight: 28, paddingTop: '0.65rem', paddingBottom: '0.65rem',
              border: '1.5px solid #DDD8CA', borderRadius: 9, fontSize: '0.875rem',
              background: 'white', color: filterType ? '#1C2D1A' : '#C9B99A',
              outline: 'none', fontFamily: '"DM Sans", sans-serif', cursor: 'pointer',
            }}
          >
            <option value="">All Types</option>
            <option value="Official Store">Official Store</option>
            <option value="Store Partner">Store Partner</option>
          </select>
        </div>
        <div style={{ position: 'relative' }}>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              paddingLeft: 12, paddingRight: 28, paddingTop: '0.65rem', paddingBottom: '0.65rem',
              border: '1.5px solid #DDD8CA', borderRadius: 9, fontSize: '0.875rem',
              background: 'white', color: filterStatus ? '#1C2D1A' : '#C9B99A',
              outline: 'none', fontFamily: '"DM Sans", sans-serif', cursor: 'pointer',
            }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {(search || filterType || filterStatus) && (
          <button
            onClick={() => { setSearch(''); setFilterType(''); setFilterStatus('') }}
            style={{ fontSize: '0.78rem', color: '#7A8C5A', background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', textDecoration: 'underline' }}
          >
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <TableSkeleton />
      ) : filteredStores.length === 0 ? (
        <EmptyState stores={stores} navigate={navigate} />
      ) : (
        <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(28,45,26,0.06)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F4F1EA' }}>
                  <th style={th()}>Store Details</th>
                  <th style={th()} className="hide-sm">Type</th>
                  <th style={th()} className="hide-sm">Location</th>
                  <th style={th()} className="hide-sm">Phone</th>
                  <th style={{ ...th(), textAlign: 'center' }}>Status</th>
                  <th style={{ ...th(), textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((s, i) => (
                  <StoreRow
                    key={s.id}
                    store={s}
                    isLast={i === filteredStores.length - 1}
                    navigate={navigate}
                    onDelete={() => setConfirmId(s.id)}
                    onToggleActive={() => handleToggleActive(s.id, s.is_active)}
                    toggling={toggling === s.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 380, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.375rem', color: '#1C2D1A', marginBottom: 10 }}>Delete Store?</h3>
            <p style={{ color: '#7A8C5A', fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
              This will permanently remove the store locator listing.
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

function StoreRow({ store: s, isLast, navigate, onDelete, onToggleActive, toggling }) {
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
          <div style={{ width: 42, height: 42, borderRadius: 9, background: '#EAE5D9', overflow: 'hidden', flexShrink: 0, border: '1px solid #DDD8CA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={18} color="#2E402B" />
          </div>
          <div>
            <span style={{ fontWeight: 500, color: '#1C2D1A', fontSize: '0.875rem', display: 'block' }}>{s.name}</span>
            <span style={{ color: '#7A8C5A', fontSize: '0.75rem', display: 'block', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.address}</span>
          </div>
        </div>
      </td>
      <td style={{ padding: '0.875rem 1.25rem' }} className="hide-sm">
        <span style={{
          background: s.type === 'Official Store' ? 'rgba(46,64,43,0.1)' : 'rgba(184,159,112,0.15)',
          color: s.type === 'Official Store' ? '#2E402B' : '#B89F70',
          fontSize: '0.72rem', fontWeight: 600, padding: '3px 9px', borderRadius: 20, letterSpacing: '0.03em'
        }}>
          {s.type}
        </span>
      </td>
      <td style={{ padding: '0.875rem 1.25rem' }} className="hide-sm">
        <span style={{ fontSize: '0.875rem', color: '#1C2D1A' }}>
          {s.city}, {s.state}
        </span>
      </td>
      <td style={{ padding: '0.875rem 1.25rem' }} className="hide-sm">
        <span style={{ fontSize: '0.875rem', color: '#1C2D1A' }}>
          {s.phone || '—'}
        </span>
      </td>
      <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
        <button
          onClick={onToggleActive}
          disabled={toggling}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600,
            background: s.is_active ? '#dcfce7' : '#FEF3C7',
            color: s.is_active ? '#166534' : '#92400E',
            border: 'none', cursor: 'pointer',
            opacity: toggling ? 0.6 : 1
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.is_active ? '#166534' : '#d97706' }} />
          {s.is_active ? 'Active' : 'Inactive'}
        </button>
      </td>
      <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <a
            href={s.map_link}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Google Maps"
            style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #DDD8CA', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A8C5A', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F4F1EA'; e.currentTarget.style.borderColor = '#7A8C5A' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#DDD8CA' }}
          >
            <ExternalLink size={13} />
          </a>
          <button
            onClick={() => navigate(`/admin/stores/${s.id}/edit`)}
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

function EmptyState({ stores, navigate }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: '5rem 2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(28,45,26,0.06)' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
        <MapPin size={28} color="#DDD8CA" />
      </div>
      <p style={{ color: '#7A8C5A', marginBottom: '1rem', fontSize: '0.95rem' }}>
        {stores.length === 0 ? 'No stores registered yet.' : 'No stores match your search.'}
      </p>
      {stores.length === 0 && (
        <button onClick={() => navigate('/admin/stores/new')} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0.65rem 1.25rem', background: '#2E402B', color: 'white', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
          <Plus size={15} /> Add your first store
        </button>
      )}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(28,45,26,0.06)' }}>
      <div style={{ height: 44, background: '#F4F1EA' }} />
      {[1, 2, 3].map(i => (
        <div key={i} style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #F4F1EA', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 9, background: '#EAE5D9', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 13, width: '30%', background: '#EAE5D9', borderRadius: 4, marginBottom: 6 }} />
            <div style={{ height: 11, width: '20%', background: '#F4F1EA', borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

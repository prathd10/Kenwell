import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Search, SlidersHorizontal, Eye, Trash2, Mail, Phone, MapPin, Calendar } from 'lucide-react'

export default function PartnerRequests() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const loadInquiries = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('partner_inquiries')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (!error && data) {
      setInquiries(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadInquiries()
  }, [])

  const handleDelete = async (id) => {
    setDeleting(id)
    const { error } = await supabase
      .from('partner_inquiries')
      .delete()
      .eq('id', id)
    
    if (!error) {
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(null)
      }
      setConfirmId(null)
      loadInquiries()
    }
    setDeleting(null)
  }

  const handleUpdateStatus = async (id, nextStatus) => {
    setUpdatingId(id)
    const { error } = await supabase
      .from('partner_inquiries')
      .update({ status: nextStatus })
      .eq('id', id)
    
    if (!error) {
      // Update local state for modal if open
      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => ({ ...prev, status: nextStatus }))
      }
      loadInquiries()
    }
    setUpdatingId(null)
  }

  const filteredInquiries = inquiries.filter(inq => {
    const matchSearch = 
      inq.store_name.toLowerCase().includes(search.toLowerCase()) ||
      inq.contact_name.toLowerCase().includes(search.toLowerCase()) ||
      inq.city.toLowerCase().includes(search.toLowerCase())
    
    const matchStatus = filterStatus ? inq.status === filterStatus : true

    return matchSearch && matchStatus
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 3, height: 20, background: '#2E402B', borderRadius: 2 }} />
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#1C2D1A', fontWeight: 600 }}>
              Partner Requests
            </h1>
          </div>
          <p style={{ color: '#7A8C5A', fontSize: '0.875rem', paddingLeft: 13 }}>
            {inquiries.length} {inquiries.length === 1 ? 'application' : 'applications'} received from store owners
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#C9B99A', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by store name, contact, city…"
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
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              paddingLeft: 28, paddingRight: 28, paddingTop: '0.65rem', paddingBottom: '0.65rem',
              border: '1.5px solid #DDD8CA', borderRadius: 9, fontSize: '0.875rem',
              background: 'white', color: filterStatus ? '#1C2D1A' : '#C9B99A',
              outline: 'none', fontFamily: '"DM Sans", sans-serif', cursor: 'pointer',
            }}
          >
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Archived">Archived</option>
          </select>
        </div>

        {(search || filterStatus) && (
          <button
            onClick={() => { setSearch(''); setFilterStatus('') }}
            style={{ fontSize: '0.78rem', color: '#7A8C5A', background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', textDecoration: 'underline' }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table / List */}
      {loading ? (
        <TableSkeleton />
      ) : filteredInquiries.length === 0 ? (
        <EmptyState inquiries={inquiries} />
      ) : (
        <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(28,45,26,0.06)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F4F1EA' }}>
                  <th style={th()}>Store Details</th>
                  <th style={th()}>Contact Name</th>
                  <th style={th()} className="hide-sm">Location</th>
                  <th style={th()} className="hide-sm">Submission Date</th>
                  <th style={{ ...th(), textAlign: 'center' }}>Pipeline Status</th>
                  <th style={{ ...th(), textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInquiries.map((inq, i) => (
                  <InquiryRow
                    key={inq.id}
                    inquiry={inq}
                    isLast={i === filteredInquiries.length - 1}
                    onView={() => setSelectedInquiry(inq)}
                    onDelete={() => setConfirmId(inq.id)}
                    onUpdateStatus={handleUpdateStatus}
                    updating={updatingId === inq.id}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal overlay */}
      {selectedInquiry && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 580, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxH: '90vh', overflowY: 'auto', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #EAE5D9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{
                  background: selectedInquiry.status === 'New' ? '#dbeafe' : selectedInquiry.status === 'Contacted' ? '#dcfce7' : '#f3f4f6',
                  color: selectedInquiry.status === 'New' ? '#1e40af' : selectedInquiry.status === 'Contacted' ? '#166534' : '#374151',
                  fontSize: '0.7rem', fontWeight: 600, padding: '2px 8px', borderRadius: 12, textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  {selectedInquiry.status}
                </span>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', color: '#1C2D1A', margin: '4px 0 0' }}>
                  {selectedInquiry.store_name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedInquiry(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: '#7A8C5A', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Profile Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#1C2D1A', fontSize: '0.875rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ color: '#7A8C5A', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Contact Person</span>
                  <span style={{ fontWeight: 600 }}>{selectedInquiry.contact_name}</span>
                </div>
                <div>
                  <span style={{ color: '#7A8C5A', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Submitted On</span>
                  <span>{new Date(selectedInquiry.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <span style={{ color: '#7A8C5A', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Email</span>
                  <a href={`mailto:${selectedInquiry.email}`} style={{ color: '#2E402B', fontWeight: 600, textDecoration: 'underline' }}>{selectedInquiry.email}</a>
                </div>
                <div>
                  <span style={{ color: '#7A8C5A', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Phone</span>
                  <a href={`tel:${selectedInquiry.phone}`} style={{ color: '#2E402B', fontWeight: 600 }}>{selectedInquiry.phone}</a>
                </div>
              </div>

              <div>
                <span style={{ color: '#7A8C5A', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Store Address</span>
                <p style={{ margin: '4px 0 0', lineHeight: 1.5 }}>
                  {selectedInquiry.address}, {selectedInquiry.city}, {selectedInquiry.state} - {selectedInquiry.postal_code}
                </p>
              </div>

              <div>
                <span style={{ color: '#7A8C5A', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Applicant Message / Note</span>
                <p style={{ margin: '4px 0 0', padding: '0.75rem', background: '#F4F1EA', borderRadius: 8, fontStyle: 'italic', lineHeight: 1.5 }}>
                  {selectedInquiry.message || 'No additional details provided.'}
                </p>
              </div>

              {/* Status Update Control */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderTop: '1px solid #EAE5D9', marginTop: '1rem' }}>
                <span style={{ fontWeight: 600 }}>Pipeline Tracking:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={e => handleUpdateStatus(selectedInquiry.id, e.target.value)}
                  style={{
                    padding: '0.45rem 1.25rem',
                    border: '1.5px solid #DDD8CA', borderRadius: 8,
                    fontSize: '0.8rem', fontFamily: '"DM Sans", sans-serif', outline: 'none', cursor: 'pointer'
                  }}
                >
                  <option value="New">New Request</option>
                  <option value="Contacted">Mark Contacted</option>
                  <option value="Archived">Archive Entry</option>
                </select>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button 
                onClick={() => {
                  setSelectedInquiry(null)
                  setConfirmId(selectedInquiry.id)
                }}
                style={{ padding: '0.65rem 1.25rem', borderRadius: 9, border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', fontWeight: 600 }}
              >
                Delete Request
              </button>
              <button 
                onClick={() => setSelectedInquiry(null)}
                style={{ padding: '0.65rem 1.25rem', borderRadius: 9, border: '1.5px solid #DDD8CA', background: 'white', color: '#1C2D1A', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem' }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: 'white', borderRadius: 16, padding: '2rem', maxWidth: 380, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.375rem', color: '#1C2D1A', marginBottom: 10 }}>Delete Request?</h3>
            <p style={{ color: '#7A8C5A', fontSize: '0.875rem', marginBottom: '1.75rem', lineHeight: 1.6 }}>
              This will permanently delete the partnership request.
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

function InquiryRow({ inquiry: inq, isLast, onView, onDelete, onUpdateStatus, updating }) {
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
            <MapPin size={18} color="#7A8C5A" />
          </div>
          <div>
            <span style={{ fontWeight: 600, color: '#1C2D1A', fontSize: '0.875rem', display: 'block' }}>{inq.store_name}</span>
            <span style={{ color: '#7A8C5A', fontSize: '0.72rem', display: 'block', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inq.address}</span>
          </div>
        </div>
      </td>
      <td style={{ padding: '0.875rem 1.25rem' }}>
        <div>
          <span style={{ fontWeight: 500, color: '#1C2D1A', fontSize: '0.85rem', display: 'block' }}>{inq.contact_name}</span>
          <div style={{ display: 'flex', gap: 8, marginTop: 3, alignItems: 'center' }}>
            <a href={`mailto:${inq.email}`} style={{ color: '#C9B99A', hoverColor: '#2E402B' }} title={inq.email}><Mail size={12} /></a>
            <a href={`tel:${inq.phone}`} style={{ color: '#C9B99A', hoverColor: '#2E402B' }} title={inq.phone}><Phone size={12} /></a>
          </div>
        </div>
      </td>
      <td style={{ padding: '0.875rem 1.25rem' }} className="hide-sm">
        <span style={{ fontSize: '0.875rem', color: '#1C2D1A' }}>
          {inq.city}, {inq.state}
        </span>
      </td>
      <td style={{ padding: '0.875rem 1.25rem' }} className="hide-sm">
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#7A8C5A', fontSize: '0.8rem' }}>
          <Calendar size={12} />
          {new Date(inq.created_at).toLocaleDateString('en-IN')}
        </div>
      </td>
      <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
        <select
          value={inq.status}
          onChange={e => onUpdateStatus(inq.id, e.target.value)}
          disabled={updating}
          style={{
            padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600,
            background: inq.status === 'New' ? '#dbeafe' : inq.status === 'Contacted' ? '#dcfce7' : '#f3f4f6',
            color: inq.status === 'New' ? '#1e40af' : inq.status === 'Contacted' ? '#166534' : '#374151',
            border: 'none', outline: 'none', cursor: 'pointer', appearance: 'none',
            textAlign: 'center', opacity: updating ? 0.6 : 1
          }}
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Archived">Archived</option>
        </select>
      </td>
      <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
          <button
            onClick={onView}
            title="Review Details"
            style={{ width: 32, height: 32, borderRadius: 8, border: '1.5px solid #DDD8CA', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7A8C5A', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F4F1EA'; e.currentTarget.style.borderColor = '#7A8C5A' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#DDD8CA' }}
          >
            <Eye size={13} />
          </button>
          <button
            onClick={onDelete}
            title="Delete Request"
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

function EmptyState({ inquiries }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: '5rem 2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(28,45,26,0.06)' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
        <Mail size={28} color="#DDD8CA" />
      </div>
      <p style={{ color: '#7A8C5A', marginBottom: '1rem', fontSize: '0.95rem' }}>
        {inquiries.length === 0 ? 'No partnership applications received yet.' : 'No requests match your search criteria.'}
      </p>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(28,45,26,0.06)' }}>
      <div style={{ height: 44, background: '#F4F1EA' }} />
      {[1, 2].map(i => (
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

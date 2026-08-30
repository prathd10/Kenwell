import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Search, Eye, RefreshCw, ShoppingBag, Send, Mail, Check, AlertCircle } from 'lucide-react'
import { sendOrderEmail } from '../../lib/emailService'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [sendingEmailKey, setSendingEmailKey] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4500)
  }

  const loadOrders = async () => {
    setLoading(true)
    let dbOrders = []
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        dbOrders = data
      }
    } catch (err) {
      console.warn('Failed to load orders from Supabase, loading from localStorage:', err)
    }

    // Merge with localStorage orders
    const localOrders = JSON.parse(localStorage.getItem('kenwell_orders') || '[]')
    const allOrders = [...dbOrders]
    
    localOrders.forEach(local => {
      if (!allOrders.some(db => db.friendly_id === local.friendly_id)) {
        allOrders.push(local)
      }
    })

    // Sort by date desc
    allOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    setOrders(allOrders)
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleStatusChange = async (orderId, isDbOrder, newStatus) => {
    setUpdatingId(orderId)
    const targetOrder = orders.find(o => o.id === orderId || o.friendly_id === orderId)
    let updatedEmails = targetOrder?.emails_sent ? [...targetOrder.emails_sent] : [true, false, false]

    // Auto-trigger customer email notifications via Resend on status changes
    if (targetOrder && targetOrder.customer_email) {
      if (newStatus === 'Shipped') {
        try {
          const res = await sendOrderEmail({ order: { ...targetOrder, status: newStatus }, type: 'shipped' })
          if (res.success) {
            updatedEmails[1] = true
            showToast(`📦 Shipped email sent to ${targetOrder.customer_email} via Resend!`, 'success')
          } else {
            showToast(`Error: ${res.error || 'Failed to send shipped email'}`, 'error')
          }
        } catch (err) {
          showToast(`Error: ${err.message}`, 'error')
        }
      } else if (newStatus === 'Delivered') {
        try {
          const res = await sendOrderEmail({ order: { ...targetOrder, status: newStatus }, type: 'delivered' })
          if (res.success) {
            updatedEmails[2] = true
            showToast(`✨ Delivered email sent to ${targetOrder.customer_email} via Resend!`, 'success')
          } else {
            showToast(`Error: ${res.error || 'Failed to send delivered email'}`, 'error')
          }
        } catch (err) {
          showToast(`Error: ${err.message}`, 'error')
        }
      }
    }

    if (isDbOrder) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus, emails_sent: updatedEmails })
          .eq('id', orderId)

        if (error) throw error
      } catch (err) {
        console.error('Failed to update status in Supabase:', err)
      }
    }

    // Update in local state & localStorage anyway (for consistency and local fallback)
    const updated = orders.map(o => (o.id === orderId || o.friendly_id === orderId) ? { ...o, status: newStatus, emails_sent: updatedEmails } : o)
    setOrders(updated)
    
    const localOrders = JSON.parse(localStorage.getItem('kenwell_orders') || '[]')
    const updatedLocal = localOrders.map(o => o.friendly_id === orderId || o.id === orderId ? { ...o, status: newStatus, emails_sent: updatedEmails } : o)
    localStorage.setItem('kenwell_orders', JSON.stringify(updatedLocal))
    
    if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.friendly_id === orderId)) {
      setSelectedOrder({ ...selectedOrder, status: newStatus, emails_sent: updatedEmails })
    }

    setUpdatingId(null)
  }

  const handleSendManualEmail = async (order, dotIndex) => {
    const types = ['confirmed', 'shipped', 'delivered']
    const typeLabels = ['Order Confirmed', 'Order Shipped', 'Order Delivered']
    const type = types[dotIndex]
    const typeLabel = typeLabels[dotIndex]
    const key = `${order.friendly_id}_${dotIndex}`

    setSendingEmailKey(key)

    try {
      const res = await sendOrderEmail({ order, type })
      if (res.success) {
        const updatedEmails = [...(order.emails_sent || [false, false, false])]
        updatedEmails[dotIndex] = true

        const isDbOrder = !!order.id && order.id.length > 20
        if (isDbOrder) {
          await supabase.from('orders').update({ emails_sent: updatedEmails }).eq('id', order.id)
        }

        const updated = orders.map(o => o.friendly_id === order.friendly_id ? { ...o, emails_sent: updatedEmails } : o)
        setOrders(updated)

        const localOrders = JSON.parse(localStorage.getItem('kenwell_orders') || '[]')
        const updatedLocal = localOrders.map(o => o.friendly_id === order.friendly_id ? { ...o, emails_sent: updatedEmails } : o)
        localStorage.setItem('kenwell_orders', JSON.stringify(updatedLocal))

        if (selectedOrder && selectedOrder.friendly_id === order.friendly_id) {
          setSelectedOrder({ ...selectedOrder, emails_sent: updatedEmails })
        }

        showToast(`✉️ ${typeLabel} email sent to ${order.customer_email} via Resend!`, 'success')
      } else {
        showToast(`Error: ${res.error || 'Failed to send email'}`, 'error')
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error')
    } finally {
      setSendingEmailKey(null)
    }
  }

  const [filterStatus, setFilterStatus] = useState('')

  const filtered = orders.filter(o => {
    const matchSearch = 
      o.friendly_id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus ? o.status === filterStatus : true
    return matchSearch && matchStatus
  })

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    } catch {
      return 'N/A'
    }
  }

  const STATUS_OPTIONS = [
    { value: 'Paid', label: 'Paid', bg: '#EAF2E8', text: '#2E402B', border: '#C0D5BD', dot: '#7A8C5A' },
    { value: 'Shipped', label: 'Shipped', bg: '#F5EFE6', text: '#8C6D3B', border: '#E2D4C3', dot: '#B89F70' },
    { value: 'Delivered', label: 'Delivered', bg: '#E4ECE2', text: '#1C2D1A', border: '#ADC7AA', dot: '#2E402B' },
    { value: 'Failed', label: 'Failed', bg: '#F8ECE9', text: '#9B3F33', border: '#E7C7C1', dot: '#C53030' },
  ]

  const getStatusColor = (status) => {
    const matched = STATUS_OPTIONS.find(s => s.value === status)
    if (matched) return matched
    return { bg: '#F4F1EA', text: '#7A8C5A', border: '#C9B99A', dot: '#C9B99A' }
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 3, height: 20, background: '#2E402B', borderRadius: 2 }} />
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#1C2D1A', fontWeight: 600 }}>
              Orders
            </h1>
          </div>
          <p style={{ color: '#7A8C5A', fontSize: '0.875rem', paddingLeft: 13 }}>
            Manage and track customer orders.
          </p>
        </div>
        
        <button
          onClick={loadOrders}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '0.65rem 1.25rem',
            background: 'white', color: '#2E402B', border: '1.5px solid #DDD8CA',
            borderRadius: 9, cursor: 'pointer', fontSize: '0.875rem',
            fontWeight: 600, fontFamily: '"DM Sans", sans-serif',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#F4F1EA' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#C9B99A', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search orders by ID, name or email..."
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
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              paddingLeft: 14, paddingRight: 32, paddingTop: '0.65rem', paddingBottom: '0.65rem',
              border: '1.5px solid #DDD8CA', borderRadius: 9, fontSize: '0.875rem',
              background: 'white', color: filterStatus ? '#1C2D1A' : '#C9B99A',
              outline: 'none', fontFamily: '"DM Sans", sans-serif', cursor: 'pointer',
            }}
          >
            <option value="">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Failed">Failed</option>
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

      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState navigate={loadOrders} />
      ) : (
        /* Orders Table */
        <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(28,45,26,0.06)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F4F1EA', borderBottom: '1.5px solid #EAE5D9' }}>
                  <th style={th()}>Order ID</th>
                  <th style={th()}>Date</th>
                  <th style={th()}>Customer</th>
                  <th style={{ ...th(), textAlign: 'right' }}>Amount</th>
                  <th style={{ ...th(), textAlign: 'center' }}>Status</th>
                  <th style={{ ...th(), textAlign: 'center' }}>Emails</th>
                  <th style={{ ...th(), textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => {
                  const colors = getStatusColor(order.status)
                  const isDbOrder = !!order.id && order.id.length > 20
                  const emailDots = order.emails_sent || [false, false, false]
                  
                  return (
                    <tr
                      key={order.id || order.friendly_id}
                      style={{
                        borderBottom: i === filtered.length - 1 ? 'none' : '1px solid #F4F1EA',
                        background: 'white',
                        transition: 'background 0.1s',
                      }}
                    >
                      {/* Friendly Order ID */}
                      <td style={{ padding: '1rem 1.25rem', fontFamily: 'monospace', color: 'rgba(28,45,26,0.5)', fontWeight: 600 }}>
                        {order.friendly_id}
                      </td>
                      
                      {/* Date */}
                      <td style={{ padding: '1rem 1.25rem', color: '#1C2D1A' }}>
                        {formatDate(order.created_at)}
                      </td>
                      
                      {/* Customer Name & Email */}
                      <td style={{ padding: '1rem 1.25rem' }}>
                        <div style={{ fontWeight: 600, color: '#1C2D1A' }}>{order.customer_name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#7A8C5A', marginTop: 1 }}>{order.customer_email}</div>
                      </td>
                      
                      {/* Amount */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#2E402B', fontSize: '0.95rem' }}>
                        ₹{Number(order.amount).toLocaleString('en-IN')}
                      </td>
                      
                      {/* Status Dropdown */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                        <StatusDropdown
                          currentStatus={order.status}
                          disabled={updatingId === (order.id || order.friendly_id)}
                          onChange={(newStatus) => handleStatusChange(order.id || order.friendly_id, isDbOrder, newStatus)}
                        />
                      </td>
                      
                      {/* Email Status Dots (Click to Send via Resend) */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                          {['Confirmed', 'Shipped', 'Delivered'].map((label, idx) => {
                            const sent = emailDots[idx]
                            const isSending = sendingEmailKey === `${order.friendly_id}_${idx}`
                            return (
                              <button
                                key={idx}
                                disabled={isSending}
                                onClick={() => handleSendManualEmail(order, idx)}
                                title={`${label} Email: ${sent ? 'Sent ✓ (Click to resend)' : 'Not sent (Click to send via Resend)'}`}
                                style={{
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                  background: sent ? '#059669' : '#DDD8CA',
                                  border: sent ? '1.5px solid #047857' : '1px solid #C9B99A',
                                  cursor: isSending ? 'not-allowed' : 'pointer',
                                  padding: 0,
                                  transition: 'transform 0.15s, background 0.15s',
                                  opacity: isSending ? 0.4 : 1,
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.3)' }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)' }}
                              />
                            )
                          })}
                        </div>
                      </td>
                      
                      {/* Action (View Detail Modal) */}
                      <td style={{ padding: '1rem 1.25rem', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '6px 12px',
                            borderRadius: 8,
                            border: '1.5px solid #DDD8CA',
                            background: 'white',
                            color: '#7A8C5A',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            fontFamily: '"DM Sans", sans-serif',
                            transition: 'all 0.15s'
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#F4F1EA'; e.currentTarget.style.borderColor = '#7A8C5A' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#DDD8CA' }}
                        >
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyRight: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(3px)' }}>
          <div style={{ background: '#F4F1EA', borderRadius: 24, padding: '2rem', maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '1px solid white', textAlign: 'left' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(201,185,154,0.4)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', color: '#1C2D1A', fontWeight: 700 }}>
                  Order Details
                </h3>
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#7A8C5A', fontWeight: 600 }}>
                  {selectedOrder.friendly_id}
                </span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'rgba(0,0,0,0.4)' }}
              >
                ✕
              </button>
            </div>

            {/* Customer Details Card */}
            <div style={{ background: 'white', borderRadius: 16, padding: '1.25rem', border: '1px solid rgba(201,185,154,0.3)', marginBottom: '1.5rem', fontSize: '0.82rem', fontFamily: '"DM Sans", sans-serif', lineHeight: 1.6 }}>
              <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', color: '#2E402B', fontWeight: 750, margin: '0 0 0.75rem 0' }}>Customer & Shipping Info</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <span style={{ color: 'rgba(28,45,26,0.4)', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', fontFamily: 'monospace' }}>Full Name</span>
                  <span style={{ fontWeight: 600, color: '#1C2D1A' }}>{selectedOrder.customer_name}</span>
                </div>
                <div>
                  <span style={{ color: 'rgba(28,45,26,0.4)', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', fontFamily: 'monospace' }}>Phone Number</span>
                  <span style={{ fontWeight: 600, color: '#1C2D1A' }}>{selectedOrder.customer_phone}</span>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'rgba(28,45,26,0.4)', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', fontFamily: 'monospace' }}>Email Address</span>
                  <span style={{ fontWeight: 600, color: '#1C2D1A' }}>{selectedOrder.customer_email}</span>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <span style={{ color: 'rgba(28,45,26,0.4)', textTransform: 'uppercase', fontSize: '0.65rem', display: 'block', fontFamily: 'monospace' }}>Delivery Address</span>
                  <span style={{ fontWeight: 600, color: '#1C2D1A' }}>
                    {selectedOrder.shipping_address}, {selectedOrder.city} - {selectedOrder.postal_code}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Email Notifications Section */}
            <div style={{ background: 'white', borderRadius: 16, padding: '1.25rem', border: '1px solid rgba(201,185,154,0.3)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', color: '#2E402B', fontWeight: 750, margin: 0 }}>
                  Customer Email Notifications (Resend)
                </h4>
                <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#7A8C5A' }}>
                  {selectedOrder.customer_email}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: '1. Order Confirmed & Paid', typeIndex: 0, desc: 'Payment receipt & initial order summary' },
                  { label: '2. Order Shipped (In Transit)', typeIndex: 1, desc: 'Dispatch alert & live tracking link' },
                  { label: '3. Order Delivered', typeIndex: 2, desc: 'Arrival confirmation & routine guidelines' }
                ].map(({ label, typeIndex, desc }) => {
                  const isSent = (selectedOrder.emails_sent || [false, false, false])[typeIndex]
                  const isSending = sendingEmailKey === `${selectedOrder.friendly_id}_${typeIndex}`
                  return (
                    <div key={typeIndex} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#FAF8F5', borderRadius: 10, border: '1px solid #EAE5D9' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', background: isSent ? '#059669' : '#C9B99A' }} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1C2D1A' }}>{label}</span>
                        </div>
                        <span style={{ fontSize: '0.68rem', color: 'rgba(28,45,26,0.5)', display: 'block', marginTop: 2, marginLeft: 14 }}>{desc}</span>
                      </div>
                      <button
                        type="button"
                        disabled={isSending}
                        onClick={() => handleSendManualEmail(selectedOrder, typeIndex)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '5px 12px', borderRadius: 8,
                          fontSize: '0.72rem', fontWeight: 600, fontFamily: '"DM Sans", sans-serif',
                          background: isSent ? '#EAF2E8' : '#2E402B',
                          color: isSent ? '#2E402B' : '#FFFFFF',
                          border: isSent ? '1px solid #C0D5BD' : 'none',
                          cursor: isSending ? 'not-allowed' : 'pointer',
                          opacity: isSending ? 0.7 : 1,
                          transition: 'all 0.15s'
                        }}
                      >
                        {isSending ? (
                          <span>Sending...</span>
                        ) : isSent ? (
                          <>
                            <Check size={11} /> Resend
                          </>
                        ) : (
                          <>
                            <Send size={11} /> Send
                          </>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Items Card */}
            <div style={{ background: 'white', borderRadius: 16, padding: '1.25rem', border: '1px solid rgba(201,185,154,0.3)', marginBottom: '1.5rem' }}>
              <h4 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', color: '#2E402B', fontWeight: 750, margin: '0 0 0.75rem 0' }}>Items in Order</h4>
              <div style={{ spaceY: 10 }}>
                {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: idx === selectedOrder.items.length - 1 ? 'none' : '1px solid #F4F1EA', paddingBottom: idx === selectedOrder.items.length - 1 ? 0 : 10, marginBottom: idx === selectedOrder.items.length - 1 ? 0 : 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: '#F4F1EA', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 2 }} />
                    </div>
                    <div style={{ flexGrow: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: '#1C2D1A', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</div>
                      <div style={{ fontSize: '0.68rem', color: '#7A8C5A', fontFamily: 'monospace' }}>Qty: {item.quantity} · ₹{item.price} each</div>
                    </div>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.8rem', color: '#1C2D1A' }}>
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Summary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(201,185,154,0.4)', paddingTop: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.65rem', color: '#7A8C5A', textTransform: 'uppercase', fontFamily: 'monospace' }}>Status</span>
                <span style={{
                  display: 'block', width: 'fit-content', marginTop: 3,
                  padding: '3px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
                  background: getStatusColor(selectedOrder.status).bg,
                  color: getStatusColor(selectedOrder.status).text
                }}>{selectedOrder.status}</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.65rem', color: 'rgba(28,45,26,0.4)', textTransform: 'uppercase', display: 'block', fontFamily: 'monospace' }}>Total Paid</span>
                <span style={{ fontFamily: 'monospace', fontSize: '1.25rem', fontWeight: 800, color: '#2E402B' }}>
                  ₹{Number(selectedOrder.amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 10000,
          background: toast.type === 'error' ? '#9B3F33' : '#2E402B',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.85rem',
          fontWeight: 600,
          fontFamily: '"DM Sans", sans-serif',
        }}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <Check size={16} />}
          <span>{toast.message}</span>
        </div>
      )}
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

function EmptyState({ navigate }) {
  return (
    <div style={{ background: 'white', borderRadius: 14, padding: '5rem 2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(28,45,26,0.06)' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
        <ShoppingBag size={28} color="#DDD8CA" />
      </div>
      <p style={{ color: '#7A8C5A', marginBottom: '1rem', fontSize: '0.95rem' }}>
        No orders placed yet.
      </p>
      <button onClick={navigate} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0.65rem 1.25rem', background: '#2E402B', color: 'white', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
        <RefreshCw size={15} /> Refresh List
      </button>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(28,45,26,0.06)' }}>
      <div style={{ height: 44, background: '#F4F1EA' }} />
      {[1, 2, 3].map(i => (
        <div key={i} style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #F4F1EA', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: '#EAE5D9', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ height: 13, width: '30%', background: '#EAE5D9', borderRadius: 4, marginBottom: 6 }} />
            <div style={{ height: 11, width: '20%', background: '#F4F1EA', borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function StatusDropdown({ currentStatus, onChange, disabled }) {
  const [open, setOpen] = useState(false)
  const STATUS_OPTIONS = [
    { value: 'Paid', label: 'Paid', bg: '#EAF2E8', text: '#2E402B', border: '#C0D5BD', dot: '#7A8C5A' },
    { value: 'Shipped', label: 'Shipped', bg: '#F5EFE6', text: '#8C6D3B', border: '#E2D4C3', dot: '#B89F70' },
    { value: 'Delivered', label: 'Delivered', bg: '#E4ECE2', text: '#1C2D1A', border: '#ADC7AA', dot: '#2E402B' },
    { value: 'Failed', label: 'Failed', bg: '#F8ECE9', text: '#9B3F33', border: '#E7C7C1', dot: '#C53030' },
  ]
  const current = STATUS_OPTIONS.find(s => s.value === currentStatus) || STATUS_OPTIONS[0]

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('click', close)
    return () => window.removeEventListener('click', close)
  }, [open])

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} onClick={e => e.stopPropagation()}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: current.bg,
          color: current.text,
          border: `1.5px solid ${current.border}`,
          padding: '5px 12px',
          borderRadius: 20,
          fontSize: '0.74rem',
          fontWeight: 700,
          fontFamily: '"DM Sans", sans-serif',
          cursor: disabled ? 'not-allowed' : 'pointer',
          outline: 'none',
          transition: 'all 0.15s ease',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: current.dot }} />
        <span>{current.label}</span>
        <svg
          style={{ width: 10, height: 10, transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s', color: current.text }}
          fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 5px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#FFFFFF',
            border: '1.5px solid #DDD8CA',
            borderRadius: 12,
            boxShadow: '0 10px 30px rgba(28,45,26,0.15)',
            padding: 4,
            zIndex: 100,
            minWidth: 130,
            textAlign: 'left',
          }}
        >
          {STATUS_OPTIONS.map(opt => {
            const isSelected = opt.value === currentStatus
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '7px 10px',
                  borderRadius: 8,
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: opt.text,
                  background: isSelected ? opt.bg : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                  fontFamily: '"DM Sans", sans-serif',
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.background = '#F4F1EA'
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent'
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: opt.dot, flexShrink: 0 }} />
                <span style={{ flexGrow: 1 }}>{opt.label}</span>
                {isSelected && (
                  <svg style={{ width: 12, height: 12, color: opt.text }} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}


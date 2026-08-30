import React, { useState, useEffect } from 'react'
import BackButton from './BackButton'
import { supabase } from '../lib/supabase'

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [contactInfo, setContactInfo] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState(null)

  const triggerTrack = async (searchIdVal, contactVal) => {
    setLoading(true)
    setError('')
    setOrder(null)
    setSearched(true)

    // Normalize order ID (handle both with and without '#')
    const rawId = searchIdVal.trim().toUpperCase()
    const cleanId = rawId.replace(/^#+/, '')
    const searchContact = contactVal.trim().toLowerCase()
    const searchDigits = contactVal.replace(/\D/g, '')

    const matchesContact = (o) => {
      if (!contactVal.trim()) return true
      const email = (o.customer_email || '').trim().toLowerCase()
      const phone = (o.customer_phone || '').trim().toLowerCase()
      const phoneDigits = (o.customer_phone || '').replace(/\D/g, '')

      // Check email match
      if (email && email === searchContact) return true

      // Check phone match with flexible country code / spacing
      if (searchDigits.length >= 6 && phoneDigits.length >= 6) {
        if (
          phoneDigits.endsWith(searchDigits) ||
          searchDigits.endsWith(phoneDigits) ||
          phoneDigits.includes(searchDigits) ||
          searchDigits.includes(phoneDigits)
        ) {
          return true
        }
      }

      return phone === searchContact
    }

    const matchesId = (o) => {
      const oFriendly = (o.friendly_id || '').toUpperCase()
      const oClean = oFriendly.replace(/^#+/, '')
      const oId = (o.id || '').toUpperCase()

      return (
        oFriendly === rawId ||
        oFriendly === cleanId ||
        oClean === cleanId ||
        oClean === rawId ||
        oId === rawId ||
        (oId && cleanId && oId.startsWith(cleanId))
      )
    }

    let foundOrder = null

    try {
      // 1. Query Supabase with multiple matching formats
      const { data, error: dbError } = await supabase
        .from('orders')
        .select('*')
        .or(`friendly_id.eq.${cleanId},friendly_id.eq.#${cleanId},friendly_id.ilike.%${cleanId}%`)

      if (!dbError && data && data.length > 0) {
        const potential = data.find(o => matchesId(o) && matchesContact(o)) || data.find(o => matchesId(o))
        if (potential && matchesContact(potential)) {
          foundOrder = potential
        }
      }
    } catch (err) {
      console.warn('Supabase query error:', err)
    }

    // 2. Query localStorage as fallback/offline store
    if (!foundOrder) {
      const localOrders = JSON.parse(localStorage.getItem('kenwell_orders') || '[]')
      const localMatch = localOrders.find(o => matchesId(o) && matchesContact(o))

      if (localMatch) {
        foundOrder = localMatch
      }
    }

    if (foundOrder) {
      setOrder(foundOrder)
    } else {
      setError('No matching order found. Please verify your Order ID and contact details.')
    }
    
    setLoading(false)
  }

  const handleTrack = (e) => {
    e.preventDefault()
    triggerTrack(orderId, contactInfo)
  }

  useEffect(() => {
    // 1. Check URL query parameters (e.g. /#track?orderId=KW-123456&contact=name@example.com)
    const searchParams = new URLSearchParams(window.location.search)
    let urlOrderId = searchParams.get('orderId') || searchParams.get('id') || ''
    let urlContact = searchParams.get('contact') || searchParams.get('email') || searchParams.get('phone') || ''

    if (!urlOrderId && window.location.hash.includes('?')) {
      const hashQuery = window.location.hash.split('?')[1]
      const hashParams = new URLSearchParams(hashQuery)
      urlOrderId = hashParams.get('orderId') || hashParams.get('id') || ''
      urlContact = hashParams.get('contact') || hashParams.get('email') || hashParams.get('phone') || ''
    }

    if (urlOrderId) {
      setOrderId(urlOrderId)
      if (urlContact) {
        setContactInfo(urlContact)
        triggerTrack(urlOrderId, urlContact)
      }
      return
    }

    // 2. Check sessionStorage fallback
    const autoTrack = sessionStorage.getItem('kenwell_last_order')
    if (autoTrack) {
      try {
        const { orderId: autoId, contact: autoContact } = JSON.parse(autoTrack)
        if (autoId && autoContact) {
          setOrderId(autoId)
          setContactInfo(autoContact)
          sessionStorage.removeItem('kenwell_last_order') // Clear immediately
          triggerTrack(autoId, autoContact)
        }
      } catch (err) {
        console.error('Failed to parse auto-track details:', err)
      }
    }
  }, [])

  // Get current step of tracking
  const getStepStatus = (status) => {
    switch (status) {
      case 'Paid':
        return 1
      case 'Shipped':
        return 2
      case 'Delivered':
        return 3
      case 'Failed':
        return -1
      default:
        return 1
    }
  }

  const step = getStepStatus(order?.status)

  return (
    <div className="py-16 px-4 max-w-3xl mx-auto space-y-10 min-h-[60vh] text-left">
      
      {/* Header */}
      <div className="text-center max-w-md mx-auto space-y-3">
        <span className="text-sage font-mono uppercase tracking-wider text-xs font-semibold">
          Delivery Status
        </span>
        <h1 className="text-4xl font-serif text-primary-green">
          Track Your Order
        </h1>
        <div className="gold-divider max-w-xs mx-auto"></div>

      <BackButton className='mb-6' />
        <p className="text-charcoal/70 text-sm leading-relaxed">
          Enter your 8-digit Order ID and email/phone to check the delivery progress.
        </p>
      </div>

      {/* TRACKING FORM */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/60 shadow-lg bg-white/40">
        <form onSubmit={handleTrack} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-charcoal/50 mb-1.5">Order ID</label>
              <input 
                type="text" 
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. KW-QNZWO2"
                className="w-full bg-white border border-cream-dark/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sage transition-colors placeholder-charcoal/30 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-charcoal/50 mb-1.5">Email or Phone Number</label>
              <input 
                type="text" 
                required
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="e.g. 8879092007 or name@example.com"
                className="w-full bg-white border border-cream-dark/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sage transition-colors placeholder-charcoal/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary-green hover:bg-sage text-white rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg text-center flex justify-center items-center gap-2"
          >
            {loading ? 'Searching...' : 'Track Formulation Delivery'}
          </button>
        </form>
      </div>

      {/* ERROR MESSAGE */}
      {searched && error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-800 text-sm p-4 rounded-2xl max-w-xl mx-auto text-center font-mono">
          {error}
        </div>
      )}

      {/* TRACKING RESULTS */}
      {order && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Visual Stepper */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/60 shadow-md bg-white/70">
            <h3 className="font-serif text-lg font-bold text-primary-green mb-6 border-b border-cream-dark/30 pb-2">
              Order Status: <span className="text-sage font-mono">{order.status}</span>
            </h3>
            
            {step === -1 ? (
              /* FAILED STATUS SCREEN */
              <div className="flex items-center gap-4 bg-red-500/5 border border-red-500/20 rounded-2xl p-5 text-red-800">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <span className="font-bold text-lg">✕</span>
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold">Payment Failed / Order Cancelled</h4>
                  <p className="text-xs text-red-700/80 mt-0.5">Please try initiating checkout again or contact support at help@kenwell.in.</p>
                </div>
              </div>
            ) : (
              /* PROGRESS STEPPER */
              <div className="relative pt-4 pb-2">
                
                {/* Connector Line */}
                <div className="absolute top-[34px] left-8 right-8 h-[3px] bg-cream-dark/45 -z-10 rounded-full">
                  <div 
                    className="h-full bg-sage transition-all duration-1000 rounded-full"
                    style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
                  />
                </div>

                <div className="flex justify-between items-start text-center">
                  
                  {/* Step 1: Paid */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      step >= 1 
                        ? 'bg-sage border-sage text-white font-bold shadow-md shadow-sage/20' 
                        : 'bg-white border-cream-dark/50 text-charcoal/30'
                    }`}>
                      {step >= 1 ? '✓' : '1'}
                    </div>
                    <span className={`text-[11px] font-mono uppercase tracking-wider mt-3 font-semibold ${step >= 1 ? 'text-primary-green' : 'text-charcoal/40'}`}>
                      Paid
                    </span>
                    <span className="text-[9px] text-charcoal/40 mt-0.5">Payment Confirmed</span>
                  </div>

                  {/* Step 2: Shipped */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      step >= 2 
                        ? 'bg-sage border-sage text-white font-bold shadow-md shadow-sage/20' 
                        : 'bg-white border-cream-dark/50 text-charcoal/30'
                    }`}>
                      {step >= 2 ? '✓' : '2'}
                    </div>
                    <span className={`text-[11px] font-mono uppercase tracking-wider mt-3 font-semibold ${step >= 2 ? 'text-primary-green' : 'text-charcoal/40'}`}>
                      Shipped
                    </span>
                    <span className="text-[9px] text-charcoal/40 mt-0.5">In Transit</span>
                  </div>

                  {/* Step 3: Delivered */}
                  <div className="flex flex-col items-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      step >= 3 
                        ? 'bg-sage border-sage text-white font-bold shadow-md shadow-sage/20' 
                        : 'bg-white border-cream-dark/50 text-charcoal/30'
                    }`}>
                      {step >= 3 ? '✓' : '3'}
                    </div>
                    <span className={`text-[11px] font-mono uppercase tracking-wider mt-3 font-semibold ${step >= 3 ? 'text-primary-green' : 'text-charcoal/40'}`}>
                      Delivered
                    </span>
                    <span className="text-[9px] text-charcoal/40 mt-0.5">To Destination</span>
                  </div>

                </div>

              </div>
            )}
          </div>

          {/* Details Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Shipping Info */}
            <div className="bg-white/60 border border-white/80 rounded-3xl p-6 space-y-4 shadow-sm">
              <h4 className="font-serif text-lg font-bold text-primary-green border-b border-cream-dark/30 pb-2">
                Shipping Address
              </h4>
              <div className="text-xs text-charcoal/70 space-y-1.5 font-mono">
                <p><span className="text-charcoal/40 uppercase">Recipient:</span> {order.customer_name}</p>
                <p><span className="text-charcoal/40 uppercase">Contact:</span> {order.customer_phone}</p>
                <p><span className="text-charcoal/40 uppercase">Email:</span> {order.customer_email}</p>
                <p><span className="text-charcoal/40 uppercase">Address:</span> {order.shipping_address}</p>
                <p><span className="text-charcoal/40 uppercase">Location:</span> {order.city} - {order.postal_code}</p>
              </div>
            </div>

            {/* Right: Items Info */}
            <div className="bg-white/60 border border-white/80 rounded-3xl p-6 space-y-4 shadow-sm">
              <h4 className="font-serif text-lg font-bold text-primary-green border-b border-cream-dark/30 pb-2">
                Formulations Stack
              </h4>
              <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1">
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-serif text-primary-green font-bold truncate max-w-[70%]">
                      {item.name} <span className="text-charcoal/45 font-mono text-[10px]">x{item.quantity}</span>
                    </span>
                    <span className="font-mono text-charcoal/80 font-semibold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cream-dark/40 pt-3 flex justify-between items-center">
                <span className="font-serif text-sm font-bold text-primary-green">Total Paid</span>
                <span className="font-mono text-base font-bold text-sage">₹{order.amount}</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  )
}

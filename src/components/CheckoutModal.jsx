import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

// Toggle to simulate successful payment in development phase
const USE_REAL_RAZORPAY = false

export default function CheckoutModal({ isOpen, onClose, cartItems, totalAmount, onOrderSuccess, setCurrentSection }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successData, setSuccessData] = useState(null)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const friendlyId = '#' + Math.random().toString(16).substring(2, 10).toUpperCase()

    // Helper to process database insert and state update
    const processOrderCompletion = async (paymentDetails) => {
      const orderData = {
        friendly_id: friendlyId,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        shipping_address: address,
        city: city,
        postal_code: postalCode,
        amount: parseFloat(totalAmount),
        status: 'Paid',
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        emails_sent: [false, false, false],
        razorpay_payment_id: paymentDetails.razorpay_payment_id,
        razorpay_order_id: paymentDetails.razorpay_order_id,
        razorpay_signature: paymentDetails.razorpay_signature,
        created_at: new Date().toISOString()
      }

      try {
        const { error: dbError } = await supabase
          .from('orders')
          .insert([orderData])

        if (dbError) {
          console.warn('Supabase insert failed, falling back to localStorage:', dbError.message)
          saveToLocalStorage(orderData)
        } else {
          console.log('Order saved to Supabase successfully!')
        }
        
        setSuccessData(orderData)
        if (onOrderSuccess) {
          onOrderSuccess()
        }
      } catch (err) {
        console.error('Checkout error:', err)
        saveToLocalStorage(orderData)
        setSuccessData(orderData)
        if (onOrderSuccess) {
          onOrderSuccess()
        }
      } finally {
        setLoading(false)
      }
    }

    if (!USE_REAL_RAZORPAY) {
      // Simulate Razorpay success instantly
      const mockPaymentDetails = {
        razorpay_payment_id: 'pay_mock_' + Math.random().toString(36).substring(2, 12),
        razorpay_order_id: 'rzp_order_mock_' + Math.random().toString(36).substring(2, 12),
        razorpay_signature: 'rzp_sig_mock_' + Math.random().toString(36).substring(2, 12),
      }
      setTimeout(() => {
        processOrderCompletion(mockPaymentDetails)
      }, 800)
      return
    }

    if (!window.Razorpay) {
      setError('Razorpay SDK failed to load. Please check your internet connection.')
      setLoading(false)
      return
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_kenwell1234567', 
      amount: Math.round(totalAmount * 100), 
      currency: 'INR',
      name: 'Kenwell Nutrition',
      description: 'Premium Wellness Formulations',
      image: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><path d=%22M50 15 C30 35 30 70 50 85 C70 70 70 35 50 15 Z%22 fill=%22%232E402B%22/></svg>',
      handler: async function (response) {
        await processOrderCompletion({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id || 'rzp_order_local_' + Math.random().toString(36).substring(2, 12),
          razorpay_signature: response.razorpay_signature || 'rzp_sig_local_' + Math.random().toString(36).substring(2, 12),
        })
      },
      prefill: {
        name: name,
        email: email,
        contact: phone,
      },
      notes: {
        address: `${address}, ${city} - ${postalCode}`,
      },
      theme: {
        color: '#203348',
      },
      modal: {
        ondismiss: function () {
          setLoading(false)
        }
      }
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      setError('Failed to initialize Razorpay checkout. Please try again.')
      setLoading(false)
    }
  }

  const saveToLocalStorage = (order) => {
    const existing = JSON.parse(localStorage.getItem('kenwell_orders') || '[]')
    localStorage.setItem('kenwell_orders', JSON.stringify([order, ...existing]))
  }

  // Handle click outside to close
  const handleBackdropClick = (e) => {
    if (e.target.id === 'checkout-backdrop') {
      onClose()
    }
  }

  return (
    <div 
      id="checkout-backdrop"
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-[#203348]/50 backdrop-blur-sm transition-all duration-300"
    >
      <div className="w-full max-w-2xl bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-[#E4DFD3] flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-[#E4DFD3] flex justify-between items-center bg-white">
          <h2 className="font-serif text-2xl font-bold text-[#203348]">
            {successData ? 'Order Confirmed' : 'Checkout Details'}
          </h2>
          <button 
            onClick={onClose}
            className="text-[#203348]/40 hover:text-[#203348] transition-colors p-1 cursor-pointer text-xl"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-grow text-left">
          
          {successData ? (
            /* SUCCESS SCREEN */
            <div className="text-center space-y-6 py-6">
              <div className="w-16 h-16 bg-[#616F3E]/20 border-2 border-[#616F3E]/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <svg className="w-8 h-8 text-[#616F3E]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-serif text-3xl font-extrabold text-[#203348]">Thank you for your order!</h3>
                <p className="text-sm text-[#203348]/60">We've received your order and are preparing your formulations.</p>
                <div className="inline-block bg-white border border-[#E4DFD3] px-4 py-2 rounded-xl mt-3 font-mono text-sm text-[#203348]/80 font-bold">
                  Order ID: <span className="text-[#616F3E]">{successData.friendly_id}</span>
                </div>
              </div>

              <div className="border-t border-[#E4DFD3] my-6"></div>

              {/* Order summary breakdown */}
              <div className="bg-white rounded-2xl border border-[#E4DFD3] p-5 space-y-4 shadow-sm">
                <h4 className="font-serif text-base font-bold text-[#203348]">Shipment Details</h4>
                <div className="text-xs text-[#203348]/70 space-y-1 font-mono">
                  <p><span className="text-[#203348]/40 uppercase">Deliver To:</span> {successData.customer_name}</p>
                  <p><span className="text-[#203348]/40 uppercase">Address:</span> {successData.shipping_address}, {successData.city} - {successData.postal_code}</p>
                  <p><span className="text-[#203348]/40 uppercase">Phone:</span> {successData.customer_phone}</p>
                </div>

                <div className="border-t border-[#E4DFD3] pt-3">
                  <span className="block text-[10px] uppercase text-[#203348]/40 mb-2 font-mono">Items Ordered</span>
                  <div className="space-y-2">
                    {successData.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="font-serif text-[#203348] font-bold truncate max-w-[70%]">
                          {item.name} <span className="text-[#203348]/45 font-mono font-medium text-[10px]">x{item.quantity}</span>
                        </span>
                        <span className="font-mono text-[#203348]/80 font-semibold">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#E4DFD3] pt-3 flex justify-between items-center">
                  <span className="font-serif text-sm font-bold text-[#203348]">Total Investment</span>
                  <span className="font-mono text-base font-bold text-[#203348]">₹{successData.amount}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={() => {
                    sessionStorage.setItem('kenwell_last_order', JSON.stringify({
                      orderId: successData.friendly_id,
                      contact: successData.customer_email || successData.customer_phone
                    }))
                    onClose()
                    if (setCurrentSection) {
                      setCurrentSection('track')
                    }
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#A5492B] hover:bg-[#203348] text-white rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-md text-center inline-block"
                >
                  Track Order
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#FAF8F5] border border-[#E4DFD3] hover:bg-[#E4DFD3]/40 text-[#203348] rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-sm text-center inline-block"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-800 text-xs p-3.5 rounded-xl">
                  {error}
                </div>
              )}

              {/* Form columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Shipping Details */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#203348] border-b border-[#E4DFD3] pb-2">
                    1. Shipping Information
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#203348]/50 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-white border border-[#E4DFD3] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#616F3E] transition-colors placeholder-[#203348]/30 text-[#203348]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#203348]/50 mb-1">Email</label>
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full bg-white border border-[#E4DFD3] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#616F3E] transition-colors placeholder-[#203348]/30 text-[#203348]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#203348]/50 mb-1">Phone</label>
                        <input 
                          type="tel" 
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full bg-white border border-[#E4DFD3] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#616F3E] transition-colors placeholder-[#203348]/30 font-mono text-[#203348]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-[#203348]/50 mb-1">Shipping Address</label>
                      <textarea 
                        required
                        rows="2"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House No, Apartment Name, Street Name"
                        className="w-full bg-white border border-[#E4DFD3] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#616F3E] transition-colors placeholder-[#203348]/30 text-[#203348] resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#203348]/50 mb-1">City</label>
                        <input 
                          type="text" 
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Mumbai"
                          className="w-full bg-white border border-[#E4DFD3] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#616F3E] transition-colors placeholder-[#203348]/30 text-[#203348]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono uppercase tracking-wider text-[#203348]/50 mb-1">Postal Code</label>
                        <input 
                          type="text" 
                          required
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="400001"
                          className="w-full bg-white border border-[#E4DFD3] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#616F3E] transition-colors placeholder-[#203348]/30 font-mono text-[#203348]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary Column */}
                <div className="space-y-4">
                  <h3 className="font-serif text-lg font-bold text-[#203348] border-b border-[#E4DFD3] pb-2">
                    2. Order Summary
                  </h3>
                  
                  <div className="bg-white border border-[#E4DFD3] rounded-2xl p-4 space-y-4 max-h-[300px] overflow-y-auto shadow-sm">
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-3 items-center">
                          <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] overflow-hidden border border-[#E4DFD3] flex items-center justify-center shrink-0">
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-contain" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-serif text-xs font-bold text-[#203348] truncate">{item.name}</h4>
                            <span className="text-[10px] font-mono text-[#203348]/50">Qty: {item.quantity} · ₹{item.price} each</span>
                          </div>
                          <span className="font-mono text-xs font-semibold text-[#203348]/80 shrink-0">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-[#E4DFD3] rounded-xl p-4 space-y-2 shadow-sm">
                    <div className="flex justify-between text-xs font-mono text-[#203348]/50">
                      <span>Subtotal</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-xs font-mono text-[#203348]/50">
                      <span>Shipping</span>
                      <span className="text-[#616F3E] font-bold uppercase text-[10px]">Free</span>
                    </div>
                    <div className="border-t border-[#E4DFD3] pt-2 flex justify-between items-center">
                      <span className="font-serif text-sm font-bold text-[#203348]">Total Investment</span>
                      <span className="font-mono text-base font-bold text-[#203348]">₹{totalAmount}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[#A5492B] hover:bg-[#203348] text-white rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg text-center flex justify-center items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Placing Order...
                      </>
                    ) : (
                      `Confirm Order (₹${totalAmount})`
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}

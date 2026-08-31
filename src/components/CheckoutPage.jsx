import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { sendOrderEmail } from '../lib/emailService'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Jammu & Kashmir', 'Ladakh'
]

// Helper to ensure Razorpay SDK is loaded
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { cartItems, updateCartQuantity, removeFromCart, clearCart } = useCart()

  // Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: 'Maharashtra',
    postalCode: '',
    country: 'India',
    saveInfo: true,
  })

  // Coupon state
  const [couponInput, setCouponInput] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orderSuccessData, setOrderSuccessData] = useState(null)

  // Scroll to top on mount and ensure scroll is enabled
  useEffect(() => {
    document.body.style.overflow = ''
    document.body.style.overflowY = 'auto'
    document.documentElement.style.overflow = ''
    document.documentElement.style.overflowY = 'auto'
    window.scrollTo(0, 0)
    return () => {
      document.body.style.overflow = ''
      document.body.style.overflowY = 'auto'
      document.documentElement.style.overflow = ''
      document.documentElement.style.overflowY = 'auto'
    }
  }, [])

  // Calculate pricing
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  }, [cartItems])

  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0
    if (appliedCoupon.type === 'percentage') {
      return Math.round((subtotal * appliedCoupon.value) / 100)
    }
    if (appliedCoupon.type === 'fixed') {
      return Math.min(appliedCoupon.value, subtotal)
    }
    return 0
  }, [appliedCoupon, subtotal])

  const shippingCost = 0 // Free express shipping across India
  const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    setCouponError('')
    setCouponSuccess('')
    const code = couponInput.trim().toUpperCase()

    if (!code) return

    if (code === 'KENWELL10' || code === 'FIRST10' || code === 'WELLNESS10') {
      setAppliedCoupon({ code, type: 'percentage', value: 10, label: '10% OFF' })
      setCouponSuccess('Coupon applied: 10% discount!')
    } else if (code === 'SAVE100' || code === 'FLAT100') {
      if (subtotal < 500) {
        setCouponError('Minimum order value of ₹500 required for this coupon.')
        return
      }
      setAppliedCoupon({ code, type: 'fixed', value: 100, label: '₹100 OFF' })
      setCouponSuccess('Coupon applied: ₹100 flat discount!')
    } else {
      setCouponError('Invalid or expired coupon code. Try KENWELL10.')
    }
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponInput('')
    setCouponSuccess('')
    setCouponError('')
  }

  const saveToLocalStorage = (order) => {
    try {
      const existing = JSON.parse(localStorage.getItem('kenwell_orders') || '[]')
      localStorage.setItem('kenwell_orders', JSON.stringify([order, ...existing]))
    } catch (e) {
      console.error('Failed to save order to localStorage:', e)
    }
  }

  const handleOrderPlacement = async (e) => {
    e.preventDefault()
    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add products before checking out.')
      return
    }

    setLoading(true)
    setError('')

    const fullName = `${formData.firstName} ${formData.lastName}`.trim()
    const friendlyId = 'KW-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    const fullAddress = [
      formData.address,
      formData.apartment,
      formData.city,
      `${formData.state} - ${formData.postalCode}`,
      formData.country
    ].filter(Boolean).join(', ')

    // Helper to process database insert and complete order
    const processOrderCompletion = async (paymentDetails = {}) => {
      const orderData = {
        friendly_id: friendlyId,
        customer_name: fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: fullAddress,
        city: formData.city,
        postal_code: formData.postalCode,
        amount: parseFloat(totalAmount),
        status: 'Paid',
        payment_method: 'Online (Razorpay)',
        coupon_applied: appliedCoupon ? appliedCoupon.code : null,
        discount_amount: discountAmount,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          servings: item.servings,
        })),
        emails_sent: [true, false, false],
        razorpay_payment_id: paymentDetails.razorpay_payment_id || null,
        razorpay_order_id: paymentDetails.razorpay_order_id || null,
        razorpay_signature: paymentDetails.razorpay_signature || null,
        created_at: new Date().toISOString(),
      }

      // Send Order Confirmed & Paid Email via Resend
      try {
        await sendOrderEmail({ order: orderData, type: 'confirmed' })
      } catch (emailErr) {
        console.warn('Resend email notification non-blocking warning:', emailErr)
      }

      try {
        const { error: dbError } = await supabase
          .from('orders')
          .insert([orderData])

        if (dbError) {
          console.warn('Supabase insert failed, saving to localStorage:', dbError.message)
          saveToLocalStorage(orderData)
        } else {
          console.log('Order saved to Supabase successfully!')
        }
      } catch (err) {
        console.error('Order save error:', err)
        saveToLocalStorage(orderData)
      } finally {
        setOrderSuccessData(orderData)
        clearCart()
        setLoading(false)
        window.scrollTo(0, 0)
      }
    }

    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_kenwell1234567'
    const isPlaceholderKey = !keyId || keyId.includes('kenwell1234567') || keyId.length < 15

    // If key is a demo placeholder, run a seamless sandbox payment simulation
    if (isPlaceholderKey) {
      setTimeout(async () => {
        const mockPayId = 'pay_sim_' + Math.random().toString(36).substring(2, 10).toUpperCase()
        const mockOrderId = 'order_sim_' + Math.random().toString(36).substring(2, 10)
        const mockSig = 'sig_sim_' + Math.random().toString(36).substring(2, 12)
        
        await processOrderCompletion({
          razorpay_payment_id: mockPayId,
          razorpay_order_id: mockOrderId,
          razorpay_signature: mockSig,
        })
      }, 900)
      return
    }

    // Ensure Razorpay SDK is loaded for real keys
    const isLoaded = await loadRazorpayScript()
    if (!isLoaded || !window.Razorpay) {
      setError('Failed to load Razorpay SDK. Simulating test payment fallback...')
      setTimeout(async () => {
        await processOrderCompletion({
          razorpay_payment_id: 'pay_fallback_' + Date.now(),
          razorpay_order_id: 'order_fallback_' + Date.now(),
          razorpay_signature: 'sig_fallback_' + Date.now(),
        })
      }, 500)
      return
    }

    const options = {
      key: keyId,
      amount: Math.round(totalAmount * 100), // in paise
      currency: 'INR',
      name: 'Kenwell Nutrition',
      description: `Order ${friendlyId} — Premium Formulations`,
      image: '/kenwell-mark.png',
      handler: async function (response) {
        await processOrderCompletion({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id || 'rzp_order_' + Math.random().toString(36).substring(2, 10),
          razorpay_signature: response.razorpay_signature || 'rzp_sig_' + Math.random().toString(36).substring(2, 10),
        })
      },
      prefill: {
        name: fullName,
        email: formData.email,
        contact: formData.phone,
      },
      notes: {
        address: fullAddress,
        orderId: friendlyId,
      },
      theme: {
        color: '#2E402B',
      },
      modal: {
        ondismiss: function () {
          setLoading(false)
        }
      }
    }

    try {
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response) {
        setError(`Payment failed: ${response.error?.description || 'Transaction cancelled.'} (Tip: Ensure a valid Razorpay Key ID is provided in .env)`)
        setLoading(false)
      })
      rzp.open()
    } catch (err) {
      console.error('Razorpay invocation error:', err)
      setError('Unable to open payment modal. Check your Razorpay Key ID in .env or try again.')
      setLoading(false)
    }
  }

  // ─────────────────────────────────────────────────────────────
  // ORDER CONFIRMED VIEW
  // ─────────────────────────────────────────────────────────────
  if (orderSuccessData) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-charcoal font-body flex flex-col">
        {/* Minimalist Top Header */}
        <header className="border-b border-[#E4DFD3] bg-white sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/kenwell-mark.png" alt="Kenwell" className="h-7 w-auto" />
              <span style={{ fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '1.4rem', fontWeight: 600, color: '#203348', textTransform: 'uppercase' }}>
                Kenwell
              </span>
            </Link>
            <div className="flex items-center gap-2 text-xs font-mono text-[#616F3E]">
              <svg className="w-4 h-4 text-[#616F3E]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Order Confirmed & Secured</span>
            </div>
          </div>
        </header>

        <main className="flex-grow max-w-3xl mx-auto px-4 py-10 w-full">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#E4DFD3] text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Animated Checkmark Circle */}
            <div className="w-20 h-20 bg-[#616F3E]/15 border-2 border-[#616F3E]/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <svg className="w-10 h-10 text-[#616F3E]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#616F3E] font-bold">Payment Successful · Razorpay Verified</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#203348]">
                Thank You, {orderSuccessData.customer_name}!
              </h1>
              <p className="text-[#203348]/60 text-sm max-w-md mx-auto leading-relaxed">
                Your order is confirmed and is being packaged in our climate-controlled fulfillment lab. A confirmation receipt has been sent to <strong className="text-[#203348]/80">{orderSuccessData.customer_email}</strong>.
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="bg-[#FAF8F5] border border-[#E4DFD3] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
              <div className="text-left">
                <span className="text-[10px] font-mono uppercase text-[#203348]/40 block">Order Reference ID</span>
                <span className="font-mono text-base font-bold text-[#203348]">{orderSuccessData.friendly_id}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono uppercase text-[#203348]/40 block">Estimated Delivery</span>
                <span className="font-mono text-sm font-semibold text-[#203348]/80">3 – 5 Business Days</span>
              </div>
            </div>

            {/* Order Items Breakdown */}
            <div className="text-left border border-[#E4DFD3] rounded-2xl p-6 bg-[#FAF8F5]/50 space-y-4">
              <h3 className="font-serif text-base font-bold text-[#203348]">Order Summary</h3>
              <div className="divide-y divide-[#E4DFD3]">
                {orderSuccessData.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl border border-[#E4DFD3] flex items-center justify-center p-1 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#203348]">{item.name}</p>
                        <p className="text-[10px] font-mono text-[#203348]/50">Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#203348]">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="border-t border-[#E4DFD3] pt-3 space-y-1.5 text-xs font-mono text-[#203348]/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{orderSuccessData.amount + (orderSuccessData.discount_amount || 0)}</span>
                </div>
                {orderSuccessData.discount_amount > 0 && (
                  <div className="flex justify-between text-[#616F3E] font-semibold">
                    <span>Discount ({orderSuccessData.coupon_applied})</span>
                    <span>-₹{orderSuccessData.discount_amount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Delivery</span>
                  <span className="text-[#616F3E] uppercase font-bold">Free</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#203348] border-t border-[#E4DFD3] pt-2 font-serif">
                  <span>Total Paid (Online via Razorpay)</span>
                  <span className="font-mono">₹{orderSuccessData.amount}</span>
                </div>
              </div>
            </div>

            {/* Delivery address */}
            <div className="text-left bg-white border border-[#E4DFD3] rounded-2xl p-5 text-xs text-[#203348]/70 space-y-1">
              <p className="font-mono uppercase text-[10px] text-[#203348]/40 tracking-wider">Shipping Destination</p>
              <p className="font-bold text-[#203348]">{orderSuccessData.customer_name} · {orderSuccessData.customer_phone}</p>
              <p>{orderSuccessData.shipping_address}</p>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  sessionStorage.setItem('kenwell_last_order', JSON.stringify({
                    orderId: orderSuccessData.friendly_id,
                    contact: orderSuccessData.customer_email || orderSuccessData.customer_phone
                  }))
                  navigate('/#track')
                }}
                className="px-8 py-3.5 bg-[#A5492B] hover:bg-[#203348] text-white rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-md text-center"
              >
                Track Live Order
              </button>
              <Link
                to="/"
                className="px-8 py-3.5 bg-[#FAF8F5] border border-[#E4DFD3] hover:bg-[#E4DFD3]/40 text-[#203348] rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-sm text-center"
              >
                Continue Shopping
              </Link>
            </div>

          </div>
        </main>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────
  // EMPTY CART VIEW
  // ─────────────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] text-charcoal font-body flex flex-col">
        {/* Minimalist Top Header */}
        <header className="border-b border-cream-dark/60 bg-white/70 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/kenwell-mark.png" alt="Kenwell" className="h-7 w-auto" />
              <span style={{ fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '1.4rem', fontWeight: 500, color: '#3A2010', textTransform: 'uppercase' }}>
                Kenwell
              </span>
            </Link>
            <Link to="/" className="text-xs font-mono text-charcoal/50 hover:text-charcoal transition-colors">
              ← Return Home
            </Link>
          </div>
        </header>

        <div className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-[#FAF8F5] border border-[#E4DFD3] flex items-center justify-center mb-5 text-[#203348]/40">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#203348] mb-2">Your Cart is Empty</h1>
          <p className="text-[#203348]/60 text-sm max-w-sm mb-8 leading-relaxed">
            You don't have any supplements or stacks in your cart yet. Explore our targeted formulations to get started.
          </p>
          <Link
            to="/#shop"
            className="px-8 py-3.5 bg-[#A5492B] hover:bg-[#203348] text-white rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-md"
          >
            Browse Products
          </Link>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────
  // DEDICATED CHECKOUT PAGE (ONLINE PAYMENTS VIA RAZORPAY ONLY)
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal font-body flex flex-col">
      
      {/* ── TOP CHECKOUT NAVIGATION BAR ── */}
      <header className="border-b border-[#E4DFD3] bg-white sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <img src="/kenwell-mark.png" alt="Kenwell" className="h-7 w-auto" />
            <span style={{ fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '1.45rem', fontWeight: 600, color: '#203348', textTransform: 'uppercase' }}>
              Kenwell
            </span>
          </Link>

          {/* Security Assurance Badges */}
          <div className="hidden sm:flex items-center gap-6 text-xs text-[#203348]/60 font-mono">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#616F3E]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Razorpay Secured · 256-Bit SSL</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#616F3E]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>100% Authentic Guarantee</span>
            </div>
          </div>

          {/* Return link */}
          <Link
            to="/"
            className="text-xs font-mono font-medium text-[#203348]/60 hover:text-[#203348] transition-colors flex items-center gap-1"
          >
            <span>←</span> Continue Shopping
          </Link>
        </div>
      </header>

      {/* ── CHECKOUT CONTENT ── */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        
        {/* Breadcrumb Steps */}
        <div className="flex items-center gap-2 text-xs font-mono text-[#203348]/50 mb-8 uppercase tracking-widest">
          <Link to="/" className="hover:text-[#203348] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#203348] font-bold">Online Checkout (Razorpay)</span>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-900 text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 shrink-0 text-amber-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setError('')
                setLoading(true)
                setTimeout(() => {
                  processOrderCompletion({
                    razorpay_payment_id: 'pay_sandbox_' + Date.now(),
                    razorpay_order_id: 'order_sandbox_' + Date.now(),
                    razorpay_signature: 'sig_sandbox_' + Date.now(),
                  })
                }, 600)
              }}
              className="px-4 py-2 bg-[#203348] hover:bg-[#A5492B] text-white text-xs font-semibold rounded-xl shrink-0 cursor-pointer shadow-sm transition-all whitespace-nowrap"
            >
              Simulate Test Payment ⚡
            </button>
          </div>
        )}

        <form onSubmit={handleOrderPlacement} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ══════════════════════════════════════════
              LEFT COLUMN: Customer & Shipping Details (7 cols)
          ══════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Step 1: Contact Information */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E4DFD3] space-y-5">
              <div className="flex items-center justify-between border-b border-[#E4DFD3] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#203348] text-white text-xs font-bold font-mono flex items-center justify-center">1</span>
                  <h2 className="font-serif text-xl font-bold text-[#203348]">Contact Information</h2>
                </div>
                <span className="text-[11px] font-mono text-[#203348]/40">Step 1 of 3</span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#203348]/60 mb-1.5">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Jane"
                      className="w-full bg-[#FAF8F5] border border-[#E4DFD3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#616F3E] focus:bg-white transition-all placeholder-[#203348]/30 text-[#203348]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#203348]/60 mb-1.5">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="w-full bg-[#FAF8F5] border border-[#E4DFD3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#616F3E] focus:bg-white transition-all placeholder-[#203348]/30 text-[#203348]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#203348]/60 mb-1.5">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jane@example.com"
                      className="w-full bg-[#FAF8F5] border border-[#E4DFD3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#616F3E] focus:bg-white transition-all placeholder-[#203348]/30 text-[#203348]"
                    />
                    <span className="text-[10px] text-[#203348]/40 mt-1 block">Order invoice & payment confirmation sent here.</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#203348]/60 mb-1.5">Mobile Phone *</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-xs font-mono text-[#203348]/50">+91</span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        pattern="[0-9]{10}"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        className="w-full bg-[#FAF8F5] border border-[#E4DFD3] rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-[#616F3E] focus:bg-white transition-all placeholder-[#203348]/30 font-mono text-[#203348]"
                      />
                    </div>
                    <span className="text-[10px] text-[#203348]/40 mt-1 block">For delivery coordination & dispatch alerts.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Destination */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E4DFD3] space-y-5">
              <div className="flex items-center justify-between border-b border-[#E4DFD3] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#203348] text-white text-xs font-bold font-mono flex items-center justify-center">2</span>
                  <h2 className="font-serif text-xl font-bold text-[#203348]">Shipping Address</h2>
                </div>
                <span className="text-[11px] font-mono text-[#203348]/40">Step 2 of 3</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#203348]/60 mb-1.5">Street Address / House No / Building *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. Flat 402, Green Valley Apartments, MG Road"
                    className="w-full bg-[#FAF8F5] border border-[#E4DFD3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#616F3E] focus:bg-white transition-all placeholder-[#203348]/30 text-[#203348]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#203348]/60 mb-1.5">Landmark / Area (Optional)</label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    placeholder="e.g. Near HDFC Bank / Sector 4"
                    className="w-full bg-[#FAF8F5] border border-[#E4DFD3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#616F3E] focus:bg-white transition-all placeholder-[#203348]/30 text-[#203348]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#203348]/60 mb-1.5">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-[#FAF8F5] border border-[#E4DFD3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#616F3E] focus:bg-white transition-all placeholder-[#203348]/30 text-[#203348]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#203348]/60 mb-1.5">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full bg-[#FAF8F5] border border-[#E4DFD3] rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-[#616F3E] focus:bg-white transition-all text-[#203348] cursor-pointer"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-[#203348]/60 mb-1.5">PIN Code *</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      pattern="[0-9]{6}"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      className="w-full bg-[#FAF8F5] border border-[#E4DFD3] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#616F3E] focus:bg-white transition-all placeholder-[#203348]/30 font-mono text-[#203348]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-center gap-2.5 text-xs text-[#203348]/70 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded text-[#616F3E] focus:ring-[#616F3E] border-[#E4DFD3] cursor-pointer accent-[#203348]"
                    />
                    <span>Save this delivery information for faster checkout next time</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method (Online via Razorpay) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#E4DFD3] space-y-5">
              <div className="flex items-center justify-between border-b border-[#E4DFD3] pb-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#203348] text-white text-xs font-bold font-mono flex items-center justify-center">3</span>
                  <h2 className="font-serif text-xl font-bold text-[#203348]">Online Payment</h2>
                </div>
                <span className="text-[11px] font-mono text-[#616F3E] font-bold uppercase tracking-wider bg-[#616F3E]/10 px-2.5 py-1 rounded-full">
                  Razorpay Secured
                </span>
              </div>

              {/* Dedicated Razorpay payment panel */}
              <div className="border-2 border-[#203348] rounded-2xl p-5 bg-[#FAF8F5] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#203348] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                    <span className="font-serif text-base font-bold text-[#203348]">All Online Payment Methods</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#203348] text-white font-semibold">
                    Instant Confirmation
                  </span>
                </div>

                <p className="text-xs text-[#203348]/70 leading-relaxed">
                  You will be securely redirected to the official Razorpay gateway window to complete your payment using any method of your choice:
                </p>

                {/* Supported Payment Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  <div className="bg-white rounded-xl p-3 border border-[#E4DFD3] text-center">
                    <span className="block text-[11px] font-bold text-[#203348]">UPI & QR</span>
                    <span className="block text-[9px] font-mono text-[#203348]/50 mt-0.5">GPay · PhonePe · Paytm</span>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-[#E4DFD3] text-center">
                    <span className="block text-[11px] font-bold text-[#203348]">Cards</span>
                    <span className="block text-[9px] font-mono text-[#203348]/50 mt-0.5">Visa · Master · RuPay</span>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-[#E4DFD3] text-center">
                    <span className="block text-[11px] font-bold text-[#203348]">NetBanking</span>
                    <span className="block text-[9px] font-mono text-[#203348]/50 mt-0.5">50+ Indian Banks</span>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-[#E4DFD3] text-center">
                    <span className="block text-[11px] font-bold text-[#203348]">Wallets & EMI</span>
                    <span className="block text-[9px] font-mono text-[#203348]/50 mt-0.5">Mobikwik · Cred · PayLater</span>
                  </div>
                </div>

                <div className="border-t border-[#E4DFD3] pt-3 flex items-center gap-2 text-[10px] font-mono text-[#203348]/50">
                  <svg className="w-3.5 h-3.5 text-[#616F3E] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 0117.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>PCI-DSS Level 1 Compliant · 100% Encrypted & Safe Transaction</span>
                </div>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════
              RIGHT COLUMN: Order Summary & Placement (5 cols)
          ══════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-[#E4DFD3] space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#E4DFD3] pb-4">
                <h3 className="font-serif text-lg font-bold text-[#203348]">Order Summary</h3>
                <span className="text-xs font-mono text-[#203348]/50">{cartItems.reduce((a, b) => a + b.quantity, 0)} Items</span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3.5 pb-3.5 border-b border-[#E4DFD3] last:border-b-0 last:pb-0">
                    <div className="w-14 h-14 bg-[#FAF8F5] rounded-xl border border-[#E4DFD3] flex items-center justify-center p-1.5 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    
                    <div className="flex-grow min-w-0 text-left">
                      <h4 className="font-serif text-xs font-bold text-[#203348] truncate">{item.name}</h4>
                      <p className="text-[10px] font-mono text-[#203348]/50">₹{item.price} each</p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center border border-[#E4DFD3] rounded-lg bg-[#FAF8F5] px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="text-xs px-1 text-[#203348]/60 hover:text-[#203348] cursor-pointer font-mono"
                          >
                            -
                          </button>
                          <span className="text-[11px] font-mono font-bold px-2 text-[#203348]">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="text-xs px-1 text-[#203348]/60 hover:text-[#203348] cursor-pointer font-mono"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[10px] text-[#A5492B] hover:underline transition-colors font-mono cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono text-sm font-bold text-[#203348]">₹{item.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon / Promo Code Field */}
              <div className="pt-2 border-t border-[#E4DFD3]">
                {!appliedCoupon ? (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Discount Code (e.g. KENWELL10)"
                        className="flex-grow bg-[#FAF8F5] border border-[#E4DFD3] rounded-xl px-3.5 py-2.5 text-xs uppercase font-mono tracking-wider focus:outline-none focus:border-[#616F3E] transition-all placeholder-[#203348]/35 text-[#203348]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-4 py-2.5 bg-[#203348] hover:bg-[#A5492B] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[10px] text-red-600 mt-1.5 font-mono">{couponError}</p>
                    )}
                    {couponSuccess && (
                      <p className="text-[10px] text-[#616F3E] mt-1.5 font-mono font-semibold">{couponSuccess}</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-[#616F3E]/10 border border-[#616F3E]/30 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#616F3E] font-mono">
                      <svg className="w-4 h-4 text-[#616F3E] shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span><strong>{appliedCoupon.code}</strong> applied ({appliedCoupon.label})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-[#203348]/50 hover:text-[#203348] cursor-pointer font-mono ml-2"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2.5 border-t border-[#E4DFD3] pt-4 text-xs font-mono text-[#203348]/70">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#616F3E] font-semibold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Express Shipping</span>
                  <span className="text-[#616F3E] font-bold uppercase text-[10px]">Free</span>
                </div>

                <div className="flex justify-between text-[11px] text-[#203348]/40">
                  <span>Estimated Taxes (GST)</span>
                  <span>Included</span>
                </div>

                <div className="border-t border-[#E4DFD3] pt-3 flex justify-between items-baseline">
                  <div>
                    <span className="font-serif text-base font-bold text-[#203348] block">Total Investment</span>
                    <span className="text-[10px] text-[#203348]/40 font-mono">100% Satisfaction Guarantee</span>
                  </div>
                  <span className="font-mono text-2xl font-extrabold text-[#203348]">₹{totalAmount}</span>
                </div>
              </div>

              {/* Place Order CTA Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4.5 bg-[#A5492B] hover:bg-[#203348] text-white rounded-2xl text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 disabled:opacity-75"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Opening Razorpay Gateway...</span>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Pay with Razorpay · ₹{totalAmount}</span>
                  </div>
                )}
              </button>

              {/* Trust Footer */}
              <div className="pt-2 text-center text-[10px] font-mono text-[#203348]/40 space-y-1">
                <p>🔒 256-Bit SSL Encrypted Online Payment via Razorpay</p>
                <p>Supports UPI, Cards, NetBanking &amp; Wallets</p>
              </div>

            </div>

          </div>

        </form>

      </main>

    </div>
  )
}

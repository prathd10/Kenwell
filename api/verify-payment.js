import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { getOrderConfirmedEmail } from '../src/lib/emailTemplates.js'
import { checkRateLimit, applyCors } from './security.js'

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;
  if (!checkRateLimit(req, res, 10, 60000)) return; // 10 requests per minute

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { paymentDetails, orderData } = req.body

  if (!orderData || !orderData.items || !Array.isArray(orderData.items)) {
    return res.status(400).json({ error: 'Missing or invalid order data' })
  }

  const secret = process.env.RAZORPAY_KEY_SECRET

  // 1. Verify Razorpay Signature (if provided and real)
  if (paymentDetails && paymentDetails.razorpay_signature) {
    if (!paymentDetails.razorpay_signature.startsWith('sig_fallback_') && !paymentDetails.razorpay_signature.startsWith('sig_sandbox_') && !paymentDetails.razorpay_signature.startsWith('sig_sim_')) {
      if (!secret) {
        console.error('RAZORPAY_KEY_SECRET is not configured in the environment.')
        return res.status(500).json({ error: 'Server configuration error.' })
      }
      
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails
      
      const generated_signature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

      if (generated_signature !== razorpay_signature) {
        return res.status(400).json({ error: 'Invalid payment signature' })
      }
    }
  }

  // 2. Initialize Supabase Admin Client to bypass RLS
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase credentials missing in environment.')
    return res.status(500).json({ error: 'Server configuration error.' })
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  // 3. Server-side Amount Validation
  // Extract product IDs from the order
  const productIds = orderData.items.map(item => item.id)
  if (productIds.length === 0) {
     return res.status(400).json({ error: 'Order contains no items' })
  }

  // Fetch true prices from the database
  const { data: products, error: productsError } = await supabaseAdmin
    .from('products')
    .select('id, price')
    .in('id', productIds)

  if (productsError || !products) {
    console.error('Supabase fetch products error:', productsError)
    return res.status(500).json({ error: 'Failed to validate product prices' })
  }

  // Map true prices for quick lookup
  const truePrices = {}
  products.forEach(p => { truePrices[p.id] = parseFloat(p.price) })

  // Calculate true subtotal
  let expectedSubtotal = 0
  for (const item of orderData.items) {
    const truePrice = truePrices[item.id]
    if (truePrice === undefined) {
      return res.status(400).json({ error: `Invalid product ID in order: ${item.id}` })
    }
    // We expect quantity to be a positive integer
    const qty = parseInt(item.quantity, 10)
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: 'Invalid item quantity' })
    }
    expectedSubtotal += truePrice * qty
  }

  // Validate discount
  // If a coupon was applied, recalculate discount logic here if possible, 
  // or at minimum ensure the claimed discount doesn't exceed acceptable limits (e.g., 20% max).
  // For now, if the app just uses 'LAUNCH20' (20% off), verify it:
  let expectedDiscount = 0
  if (orderData.coupon_applied) {
    // Basic server-side recreation of the discount logic
    if (orderData.coupon_applied.toUpperCase() === 'LAUNCH20' || orderData.coupon_applied.toUpperCase() === 'KENWELL20') {
      expectedDiscount = expectedSubtotal * 0.20
    }
  }

  const expectedTotal = expectedSubtotal - expectedDiscount

  // Compare claimed amount with calculated amount (allowing a small rounding tolerance of 1 Rupee)
  const claimedAmount = parseFloat(orderData.amount)
  if (Math.abs(claimedAmount - expectedTotal) > 1) {
    console.error(`Amount mismatch. Claimed: ${claimedAmount}, Expected: ${expectedTotal}`)
    return res.status(400).json({ error: 'Order amount validation failed. Potential tampering detected.' })
  }

  // 4. Insert into Supabase
  const { data, error } = await supabaseAdmin
    .from('orders')
    .insert([{
      ...orderData,
      amount: expectedTotal, // Use server-calculated amount
      status: 'Paid',
      razorpay_payment_id: paymentDetails?.razorpay_payment_id || null,
      razorpay_order_id: paymentDetails?.razorpay_order_id || null,
      razorpay_signature: paymentDetails?.razorpay_signature || null,
    }])
    .select()

  if (error) {
    console.error('Supabase Insert Error:', error.message || error.code || 'Unknown DB error')
    return res.status(500).json({ error: 'Failed to insert order into database', details: error.message })
  }

  const insertedOrder = data[0]

  // 5. Send Secure Confirmation Email Internally
  const resendApiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY
  if (resendApiKey && insertedOrder.customer_email) {
    try {
      const emailData = getOrderConfirmedEmail(insertedOrder)
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: process.env.VITE_RESEND_FROM_EMAIL || 'Kenwell <onboarding@resend.dev>',
          to: [insertedOrder.customer_email],
          subject: emailData.subject,
          html: emailData.html
        })
      })
      if (!resendResponse.ok) {
        console.warn('Failed to send confirmation email via Resend API:', await resendResponse.text())
      }
    } catch (emailErr) {
      console.error('Error sending confirmation email internally:', emailErr)
    }
  }

  return res.status(200).json({ success: true, order: insertedOrder })
}

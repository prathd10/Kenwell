import {
  getOrderConfirmedEmail,
  getOrderShippedEmail,
  getOrderDeliveredEmail
} from '../src/lib/emailTemplates.js'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, applyCors } from './security.js'

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;
  if (!checkRateLimit(req, res, 20, 60000)) return; // 20 requests per minute

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  // 1. Authorize request via Supabase Auth
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing authorization header' })
  }
  
  const token = authHeader.split(' ')[1]
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY
  
  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return res.status(403).json({ error: 'Unauthorized to send emails.' })
    }
  } else {
    return res.status(500).json({ error: 'Server configuration error.' })
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured on server' })
  }

  const { order, type = 'confirmed' } = req.body

  if (!order || !order.customer_email) {
    return res.status(400).json({ error: 'Missing order data or customer email' })
  }

  let emailData = null
  switch (type) {
    case 'confirmed':
    case 'Paid':
      emailData = getOrderConfirmedEmail(order)
      break
    case 'shipped':
    case 'Shipped':
      emailData = getOrderShippedEmail(order)
      break
    case 'delivered':
    case 'Delivered':
      emailData = getOrderDeliveredEmail(order)
      break
    default:
      return res.status(400).json({ error: 'Unknown email type' })
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.VITE_RESEND_FROM_EMAIL || 'Kenwell <onboarding@resend.dev>',
        to: [order.customer_email],
        subject: emailData.subject,
        html: emailData.html
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json(data)
    }

    return res.status(200).json(data)
  } catch (err) {
    console.error('Resend Serverless Error:', err)
    return res.status(500).json({ error: err.message || 'Internal server error sending email' })
  }
}

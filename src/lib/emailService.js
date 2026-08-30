import { supabase } from './supabase'
import {
  getOrderConfirmedEmail,
  getOrderShippedEmail,
  getOrderDeliveredEmail
} from './emailTemplates'

/**
 * Resend Email Dispatch Service for Kenwell
 * Supports Supabase Edge Functions & direct Resend REST API
 */
export async function sendOrderEmail({ order, type = 'confirmed' }) {
  if (!order || !order.customer_email) {
    console.warn('[Resend Email Service] Cannot send email: missing order or recipient email address.')
    return { success: false, error: 'Recipient email is missing' }
  }

  // 1. Try Supabase Edge Function first
  try {
    const { data: edgeData, error: edgeError } = await supabase.functions.invoke('send-order-email', {
      body: { order, type }
    })

    if (!edgeError && edgeData && (edgeData.success || edgeData.id)) {
      console.log(`%c[Supabase Edge Function · ${type.toUpperCase()}] Dispatched to ${order.customer_email}`, 'color: #059669; font-weight: bold;')
      return { success: true, id: edgeData.id || edgeData.data?.id }
    } else if (edgeError) {
      console.warn('[Supabase Edge Function Response]:', edgeError)
    }
  } catch (edgeInvokeErr) {
    console.warn('[Supabase Edge Function not reachable, attempting direct dispatch]:', edgeInvokeErr.message)
  }

  // 2. Direct Resend / Serverless Fallback
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
      console.warn(`[Resend Email Service] Unknown email type: ${type}`)
      return { success: false, error: `Unknown email type: ${type}` }
  }

  const apiKey = import.meta.env.VITE_RESEND_API_KEY || ''
  const fromEmail = import.meta.env.VITE_RESEND_FROM_EMAIL || 'Kenwell <onboarding@resend.dev>'

  // 2. Try Vercel Serverless Function (/api/send-email)
  try {
    const payload = {
      from: fromEmail,
      to: [order.customer_email],
      subject: emailData.subject,
      html: emailData.html
    }

    const vercelRes = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (vercelRes.ok) {
      const data = await vercelRes.json()
      console.log(`%c[Vercel Serverless Email Dispatched · ${type.toUpperCase()}] ID: ${data.id} to ${order.customer_email}`, 'color: #059669; font-weight: bold;')
      return { success: true, id: data.id }
    }
  } catch {
    // If not running on Vercel or /api/send-email fails, continue to direct dispatch
  }

  // 3. Direct Resend REST API Fallback (if VITE_RESEND_API_KEY is available)
  if (apiKey) {
    try {
      const payload = {
        from: fromEmail,
        to: [order.customer_email],
        subject: emailData.subject,
        html: emailData.html
      }

      console.log(`[Resend Sending...] Dispatching ${type} email to ${order.customer_email} via Resend...`)

      let res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('[Resend API Error Details]:', data)
        return {
          success: false,
          error: data.message || data.error?.message || 'Failed to dispatch email via Resend'
        }
      }

      console.log(`%c[Resend Email Dispatched Successfully] ID: ${data.id} to ${order.customer_email}`, 'color: #059669; font-weight: bold;')
      return {
        success: true,
        id: data.id
      }
    } catch (err) {
      console.error('[Resend Network Error]:', err)
      return {
        success: false,
        error: err.message || 'Network error communicating with Resend'
      }
    }
  }

  return { success: false, error: 'Email service could not reach serverless functions or API key' }
}

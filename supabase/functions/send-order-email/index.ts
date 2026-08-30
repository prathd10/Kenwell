// Supabase Edge Function: send-order-email
// Deploy via: supabase functions deploy send-order-email --no-verify-jwt
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const emailWrapper = ({ title, preheader, content }: { title: string, preheader: string, content: string }) => {
  const siteUrl = Deno.env.get('SITE_URL') || 'https://kenwell.in'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1C2D1A; -webkit-font-smoothing: antialiased;">
  
  <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #F4F1EA; padding: 30px 10px;">
    <tr>
      <td align="center" valign="top">
        
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(28, 45, 26, 0.08); border: 1px solid #EAE5D9;">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 32px 20px 24px; background-color: #2E402B; border-bottom: 3px solid #7A8C5A;">
              <span style="font-family: Impact, Arial, sans-serif; font-size: 26px; font-weight: 700; color: #FFFFFF; letter-spacing: 2px; text-transform: uppercase;">
                KENWELL
              </span>
              <div style="font-size: 10px; font-family: monospace; color: #C9B99A; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px;">
                Clean Nutrition · Precision Formulations
              </div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 36px 32px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 32px; background-color: #FAF8F5; border-top: 1px solid #EAE5D9; text-align: center;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size: 11px; color: #7A8C5A; line-height: 18px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px;">
                    Kenwell Precision Health & Nutrition
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 12px; color: rgba(28, 45, 26, 0.5); line-height: 18px; padding-top: 8px;">
                    Questions about your order? Reach out to <a href="mailto:help@kenwell.in" style="color: #2E402B; font-weight: 600;">help@kenwell.in</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 16px;">
                    <a href="${siteUrl}" style="font-size: 11px; color: #7A8C5A; text-decoration: none; margin: 0 8px;">Official Website</a>
                    <span style="color: #DDD8CA;">•</span>
                    <a href="${siteUrl}/#track" style="font-size: 11px; color: #7A8C5A; text-decoration: none; margin: 0 8px;">Live Tracking</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 10px; color: rgba(28, 45, 26, 0.35); padding-top: 16px;">
                    © ${new Date().getFullYear()} Kenwell. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`
}

function getTemplate(order: any, type: string) {
  const rawSiteUrl = Deno.env.get('SITE_URL') || 'https://kenwell.in'
  const siteUrl = rawSiteUrl.replace(/\/+$/, '')
  const orderId = order.friendly_id || ''
  const contact = order.customer_email || order.customer_phone || ''
  const trackUrl = `${siteUrl}/#track?orderId=${encodeURIComponent(orderId)}&contact=${encodeURIComponent(contact)}`

  if (type === 'confirmed' || type === 'Paid') {
    const items = order.items || []
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0)
    const discount = order.discount_amount || 0
    const total = order.amount || (subtotal - discount)

    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #F4F1EA;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="50" valign="middle">
                <div style="width: 44px; height: 44px; background-color: #FAF8F5; border: 1px solid #DDD8CA; border-radius: 8px; overflow: hidden; text-align: center;">
                  <img src="${item.image || 'https://kenwell.in/kenwell-mark.png'}" alt="${item.name}" width="40" height="40" style="object-fit: contain; display: block; margin: 2px auto;" />
                </div>
              </td>
              <td style="padding-left: 12px;" valign="middle">
                <div style="font-size: 13px; font-weight: 700; color: #2E402B;">${item.name}</div>
                <div style="font-size: 11px; color: #7A8C5A; font-family: monospace;">Qty: ${item.quantity} × ₹${Number(item.price).toLocaleString('en-IN')}</div>
              </td>
              <td align="right" valign="middle" style="font-family: monospace; font-size: 13px; font-weight: 700; color: #1C2D1A;">
                ₹${Number(item.price * item.quantity).toLocaleString('en-IN')}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    `).join('')

    return {
      subject: `Order Confirmed: ${order.friendly_id} — Kenwell Formulations`,
      html: emailWrapper({
        title: `Order Confirmed: ${order.friendly_id}`,
        preheader: `Thank you! Your payment for order ${order.friendly_id} has been confirmed.`,
        content: `
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 6px 16px; background-color: #EAF2E8; border: 1.5px solid #C0D5BD; border-radius: 99px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #2E402B; text-transform: uppercase;">
                ✓ Payment Confirmed · Razorpay Verified
              </span>
            </div>
            <h1 style="font-size: 24px; font-weight: 700; color: #2E402B; margin: 16px 0 8px; font-family: Georgia, serif;">
              Thank You, ${order.customer_name || 'Valued Customer'}!
            </h1>
            <p style="font-size: 14px; color: rgba(28, 45, 26, 0.7); margin: 0; line-height: 22px;">
              Your order is being prepared in our climate-controlled lab for rapid dispatch.
            </p>
          </div>

          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F5; border: 1.5px solid #DDD8CA; border-radius: 14px; margin-bottom: 28px; padding: 16px 20px;">
            <tr>
              <td>
                <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #7A8C5A;">Order ID</div>
                <div style="font-size: 16px; font-family: monospace; font-weight: 700; color: #2E402B;">${order.friendly_id}</div>
              </td>
              <td align="right">
                <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #7A8C5A;">Estimated Dispatch</div>
                <div style="font-size: 13px; font-weight: 600; color: #1C2D1A;">Within 24 Hours</div>
              </td>
            </tr>
          </table>

          <div style="font-size: 12px; font-family: monospace; font-weight: 700; color: #7A8C5A; text-transform: uppercase; margin-bottom: 10px;">
            Your Formulations Stack
          </div>
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
            ${itemsHtml}
          </table>

          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F5; border-radius: 12px; padding: 14px 18px; margin-bottom: 28px; font-family: monospace; font-size: 12px;">
            <tr>
              <td style="color: rgba(28, 45, 26, 0.6); padding-bottom: 6px;">Subtotal</td>
              <td align="right" style="color: #1C2D1A; padding-bottom: 6px;">₹${Number(subtotal).toLocaleString('en-IN')}</td>
            </tr>
            ${discount > 0 ? `
            <tr>
              <td style="color: #7A8C5A; font-weight: 600; padding-bottom: 6px;">Discount (${order.coupon_applied || 'PROMO'})</td>
              <td align="right" style="color: #7A8C5A; font-weight: 600; padding-bottom: 6px;">-₹${Number(discount).toLocaleString('en-IN')}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="color: rgba(28, 45, 26, 0.6); padding-bottom: 8px;">Express Shipping</td>
              <td align="right" style="color: #7A8C5A; font-weight: 700;">FREE</td>
            </tr>
            <tr>
              <td style="border-top: 1px solid #DDD8CA; padding-top: 10px; font-size: 14px; font-weight: 700; color: #2E402B; font-family: Georgia, serif;">Total Paid (Online)</td>
              <td align="right" style="border-top: 1px solid #DDD8CA; padding-top: 10px; font-size: 16px; font-weight: 800; color: #2E402B; font-family: monospace;">₹${Number(total).toLocaleString('en-IN')}</td>
            </tr>
          </table>

          <div style="background-color: #FFFFFF; border: 1px solid #EAE5D9; border-radius: 12px; padding: 16px; margin-bottom: 28px;">
            <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #7A8C5A; margin-bottom: 6px;">
              Shipping Destination
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #1C2D1A;">${order.customer_name} · ${order.customer_phone || ''}</div>
            <div style="font-size: 12px; color: rgba(28, 45, 26, 0.7); line-height: 18px; margin-top: 3px;">
              ${order.shipping_address || ''}
            </div>
          </div>

          <div style="text-align: center; margin: 32px 0 10px;">
            <a href="${trackUrl}" style="display: inline-block; background-color: #2E402B; color: #F4F1EA; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 99px;">
              Track Live Delivery →
            </a>
          </div>
        `
      })
    }
  }

  if (type === 'shipped' || type === 'Shipped') {
    return {
      subject: `Your Order is Shipped: ${order.friendly_id} — Kenwell`,
      html: emailWrapper({
        title: `Your Order is Shipped: ${order.friendly_id}`,
        preheader: `Good news! Your Kenwell order ${order.friendly_id} has been dispatched.`,
        content: `
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 6px 16px; background-color: #F5EFE6; border: 1.5px solid #E2D4C3; border-radius: 99px;">
              <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #8C6D3B; text-transform: uppercase;">
                📦 Order Shipped · In Transit
              </span>
            </div>
            <h1 style="font-size: 24px; font-weight: 700; color: #2E402B; margin: 16px 0 8px; font-family: Georgia, serif;">
              Your Formulations Are On The Way!
            </h1>
            <p style="font-size: 14px; color: rgba(28, 45, 26, 0.7); margin: 0; line-height: 22px;">
              Hi ${order.customer_name || 'there'}, your order <strong style="color: #2E402B; font-family: monospace;">${order.friendly_id}</strong> has departed our fulfillment facility.
            </p>
          </div>

          <div style="background-color: #FFFFFF; border: 1px solid #EAE5D9; border-radius: 12px; padding: 18px; margin-bottom: 28px;">
            <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #7A8C5A; margin-bottom: 6px;">
              Delivering To
            </div>
            <div style="font-size: 13px; font-weight: 700; color: #1C2D1A;">${order.customer_name}</div>
            <div style="font-size: 12px; color: rgba(28, 45, 26, 0.7); line-height: 18px; margin-top: 2px;">
              ${order.shipping_address || ''}
            </div>
          </div>

          <div style="text-align: center; margin: 32px 0 10px;">
            <a href="${trackUrl}" style="display: inline-block; background-color: #2E402B; color: #F4F1EA; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 99px;">
              Track Live Delivery →
            </a>
          </div>
        `
      })
    }
  }

  // Delivered
  return {
    subject: `Delivered: Your Kenwell Order ${order.friendly_id}`,
    html: emailWrapper({
      title: `Order Delivered: ${order.friendly_id}`,
      preheader: `Your Kenwell formulations have arrived! Here are your dosage and storage guidelines.`,
      content: `
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="display: inline-block; padding: 6px 16px; background-color: #E4ECE2; border: 1.5px solid #ADC7AA; border-radius: 99px;">
            <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #1C2D1A; text-transform: uppercase;">
              ✨ Order Delivered Successfully
            </span>
          </div>
          <h1 style="font-size: 24px; font-weight: 700; color: #2E402B; margin: 16px 0 8px; font-family: Georgia, serif;">
            Your Package Has Arrived!
          </h1>
          <p style="font-size: 14px; color: rgba(28, 45, 26, 0.7); margin: 0; line-height: 22px;">
            Hi ${order.customer_name || 'there'}, your Kenwell package for order <strong style="color: #2E402B; font-family: monospace;">${order.friendly_id}</strong> has been delivered.
          </p>
        </div>

        <div style="background-color: #FAF8F5; border: 1.5px solid #DDD8CA; border-radius: 14px; padding: 20px; margin-bottom: 28px;">
          <div style="font-size: 11px; font-family: monospace; font-weight: 700; color: #2E402B; text-transform: uppercase; margin-bottom: 10px;">
            Recommended Routine & Storage
          </div>
          <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: rgba(28, 45, 26, 0.75); line-height: 22px;">
            <li>Store in a cool, dry place away from direct sunlight.</li>
            <li>Follow recommended dosage on the formulation bottle.</li>
            <li>Scan the QR code on your product box for batch lab certificates.</li>
          </ul>
        </div>
      `
    })
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('RESEND_API_KEY') || ''
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'Kenwell <onboarding@resend.dev>'
    
    const body = await req.json()
    // Support direct invoke { order, type } or Supabase Database Webhook { record, type, old_record }
    const order = body.order || body.record
    let type = body.type || 'confirmed'

    // If triggered via Database Webhook
    if (body.type === 'UPDATE' && body.record) {
      if (body.record.status === 'Shipped') type = 'shipped'
      else if (body.record.status === 'Delivered') type = 'delivered'
      else type = 'confirmed'
    }

    if (!order || !order.customer_email) {
      return new Response(JSON.stringify({ error: 'Missing order or customer_email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { subject, html } = getTemplate(order, type)

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [order.customer_email],
        subject,
        html
      })
    })

    const data = await resendResponse.json()

    if (!resendResponse.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: resendResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

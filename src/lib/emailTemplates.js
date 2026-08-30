/**
 * Luxury HTML Email Templates for Kenwell Nutrition
 * Compatible with all major email clients (Gmail, Apple Mail, Outlook)
 */

const getSiteUrl = () => {
  let url = 'https://kenwell.in'
  if (typeof window !== 'undefined' && window.location) {
    url = window.location.origin
  } else if (import.meta.env.VITE_SITE_URL) {
    url = import.meta.env.VITE_SITE_URL
  }
  return url.replace(/\/+$/, '')
}

const getTrackUrl = (order) => {
  const base = getSiteUrl()
  const orderId = order?.friendly_id || ''
  const contact = order?.customer_email || order?.customer_phone || ''
  return `${base}/#track?orderId=${encodeURIComponent(orderId)}&contact=${encodeURIComponent(contact)}`
}

/**
 * Shared email wrapper layout
 */
const emailWrapper = ({ title, preheader, content }) => {
  const siteUrl = getSiteUrl()

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1C2D1A; -webkit-font-smoothing: antialiased;">
  
  <!-- Preheader preview text (hidden) -->
  <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all;">
    ${preheader}
  </div>

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed; background-color: #F4F1EA; padding: 30px 10px;">
    <tr>
      <td align="center" valign="top">
        
        <!-- Main Email Container -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(28, 45, 26, 0.08); border: 1px solid #EAE5D9;">
          
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="padding: 32px 20px 24px; background-color: #2E402B; border-bottom: 3px solid #7A8C5A;">
              <table border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <span style="font-family: 'Fredoka One', Impact, Arial, sans-serif; font-size: 26px; font-weight: 700; color: #FFFFFF; letter-spacing: 2px; text-transform: uppercase;">
                      KENWELL
                    </span>
                    <div style="font-size: 10px; font-family: 'Courier New', monospace; color: #C9B99A; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px;">
                      Clean Nutrition · Precision Formulations
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dynamic Body Content -->
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
                  <td align="center" style="font-size: 11px; color: #7A8C5A; line-height: 18px; font-family: 'Courier New', monospace; text-transform: uppercase; letter-spacing: 1px;">
                    Kenwell Precision Health & Nutrition
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 12px; color: rgba(28, 45, 26, 0.5); line-height: 18px; padding-top: 8px;">
                    Have questions about your order or formulation routine?<br />
                    Reach out directly at <a href="mailto:help@kenwell.in" style="color: #2E402B; font-weight: 600; text-decoration: underline;">help@kenwell.in</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 16px;">
                    <a href="${siteUrl}" style="display: inline-block; font-size: 11px; color: #7A8C5A; text-decoration: none; margin: 0 8px;">Official Website</a>
                    <span style="color: #DDD8CA;">•</span>
                    <a href="${siteUrl}/#track" style="display: inline-block; font-size: 11px; color: #7A8C5A; text-decoration: none; margin: 0 8px;">Live Tracking</a>
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
        <!-- /Main Email Container -->

      </td>
    </tr>
  </table>

</body>
</html>
`
}

/**
 * 1. Order Confirmed & Paid Email Template
 */
export const getOrderConfirmedEmail = (order) => {
  const items = order.items || []
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const discount = order.discount_amount || 0
  const total = order.amount || (subtotal - discount)
  const trackUrl = getTrackUrl(order)

  const itemsHtml = items.map(item => `
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
              <div style="font-size: 11px; color: #7A8C5A; font-family: monospace;">Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')}</div>
            </td>
            <td align="right" valign="middle" style="font-family: monospace; font-size: 13px; font-weight: 700; color: #1C2D1A;">
              ₹${(item.price * item.quantity).toLocaleString('en-IN')}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `).join('')

  const content = `
    <!-- Top Status Badge -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 6px 16px; background-color: #EAF2E8; border: 1.5px solid #C0D5BD; border-radius: 99px;">
        <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #2E402B; text-transform: uppercase; letter-spacing: 1px;">
          ✓ Payment Confirmed · Razorpay Verified
        </span>
      </div>
      <h1 style="font-size: 24px; font-weight: 700; color: #2E402B; margin: 16px 0 8px; font-family: Georgia, serif;">
        Thank You, ${order.customer_name || 'Valued Customer'}!
      </h1>
      <p style="font-size: 14px; color: rgba(28, 45, 26, 0.7); margin: 0; line-height: 22px;">
        Your order has been received and is being prepared in our climate-controlled lab for rapid dispatch.
      </p>
    </div>

    <!-- Order Reference Pill Card -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F5; border: 1.5px solid #DDD8CA; border-radius: 14px; margin-bottom: 28px;">
      <tr>
        <td style="padding: 16px 20px;">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td>
                <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #7A8C5A; letter-spacing: 1px;">Order ID</div>
                <div style="font-size: 16px; font-family: monospace; font-weight: 700; color: #2E402B; margin-top: 2px;">${order.friendly_id}</div>
              </td>
              <td align="right">
                <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #7A8C5A; letter-spacing: 1px;">Estimated Dispatch</div>
                <div style="font-size: 13px; font-weight: 600; color: #1C2D1A; margin-top: 2px;">Within 24 Hours</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Items Section -->
    <div style="font-size: 12px; font-family: monospace; font-weight: 700; color: #7A8C5A; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
      Your Formulations Stack
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
      ${itemsHtml}
    </table>

    <!-- Pricing Breakdown -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F5; border-radius: 12px; padding: 14px 18px; margin-bottom: 28px; font-family: monospace; font-size: 12px;">
      <tr>
        <td style="color: rgba(28, 45, 26, 0.6); padding-bottom: 6px;">Subtotal</td>
        <td align="right" style="color: #1C2D1A; padding-bottom: 6px;">₹${subtotal.toLocaleString('en-IN')}</td>
      </tr>
      ${discount > 0 ? `
      <tr>
        <td style="color: #7A8C5A; font-weight: 600; padding-bottom: 6px;">Discount (${order.coupon_applied || 'PROMO'})</td>
        <td align="right" style="color: #7A8C5A; font-weight: 600; padding-bottom: 6px;">-₹${discount.toLocaleString('en-IN')}</td>
      </tr>
      ` : ''}
      <tr>
        <td style="color: rgba(28, 45, 26, 0.6); padding-bottom: 8px;">Express Shipping</td>
        <td align="right" style="color: #7A8C5A; font-weight: 700; text-transform: uppercase; padding-bottom: 8px;">FREE</td>
      </tr>
      <tr>
        <td style="border-top: 1px solid #DDD8CA; padding-top: 10px; font-size: 14px; font-weight: 700; color: #2E402B; font-family: Georgia, serif;">Total Paid (Online)</td>
        <td align="right" style="border-top: 1px solid #DDD8CA; padding-top: 10px; font-size: 16px; font-weight: 800; color: #2E402B; font-family: monospace;">₹${total.toLocaleString('en-IN')}</td>
      </tr>
    </table>

    <!-- Shipping Address -->
    <div style="background-color: #FFFFFF; border: 1px solid #EAE5D9; border-radius: 12px; padding: 16px; margin-bottom: 28px;">
      <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #7A8C5A; letter-spacing: 1px; margin-bottom: 6px;">
        Shipping Destination
      </div>
      <div style="font-size: 13px; font-weight: 700; color: #1C2D1A;">${order.customer_name} · ${order.customer_phone || ''}</div>
      <div style="font-size: 12px; color: rgba(28, 45, 26, 0.7); line-height: 18px; margin-top: 3px;">
        ${order.shipping_address || ''}
      </div>
    </div>

    <!-- Track Order CTA Button -->
    <div style="text-align: center; margin: 32px 0 10px;">
      <a href="${trackUrl}" style="display: inline-block; background-color: #2E402B; color: #F4F1EA; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 99px; box-shadow: 0 4px 14px rgba(46, 64, 43, 0.25);">
        Track Live Delivery →
      </a>
    </div>
  `

  return {
    subject: `Order Confirmed: ${order.friendly_id} — Kenwell Formulations`,
    html: emailWrapper({
      title: `Order Confirmed: ${order.friendly_id}`,
      preheader: `Thank you for your order! Your payment for ${order.friendly_id} is confirmed and is being packaged.`,
      content
    })
  }
}

/**
 * 2. Order Shipped Email Template
 */
export const getOrderShippedEmail = (order) => {
  const trackUrl = getTrackUrl(order)

  const content = `
    <!-- Top Status Badge -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 6px 16px; background-color: #F5EFE6; border: 1.5px solid #E2D4C3; border-radius: 99px;">
        <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #8C6D3B; text-transform: uppercase; letter-spacing: 1px;">
          📦 Order Shipped · In Transit
        </span>
      </div>
      <h1 style="font-size: 24px; font-weight: 700; color: #2E402B; margin: 16px 0 8px; font-family: Georgia, serif;">
        Your Formulations Are On The Way!
      </h1>
      <p style="font-size: 14px; color: rgba(28, 45, 26, 0.7); margin: 0; line-height: 22px;">
        Hi ${order.customer_name || 'there'}, your package for order <strong style="color: #2E402B; font-family: monospace;">${order.friendly_id}</strong> has departed our fulfillment facility.
      </p>
    </div>

    <!-- Progress Timeline Card -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F5; border: 1.5px solid #DDD8CA; border-radius: 14px; padding: 20px; margin-bottom: 28px;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="90%">
            <tr>
              <td align="center" width="33%">
                <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #7A8C5A; color: #FFFFFF; line-height: 28px; font-size: 12px; font-weight: 700;">✓</div>
                <div style="font-size: 10px; font-family: monospace; color: #2E402B; font-weight: 700; text-transform: uppercase; margin-top: 6px;">Paid</div>
              </td>
              <td align="center" width="33%">
                <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #2E402B; color: #FFFFFF; line-height: 28px; font-size: 12px; font-weight: 700;">2</div>
                <div style="font-size: 10px; font-family: monospace; color: #2E402B; font-weight: 700; text-transform: uppercase; margin-top: 6px;">Shipped</div>
              </td>
              <td align="center" width="33%">
                <div style="width: 28px; height: 28px; border-radius: 50%; background-color: #DDD8CA; color: rgba(28, 45, 26, 0.4); line-height: 28px; font-size: 12px; font-weight: 700;">3</div>
                <div style="font-size: 10px; font-family: monospace; color: rgba(28, 45, 26, 0.4); text-transform: uppercase; margin-top: 6px;">Delivered</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Destination details -->
    <div style="background-color: #FFFFFF; border: 1px solid #EAE5D9; border-radius: 12px; padding: 18px; margin-bottom: 28px;">
      <div style="font-size: 10px; font-family: monospace; text-transform: uppercase; color: #7A8C5A; letter-spacing: 1px; margin-bottom: 6px;">
        Delivering To
      </div>
      <div style="font-size: 13px; font-weight: 700; color: #1C2D1A;">${order.customer_name}</div>
      <div style="font-size: 12px; color: rgba(28, 45, 26, 0.7); line-height: 18px; margin-top: 2px;">
        ${order.shipping_address || ''}
      </div>
    </div>

    <!-- Live Tracking CTA -->
    <div style="text-align: center; margin: 32px 0 10px;">
      <a href="${trackUrl}" style="display: inline-block; background-color: #2E402B; color: #F4F1EA; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 99px; box-shadow: 0 4px 14px rgba(46, 64, 43, 0.25);">
        Track Live Delivery →
      </a>
      <div style="font-size: 11px; color: rgba(28, 45, 26, 0.4); margin-top: 10px; font-family: monospace;">
        Use Order ID: <strong>${order.friendly_id}</strong>
      </div>
    </div>
  `

  return {
    subject: `Your Order is Shipped: ${order.friendly_id} — Kenwell`,
    html: emailWrapper({
      title: `Your Order is Shipped: ${order.friendly_id}`,
      preheader: `Good news! Your Kenwell order ${order.friendly_id} has been dispatched and is on its way.`,
      content
    })
  }
}

/**
 * 3. Order Delivered Email Template
 */
export const getOrderDeliveredEmail = (order) => {
  const siteUrl = getSiteUrl()

  const content = `
    <!-- Top Status Badge -->
    <div style="text-align: center; margin-bottom: 24px;">
      <div style="display: inline-block; padding: 6px 16px; background-color: #E4ECE2; border: 1.5px solid #ADC7AA; border-radius: 99px;">
        <span style="font-family: monospace; font-size: 11px; font-weight: 700; color: #1C2D1A; text-transform: uppercase; letter-spacing: 1px;">
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

    <!-- Usage Guidelines Card -->
    <div style="background-color: #FAF8F5; border: 1.5px solid #DDD8CA; border-radius: 14px; padding: 20px; margin-bottom: 28px;">
      <div style="font-size: 11px; font-family: monospace; font-weight: 700; color: #2E402B; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">
        Recommended Routine & Storage
      </div>
      <ul style="margin: 0; padding-left: 18px; font-size: 13px; color: rgba(28, 45, 26, 0.75); line-height: 22px;">
        <li>Store in a cool, dry place away from direct sunlight.</li>
        <li>Follow recommended dosage on the formulation bottle.</li>
        <li>Scan the QR code on your product box for batch lab certificates.</li>
      </ul>
    </div>

    <!-- Support CTA -->
    <div style="text-align: center; margin: 28px 0 10px;">
      <a href="${siteUrl}/#verify" style="display: inline-block; background-color: #2E402B; color: #F4F1EA; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; text-decoration: none; padding: 14px 32px; border-radius: 99px; box-shadow: 0 4px 14px rgba(46, 64, 43, 0.25);">
        Verify Batch & Authenticity →
      </a>
    </div>
  `

  return {
    subject: `Delivered: Your Kenwell Order ${order.friendly_id}`,
    html: emailWrapper({
      title: `Order Delivered: ${order.friendly_id}`,
      preheader: `Your Kenwell formulations have arrived! Here are your dosage and storage guidelines.`,
      content
    })
  }
}

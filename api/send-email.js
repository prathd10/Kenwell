// Vercel Serverless Function: api/send-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured on server' })
  }

  const { from, to, subject, html } = req.body

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required email fields (to, subject, html)' })
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: from || process.env.VITE_RESEND_FROM_EMAIL || 'Kenwell <onboarding@resend.dev>',
        to,
        subject,
        html
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

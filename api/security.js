// Basic in-memory rate limiter for serverless environments.
// Note: This operates per serverless instance.
const ipCache = new Map()

export function checkRateLimit(req, res, limit = 10, windowMs = 60000) {
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1'
  const now = Date.now()
  
  if (!ipCache.has(ip)) {
    ipCache.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  const record = ipCache.get(ip)
  if (now > record.resetTime) {
    record.count = 1
    record.resetTime = now + windowMs
    return true
  }

  if (record.count >= limit) {
    res.status(429).json({ error: 'Too many requests. Please try again later.' })
    return false
  }

  record.count++
  return true
}

export function applyCors(req, res) {
  // Set explicit allowed origins
  const origin = req.headers.origin
  
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173',
    'https://kenwell.in',
    'https://www.kenwell.in',
    'https://kenwell-five.vercel.app'
  ]

  if (origin && (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app'))) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return false // Stop further execution for OPTIONS
  }
  
  return true
}

import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'
import { checkRateLimit, applyCors } from './security.js'

export default async function handler(req, res) {
  if (!applyCors(req, res)) return;
  if (!checkRateLimit(req, res, 30, 60000)) return; // 30 requests per minute

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || process.env.VITE_IMAGEKIT_PRIVATE_KEY;
  
  if (!privateKey) {
    return res.status(500).json({ error: 'IMAGEKIT_PRIVATE_KEY is not configured on the server.' });
  }

  // Authorize request via Supabase Auth
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
      return res.status(403).json({ error: 'Unauthorized to upload images.' })
    }
  } else {
    // If we can't verify because env is missing, we fail secure
    return res.status(500).json({ error: 'Server configuration error.' })
  }

  try {
    const imagekitToken = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 60 * 30; // Expires in 30 minutes
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(imagekitToken + expire.toString())
      .digest('hex');

    res.status(200).json({ token: imagekitToken, expire, signature });
  } catch (err) {
    console.error('ImageKit Auth Error:', err);
    res.status(500).json({ error: 'Failed to generate authentication parameters.' });
  }
}

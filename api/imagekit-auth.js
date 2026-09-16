import crypto from 'crypto'

export default function handler(req, res) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY || process.env.VITE_IMAGEKIT_PRIVATE_KEY;
  
  if (!privateKey) {
    return res.status(500).json({ error: 'IMAGEKIT_PRIVATE_KEY is not configured on the server.' });
  }

  try {
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 60 * 30; // Expires in 30 minutes
    const signature = crypto
      .createHmac('sha1', privateKey)
      .update(token + expire.toString())
      .digest('hex');

    res.status(200).json({ token, expire, signature });
  } catch (err) {
    console.error('ImageKit Auth Error:', err);
    res.status(500).json({ error: 'Failed to generate authentication parameters.' });
  }
}

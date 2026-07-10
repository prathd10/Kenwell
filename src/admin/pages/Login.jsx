import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin/dashboard')
    })
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else navigate('/admin/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Left decorative panel — hidden on small screens */}
      <div
        className="hidden md:flex"
        style={{
          width: '42%',
          background: 'linear-gradient(155deg, #1C2D1A 0%, #253C22 50%, #1a2a18 100%)',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '3rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative rings */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', border: '1px solid rgba(122,140,90,0.15)' }} />
        <div style={{ position: 'absolute', top: -40, right: -40, width: 220, height: 220, borderRadius: '50%', border: '1px solid rgba(184,159,112,0.1)' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -100, width: 380, height: 380, borderRadius: '50%', border: '1px solid rgba(122,140,90,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', border: '1px solid rgba(184,159,112,0.07)' }} />

        {/* Logo */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '3rem' }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'rgba(122,140,90,0.2)', border: '1px solid rgba(122,140,90,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src="/kenwell-mark-light.png" alt="" style={{ width: 20, height: 'auto' }} />
            </div>
            <div>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#F4F1EA', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.14em' }}>KENWELL</div>
              <div style={{ fontSize: '0.5rem', color: '#7A8C5A', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 2 }}>Wellness &amp; Nutrition</div>
            </div>
          </div>

          {/* Tagline */}
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', color: '#F4F1EA', fontSize: '2.25rem', fontWeight: 500, lineHeight: 1.25, maxWidth: 280 }}>
            Manage your<br />
            <span style={{ color: '#B89F70' }}>wellness</span> store<br />
            with ease.
          </h2>
          <p style={{ color: 'rgba(244,241,234,0.45)', fontSize: '0.875rem', marginTop: '1rem', maxWidth: 260, lineHeight: 1.6 }}>
            Add products, manage categories, and track your catalogue — all in one place.
          </p>
        </div>

        {/* Botanical SVG decoration */}
        <div style={{ opacity: 0.12 }}>
          <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
            <circle cx="90" cy="90" r="60" stroke="#F4F1EA" strokeWidth="0.5" />
            <circle cx="90" cy="90" r="40" stroke="#F4F1EA" strokeWidth="0.5" />
            <circle cx="90" cy="90" r="20" stroke="#F4F1EA" strokeWidth="0.5" />
            <line x1="90" y1="30" x2="90" y2="150" stroke="#F4F1EA" strokeWidth="0.5" />
            <line x1="30" y1="90" x2="150" y2="90" stroke="#F4F1EA" strokeWidth="0.5" />
            <line x1="47" y1="47" x2="133" y2="133" stroke="#F4F1EA" strokeWidth="0.5" />
            <line x1="133" y1="47" x2="47" y2="133" stroke="#F4F1EA" strokeWidth="0.5" />
          </svg>
        </div>
      </div>

      {/* Right form panel */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F4F1EA',
          padding: '2rem 1.5rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: 380 }}>
          {/* Mobile logo */}
          <div className="md:hidden" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img src="/kenwell-mark.png" alt="" style={{ height: 36, width: 'auto', margin: '0 auto 8px' }} />
            <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#1C2D1A', fontSize: '2rem', fontWeight: 700, letterSpacing: '0.12em' }}>KENWELL</div>
            <div style={{ color: '#7A8C5A', fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 4 }}>Wellness &amp; Nutrition</div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#1C2D1A', fontWeight: 600, marginBottom: 6 }}>
              Welcome back
            </h1>
            <p style={{ color: '#7A8C5A', fontSize: '0.875rem' }}>Sign in to your admin panel</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#1C2D1A', marginBottom: 6, fontWeight: 600, letterSpacing: '0.03em' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@kenwell.in"
                required
                style={{
                  width: '100%', padding: '0.8rem 1rem',
                  border: '1.5px solid #DDD8CA', borderRadius: 9,
                  fontSize: '0.9rem', color: '#1C2D1A', background: 'white',
                  outline: 'none', boxSizing: 'border-box',
                  fontFamily: '"DM Sans", sans-serif', transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onFocus={e => { e.target.style.borderColor = '#2E402B'; e.target.style.boxShadow = '0 0 0 3px rgba(46,64,43,0.08)' }}
                onBlur={e => { e.target.style.borderColor = '#DDD8CA'; e.target.style.boxShadow = 'none' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', color: '#1C2D1A', marginBottom: 6, fontWeight: 600, letterSpacing: '0.03em' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '0.8rem 2.75rem 0.8rem 1rem',
                    border: '1.5px solid #DDD8CA', borderRadius: 9,
                    fontSize: '0.9rem', color: '#1C2D1A', background: 'white',
                    outline: 'none', boxSizing: 'border-box',
                    fontFamily: '"DM Sans", sans-serif', transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#2E402B'; e.target.style.boxShadow = '0 0 0 3px rgba(46,64,43,0.08)' }}
                  onBlur={e => { e.target.style.borderColor = '#DDD8CA'; e.target.style.boxShadow = 'none' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#C9B99A', padding: 0, display: 'flex' }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 9, padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.9rem', marginTop: 4,
                background: loading ? '#7A8C5A' : '#2E402B',
                color: 'white', border: 'none', borderRadius: 9,
                fontSize: '0.9375rem', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                letterSpacing: '0.03em', transition: 'background 0.2s',
                fontFamily: '"DM Sans", sans-serif',
              }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#253C22' }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2E402B' }}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #DDD8CA', display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7A8C5A' }} />
            <p style={{ fontSize: '0.78rem', color: '#C9B99A' }}>Kenwell Admin · Secure Access</p>
          </div>
        </div>
      </div>
    </div>
  )
}

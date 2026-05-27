import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { LayoutDashboard, Tag, Package, LogOut, Menu, X } from 'lucide-react'

const NAV = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/categories', icon: Tag, label: 'Categories' },
  { to: '/admin/products', icon: Package, label: 'Products' },
]

function Sidebar({ onClose }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data?.user?.email ?? ''))
  }, [])

  const initials = email ? email.slice(0, 2).toUpperCase() : 'KW'

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div
      style={{
        width: 240,
        minHeight: '100vh',
        background: 'linear-gradient(170deg, #1C2D1A 0%, #253C22 60%, #1a2a18 100%)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '"DM Sans", sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative circles */}
      <div style={{ position: 'absolute', bottom: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(122,140,90,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 40, right: -80, width: 160, height: 160, borderRadius: '50%', background: 'rgba(184,159,112,0.05)', pointerEvents: 'none' }} />

      {/* Brand */}
      <div style={{ padding: '1.75rem 1.5rem 1.5rem', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(122,140,90,0.25)', border: '1px solid rgba(122,140,90,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
              <path d="M7 1C4 5 4 13 7 17C10 13 10 5 7 1Z" fill="#7A8C5A" />
              <path d="M7 9C4 7 1 8 1 11C4 12 6 11 7 9Z" fill="#B89F70" opacity="0.8"/>
              <path d="M7 9C10 7 13 8 13 11C10 12 8 11 7 9Z" fill="#7A8C5A" opacity="0.6"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: '"Cormorant Garamond", serif', color: '#F4F1EA', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.12em', lineHeight: 1 }}>
              KENWELL
            </div>
            <div style={{ color: '#7A8C5A', fontSize: '0.5rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 2 }}>
              Admin Panel
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(184,159,112,0.3) 0%, transparent 100%)', marginTop: '1.25rem' }} />
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0.5rem 0.75rem' }}>
        <div style={{ fontSize: '0.55rem', color: 'rgba(244,241,234,0.25)', letterSpacing: '0.25em', textTransform: 'uppercase', padding: '0.5rem 0.75rem', marginBottom: 4 }}>
          Navigation
        </div>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            style={{ textDecoration: 'none', display: 'block' }}
          >
            {({ isActive }) => (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 11,
                  padding: '0.7rem 0.875rem',
                  borderRadius: 9,
                  marginBottom: 3,
                  color: isActive ? '#F4F1EA' : 'rgba(244,241,234,0.45)',
                  background: isActive ? 'rgba(122,140,90,0.2)' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s',
                  borderLeft: isActive ? '3px solid #B89F70' : '3px solid transparent',
                  cursor: 'pointer',
                }}
              >
                <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ padding: '1rem 0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {email && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.6rem 0.875rem', marginBottom: 4 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(184,159,112,0.25)', border: '1px solid rgba(184,159,112,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '0.65rem', color: '#B89F70', fontWeight: 700 }}>{initials}</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', color: 'rgba(244,241,234,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</div>
              <div style={{ fontSize: '0.6rem', color: '#7A8C5A', marginTop: 1 }}>Administrator</div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '0.65rem 0.875rem', width: '100%', borderRadius: 9,
            color: 'rgba(244,241,234,0.35)', background: 'transparent',
            border: 'none', cursor: 'pointer', fontSize: '0.85rem',
            fontFamily: '"DM Sans", sans-serif', transition: 'all 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#F4F1EA'; e.currentTarget.style.background = 'rgba(220,38,38,0.1)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(244,241,234,0.35)'; e.currentTarget.style.background = 'transparent' }}
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#EFECE4', fontFamily: '"DM Sans", sans-serif' }}>
      {/* Desktop sidebar */}
      <div className="hidden md:block" style={{ flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <Sidebar onClose={() => {}} />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40, backdropFilter: 'blur(2px)' }} />
      )}

      {/* Mobile sidebar */}
      <div className="md:hidden" style={{ position: 'fixed', top: 0, left: open ? 0 : -240, zIndex: 50, transition: 'left 0.25s ease', height: '100%' }}>
        <Sidebar onClose={() => setOpen(false)} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Mobile topbar */}
        <div className="md:hidden" style={{ background: '#1C2D1A', padding: '0.875rem 1.25rem', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
          <button onClick={() => setOpen(!open)} style={{ color: '#F4F1EA', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span style={{ fontFamily: '"Cormorant Garamond", serif', color: '#F4F1EA', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.12em' }}>KENWELL</span>
        </div>

        <main style={{ flex: 1, padding: '2.25rem 2rem', maxWidth: 1200, width: '100%' }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

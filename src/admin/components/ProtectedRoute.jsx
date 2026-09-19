import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F1EA' }}>
        <div style={{ width: 32, height: 32, border: '2.5px solid #2E402B', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Admin UI Protection: Whitelist specific email or domain
  if (session) {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'admin@kenwell.in'
    if (session.user.email !== adminEmail) {
      console.warn(`Unauthorized access attempt by ${session.user.email}. Logging out.`)
      supabase.auth.signOut().then(() => {
        window.location.href = '/admin/login'
      })
      return null
    }
    return children
  }

  return <Navigate to="/admin/login" replace />
}

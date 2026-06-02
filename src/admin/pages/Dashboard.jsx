import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Package, Tag, CheckCircle, TrendingUp, ArrowRight, ArrowUpRight, Eye, MousePointerClick } from 'lucide-react'

const CARD_ACCENTS = ['#2E402B', '#7A8C5A', '#4A8B8C', '#B89F70']

function StatCard({ icon: Icon, label, value, sub, color, index }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minWidth: 160,
        boxShadow: hovered
          ? '0 8px 32px rgba(28,45,26,0.12)'
          : '0 2px 12px rgba(28,45,26,0.06)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s ease',
        cursor: 'default',
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: 3, background: color }} />
      <div style={{ padding: '1.25rem 1.375rem 1.375rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 10,
              background: color + '15',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon size={18} color={color} strokeWidth={2} />
          </div>
          <ArrowUpRight size={14} color="rgba(28,45,26,0.2)" />
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.25rem', fontWeight: 600, color: '#1C2D1A', lineHeight: 1, marginBottom: 6 }}>
          {value ?? <span style={{ opacity: 0.3, fontSize: '1.5rem' }}>—</span>}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#7A8C5A', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {label}
        </div>
        {sub && <div style={{ fontSize: '0.72rem', color: '#C9B99A', marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  )
}

function MiniBar({ label, value, max, color, index }) {
  const pct = max > 0 ? Math.max((value / max) * 100, value > 0 ? 4 : 0) : 0
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
          <span style={{ fontSize: '0.85rem', color: '#1C2D1A', fontWeight: 500 }}>{label}</span>
        </div>
        <span style={{
          fontSize: '0.75rem', fontWeight: 700, color: 'white',
          background: color, padding: '2px 8px', borderRadius: 20,
          minWidth: 24, textAlign: 'center',
        }}>
          {value}
        </span>
      </div>
      <div style={{ height: 6, background: '#EAE5D9', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 6, transition: 'width 0.8s cubic-bezier(.4,0,.2,1)' }} />
      </div>
    </div>
  )
}

const BAR_COLORS = ['#2E402B', '#7A8C5A', '#B89F70', '#4A8B8C', '#C9B99A', '#1C2D1A']

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ products: null, categories: null, active: null, views: 0, clicks: 0 })
  const [recent, setRecent] = useState([])
  const [categoryDist, setCategoryDist] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: products },
        { count: categories },
        { count: active },
        { data: recentProds },
        { data: cats },
        { count: views },
        { count: clicks },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('products').select('id, name, price, is_active, created_at, categories(name)').order('created_at', { ascending: false }).limit(6),
        supabase.from('categories').select('id, name, products(count)'),
        supabase.from('analytics').select('*', { count: 'exact', head: true }).eq('event_type', 'page_view'),
        supabase.from('analytics').select('*', { count: 'exact', head: true }).eq('event_type', 'click'),
      ])
      setStats({ products, categories, active, views: views || 0, clicks: clicks || 0 })
      setRecent(recentProds || [])
      const dist = (cats || [])
        .map(c => ({ name: c.name, count: c.products?.[0]?.count ?? 0 }))
        .sort((a, b) => b.count - a.count)
      setCategoryDist(dist)
      setLoading(false)
    }
    load()
  }, [])

  const maxCount = Math.max(...categoryDist.map(c => c.count), 1)
  const inactive = (stats.products != null && stats.active != null) ? stats.products - stats.active : null

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ width: 3, height: 20, background: '#B89F70', borderRadius: 2 }} />
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#1C2D1A', fontWeight: 600 }}>
            Dashboard
          </h1>
        </div>
        <p style={{ color: '#7A8C5A', fontSize: '0.875rem', paddingLeft: 13 }}>
          Overview of your Kenwell store
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <StatCard icon={Eye} label="Total Views" value={stats.views} sub="+12% from last month" color={CARD_ACCENTS[0]} index={0} />
        <StatCard icon={MousePointerClick} label="Clicks" value={stats.clicks} sub="+5% from last month" color={CARD_ACCENTS[1]} index={1} />
        <StatCard icon={Package} label="Products" value={stats.active || 66} sub="Active in catalog" color={CARD_ACCENTS[2]} index={2} />
        <StatCard 
          icon={TrendingUp} 
          label="Top Item" 
          value={
            <span style={{ fontSize: '1.25rem', fontFamily: '"DM Sans", sans-serif', fontWeight: 500, lineHeight: 1.2, display: 'block' }}>
              {recent.length > 0 ? recent[0].name : "Blush Stone Silver Ring"}
            </span>
          } 
          sub="Most engaged" 
          color={CARD_ACCENTS[3]} 
          index={3} 
        />
      </div>

      {/* Bottom panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="dash-grid">
        {/* Distribution chart */}
        <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(28,45,26,0.06)' }}>
          <div style={{ padding: '1.375rem 1.5rem', borderBottom: '1px solid #F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: '#1C2D1A', fontWeight: 600, marginBottom: 2 }}>
                Product Distribution
              </h2>
              <p style={{ fontSize: '0.72rem', color: '#C9B99A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>By Category</p>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={15} color="#7A8C5A" />
            </div>
          </div>

          <div style={{ padding: '1.375rem 1.5rem' }}>
            {loading ? (
              <LoadingDots />
            ) : categoryDist.length === 0 ? (
              <EmptyState label="No categories yet." action={() => navigate('/admin/categories')} actionLabel="Create one" />
            ) : (
              categoryDist.map((c, i) => (
                <MiniBar key={c.name} label={c.name} value={c.count} max={maxCount} color={BAR_COLORS[i % BAR_COLORS.length]} index={i} />
              ))
            )}
          </div>
        </div>

        {/* Recent Products */}
        <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(28,45,26,0.06)' }}>
          <div style={{ padding: '1.375rem 1.5rem', borderBottom: '1px solid #F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: '#1C2D1A', fontWeight: 600, marginBottom: 2 }}>
                Recent Products
              </h2>
              <p style={{ fontSize: '0.72rem', color: '#C9B99A', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Latest additions</p>
            </div>
            <button
              onClick={() => navigate('/admin/products')}
              style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#7A8C5A', background: '#F4F1EA', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, padding: '6px 10px', borderRadius: 7 }}
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          <div style={{ padding: '0.75rem 1.5rem' }}>
            {loading ? (
              <LoadingDots />
            ) : recent.length === 0 ? (
              <EmptyState label="No products yet." action={() => navigate('/admin/products/new')} actionLabel="Add product" />
            ) : (
              recent.map((p, i) => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.75rem 0',
                    borderBottom: i < recent.length - 1 ? '1px solid #F4F1EA' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: p.is_active ? '#2E402B' : '#C9B99A', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.875rem', color: '#1C2D1A', fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#7A8C5A', marginTop: 1 }}>{p.categories?.name ?? 'Uncategorised'}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1rem', color: '#1C2D1A', fontWeight: 600 }}>
                      ₹{Number(p.price).toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) { .dash-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '1rem 0', alignItems: 'center' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#DDD8CA', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
    </div>
  )
}

function EmptyState({ label, action, actionLabel }) {
  return (
    <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
      <p style={{ color: '#C9B99A', fontSize: '0.85rem', marginBottom: 8 }}>{label}</p>
      {action && (
        <button onClick={action} style={{ color: '#7A8C5A', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontFamily: '"DM Sans", sans-serif', textDecoration: 'underline' }}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}

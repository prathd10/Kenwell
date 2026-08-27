import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  TrendingUp, Users, Eye, Repeat2, Globe, Smartphone, Monitor, Tablet,
  ArrowUpRight, RefreshCw, MousePointerClick, ChevronRight
} from 'lucide-react'

// ─── Palette ─────────────────────────────────────────────────────────────────
const C = {
  forest: '#1C2D1A',
  sage: '#7A8C5A',
  gold: '#B89F70',
  cream: '#F4F1EA',
  bg: '#EFECE4',
  muted: '#C9B99A',
  dark: '#2E402B',
  teal: '#4A8B8C',
}

// Source colours + labels
const SOURCE_META = {
  direct:    { label: 'Direct',    color: C.forest },
  seo:       { label: 'SEO',       color: C.teal },
  meta:      { label: 'Meta Ads',  color: '#1877F2' },
  instagram: { label: 'Instagram', color: '#E1306C' },
  social:    { label: 'Social',    color: '#7A8C5A' },
  email:     { label: 'Email',     color: C.gold },
  other:     { label: 'Other',     color: C.muted },
}

const DEVICE_META = {
  desktop: { label: 'Desktop', icon: Monitor,    color: C.forest },
  mobile:  { label: 'Mobile',  icon: Smartphone, color: C.teal },
  tablet:  { label: 'Tablet',  icon: Tablet,     color: C.gold },
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionTitle({ title, sub }) {
  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: C.forest, fontWeight: 600, marginBottom: 2 }}>
        {title}
      </h2>
      {sub && <p style={{ fontSize: '0.72rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{sub}</p>}
    </div>
  )
}

function Card({ children, style = {} }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: 14,
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(28,45,26,0.06)',
      padding: '1.5rem',
      ...style,
    }}>
      {children}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, sub, color, loading }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: hovered ? '0 8px 32px rgba(28,45,26,0.12)' : '0 2px 12px rgba(28,45,26,0.06)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ height: 3, background: color }} />
      <div style={{ padding: '1.25rem 1.375rem 1.375rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} color={color} strokeWidth={2} />
          </div>
          <ArrowUpRight size={14} color="rgba(28,45,26,0.2)" />
        </div>
        <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2.25rem', fontWeight: 600, color: C.forest, lineHeight: 1, marginBottom: 6 }}>
          {loading ? <span style={{ opacity: 0.2, fontSize: '1.5rem' }}>—</span> : (value ?? <span style={{ opacity: 0.3, fontSize: '1.5rem' }}>0</span>)}
        </div>
        <div style={{ fontSize: '0.72rem', color: C.sage, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.72rem', color: C.muted, marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  )
}

/** Horizontal bar chart for source breakdown */
function SourceBar({ source, count, total, color, label }) {
  const pct = total > 0 ? Math.max((count / total) * 100, count > 0 ? 2 : 0) : 0
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
          <span style={{ fontSize: '0.875rem', color: C.forest, fontWeight: 500 }}>{label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: '0.75rem', color: C.muted }}>{count.toLocaleString()}</span>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'white', background: color, padding: '2px 8px', borderRadius: 20, minWidth: 40, textAlign: 'center' }}>
            {pct.toFixed(1)}%
          </span>
        </div>
      </div>
      <div style={{ height: 7, background: C.bg, borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 6, transition: 'width 1s cubic-bezier(.4,0,.2,1)' }} />
      </div>
    </div>
  )
}

/** 30-day sparkline using inline SVG */
function Sparkline({ data, color = C.sage, height = 56 }) {
  if (!data || data.length === 0) return null
  const max = Math.max(...data.map(d => d.value), 1)
  const w = 600; const h = height
  const step = w / Math.max(data.length - 1, 1)
  const pts = data.map((d, i) => {
    const x = i * step
    const y = h - (d.value / max) * h * 0.85 - h * 0.05
    return `${x},${y}`
  }).join(' ')
  const fillPts = `0,${h} ${pts} ${w},${h}`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height, display: 'block' }}>
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill="url(#spark-fill)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

/** Donut-style device chart (pure CSS + SVG) */
function DonutChart({ slices }) {
  const total = slices.reduce((s, sl) => s + sl.value, 0)
  if (total === 0) return <div style={{ textAlign: 'center', color: C.muted, fontSize: '0.85rem', padding: '2rem 0' }}>No data yet</div>

  const r = 70; const cx = 80; const cy = 80
  let cumAngle = -Math.PI / 2
  const paths = slices.map(sl => {
    const angle = (sl.value / total) * 2 * Math.PI
    const x1 = cx + r * Math.cos(cumAngle)
    const y1 = cy + r * Math.sin(cumAngle)
    cumAngle += angle
    const x2 = cx + r * Math.cos(cumAngle)
    const y2 = cy + r * Math.sin(cumAngle)
    const largeArc = angle > Math.PI ? 1 : 0
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
    return { d, color: sl.color }
  })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap' }}>
      <svg viewBox="0 0 160 160" style={{ width: 130, height: 130, flexShrink: 0 }}>
        {paths.map((p, i) => <path key={i} d={p.d} fill={p.color} />)}
        <circle cx={cx} cy={cy} r={r * 0.55} fill="white" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="14" fontWeight="700" fill={C.forest} fontFamily='"Cormorant Garamond", serif'>
          {total.toLocaleString()}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="7" fill={C.muted} fontFamily='"DM Sans", sans-serif' letterSpacing="1">
          SESSIONS
        </text>
      </svg>
      <div style={{ flex: 1 }}>
        {slices.map(sl => (
          <div key={sl.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: sl.color }} />
              <span style={{ fontSize: '0.85rem', color: C.forest }}>{sl.label}</span>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: C.muted }}>
              {total > 0 ? ((sl.value / total) * 100).toFixed(1) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Analytics() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [range, setRange] = useState(30) // days

  // Aggregated state
  const [overview, setOverview] = useState({ totalViews: 0, uniqueVisitors: 0, returningVisitors: 0, totalClicks: 0 })
  const [sourceCounts, setSourceCounts] = useState({})
  const [deviceCounts, setDeviceCounts] = useState({})
  const [topPages, setTopPages] = useState([])
  const [trendData, setTrendData] = useState([])
  const [recentSessions, setRecentSessions] = useState([])

  const load = useCallback(async () => {
    setRefreshing(true)
    const since = new Date(Date.now() - range * 24 * 60 * 60 * 1000).toISOString()

    const [
      { data: pageViews },
      { data: clicks },
    ] = await Promise.all([
      supabase.from('analytics')
        .select('session_id, source, device, country, city, path, created_at, is_new_visitor')
        .eq('event_type', 'page_view')
        .gte('created_at', since)
        .order('created_at', { ascending: false }),
      supabase.from('analytics')
        .select('id', { count: 'exact', head: true })
        .eq('event_type', 'click')
        .gte('created_at', since),
    ])

    const views = pageViews || []

    // Overview
    const sessions = new Set(views.map(v => v.session_id).filter(Boolean))
    const newSessions = new Set(views.filter(v => v.is_new_visitor).map(v => v.session_id).filter(Boolean))
    const returning = sessions.size - newSessions.size

    setOverview({
      totalViews: views.length,
      uniqueVisitors: sessions.size,
      returningVisitors: Math.max(returning, 0),
      totalClicks: clicks || 0,
    })

    // Source counts (by session — one per session to avoid inflating)
    const sessionSource = {}
    views.forEach(v => {
      if (v.session_id && !sessionSource[v.session_id]) {
        sessionSource[v.session_id] = v.source || 'direct'
      }
    })
    const srcs = {}
    Object.values(sessionSource).forEach(s => { srcs[s] = (srcs[s] || 0) + 1 })
    setSourceCounts(srcs)

    // Device counts (by session)
    const sessionDevice = {}
    views.forEach(v => {
      if (v.session_id && !sessionDevice[v.session_id]) {
        sessionDevice[v.session_id] = v.device || 'desktop'
      }
    })
    const devs = {}
    Object.values(sessionDevice).forEach(d => { devs[d] = (devs[d] || 0) + 1 })
    setDeviceCounts(devs)

    // Top pages
    const pageCounts = {}
    views.forEach(v => { if (v.path) pageCounts[v.path] = (pageCounts[v.path] || 0) + 1 })
    const sortedPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, count]) => ({ path, count }))
    setTopPages(sortedPages)

    // 30-day trend — group by date
    const byDate = {}
    const now = new Date()
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      byDate[key] = 0
    }
    views.forEach(v => {
      const key = v.created_at.slice(0, 10)
      if (key in byDate) byDate[key]++
    })
    const trend = Object.entries(byDate).map(([date, value]) => ({
      date,
      label: new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      value,
    }))
    setTrendData(trend)

    // Recent sessions — last 50 unique sessions
    const seen = new Set()
    const sessions50 = []
    for (const v of views) {
      if (!v.session_id || seen.has(v.session_id)) continue
      seen.add(v.session_id)
      sessions50.push(v)
      if (sessions50.length >= 50) break
    }
    setRecentSessions(sessions50)

    setLoading(false)
    setRefreshing(false)
  }, [range])

  useEffect(() => { load() }, [load])

  const totalSources = Object.values(sourceCounts).reduce((s, n) => s + n, 0)
  const totalDevices = Object.values(deviceCounts).reduce((s, n) => s + n, 0)

  const deviceSlices = Object.entries(DEVICE_META).map(([key, meta]) => ({
    label: meta.label,
    color: meta.color,
    value: deviceCounts[key] || 0,
  })).filter(s => s.value > 0)

  const peakDay = trendData.reduce((best, d) => d.value > (best?.value || 0) ? d : best, null)

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 3, height: 20, background: C.gold, borderRadius: 2 }} />
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: C.forest, fontWeight: 600 }}>
              Analytics
            </h1>
          </div>
          <p style={{ color: C.sage, fontSize: '0.875rem', paddingLeft: 13 }}>
            Real visitor data — sources, devices, and pages
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Range selector */}
          {[7, 30, 90].map(d => (
            <button
              key={d}
              onClick={() => setRange(d)}
              style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: '0.8rem', fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
                background: range === d ? C.forest : C.cream,
                color: range === d ? '#F4F1EA' : C.sage,
                transition: 'all 0.15s',
              }}
            >
              {d}d
            </button>
          ))}

          {/* Refresh */}
          <button
            onClick={load}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8, border: `1px solid ${C.cream}`,
              background: 'white', cursor: refreshing ? 'default' : 'pointer',
              fontSize: '0.8rem', fontFamily: '"DM Sans", sans-serif', fontWeight: 600,
              color: C.sage, opacity: refreshing ? 0.5 : 1,
            }}
          >
            <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Overview stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={Eye}           label="Page Views"        value={overview.totalViews.toLocaleString()}        sub={`Last ${range} days`}  color={C.forest}  loading={loading} />
        <StatCard icon={Users}         label="Unique Visitors"   value={overview.uniqueVisitors.toLocaleString()}    sub="Distinct sessions"    color={C.teal}    loading={loading} />
        <StatCard icon={Repeat2}       label="Returning"         value={overview.returningVisitors.toLocaleString()} sub="Recognised sessions"  color={C.gold}    loading={loading} />
        <StatCard icon={MousePointerClick} label="Clicks"        value={overview.totalClicks.toLocaleString()}       sub="Buttons & links"      color={C.sage}    loading={loading} />
      </div>

      {/* Trend + Sources */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Trend chart */}
        <Card>
          <SectionTitle title="Daily Traffic" sub={`Last ${range} days`} />
          {loading ? <LoadingDots /> : trendData.length === 0 ? (
            <p style={{ color: C.muted, fontSize: '0.85rem' }}>No data yet</p>
          ) : (
            <div>
              <div style={{ marginBottom: 8 }}>
                <Sparkline data={trendData} color={C.sage} height={80} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: C.muted }}>
                <span>{trendData[0]?.label}</span>
                {peakDay && (
                  <span style={{ color: C.sage, fontWeight: 600 }}>
                    Peak: {peakDay.label} ({peakDay.value} views)
                  </span>
                )}
                <span>{trendData[trendData.length - 1]?.label}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Traffic Sources */}
        <Card>
          <SectionTitle title="Traffic Sources" sub="By unique session" />
          {loading ? <LoadingDots /> : totalSources === 0 ? (
            <p style={{ color: C.muted, fontSize: '0.85rem' }}>
              No data yet — UTM params will appear here once visitors arrive.
            </p>
          ) : (
            <div>
              {Object.entries(SOURCE_META)
                .map(([key, meta]) => ({ key, ...meta, count: sourceCounts[key] || 0 }))
                .filter(s => s.count > 0)
                .sort((a, b) => b.count - a.count)
                .map(s => (
                  <SourceBar key={s.key} source={s.key} count={s.count} total={totalSources} color={s.color} label={s.label} />
                ))}
            </div>
          )}
        </Card>
      </div>

      {/* Device + Top Pages */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Device breakdown */}
        <Card>
          <SectionTitle title="Device Breakdown" sub="By unique session" />
          {loading ? <LoadingDots /> : <DonutChart slices={deviceSlices.length ? deviceSlices : [{ label: 'Desktop', color: C.forest, value: 0 }]} />}
        </Card>

        {/* Top pages */}
        <Card>
          <SectionTitle title="Top Pages" sub="By view count" />
          {loading ? <LoadingDots /> : topPages.length === 0 ? (
            <p style={{ color: C.muted, fontSize: '0.85rem' }}>No page views recorded yet.</p>
          ) : (
            <div>
              {topPages.map((pg, i) => (
                <div
                  key={pg.path}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.6rem 0',
                    borderBottom: i < topPages.length - 1 ? `1px solid ${C.bg}` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6,
                      background: i === 0 ? C.gold + '25' : C.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', fontWeight: 700, color: i === 0 ? C.gold : C.muted,
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </div>
                    <span style={{ fontSize: '0.875rem', color: C.forest, fontWeight: 500 }}>
                      {pg.path}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '0.78rem', fontWeight: 700, color: 'white',
                    background: i === 0 ? C.gold : C.sage,
                    padding: '2px 10px', borderRadius: 20,
                  }}>
                    {pg.count.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Recent Sessions Table */}
      <Card style={{ padding: 0 }}>
        <div style={{ padding: '1.375rem 1.5rem', borderBottom: `1px solid ${C.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.2rem', color: C.forest, fontWeight: 600, marginBottom: 2 }}>Recent Sessions</h2>
            <p style={{ fontSize: '0.72rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Last 50 unique visitors</p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: '"DM Sans", sans-serif', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.bg}` }}>
                {['Time', 'Page', 'Source', 'Device', 'Location', 'Visitor'].map(h => (
                  <th key={h} style={{ padding: '0.75rem 1.25rem', textAlign: 'left', color: C.muted, fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center' }}><LoadingDots /></td></tr>
              ) : recentSessions.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: C.muted }}>No sessions recorded yet in this period.</td></tr>
              ) : recentSessions.map((s, i) => {
                const src = SOURCE_META[s.source] || SOURCE_META.other
                const dev = DEVICE_META[s.device] || DEVICE_META.desktop
                const DevIcon = dev.icon
                return (
                  <tr
                    key={`${s.session_id}-${i}`}
                    style={{ borderBottom: `1px solid ${C.bg}`, transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = C.cream + '60'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '0.75rem 1.25rem', color: C.muted, whiteSpace: 'nowrap' }}>
                      {new Date(s.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem', color: C.forest, fontWeight: 500, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.path || '—'}
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <span style={{ background: src.color + '18', color: src.color, padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>
                        {src.label}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: dev.color }}>
                        <DevIcon size={13} />
                        <span style={{ fontSize: '0.78rem', fontWeight: 500 }}>{dev.label}</span>
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem', color: C.muted }}>
                      {s.city && s.country ? `${s.city}, ${s.country}` : s.country || '—'}
                    </td>
                    <td style={{ padding: '0.75rem 1.25rem' }}>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 600,
                        background: s.is_new_visitor ? C.teal + '18' : C.gold + '18',
                        color: s.is_new_visitor ? C.teal : C.gold,
                        padding: '2px 8px', borderRadius: 20,
                      }}>
                        {s.is_new_visitor ? 'New' : 'Returning'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
        @media (max-width: 768px) {
          .analytics-two-col { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}

function LoadingDots() {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '1rem 0', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#DDD8CA', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { insertCodesChunked, getBatchProgress, buildSkuZip, downloadBlob } from '../../lib/authCodes'
import { Plus, ShieldCheck, ArrowLeft, Download, Loader2 } from 'lucide-react'

const inputStyle = {
  width: '100%', padding: '0.75rem 1rem',
  border: '1.5px solid #DDD8CA', borderRadius: 8,
  fontSize: '0.9rem', color: '#1C2D1A', background: '#FAFAF8',
  outline: 'none', boxSizing: 'border-box',
  fontFamily: '"DM Sans", sans-serif',
}

const labelStyle = {
  display: 'block', fontSize: '0.85rem',
  color: '#1C2D1A', marginBottom: 6, fontWeight: 500,
}

function Section({ title, children }) {
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 1px 8px rgba(28,45,26,0.06)', marginBottom: 16 }}>
      {title && (
        <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.1rem', color: '#1C2D1A', fontWeight: 600, marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #EAE5D9' }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export default function AuthCodes() {
  const [view, setView] = useState('list') // 'list' | 'new' | 'generating'
  const [batches, setBatches] = useState([])
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeBatch, setActiveBatch] = useState(null)

  const loadList = async () => {
    setLoading(true)
    const [{ data: batchData }, { data: productData }, { data: statsData }] = await Promise.all([
      supabase.from('auth_code_batches').select('*').order('created_at', { ascending: false }),
      supabase.from('products').select('id, name, slug').eq('is_active', true).order('name'),
      supabase.from('product_auth_code_stats').select('*').order('product_name'),
    ])
    setBatches(batchData || [])
    setProducts(productData || [])
    setStats(statsData || [])
    setLoading(false)
  }

  useEffect(() => { loadList() }, [])

  const openBatch = (batch) => {
    setActiveBatch(batch)
    setView('generating')
  }

  const backToList = () => {
    setActiveBatch(null)
    setView('list')
    loadList()
  }

  return (
    <div>
      {view === 'list' && (
        <BatchList
          batches={batches}
          stats={stats}
          loading={loading}
          onNew={() => setView('new')}
          onOpen={openBatch}
        />
      )}
      {view === 'new' && (
        <NewBatchForm
          products={products}
          onCancel={() => setView('list')}
          onCreated={openBatch}
        />
      )}
      {view === 'generating' && activeBatch && (
        <GenerationView
          batch={activeBatch}
          products={products}
          onBack={backToList}
        />
      )}
    </div>
  )
}

function BatchList({ batches, stats, loading, onNew, onOpen }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{ width: 3, height: 20, background: '#7A8C5A', borderRadius: 2 }} />
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#1C2D1A', fontWeight: 600 }}>
              Authenticity Codes
            </h1>
          </div>
          <p style={{ color: '#7A8C5A', fontSize: '0.875rem', paddingLeft: 13 }}>
            {batches.length} {batches.length === 1 ? 'batch' : 'batches'} generated
          </p>
        </div>
        <button
          onClick={onNew}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '0.65rem 1.25rem',
            background: '#2E402B', color: 'white', border: 'none',
            borderRadius: 9, cursor: 'pointer', fontSize: '0.875rem',
            fontWeight: 600, fontFamily: '"DM Sans", sans-serif',
            boxShadow: '0 2px 8px rgba(46,64,43,0.25)',
          }}
        >
          <Plus size={15} strokeWidth={2.5} /> New Batch
        </button>
      </div>

      {!loading && <ProductStatsTable stats={stats} />}

      {!loading && batches.length > 0 && (
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.4rem', color: '#1C2D1A', fontWeight: 600, margin: '2rem 0 1rem' }}>
          Batch History
        </h2>
      )}

      {loading ? (
        <div style={{ background: 'white', borderRadius: 14, padding: '3rem', textAlign: 'center', color: '#7A8C5A' }}>Loading…</div>
      ) : batches.length === 0 ? (
        <div style={{ background: 'white', borderRadius: 14, padding: '5rem 2rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(28,45,26,0.06)' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
            <ShieldCheck size={28} color="#DDD8CA" />
          </div>
          <p style={{ color: '#7A8C5A', marginBottom: '1rem', fontSize: '0.95rem' }}>No batches generated yet</p>
          <button onClick={onNew} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0.65rem 1.25rem', background: '#2E402B', color: 'white', border: 'none', borderRadius: 9, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
            <Plus size={15} /> Generate your first batch
          </button>
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(28,45,26,0.06)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#F4F1EA' }}>
                <th style={th()}>Batch</th>
                <th style={th()}>SKUs</th>
                <th style={{ ...th(), textAlign: 'right' }}>Total Codes</th>
                <th style={{ ...th(), textAlign: 'center' }}>Status</th>
                <th style={{ ...th(), textAlign: 'right' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((b, i) => (
                <tr
                  key={b.id}
                  onClick={() => onOpen(b)}
                  style={{ borderBottom: i === batches.length - 1 ? 'none' : '1px solid #F4F1EA', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAFAF8')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'white')}
                >
                  <td style={{ padding: '0.875rem 1.25rem', fontWeight: 500, color: '#1C2D1A' }}>{b.label}</td>
                  <td style={{ padding: '0.875rem 1.25rem', color: '#7A8C5A' }}>{(b.sku_plan || []).length}</td>
                  <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right', color: '#1C2D1A' }}>
                    {(b.sku_plan || []).reduce((sum, p) => sum + p.quantity, 0).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600,
                      background: b.status === 'completed' ? '#dcfce7' : '#FEF3C7',
                      color: b.status === 'completed' ? '#166534' : '#92400E',
                    }}>
                      {b.status === 'completed' ? 'Completed' : 'In Progress'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right', color: '#7A8C5A' }}>
                    {new Date(b.created_at).toLocaleDateString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function th() {
  return {
    padding: '0.875rem 1.25rem', textAlign: 'left', color: '#7A8C5A',
    fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase',
    letterSpacing: '0.07em', whiteSpace: 'nowrap',
  }
}

function ProductStatsTable({ stats }) {
  const withCodes = (stats || []).filter(s => s.total_codes > 0)
  const totalGenerated = withCodes.reduce((sum, s) => sum + s.total_codes, 0)
  const totalVerified = withCodes.reduce((sum, s) => sum + s.verified_codes, 0)

  if (withCodes.length === 0) return null

  return (
    <div>
      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
        <SummaryCard label="Codes Generated" value={totalGenerated.toLocaleString('en-IN')} />
        <SummaryCard label="Codes Verified" value={totalVerified.toLocaleString('en-IN')} />
        <SummaryCard
          label="Verification Rate"
          value={`${totalGenerated ? Math.round((totalVerified / totalGenerated) * 100) : 0}%`}
        />
      </div>

      <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(28,45,26,0.06)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F4F1EA' }}>
              <th style={th()}>Product</th>
              <th style={{ ...th(), textAlign: 'right' }}>Generated</th>
              <th style={{ ...th(), textAlign: 'right' }}>Verified</th>
              <th style={{ ...th(), textAlign: 'right' }}>Remaining</th>
              <th style={{ ...th(), width: 160 }}>Progress</th>
            </tr>
          </thead>
          <tbody>
            {withCodes.map((s, i) => {
              const pct = s.total_codes ? Math.round((s.verified_codes / s.total_codes) * 100) : 0
              return (
                <tr key={s.product_id} style={{ borderBottom: i === withCodes.length - 1 ? 'none' : '1px solid #F4F1EA' }}>
                  <td style={{ padding: '0.875rem 1.25rem', fontWeight: 500, color: '#1C2D1A' }}>{s.product_name}</td>
                  <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right', color: '#7A8C5A' }}>{s.total_codes.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right', color: '#166534', fontWeight: 500 }}>{s.verified_codes.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right', color: '#7A8C5A' }}>{(s.total_codes - s.verified_codes).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '0.875rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, background: '#F4F1EA', borderRadius: 20, height: 6, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: '#2E402B' }} />
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#7A8C5A', width: 32, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SummaryCard({ label, value }) {
  return (
    <div style={{ background: 'white', borderRadius: 12, padding: '1rem 1.25rem', boxShadow: '0 1px 8px rgba(28,45,26,0.06)' }}>
      <div style={{ fontSize: '0.7rem', color: '#7A8C5A', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.6rem', fontWeight: 600, color: '#1C2D1A' }}>{value}</div>
    </div>
  )
}

function NewBatchForm({ products, onCancel, onCreated }) {
  const [label, setLabel] = useState('')
  const [quantities, setQuantities] = useState(() => Object.fromEntries(products.map(p => [p.id, ''])))
  const [bulkQty, setBulkQty] = useState('800')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const applyBulk = () => {
    setQuantities(Object.fromEntries(products.map(p => [p.id, bulkQty])))
  }

  const handleCreate = async () => {
    if (!label.trim()) return setError('Batch label is required.')
    const skuPlan = products
      .map(p => ({ product_id: p.id, quantity: parseInt(quantities[p.id], 10) || 0 }))
      .filter(p => p.quantity > 0)
    if (skuPlan.length === 0) return setError('Set a quantity for at least one product.')

    setSaving(true)
    setError('')
    const { data, error: dbErr } = await supabase
      .from('auth_code_batches')
      .insert({ label: label.trim(), sku_plan: skuPlan, status: 'in_progress' })
      .select('*')
      .single()

    if (dbErr) {
      setError(dbErr.message)
      setSaving(false)
    } else {
      onCreated(data)
    }
  }

  const totalPlanned = Object.values(quantities).reduce((sum, q) => sum + (parseInt(q, 10) || 0), 0)

  return (
    <div style={{ maxWidth: 700 }}>
      <button
        onClick={onCancel}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#7A8C5A', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontFamily: '"DM Sans", sans-serif', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={15} /> Back to Batches
      </button>

      <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.875rem', color: '#1C2D1A', fontWeight: 600, marginBottom: 4 }}>
        New Code Batch
      </h1>
      <p style={{ color: '#7A8C5A', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
        Set how many authenticity codes to generate per product.
      </p>

      <Section title="Batch Details">
        <label style={labelStyle}>Label <span style={{ color: '#dc2626' }}>*</span></label>
        <input
          type="text"
          value={label}
          onChange={e => setLabel(e.target.value)}
          placeholder="e.g. First Batch — July 2026"
          style={inputStyle}
          onFocus={e => (e.target.style.borderColor = '#2E402B')}
          onBlur={e => (e.target.style.borderColor = '#DDD8CA')}
        />
      </Section>

      <Section title="Quantities per SKU">
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: '1.25rem' }}>
          <input
            type="number"
            min="0"
            value={bulkQty}
            onChange={e => setBulkQty(e.target.value)}
            style={{ ...inputStyle, width: 120 }}
          />
          <button
            type="button"
            onClick={applyBulk}
            style={{ padding: '0.65rem 1.1rem', borderRadius: 8, border: '1.5px solid #DDD8CA', background: '#F4F1EA', color: '#2E402B', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}
          >
            Set all to this quantity
          </button>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: '#7A8C5A' }}>
            Total: {totalPlanned.toLocaleString('en-IN')} codes
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 400, overflowY: 'auto' }}>
          {products.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #F4F1EA' }}>
              <span style={{ flex: 1, fontSize: '0.85rem', color: '#1C2D1A' }}>{p.name}</span>
              <input
                type="number"
                min="0"
                value={quantities[p.id]}
                onChange={e => setQuantities(q => ({ ...q, [p.id]: e.target.value }))}
                style={{ ...inputStyle, width: 110, padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
              />
            </div>
          ))}
        </div>
      </Section>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.75rem 1rem', color: '#dc2626', fontSize: '0.875rem', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{ padding: '0.7rem 1.5rem', borderRadius: 8, border: '1.5px solid #DDD8CA', background: 'white', color: '#1C2D1A', cursor: 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem' }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleCreate}
          disabled={saving}
          style={{ padding: '0.7rem 1.75rem', borderRadius: 8, border: 'none', background: saving ? '#7A8C5A' : '#2E402B', color: 'white', cursor: saving ? 'not-allowed' : 'pointer', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', fontWeight: 600 }}
        >
          {saving ? 'Starting…' : 'Start Generating'}
        </button>
      </div>
    </div>
  )
}

function GenerationView({ batch, products, onBack }) {
  const productMap = Object.fromEntries(products.map(p => [p.id, p]))
  const skuPlan = batch.sku_plan || []

  const [rows, setRows] = useState(() =>
    skuPlan.map(({ product_id, quantity }) => ({
      productId: product_id,
      target: quantity,
      done: 0,
      status: 'pending', // pending | generating | rendering | ready | error
      zipBlob: null,
    }))
  )
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(batch.status === 'completed')

  const setRow = (productId, patch) => {
    setRows(prev => prev.map(r => (r.productId === productId ? { ...r, ...patch } : r)))
  }

  const runBatch = async () => {
    setRunning(true)

    // Resume support: check what's already in the DB for this batch.
    const existingCounts = await getBatchProgress(batch.id)
    setRows(prev => prev.map(r => ({ ...r, done: existingCounts[r.productId] || 0 })))

    for (const row of skuPlan) {
      const product = productMap[row.product_id]
      const already = existingCounts[row.product_id] || 0
      const remaining = row.quantity - already

      if (remaining > 0) {
        setRow(row.product_id, { status: 'generating' })
        await insertCodesChunked(batch.id, row.product_id, remaining, (insertedThisRun) => {
          setRow(row.product_id, { done: already + insertedThisRun })
        })
      }

      setRow(row.product_id, { status: 'rendering', done: row.quantity })
      try {
        const blob = await buildSkuZip({ product, batchId: batch.id, batchLabel: batch.label })
        setRow(row.product_id, { status: 'ready', zipBlob: blob })
      } catch (err) {
        console.error(err)
        setRow(row.product_id, { status: 'error' })
      }
    }

    await supabase.from('auth_code_batches').update({ status: 'completed' }).eq('id', batch.id)
    setRunning(false)
    setFinished(true)
  }

  const totalTarget = rows.reduce((sum, r) => sum + r.target, 0)
  const totalDone = rows.reduce((sum, r) => sum + r.done, 0)

  return (
    <div>
      <button
        onClick={onBack}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#7A8C5A', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontFamily: '"DM Sans", sans-serif', marginBottom: '1.5rem' }}
      >
        <ArrowLeft size={15} /> Back to Batches
      </button>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.875rem', color: '#1C2D1A', fontWeight: 600, marginBottom: 4 }}>
            {batch.label}
          </h1>
          <p style={{ color: '#7A8C5A', fontSize: '0.875rem' }}>
            {totalDone.toLocaleString('en-IN')} / {totalTarget.toLocaleString('en-IN')} codes
          </p>
        </div>
        {!finished && (
          <button
            onClick={runBatch}
            disabled={running}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '0.65rem 1.25rem', background: running ? '#7A8C5A' : '#2E402B',
              color: 'white', border: 'none', borderRadius: 9,
              cursor: running ? 'not-allowed' : 'pointer', fontSize: '0.875rem',
              fontWeight: 600, fontFamily: '"DM Sans", sans-serif',
            }}
          >
            {running ? <Loader2 size={15} className="animate-spin" /> : null}
            {running ? 'Generating…' : 'Start / Resume Generation'}
          </button>
        )}
      </div>

      {/* Overall progress bar */}
      <div style={{ background: '#F4F1EA', borderRadius: 20, height: 10, overflow: 'hidden', marginBottom: '1.75rem' }}>
        <div style={{
          width: totalTarget ? `${Math.min(100, (totalDone / totalTarget) * 100)}%` : '0%',
          height: '100%', background: '#2E402B', transition: 'width 0.3s ease',
        }} />
      </div>

      <div style={{ background: 'white', borderRadius: 14, boxShadow: '0 2px 12px rgba(28,45,26,0.06)', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F4F1EA' }}>
              <th style={th()}>Product</th>
              <th style={{ ...th(), textAlign: 'right' }}>Progress</th>
              <th style={{ ...th(), textAlign: 'center' }}>Status</th>
              <th style={{ ...th(), textAlign: 'right' }}>Download</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const product = productMap[r.productId]
              return (
                <tr key={r.productId} style={{ borderBottom: i === rows.length - 1 ? 'none' : '1px solid #F4F1EA' }}>
                  <td style={{ padding: '0.875rem 1.25rem', color: '#1C2D1A', fontWeight: 500 }}>{product?.name || 'Unknown product'}</td>
                  <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right', color: '#7A8C5A' }}>{r.done} / {r.target}</td>
                  <td style={{ padding: '0.875rem 1.25rem', textAlign: 'center' }}>
                    <StatusBadge status={r.status} />
                  </td>
                  <td style={{ padding: '0.875rem 1.25rem', textAlign: 'right' }}>
                    {r.status === 'ready' && r.zipBlob && (
                      <button
                        onClick={() => downloadBlob(r.zipBlob, `${product?.slug || r.productId}-codes.zip`)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.4rem 0.9rem', borderRadius: 7, border: '1.5px solid #DDD8CA', background: 'white', color: '#2E402B', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                      >
                        <Download size={13} /> ZIP
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    pending: { bg: '#F4F1EA', color: '#7A8C5A', label: 'Pending' },
    generating: { bg: '#FEF3C7', color: '#92400E', label: 'Generating…' },
    rendering: { bg: '#FEF3C7', color: '#92400E', label: 'Rendering QRs…' },
    ready: { bg: '#dcfce7', color: '#166534', label: 'Ready' },
    error: { bg: '#fef2f2', color: '#dc2626', label: 'Error' },
  }
  const s = map[status] || map.pending
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 600, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  )
}

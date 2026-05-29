import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Video, Plus, Trash2, GripVertical, Save, Eye, EyeOff, CheckCircle, Loader } from 'lucide-react'

function empty(maxOrder) {
  return {
    id: null, // null = unsaved
    title: '',
    handle: '',
    role: '',
    product: '',
    video_url: '',
    thumbnail_url: '',
    caption: '',
    active: true,
    sort_order: maxOrder + 1,
  }
}

export default function UGCVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)   // id (or '__new__') of row being edited
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)
  const [dragIdx, setDragIdx] = useState(null)
  const [overIdx, setOverIdx] = useState(null)

  /* ── Load ──────────────────────────────────────────────────── */
  async function load() {
    setLoading(true)
    const { data, error } = await supabase
      .from('ugc_videos')
      .select('*')
      .order('sort_order', { ascending: true })
    if (error) setError(error.message)
    else setVideos(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  /* ── Flash saved ────────────────────────────────────────────── */
  function flashSaved() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  /* ── Add new ────────────────────────────────────────────────── */
  function handleAdd() {
    const maxOrder = videos.reduce((m, v) => Math.max(m, v.sort_order), 0)
    const n = empty(maxOrder)
    setDraft(n)
    setEditing('__new__')
  }

  /* ── Edit existing ──────────────────────────────────────────── */
  function handleEdit(v) {
    setDraft({ ...v })
    setEditing(v.id)
  }

  /* ── Cancel ─────────────────────────────────────────────────── */
  function handleCancel() {
    setEditing(null)
    setDraft(null)
    setError(null)
  }

  /* ── Save draft (insert or update) ─────────────────────────── */
  async function handleSaveDraft() {
    if (!draft) return
    setSaving(true)
    setError(null)

    const payload = {
      title: draft.title,
      handle: draft.handle,
      role: draft.role,
      product: draft.product,
      video_url: draft.video_url,
      thumbnail_url: draft.thumbnail_url || null,
      caption: draft.caption || null,
      active: draft.active,
      sort_order: draft.sort_order,
    }

    let err
    if (editing === '__new__') {
      ;({ error: err } = await supabase.from('ugc_videos').insert(payload))
    } else {
      ;({ error: err } = await supabase.from('ugc_videos').update(payload).eq('id', editing))
    }

    if (err) { setError(err.message); setSaving(false); return }

    await load()
    setSaving(false)
    setEditing(null)
    setDraft(null)
    flashSaved()
  }

  /* ── Delete ─────────────────────────────────────────────────── */
  async function handleDelete(id) {
    if (!confirm('Delete this video entry?')) return
    const { error: err } = await supabase.from('ugc_videos').delete().eq('id', id)
    if (err) { setError(err.message); return }
    if (editing === id) { setEditing(null); setDraft(null) }
    await load()
    flashSaved()
  }

  /* ── Toggle active ──────────────────────────────────────────── */
  async function handleToggle(v) {
    const { error: err } = await supabase
      .from('ugc_videos')
      .update({ active: !v.active })
      .eq('id', v.id)
    if (err) { setError(err.message); return }
    setVideos(prev => prev.map(x => x.id === v.id ? { ...x, active: !x.active } : x))
    flashSaved()
  }

  /* ── Drag reorder ───────────────────────────────────────────── */
  function handleDragStart(i) { setDragIdx(i) }
  function handleDragOver(e, i) { e.preventDefault(); setOverIdx(i) }
  async function handleDrop(e, i) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === i) { setDragIdx(null); setOverIdx(null); return }
    const list = [...videos]
    const [moved] = list.splice(dragIdx, 1)
    list.splice(i, 0, moved)
    // Reassign sort_order in bulk
    const updates = list.map((v, idx) => supabase.from('ugc_videos').update({ sort_order: idx + 1 }).eq('id', v.id))
    await Promise.all(updates)
    setVideos(list.map((v, idx) => ({ ...v, sort_order: idx + 1 })))
    setDragIdx(null); setOverIdx(null)
    flashSaved()
  }

  /* ── Styles ─────────────────────────────────────────────────── */
  const inputStyle = {
    width: '100%', padding: '0.6rem 0.875rem', borderRadius: 8,
    border: '1.5px solid #E8E3D9', fontSize: '0.875rem',
    fontFamily: '"DM Sans", sans-serif', color: '#1C2D1A',
    background: '#FAFAF8', outline: 'none', boxSizing: 'border-box',
  }
  const labelStyle = {
    fontSize: '0.7rem', fontWeight: 600, color: '#7A8C5A',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    marginBottom: 5, display: 'block',
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 3, height: 20, background: '#B89F70', borderRadius: 2 }} />
            <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '2rem', color: '#1C2D1A', fontWeight: 600 }}>
              UGC Videos
            </h1>
          </div>
          <p style={{ color: '#7A8C5A', fontSize: '0.875rem', paddingLeft: 13 }}>
            Manage the Journey Review videos shown on the home page. First 3 active rows are displayed.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {saved && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2E402B', fontSize: '0.8rem', fontWeight: 600 }}>
              <CheckCircle size={15} color="#2E402B" /> Saved
            </span>
          )}
          <button
            onClick={handleAdd}
            disabled={editing === '__new__'}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              background: '#1C2D1A', color: '#F4F1EA', border: 'none',
              borderRadius: 9, padding: '0.65rem 1.1rem',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif', opacity: editing === '__new__' ? 0.5 : 1,
            }}
          >
            <Plus size={15} /> Add Video
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', color: '#991B1B', fontSize: '0.82rem' }}>
          {error}
        </div>
      )}

      {/* Info strip */}
      <div style={{ background: 'rgba(184,159,112,0.08)', border: '1px solid rgba(184,159,112,0.3)', borderRadius: 10, padding: '0.875rem 1.1rem', marginBottom: '1.5rem', fontSize: '0.8rem', color: '#B89F70', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Video size={14} />
        <span>Paste a direct <strong>MP4/WebM</strong> URL or a hosted reel link. Drag rows to reorder. First 3 active entries appear on the homepage.</span>
      </div>

      {/* Loading */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '2rem', color: '#C9B99A', fontSize: '0.875rem' }}>
          <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Loading videos…
          <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* New video form (prepended when adding) */}
          {editing === '__new__' && draft && (
            <div style={{ background: 'white', borderRadius: 12, border: '2px solid #7A8C5A', boxShadow: '0 4px 20px rgba(28,45,26,0.1)', overflow: 'hidden' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F4F1EA', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7A8C5A', textTransform: 'uppercase', letterSpacing: '0.08em' }}>New Video</span>
              </div>
              <EditForm draft={draft} setDraft={setDraft} inputStyle={inputStyle} labelStyle={labelStyle} onSave={handleSaveDraft} onCancel={handleCancel} saving={saving} />
            </div>
          )}

          {/* Existing rows */}
          {videos.map((v, i) => (
            <div
              key={v.id}
              draggable={editing !== v.id}
              onDragStart={() => handleDragStart(i)}
              onDragOver={e => handleDragOver(e, i)}
              onDrop={e => handleDrop(e, i)}
              style={{
                background: 'white', borderRadius: 12,
                border: overIdx === i ? '2px solid #7A8C5A' : '1.5px solid #EAE5D9',
                boxShadow: '0 2px 10px rgba(28,45,26,0.05)',
                overflow: 'hidden', opacity: v.active ? 1 : 0.55,
                transition: 'all 0.15s',
              }}
            >
              {/* Row header */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', gap: 12 }}>
                <div style={{ cursor: 'grab', color: '#C9B99A', flexShrink: 0 }} title="Drag to reorder">
                  <GripVertical size={16} />
                </div>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: i < 3 && v.active ? '#1C2D1A' : '#EAE5D9', color: i < 3 && v.active ? 'white' : '#A0977F', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'monospace' }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: '#1C2D1A', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {v.title || <span style={{ color: '#C9B99A', fontStyle: 'italic' }}>Untitled</span>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#7A8C5A', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {v.handle} · {v.product}
                  </div>
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 20, background: v.active ? 'rgba(46,64,43,0.1)' : 'rgba(201,185,154,0.15)', color: v.active ? '#2E402B' : '#A0977F', flexShrink: 0 }}>
                  {v.active ? 'Active' : 'Hidden'}
                </span>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={() => handleToggle(v)} title={v.active ? 'Hide' : 'Show'} style={{ background: 'none', border: '1.5px solid #EAE5D9', borderRadius: 7, padding: '5px 7px', cursor: 'pointer', color: '#7A8C5A', display: 'flex', alignItems: 'center' }}>
                    {v.active ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => editing === v.id ? handleCancel() : handleEdit(v)} style={{ background: editing === v.id ? '#F4F1EA' : '#1C2D1A', border: 'none', borderRadius: 7, padding: '5px 12px', cursor: 'pointer', color: editing === v.id ? '#1C2D1A' : 'white', fontSize: '0.75rem', fontWeight: 600, fontFamily: '"DM Sans", sans-serif' }}>
                    {editing === v.id ? 'Cancel' : 'Edit'}
                  </button>
                  <button onClick={() => handleDelete(v.id)} title="Delete" style={{ background: 'none', border: '1.5px solid #EAE5D9', borderRadius: 7, padding: '5px 7px', cursor: 'pointer', color: '#C9B99A', display: 'flex', alignItems: 'center' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Expanded edit form */}
              {editing === v.id && draft && (
                <div style={{ borderTop: '1px solid #F4F1EA' }}>
                  <EditForm draft={draft} setDraft={setDraft} inputStyle={inputStyle} labelStyle={labelStyle} onSave={handleSaveDraft} onCancel={handleCancel} saving={saving} />
                </div>
              )}
            </div>
          ))}

          {videos.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#C9B99A', fontSize: '0.9rem' }}>
              No videos yet.{' '}
              <button onClick={handleAdd} style={{ color: '#7A8C5A', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontFamily: '"DM Sans", sans-serif', textDecoration: 'underline' }}>
                Add your first one
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Shared edit form ──────────────────────────────────────────── */
function EditForm({ draft, setDraft, inputStyle, labelStyle, onSave, onCancel, saving }) {
  return (
    <div style={{ padding: '1.25rem 1.5rem', background: '#FAFAF8' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Title / Hook</label>
          <input style={inputStyle} value={draft.title} onChange={e => setDraft({ ...draft, title: e.target.value })} placeholder="e.g. Week 1 vs Week 4" />
        </div>
        <div>
          <label style={labelStyle}>Handle / Name</label>
          <input style={inputStyle} value={draft.handle} onChange={e => setDraft({ ...draft, handle: e.target.value })} placeholder="@username" />
        </div>
        <div>
          <label style={labelStyle}>Role / Title</label>
          <input style={inputStyle} value={draft.role} onChange={e => setDraft({ ...draft, role: e.target.value })} placeholder="e.g. CrossFit Athlete" />
        </div>
        <div>
          <label style={labelStyle}>Featured Product</label>
          <input style={inputStyle} value={draft.product} onChange={e => setDraft({ ...draft, product: e.target.value })} placeholder="e.g. KSM-66 Ashwagandha" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Video URL <span style={{ color: '#C9B99A', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(direct MP4/WebM or reel link)</span></label>
          <input style={inputStyle} value={draft.video_url} onChange={e => setDraft({ ...draft, video_url: e.target.value })} placeholder="https://cdn.example.com/my-reel.mp4" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Thumbnail URL <span style={{ color: '#C9B99A', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional poster image)</span></label>
          <input style={inputStyle} value={draft.thumbnail_url || ''} onChange={e => setDraft({ ...draft, thumbnail_url: e.target.value })} placeholder="https://cdn.example.com/thumb.jpg" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Caption / Quote</label>
          <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 68 }} value={draft.caption || ''} onChange={e => setDraft({ ...draft, caption: e.target.value })} placeholder="Short journey quote shown below the video..." />
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div onClick={() => setDraft({ ...draft, active: !draft.active })} style={{ width: 36, height: 20, borderRadius: 10, background: draft.active ? '#1C2D1A' : '#C9B99A', position: 'relative', transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: 3, left: draft.active ? 18 : 3, width: 14, height: 14, borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
          </div>
          <span style={{ fontSize: '0.82rem', color: '#1C2D1A', fontWeight: 500 }}>Show on homepage</span>
        </div>
      </div>
      <div style={{ marginTop: '1.1rem', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button onClick={onCancel} style={{ background: 'none', border: '1.5px solid #EAE5D9', borderRadius: 8, padding: '0.6rem 1.2rem', cursor: 'pointer', color: '#7A8C5A', fontSize: '0.82rem', fontFamily: '"DM Sans", sans-serif', fontWeight: 600 }}>
          Cancel
        </button>
        <button onClick={onSave} disabled={saving} style={{ background: '#1C2D1A', color: 'white', border: 'none', borderRadius: 8, padding: '0.6rem 1.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
          {saving ? <Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={14} />}
          {saving ? 'Saving…' : 'Save Video'}
        </button>
      </div>
    </div>
  )
}

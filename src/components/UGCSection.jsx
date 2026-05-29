import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'

/* ── Single vertical video card ─────────────────────────────────── */
function VideoCard({ video, index }) {
  const videoRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const accentColors = ['#7A8C5A', '#4A8B8C', '#B89F70']
  const accent = accentColors[index % accentColors.length]

  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    if (hovered || expanded) {
      el.play().catch(() => {})
    } else {
      el.pause()
      el.currentTime = 0
    }
  }, [hovered, expanded])

  return (
    <>
      {/* Card */}
      <div
        className="group relative flex-1 min-w-0"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => setExpanded(true)}
        style={{ cursor: 'pointer' }}
      >
        {/* Aspect ratio wrapper — 9:16 vertical */}
        <div
          className="relative w-full overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
          style={{ paddingBottom: '177.78%', background: '#111' }}
        >
          {/* Video element */}
          <video
            ref={videoRef}
            src={video.video_url}
            poster={video.thumbnail_url || undefined}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={() => setLoaded(true)}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.4s ease' }}
          />

          {/* Skeleton shimmer while loading */}
          {!loaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-cream-dark/30 to-charcoal/20 animate-pulse" />
          )}

          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0) 100%)',
              opacity: hovered ? 1 : 0.7,
            }}
          />

          {/* Play indicator — shows when NOT hovered */}
          {!hovered && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:opacity-0">
              <svg className="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          )}

          {/* Verified badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/15 backdrop-blur-md border border-white/25 rounded-full px-2.5 py-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            <span className="text-white text-[9px] font-mono uppercase tracking-wider font-bold">Verified</span>
          </div>

          {/* Playing indicator pill */}
          {hovered && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2.5 py-1 animate-in fade-in duration-200">
              <span className="flex gap-0.5 items-end h-3">
                {[1, 2, 3].map(i => (
                  <span
                    key={i}
                    className="w-[2px] bg-white rounded-full inline-block"
                    style={{
                      height: `${[60, 100, 75][i - 1]}%`,
                      animation: `barBounce 0.9s ease-in-out ${i * 0.15}s infinite alternate`,
                    }}
                  />
                ))}
              </span>
              <span className="text-white text-[9px] font-mono tracking-wider">PLAYING</span>
            </div>
          )}

          {/* Bottom info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {/* Product tag */}
            <div
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider font-bold"
              style={{
                background: accent + '30',
                border: `1px solid ${accent}50`,
                color: accent === '#7A8C5A' ? '#a8c07a' : accent === '#4A8B8C' ? '#6fc5c6' : '#D4AE6A',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: 'currentColor' }} />
              {video.product}
            </div>

            {/* Journey title */}
            <h3 className="text-white font-serif text-lg font-bold leading-tight">
              {video.title}
            </h3>

            {/* Caption — shows on hover */}
            <p
              className="text-white/80 text-xs leading-relaxed line-clamp-2 transition-all duration-300"
              style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(6px)' }}
            >
              "{video.caption}"
            </p>

            {/* Author row */}
            <div className="flex items-center gap-2.5 pt-1">
              <div
                className="w-7 h-7 rounded-full border-2 border-white/40 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: accent + '60' }}
              >
                {video.handle.replace('@', '').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="text-white text-xs font-semibold leading-none">{video.handle}</div>
                <div className="text-white/55 text-[10px] mt-0.5">{video.role}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full-screen lightbox modal */}
      {expanded && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/90 backdrop-blur-md p-4"
          onClick={() => setExpanded(false)}
        >
          <div
            className="relative max-w-sm w-full"
            onClick={e => e.stopPropagation()}
          >
            <video
              src={video.video_url}
              poster={video.thumbnail_url || undefined}
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full rounded-2xl shadow-2xl"
              style={{ maxHeight: '85vh', objectFit: 'contain' }}
            />

            <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-full border-2 border-white/30 flex items-center justify-center text-white text-[11px] font-bold"
                  style={{ background: accent + '80' }}
                >
                  {video.handle.replace('@', '').slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="text-white text-sm font-bold">{video.handle}</div>
                  <div className="text-white/60 text-[11px]">{video.role}</div>
                </div>
                <div
                  className="ml-auto text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full font-bold"
                  style={{
                    background: accent + '30',
                    color: accent === '#7A8C5A' ? '#a8c07a' : accent === '#4A8B8C' ? '#6fc5c6' : '#D4AE6A',
                    border: `1px solid ${accent}40`,
                  }}
                >
                  {video.product}
                </div>
              </div>
              <h3 className="text-white font-serif text-xl font-bold">{video.title}</h3>
              <p className="text-white/70 text-sm leading-relaxed">"{video.caption}"</p>
            </div>

            <button
              onClick={() => setExpanded(false)}
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white text-charcoal flex items-center justify-center shadow-xl hover:bg-cream-dark transition-colors cursor-pointer text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  )
}

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function UGCSection() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVideos() {
      const { data } = await supabase
        .from('ugc_videos')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })
        .limit(3)
      setVideos(data || [])
      setLoading(false)
    }
    fetchVideos()
  }, [])

  // Don't render the section at all while loading or if no videos configured
  if (loading || videos.length === 0) return null

  return (
    <section className="py-20 bg-charcoal relative overflow-hidden">
      {/* Decorative BG */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#F4F1EA_1px,transparent_1px),linear-gradient(to_bottom,#F4F1EA_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(122,140,90,0.12) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 text-sage font-mono uppercase tracking-widest text-[11px] font-semibold mb-3">
            <span className="w-4 h-[1px] bg-sage" />
            Real People, Real Results
            <span className="w-4 h-[1px] bg-sage" />
          </span>
          <h2 className="text-3xl md:text-5xl font-serif text-white mt-2 leading-tight">
            Journey{' '}
            <span className="italic font-light text-sage">Reviews</span>
          </h2>
          <p className="text-white/50 text-sm max-w-md mx-auto mt-3 leading-relaxed">
            Verified customers documenting their transformation — hover to preview, click to watch.
          </p>
        </div>

        {/* 3-video grid */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch">
          {videos.map((video, i) => (
            <VideoCard key={video.id} video={video} index={i} />
          ))}
        </div>

        {/* Bottom trust strip */}
        <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[
            'All reviews are from verified purchasers',
            'No incentivised or paid testimonials',
            'Unfiltered journey documentation',
          ].map(text => (
            <span key={text} className="flex items-center gap-2 text-white/40 text-xs font-mono">
              <span className="text-sage font-bold">✓</span>
              {text}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes barBounce {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1); }
        }
      `}</style>
    </section>
  )
}

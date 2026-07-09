import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import VideoCard from './VideoCard'

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
    </section>
  )
}

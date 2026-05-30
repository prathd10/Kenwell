import React, { useState, useEffect, useCallback, useRef } from 'react'
import { PRODUCTS } from '../data'
import UGCSection from './UGCSection'
import ProductCard from './ProductCard'

/* ── Image map ─────────────────────────────────────────────────── */
const LOCAL_BOTTLE_MAP = {
  1: '/bottle_multivitamin.png',
  2: '/bottle_magnesium.png',
  3: '/bottle_vitamin_d3.png',
  4: '/bottle_zinc_magnesium.png',
  5: '/bottle_fish_oil.png',
  6: '/bottle_fish_oil.png',
  7: '/bottle_fish_oil.png',
  8: '/bottle_joint_support.png',
  9: '/bottle_milk_thistle.png',
  10: '/bottle_nac.png',
  11: '/bottle_tudca.png',
  12: '/bottle_nad.png',
  13: '/bottle_milk_thistle.png',
  14: '/bottle_vitamin_c.png',
  15: '/bottle_glutathione.png',
  16: '/bottle_vitamin_d3.png',
  17: '/bottle_coq10.png',
  18: '/bottle_melatonin.png',
  19: '/bottle_ashwagandha.png',
  20: '/bottle_berberine.png',
  21: '/bottle_probiotics.png',
}

/* ── Constants ─────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    id: 19,
    headline: 'Proven Stress Relief',
    sub: 'Ashwagandha · Naturally lowers stress levels',
    badge: 'Core Series',
    cta: 'Shop Ashwagandha',
    accent: '#7A8C5A',
    bg: 'from-sage/10 via-cream-dark/40 to-bg-primary',
    bgImage: 'https://images.unsplash.com/photo-1618220179428-22790b46a014?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 12,
    headline: 'More Energy & Healthy Aging',
    sub: 'NAD+ · Boosts your natural body energy',
    badge: 'Liposomal Series',
    cta: 'Shop NAD+',
    accent: '#4A8B8C',
    bg: 'from-slate-teal/10 via-cream-dark/40 to-bg-primary',
    bgImage: 'https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?q=80&w=2000&auto=format&fit=crop',
  },
  {
    id: 15,
    headline: 'The Ultimate Detox',
    sub: 'Glutathione · Clears toxins & brightens skin',
    badge: 'Liposomal Series',
    cta: 'Shop Glutathione',
    accent: '#4A8B8C',
    bg: 'from-slate-teal/8 via-cream-dark/30 to-bg-primary',
    bgImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop',
  },
]

const CAT_ICON_CLS = 'w-6 h-6'
const CATEGORIES = [
  {
    label: 'Daily Core', goal: 'Energy', desc: '7 products',
    color: 'bg-sage/8 border-sage/20 hover:bg-sage/16', text: 'text-primary-green',
    icon: <svg className={CAT_ICON_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  },
  {
    label: 'Sleep & Stress', goal: 'Sleep', desc: '4 products',
    color: 'bg-slate-teal/8 border-slate-teal/20 hover:bg-slate-teal/16', text: 'text-slate-teal',
    icon: <svg className={CAT_ICON_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  },
  {
    label: 'Immunity', goal: 'Immunity', desc: '6 products',
    color: 'bg-sage/8 border-sage/20 hover:bg-sage/16', text: 'text-primary-green',
    icon: <svg className={CAT_ICON_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  },
  {
    label: 'Gut Health', goal: 'Gut Health', desc: '3 products',
    color: 'bg-champagne/20 border-champagne/40 hover:bg-champagne/35', text: 'text-primary-green',
    icon: <svg className={CAT_ICON_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  },
  {
    label: 'Detox & Liver', goal: 'Detox', desc: '5 products',
    color: 'bg-slate-teal/8 border-slate-teal/20 hover:bg-slate-teal/16', text: 'text-slate-teal',
    icon: <svg className={CAT_ICON_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  },
  {
    label: 'Performance', goal: 'Performance', desc: '5 products',
    color: 'bg-champagne/20 border-champagne/40 hover:bg-champagne/35', text: 'text-primary-green',
    icon: <svg className={CAT_ICON_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
]

const BESTSELLER_IDS = [19, 2, 12, 15, 6, 1]

const TRUST_SVG_CLS = 'w-6 h-6 text-sage'
const TRUST_POINTS = [
  {
    title: 'Proper Doses',
    body: 'Every ingredient is used in the right amount to actually work. We don\'t hide tiny amounts in "secret blends".',
    icon: <svg className={TRUST_SVG_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>,
  },
  {
    title: 'No Junk Fillers',
    body: 'No talc, cheap chemicals, or fake colors. We show every single ingredient on the label so you know what you are taking.',
    icon: <svg className={TRUST_SVG_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  },
  {
    title: 'Top Quality Made',
    body: 'Made in top-quality facilities. Every single batch is tested for safety and purity before it reaches you.',
    icon: <svg className={TRUST_SVG_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  },
  {
    title: 'Lab Verified',
    body: 'A third-party lab checks every product. You can scan the QR code on your bottle to see the proof yourself.',
    icon: <svg className={TRUST_SVG_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
  },
]

/* ── Helpers ───────────────────────────────────────────────────── */
function Stars({ n = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < n ? 'text-gold-accent fill-current' : 'text-charcoal/15 fill-current'}`} viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  )
}

function getLocalSrc(product) {
  return LOCAL_BOTTLE_MAP[product.id] || '/bottle_multivitamin.png'
}



/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════ */
export default function Hero({ 
  setCurrentSection, 
  onQuickView, 
  onAddToCart, 
  onToggleWishlist, 
  wishlistItems,
  onAddToStack,
  stackItems
}) {
  const [slide, setSlide] = useState(0)
  const [fading, setFading] = useState(false)
  const [heroImgErr, setHeroImgErr] = useState(false)
  const intervalRef = useRef(null)
  const carouselRef = useRef(null)

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const firstChild = container.firstElementChild;
      const scrollAmount = firstChild ? firstChild.clientWidth + 24 : 300; // clientWidth + 24px gap (gap-6)
      if (dir === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        // If at the end, wrap to start
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 15) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }
  }

  const goTo = useCallback((i) => {
    setFading(true)
    setTimeout(() => {
      setSlide(i)
      setHeroImgErr(false)
      setFading(false)
    }, 280)
  }, [])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSlide(s => {
        const next = (s + 1) % HERO_SLIDES.length
        goTo(next)
        return s // actual change happens inside goTo
      })
    }, 4000)
    return () => clearInterval(intervalRef.current)
  }, [goTo])

  const activeSlide = HERO_SLIDES[slide]
  const activeProduct = PRODUCTS.find(p => p.id === activeSlide.id)

  const nextSlide = HERO_SLIDES[(slide + 1) % HERO_SLIDES.length]
  const nextProduct = PRODUCTS.find(p => p.id === nextSlide.id)

  const nextNextSlide = HERO_SLIDES[(slide + 2) % HERO_SLIDES.length]
  const nextNextProduct = PRODUCTS.find(p => p.id === nextNextSlide.id)

  const bestsellers = BESTSELLER_IDS.map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean)

  const filterGoal = (goal) => window.dispatchEvent(new CustomEvent('kenwell:filterGoal', { detail: goal }))
  const filterSeries = (series) => window.dispatchEvent(new CustomEvent('kenwell:filterSeries', { detail: series }))

  return (
    <div className="w-full">

      {/* Hero + Marquee Wrapper for Mobile Full Height */}
      <div className="flex flex-col min-h-[calc(100svh-70px)] lg:min-h-0 lg:block">
        {/* ══════════════════════════════════════════════
            1. FULL-BLEED HERO BANNER  (PS Nutrition style)
        ══════════════════════════════════════════════ */}
        <section
          className={`relative flex-1 lg:flex-none lg:min-h-[60vh] flex items-center bg-[#F4F1EA] overflow-hidden transition-all duration-700`}
        >
        {/* Full-width Lifestyle Background Image */}
        {activeSlide.bgImage && (
          <div className="absolute inset-0 z-0 transition-opacity duration-1000">
            <img 
              src={activeSlide.bgImage} 
              alt="Lifestyle Background" 
              className="w-full h-full object-cover opacity-80 mix-blend-multiply"
              fetchpriority="high"
              decoding="async"
            />
            {/* Gradient overlay to ensure text readability on the left */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#F4F1EA] via-[#F4F1EA]/90 to-transparent w-[70%]" />
          </div>
        )}

        {/* Decorative grid */}
        <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(to_right,#3D4A2B_1px,transparent_1px),linear-gradient(to_bottom,#3D4A2B_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none z-0" />


        {/* --- FULL BLEED RIGHT HALF BACKGROUND --- */}
        <div 
          className="absolute -right-[5%] lg:right-0 top-0 bottom-0 w-[75%] lg:w-[65%] pointer-events-none overflow-hidden"
          style={{ maskImage: 'linear-gradient(to right, transparent 25%, black 50%)', WebkitMaskImage: 'linear-gradient(to right, transparent 25%, black 50%)' }}
        >
          {/* Glow disc behind bottle */}
          <div
            className="absolute inset-0 blur-3xl opacity-30"
            style={{ background: `radial-gradient(circle at center, ${activeSlide.accent}, transparent 80%)` }}
          />

          {/* Blurred Background Product 2 — decorative, lazy load */}
          <img
            key={`bg2-${nextNextSlide.id}`}
            src={nextNextProduct?.image || getLocalSrc(nextNextProduct)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center translate-x-[16%] lg:translate-x-[16%] scale-[1.15] opacity-[0.15] blur-[12px] -z-20 transition-all duration-700"
            loading="lazy"
            decoding="async"
          />

          {/* Blurred Background Product 1 — decorative, lazy load */}
          <img
            key={`bg1-${nextSlide.id}`}
            src={nextProduct?.image || getLocalSrc(nextProduct)}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center translate-x-[12%] lg:translate-x-[12%] scale-[1.1] opacity-[0.35] blur-[6px] -z-10 transition-all duration-700"
            loading="lazy"
            decoding="async"
          />

          {/* Front Active Product — eager but non-blocking decode */}
          <img
            key={slide}
            src={heroImgErr ? getLocalSrc(activeProduct) : (activeProduct?.image || getLocalSrc(activeProduct))}
            alt=""
            onError={() => setHeroImgErr(true)}
            className="absolute inset-0 w-full h-full object-cover object-center translate-x-[8%] lg:translate-x-[8%] scale-[1.05] drop-shadow-2xl z-10 transition-all duration-700"
            decoding="async"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 lg:py-16 z-10">
          <div className="w-[50%] sm:w-[55%] lg:w-1/2">

            {/* ── Left text ── */}
            <div
              className="space-y-3 sm:space-y-5 text-left"
              style={{ opacity: fading ? 0 : 1, transform: fading ? 'translateY(12px)' : 'translateY(0)', transition: 'opacity 0.28s ease, transform 0.28s ease' }}
            >
              <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif text-primary-green leading-[1.1] tracking-tight">
                {activeSlide.headline.split(' ').slice(0, -1).join(' ')}{' '}
                <span className="italic font-light text-sage">{activeSlide.headline.split(' ').slice(-1)}</span>
              </h1>

              <p className="text-charcoal/70 text-xs sm:text-lg leading-relaxed max-w-lg pr-2">{activeSlide.sub}</p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 pt-1">
                <button
                  onClick={() => onQuickView(activeProduct)}
                  className="bg-primary-green hover:bg-sage text-white px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full text-[10px] sm:text-sm uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer text-center"
                >
                  {activeSlide.cta}
                </button>
                <button
                  onClick={() => setCurrentSection('shop')}
                  className="border-2 border-primary-green/25 hover:border-primary-green text-primary-green bg-white/60 backdrop-blur-sm hover:bg-white/80 px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full text-[10px] sm:text-sm uppercase tracking-widest font-semibold transition-all cursor-pointer text-center"
                >
                  View All →
                </button>
              </div>

              {/* Mini stats */}
              <div className="hidden sm:flex items-center gap-8 pt-4 border-t border-cream-dark/60 max-w-sm">
                {[['23+', 'Formulations'], ['4.8★', 'Avg Rating'], ['GMP', 'Certified']].map(([v, l]) => (
                  <div key={l}>
                    <span className="block font-serif text-2xl font-bold text-primary-green">{v}</span>
                    <span className="text-[10px] text-charcoal/50 uppercase tracking-wider">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${i === slide ? 'w-7 bg-primary-green' : 'w-1.5 bg-charcoal/20 hover:bg-charcoal/40'}`}
            />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2. MARQUEE TRUST STRIP
      ══════════════════════════════════════════════ */}
      <div className="bg-primary-green overflow-hidden py-3 flex shrink-0">
        <div className="flex animate-marquee whitespace-nowrap w-max hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex items-center px-3 md:px-5">
              {['23 Premium Health Products', 'Top Quality Made', '100% Transparent Labels', '4.8★ Average Rating', 'Free Shipping ₹999+', 'No Artificial Fillers', 'Proper Health Doses'].map((item, i) => (
                <span key={i} className="flex items-center gap-6 md:gap-10 px-3 md:px-5 text-[11px] font-mono uppercase tracking-wider text-white/85 whitespace-nowrap">
                  {item}
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      </div> {/* End Hero + Marquee Wrapper */}

      {/* ══════════════════════════════════════════════
          3. SHOP BY CATEGORY GRID  (PS Nutrition style)
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-sage font-mono uppercase tracking-wider text-[11px] font-semibold block mb-1">Find Your Goal</span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary-green">Shop by Category</h2>
          </div>
          <button onClick={() => setCurrentSection('shop')} className="hidden sm:block text-xs font-semibold text-primary-green hover:text-sage border border-primary-green/20 hover:border-sage/50 px-5 py-2 rounded-full transition-all cursor-pointer uppercase tracking-wider">
            All Products →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => filterGoal(cat.goal)}
              className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border ${cat.color} transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer text-center`}
            >
              <span className={cat.text}>{cat.icon}</span>
              <span className={`font-semibold text-sm ${cat.text}`}>{cat.label}</span>
              <span className="text-[10px] text-charcoal/40 font-mono">{cat.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. BESTSELLERS SHELF  (Carousel)
      ══════════════════════════════════════════════ */}
      <section className="py-12 bg-bg-secondary/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-sage font-mono uppercase tracking-wider text-[11px] font-semibold block mb-1">Customer Favorites</span>
              <h2 className="text-3xl md:text-4xl font-serif text-primary-green">Bestsellers</h2>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <button onClick={() => scrollCarousel('left')} className="p-2 rounded-full border border-primary-green/20 hover:bg-white text-primary-green transition-all cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button onClick={() => scrollCarousel('right')} className="p-2 rounded-full border border-primary-green/20 hover:bg-white text-primary-green transition-all cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>

          {/* Horizontal scroll carousel */}
          <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
            <div 
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {bestsellers.map(p => (
                <div 
                  key={p.id}
                  className="w-[260px] sm:w-[calc((100%-48px)/3)] lg:w-[calc((100%-72px)/4)] flex-shrink-0 snap-start"
                >
                  <ProductCard
                    product={p}
                    onQuickView={onQuickView}
                    onAddToStack={onAddToStack}
                    isInStack={stackItems?.some(item => item.id === p.id)}
                    onToggleWishlist={onToggleWishlist}
                    isInWishlist={wishlistItems?.some(w => w.id === p.id)}
                    onAddToCart={onAddToCart}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex sm:hidden justify-center items-center mt-2 gap-4">
            <button onClick={() => scrollCarousel('left')} className="p-2 rounded-full border border-primary-green/20 text-primary-green active:bg-primary-green/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={() => scrollCarousel('right')} className="p-2 rounded-full border border-primary-green/20 text-primary-green active:bg-primary-green/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          
          <div className="text-center mt-10">
            <button onClick={() => setCurrentSection('shop')} className="text-xs font-semibold text-primary-green hover:text-sage border border-primary-green/20 hover:border-sage/50 px-6 py-2.5 rounded-full uppercase tracking-wider cursor-pointer transition-all">
              View All Bestsellers →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. SHOP BY SERIES — 3-col feature cards
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-sage font-mono uppercase tracking-wider text-[11px] font-semibold">Product Lines</span>
          <h2 className="text-3xl md:text-4xl font-serif text-primary-green mt-2">Shop by Series</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {[
            {
              series: 'Core Series',
              badge: 'Daily Basics',
              count: '7 products',
              desc: 'Everyday nutrients to keep you healthy — easy-to-absorb minerals, fish oil, and daily vitamins.',
              accent: 'border-sage/30 bg-gradient-to-br from-sage/5 to-sage/12',
              btnColor: 'text-sage border-sage/30 hover:bg-sage hover:text-white',
              dotColor: 'bg-sage',
            },
            {
              series: 'Wellness Series',
              badge: 'Targeted Health',
              count: '12 products',
              desc: 'Specific products for your joints, liver, gut, sleep, and keeping your hormones balanced.',
              accent: 'border-champagne/50 bg-gradient-to-br from-champagne/15 to-champagne/30',
              btnColor: 'text-gold-accent border-champagne/50 hover:bg-gold-accent hover:text-white',
              dotColor: 'bg-gold-accent',
            },
            {
              series: 'Liposomal Series',
              badge: 'Healthy Aging',
              count: '4 products',
              desc: 'Products like NAD+ and Vitamin C made with special technology so your body absorbs them perfectly.',
              accent: 'border-slate-teal/30 bg-gradient-to-br from-slate-teal/5 to-slate-teal/12',
              btnColor: 'text-slate-teal border-slate-teal/30 hover:bg-slate-teal hover:text-white',
              dotColor: 'bg-slate-teal',
            },
            {
              series: 'Performance Series',
              badge: 'Fitness & Energy',
              count: '5 products',
              desc: 'Powerful formulas to help you work out harder, recover faster, and stay focused.',
              accent: 'border-primary-green/20 bg-gradient-to-br from-primary-green/5 to-primary-green/10',
              btnColor: 'text-primary-green border-primary-green/30 hover:bg-primary-green hover:text-white',
              dotColor: 'bg-primary-green',
            },
          ].map((s) => (
            <div
              key={s.series}
              className={`group relative rounded-2xl border ${s.accent} p-4 sm:p-7 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col`}
              onClick={() => filterSeries(s.series)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0 mb-3 sm:mb-5">
                <span className={`inline-flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[10px] font-mono uppercase tracking-wider font-semibold`}>
                  <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${s.dotColor}`} />
                  {s.badge}
                </span>
                <span className="text-[9px] sm:text-[10px] text-charcoal/40 font-mono">{s.count}</span>
              </div>
              <h3 className="font-serif text-lg sm:text-2xl text-primary-green mb-2 sm:mb-3 group-hover:text-inherit transition-colors">{s.series}</h3>
              <p className="text-[11px] sm:text-sm text-charcoal/60 leading-relaxed flex-grow">{s.desc}</p>
              <button className={`mt-4 sm:mt-6 w-full border rounded-full py-2 sm:py-2.5 text-[9px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${s.btnColor}`}>
                Explore <span className="hidden sm:inline">{s.series} </span>→
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. INTERACTIVE STACK BUILDER PROMO  (PS Nutrition: "Fuel Calculator")
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-primary-green relative overflow-hidden">
        {/* Large decorative BG text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-serif text-[18vw] font-bold text-white/[0.04] leading-none">STACK</span>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span className="inline-block bg-white/15 border border-white/20 text-[10px] font-mono uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Your Personal Plan
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl mb-5 leading-tight">
            Build Your Perfect<br />
            <span className="italic font-light opacity-80">Supplement Stack</span>
          </h2>
          <p className="text-white/70 text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Take our quick 90-second health quiz to get a custom supplement plan made just for your goals — then add it to your cart in one click.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentSection('quiz')}
              className="bg-white text-primary-green hover:bg-cream-dark px-8 py-4 rounded-full text-sm uppercase tracking-widest font-bold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
            >
              Take Wellness Quiz
            </button>
            <button
              onClick={() => setCurrentSection('builder')}
              className="border-2 border-white/40 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-full text-sm uppercase tracking-widest font-semibold transition-all cursor-pointer"
            >
              Open Stack Builder
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. TRUST / WHY KENWELL  — 4 icon cards
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-sage font-mono uppercase tracking-wider text-[11px] font-semibold">The Kenwell Standard</span>
          <h2 className="text-3xl md:text-4xl font-serif text-primary-green mt-2">Why We're Different</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {TRUST_POINTS.map((t) => (
            <div key={t.title} className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/70 p-4 sm:p-6 hover:shadow-lg hover:border-sage/30 transition-all duration-300 text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-sage/10 border border-sage/20 flex items-center justify-center mb-3 sm:mb-4">
                <div className="scale-75 sm:scale-100">{t.icon}</div>
              </div>
              <h3 className="font-serif text-sm sm:text-lg font-bold text-primary-green mb-1.5 sm:mb-2">{t.title}</h3>
              <p className="text-[10px] sm:text-sm text-charcoal/60 leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. REVIEWS  — 3 cards with product tags
      ══════════════════════════════════════════════ */}
      <section className="py-16 bg-bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-sage font-mono uppercase tracking-wider text-[11px] font-semibold">Verified Reviews</span>
            <h2 className="text-3xl md:text-4xl font-serif text-primary-green mt-2">What Customers Say</h2>
          </div>

          <div className="relative overflow-hidden group py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {[
                { quote: '"Amazing recovery times"', body: 'Switched to the Chelated Magnesium + Ashwagandha stack. Sleep latency dropped from 45 min to under 15. Wake up without grogginess.', name: 'Rahul K.', role: 'CrossFit Athlete', product: 'Magnesium + Ashwagandha', stars: 5 },
                { quote: '"Legitimate open labels"', body: 'As a clinical nutritionist I examine every supplement closely. Kenwell is the first Indian brand I actively recommend — purity assays verified, zero undisclosed fillers.', name: 'Dr. Priya M.', role: 'Clinical Nutritionist', product: 'Multivitamin with Probiotics', stars: 5 },
                { quote: '"Mitochondrial fuel works"', body: 'The NAD+ and CoQ10 stack made a noticeable difference in afternoon focus. No more brain fog during long coding sessions.', name: 'Vikram S.', role: 'Software Architect', product: 'NAD+ · CoQ10', stars: 5 },
                { quote: '"Visible skin improvements"', body: 'Added Liposomal Glutathione to my routine. After 3 weeks, my skin looks noticeably brighter and clearer. Absorption is definitely superior.', name: 'Ananya T.', role: 'Dermatologist', product: 'Liposomal Glutathione', stars: 5 },
                { quote: '"Finally, no nausea"', body: 'Most multivitamins upset my stomach, but the Core Series is gentle. The bioavailable forms make a huge difference in my daily energy levels.', name: 'Karan D.', role: 'Fitness Coach', product: 'Core Multivitamin', stars: 5 },
                { quote: '"A staple in my stack"', body: 'TUDCA is hard to find with this level of purity in India. Kenwell delivered perfectly. Liver enzymes are back in optimal range.', name: 'Siddharth M.', role: 'Biohacker', product: 'TUDCA 500mg', stars: 5 },
                { quote: '"Amazing recovery times"', body: 'Switched to the Chelated Magnesium + Ashwagandha stack. Sleep latency dropped from 45 min to under 15. Wake up without grogginess.', name: 'Rahul K.', role: 'CrossFit Athlete', product: 'Magnesium + Ashwagandha', stars: 5 },
                { quote: '"Legitimate open labels"', body: 'As a clinical nutritionist I examine every supplement closely. Kenwell is the first Indian brand I actively recommend — purity assays verified, zero undisclosed fillers.', name: 'Dr. Priya M.', role: 'Clinical Nutritionist', product: 'Multivitamin with Probiotics', stars: 5 },
                { quote: '"Mitochondrial fuel works"', body: 'The NAD+ and CoQ10 stack made a noticeable difference in afternoon focus. No more brain fog during long coding sessions.', name: 'Vikram S.', role: 'Software Architect', product: 'NAD+ · CoQ10', stars: 5 },
                { quote: '"Visible skin improvements"', body: 'Added Liposomal Glutathione to my routine. After 3 weeks, my skin looks noticeably brighter and clearer. Absorption is definitely superior.', name: 'Ananya T.', role: 'Dermatologist', product: 'Liposomal Glutathione', stars: 5 },
                { quote: '"Finally, no nausea"', body: 'Most multivitamins upset my stomach, but the Core Series is gentle. The bioavailable forms make a huge difference in my daily energy levels.', name: 'Karan D.', role: 'Fitness Coach', product: 'Core Multivitamin', stars: 5 },
                { quote: '"A staple in my stack"', body: 'TUDCA is hard to find with this level of purity in India. Kenwell delivered perfectly. Liver enzymes are back in optimal range.', name: 'Siddharth M.', role: 'Biohacker', product: 'TUDCA 500mg', stars: 5 },
              ].map((r, i) => (
                <div key={i} className="w-[300px] sm:w-[380px] flex-shrink-0 bg-white/70 backdrop-blur-sm rounded-2xl border border-white/70 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow mr-4 sm:mr-5 whitespace-normal">
                  <div className="space-y-3">
                    <Stars n={r.stars} />
                    <h4 className="font-serif text-lg font-bold text-primary-green">{r.quote}</h4>
                    <p className="text-sm text-charcoal/65 leading-relaxed">{r.body}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-cream-dark/40 flex items-end justify-between">
                    <div>
                      <span className="block text-sm font-bold text-charcoal/80">{r.name}</span>
                      <span className="text-[10px] text-charcoal/45">{r.role}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-charcoal/35 uppercase tracking-wider block">Using</span>
                      <span className="text-[10px] font-semibold text-sage">{r.product}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8b. UGC JOURNEY REVIEWS — 3 hover-play videos
      ══════════════════════════════════════════════ */}
      <UGCSection />

      {/* ══════════════════════════════════════════════
          9. FINAL CTA BANNER
      ══════════════════════════════════════════════ */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-bg-primary via-cream-dark/20 to-bg-primary">
        <span className="text-sage font-mono uppercase tracking-wider text-[11px] font-semibold">The Full Collection</span>
        <h2 className="text-3xl md:text-4xl font-serif text-primary-green mt-3 mb-4">
          23 Premium Health Products
        </h2>
        <p className="text-charcoal/55 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Transparent labels · Proper doses · Easy to absorb · No artificial junk
        </p>
        <button
          onClick={() => setCurrentSection('shop')}
          className="bg-primary-green hover:bg-sage text-white px-10 py-4 rounded-full text-sm uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
        >
          Browse the Full Shop →
        </button>
      </section>

    </div>
  )
}

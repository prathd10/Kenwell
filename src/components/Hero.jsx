import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import UGCSection from './UGCSection'
import ProductCard from './ProductCard'

/* ── Image map ─────────────────────────────────────────────────── */
const LOCAL_BOTTLE_MAP = {
  'multivitamin-with-probiotics': '/bottle_multivitamin-with-probiotics.png',
  'chelated-magnesium-glycinate': '/bottle_chelated-magnesium-glycinate.png',
  'vitamin-d3-k2-calcium': '/bottle_vitamin-d3-k2-calcium.png',
  'zinc-picolonate-magnesium': '/bottle_zinc-picolonate-magnesium.png',
  'single-strength-fish-oil': '/bottle_single-strength-fish-oil.png',
  'triple-strength-fish-oil': '/bottle_triple-strength-fish-oil.png',
  'vegetarian-omega': '/bottle_vegetarian-omega.png',
  'joint-support': '/bottle_joint-support.png',
  'milk-thistle': '/bottle_milk-thistle.png',
  'nac': '/bottle_nac.png',
  'tudca': '/bottle_tudca.png',
  'nad': '/bottle_nad.png',
  'fat-burner': '/bottle_fat-burner.png',
  'liver-support-blend': '/bottle_liver-support-blend.png',
  'berberine-hcl': '/bottle_berberine-hcl.png',
  'vitamin-c': '/bottle_vitamin-c.png',
  'glutathione-reduced': '/bottle_glutathione-reduced.png',
  'vitamin-b12': '/bottle_vitamin-b12.png',
  'coq10-ubiquinone': '/bottle_coq10-ubiquinone.png',
  'melatonin-sleep-support': '/bottle_melatonin-sleep-support.png',
  'ksm-66-ashwagandha': '/bottle_ksm-66-ashwagandha.png',
  'dht-blocker': '/bottle_dht-blocker.png',
  'prebiotics-probiotics': '/bottle_prebiotics-probiotics.png',
}

const SPOTLIGHT_PRODUCTS = [
  {
    slug: 'ksm-66-ashwagandha',
    name: 'KSM-66® Ashwagandha',
    subtitle: 'Full-Spectrum Organic Root Extract',
    dose: '600mg Clinical Dose',
    metric: '27% Cortisol Drop',
    tag: 'Stress & Cortisol',
    accent: '#1C355E',
    badge: 'Core Series',
  },
  {
    slug: 'chelated-magnesium-glycinate',
    name: 'Chelated Magnesium Glycinate',
    subtitle: 'High-Bioavailability Dipeptide Delivery',
    dose: '400mg Pure Chelated',
    metric: 'Zero GI Distress',
    tag: 'Deep REM Sleep',
    accent: '#D47A3B',
    badge: 'Core Series',
  },
  {
    slug: 'nad',
    name: 'NAD+ Cellular Complex',
    subtitle: 'Liposomal Mitochondrial Coenzyme',
    dose: 'Sub-Cellular Fuel',
    metric: 'Sirtuin Activation',
    tag: 'Longevity & Focus',
    accent: '#1C355E',
    badge: 'Liposomal Series',
  },
  {
    slug: 'triple-strength-fish-oil',
    name: 'Triple Strength Fish Oil',
    subtitle: 'Pure Triglyceride Molecular Distillation',
    dose: 'Ultra-Pure EPA & DHA',
    metric: '70% Higher Uptake',
    tag: 'Heart & Joint Vitality',
    accent: '#1C355E',
    badge: 'Core Series',
  },
  {
    slug: 'glutathione-reduced',
    name: 'Liposomal Glutathione',
    subtitle: 'Active Reduced L-Glutathione Tripeptide',
    dose: '500mg Phospholipid',
    metric: 'Master Cellular Detox',
    tag: 'Detox & Radiant Skin',
    accent: '#D47A3B',
    badge: 'Liposomal Series',
  },
]

const CAT_ICON_CLS = 'w-6 h-6'
const CATEGORIES = [
  {
    label: 'Daily Core', goal: 'Energy', desc: '7 products',
    color: 'bg-[#4A6B4A]/8 border-[#4A6B4A]/20 hover:bg-[#4A6B4A]/15', text: 'text-[#4A6B4A]',
    icon: <svg className={CAT_ICON_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  },
  {
    label: 'Sleep & Stress', goal: 'Sleep', desc: '4 products',
    color: 'bg-[#1C355E]/8 border-[#1C355E]/20 hover:bg-[#1C355E]/15', text: 'text-[#1C355E]',
    icon: <svg className={CAT_ICON_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  },
  {
    label: 'Immunity', goal: 'Immunity', desc: '6 products',
    color: 'bg-[#4A6B4A]/8 border-[#4A6B4A]/20 hover:bg-[#4A6B4A]/15', text: 'text-[#4A6B4A]',
    icon: <svg className={CAT_ICON_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  },
  {
    label: 'Gut Health', goal: 'Gut Health', desc: '3 products',
    color: 'bg-[#D47A3B]/8 border-[#D47A3B]/20 hover:bg-[#D47A3B]/15', text: 'text-[#D47A3B]',
    icon: <svg className={CAT_ICON_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  },
  {
    label: 'Detox & Liver', goal: 'Detox', desc: '5 products',
    color: 'bg-[#1C355E]/8 border-[#1C355E]/20 hover:bg-[#1C355E]/15', text: 'text-[#1C355E]',
    icon: <svg className={CAT_ICON_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  },
  {
    label: 'Performance', goal: 'Performance', desc: '5 products',
    color: 'bg-[#D47A3B]/8 border-[#D47A3B]/20 hover:bg-[#D47A3B]/15', text: 'text-[#D47A3B]',
    icon: <svg className={CAT_ICON_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
]

const BESTSELLER_SLUGS = ['ksm-66-ashwagandha', 'chelated-magnesium-glycinate', 'nad', 'glutathione-reduced', 'triple-strength-fish-oil', 'multivitamin-with-probiotics']

const TRUST_SVG_CLS = 'w-6 h-6 text-[#4A6B4A]'
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
        <svg key={i} className={`w-3.5 h-3.5 ${i < n ? 'text-[#D47A3B] fill-current' : 'text-[#1C355E]/15 fill-current'}`} viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  )
}

function getLocalSrc(product) {
  return LOCAL_BOTTLE_MAP[product?.slug] || '/bottle_multivitamin.png'
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
  const { products } = useProducts()
  const [selectedSlug, setSelectedSlug] = useState('ksm-66-ashwagandha')
  const [imgFading, setImgFading] = useState(false)
  const heroRef = useRef(null)
  const carouselRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2 // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2 // -1 to 1
    setMousePos({ 
      x: Math.max(-1, Math.min(1, x)), 
      y: Math.max(-1, Math.min(1, y)) 
    })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 })
  }

  const scrollCarousel = (dir) => {
    if (carouselRef.current) {
      const container = carouselRef.current
      const firstChild = container.firstElementChild
      const scrollAmount = firstChild ? firstChild.clientWidth + 24 : 300
      if (dir === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      } else {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 15) {
          container.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
      }
    }
  }

  const handleSelectProduct = (slug) => {
    if (slug === selectedSlug) return
    setImgFading(true)
    setTimeout(() => {
      setSelectedSlug(slug)
      setImgFading(false)
    }, 180)
  }

  const activeSpotlight = SPOTLIGHT_PRODUCTS.find(s => s.slug === selectedSlug) || SPOTLIGHT_PRODUCTS[0]
  const activeProduct = products.find(p => p.slug === selectedSlug) || products.find(p => p.slug === 'ksm-66-ashwagandha') || products[0]

  const bestsellers = BESTSELLER_SLUGS.map(slug => products.find(p => p.slug === slug)).filter(Boolean)

  const filterGoal = (goal) => window.dispatchEvent(new CustomEvent('kenwell:filterGoal', { detail: goal }))
  const filterSeries = (series) => window.dispatchEvent(new CustomEvent('kenwell:filterSeries', { detail: series }))

  return (
    <div className="w-full font-lato">

      {/* Hero + Marquee Wrapper for Mobile Full Height */}
      <div className="flex flex-col min-h-[calc(100svh-70px)] lg:min-h-0 lg:block">
        {/* ══════════════════════════════════════════════
            1. PARALLAX GLASSMORPHIC HERO BANNER
        ══════════════════════════════════════════════ */}
        <section 
          ref={heroRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full bg-[#FAF8F5] border-b border-[#E4DFD3]/60 overflow-hidden py-10 lg:py-16"
        >
          
          {/* Delicate Japanese Botanical Pattern Trim (Top accent border) */}
          <div 
            className="absolute top-0 left-0 right-0 h-1.5 opacity-85 z-20"
            style={{ 
              backgroundImage: "url('/patterns/pattern-blue.jpg')", 
              backgroundSize: '240px auto' 
            }}
          />

          {/* Layer 1: Parallax Japanese Botanical Pattern Background */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.22] bg-repeat transition-transform duration-700 ease-out z-0"
            style={{ 
              backgroundImage: "url('/patterns/pattern-blue.jpg')", 
              backgroundSize: '340px auto',
              transform: `translate3d(${mousePos.x * 14}px, ${mousePos.y * 14}px, 0)`
            }}
          />

          {/* Layer 1b: Soft Frosted White / Cream Veil over pattern for high legibility */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#FAF8F5]/92 via-[#FAF8F5]/84 to-[#FAF8F5]/75 backdrop-blur-[1px] z-0" />

          {/* Layer 2: Oversized Artistic Kenwell Bottle in Background with Parallax */}
          <div 
            className="absolute right-[-4%] lg:right-[4%] top-1/2 pointer-events-none select-none z-0 transition-transform duration-500 ease-out"
            style={{
              transform: `translate3d(${mousePos.x * 24}px, calc(-50% + ${mousePos.y * 18}px), 0) rotate(${12 + mousePos.x * 3}deg)`
            }}
          >
            <img 
              src={`/bottle_${selectedSlug}.png`} 
              alt="" 
              className="w-[340px] sm:w-[500px] lg:w-[650px] h-auto object-contain opacity-[0.38] filter drop-shadow-2xl mix-blend-multiply scale-110 lg:scale-130 transition-opacity duration-500"
            />
          </div>

          {/* Layer 3: Ambient Radial Glow with Parallax */}
          <div 
            className="absolute -right-10 top-1/2 w-[650px] h-[650px] rounded-full blur-3xl opacity-45 pointer-events-none transition-transform duration-700 ease-out z-0"
            style={{
              background: `radial-gradient(circle, ${activeSpotlight.accent}35 0%, #D47A3B20 45%, transparent 70%)`,
              transform: `translate3d(${mousePos.x * 36}px, calc(-50% + ${mousePos.y * 24}px), 0)`
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

              {/* ── Left Column: Editorial Store Brand Intro & Glass Stats ── */}
              <div className="lg:col-span-7 space-y-6 text-left">
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-playfair text-[#1C355E] leading-[1.12] tracking-tight">
                  Formulated for Vitality.<br />
                  <span className="text-[#1C355E]">Rooted in </span>
                  <span className="italic font-light text-[#D47A3B]">Purity &amp; Science.</span>
                </h1>

                {/* Subtitle description */}
                <p className="text-[#1C355E]/80 text-sm sm:text-lg leading-relaxed max-w-xl font-light">
                  Clinical-strength nutraceuticals formulated with bioactive, high-absorption ingredients. 
                  Zero synthetic fillers, zero proprietary blends—verified by third-party testing with scannable batch reports.
                </p>

                {/* CTA Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentSection('shop')}
                    className="bg-[#1C355E] hover:bg-[#D47A3B] text-white px-7 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer flex items-center gap-2"
                  >
                    <span>Shop All Products</span>
                    <span>→</span>
                  </button>
                  <button
                    onClick={() => setCurrentSection('quiz')}
                    className="border-2 border-[#1C355E]/25 hover:border-[#1C355E] text-[#1C355E] glass-pill px-6 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    Take 60s Health Quiz
                  </button>
                  <button
                    onClick={() => setCurrentSection('lab')}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#4A6B4A] hover:text-[#1C355E] px-3 py-2 transition-colors cursor-pointer"
                  >
                    <span>Scan Lab Report</span>
                    <span>↗</span>
                  </button>
                </div>

                {/* Frosted Glass Proof Points Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#E4DFD3]/80">
                  {[
                    { val: '23+', lbl: 'Formulations', col: 'text-[#1C355E]' },
                    { val: '100%', lbl: 'Open Label', col: 'text-[#4A6B4A]' },
                    { val: '4.8★', lbl: '10,000+ Reviews', col: 'text-[#D47A3B]' },
                    { val: 'GMP', lbl: 'Lab Verified', col: 'text-[#1C355E]' },
                  ].map((st, i) => (
                    <div 
                      key={i} 
                      className="glass-pill rounded-2xl p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left"
                    >
                      <span className={`block font-playfair text-xl sm:text-2xl font-bold ${st.col}`}>{st.val}</span>
                      <span className="text-[10px] text-[#1C355E]/60 uppercase tracking-wider font-mono">{st.lbl}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* ── Right Column: Interactive Parallax 3D Glass Card Showcase ── */}
              <div className="lg:col-span-5 flex flex-col items-center">
                
                {/* Product Pill Switcher Tabs in Frosted Glass */}
                <div className="w-full flex items-center justify-start lg:justify-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4">
                  {SPOTLIGHT_PRODUCTS.map((s) => {
                    const isSelected = s.slug === selectedSlug
                    return (
                      <button
                        key={s.slug}
                        onClick={() => handleSelectProduct(s.slug)}
                        className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-wider whitespace-nowrap transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#1C355E] text-white border border-[#1C355E] shadow-md font-bold'
                            : 'glass-pill text-[#1C355E]/75 hover:text-[#1C355E]'
                        }`}
                      >
                        {s.name.split(' ')[0]}
                      </button>
                    )
                  })}
                </div>

                {/* 3D Parallax Glass Card Wrapper */}
                <div 
                  className="relative w-full max-w-md transition-transform duration-300 ease-out"
                  style={{
                    transform: `perspective(1000px) rotateX(${-mousePos.y * 5}deg) rotateY(${mousePos.x * 5}deg) translate3d(${mousePos.x * -14}px, ${mousePos.y * -14}px, 0)`
                  }}
                >
                  {/* Main Frosted Glass Showcase Card */}
                  <div className="glass-card-hero rounded-3xl p-5 sm:p-7 relative overflow-hidden flex flex-col items-center">
                    
                    {/* Glowing color accent strip */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1.5 shadow-sm"
                      style={{ backgroundColor: activeSpotlight.accent }}
                    />

                    {/* Authentic Genuine Kenwell Bottle Image with Parallax Shift */}
                    <div className="relative w-full h-[280px] sm:h-[320px] flex items-center justify-center my-1 z-10">
                      {/* Bottle Glass Ground Shadow */}
                      <div className="absolute bottom-3 w-40 h-5 bg-[#1C355E]/10 rounded-full blur-md" />
                      
                      <img 
                        src={`/bottle_${selectedSlug}.png`} 
                        alt={activeSpotlight.name}
                        onError={(e) => {
                          e.currentTarget.src = getLocalSrc({ slug: selectedSlug })
                        }}
                        className={`h-full w-auto max-w-full object-contain drop-shadow-2xl transition-all duration-300 ${
                          imgFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        }`}
                      />
                    </div>

                    {/* Product Details Panel */}
                    <div className="w-full text-center mt-2 pt-3 border-t border-[#E4DFD3]/70 z-10">
                      <span className="text-[10px] font-mono text-[#D47A3B] uppercase tracking-wider font-semibold block mb-0.5">
                        {activeSpotlight.tag} · {activeSpotlight.metric}
                      </span>
                      <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#1C355E] leading-tight">
                        {activeSpotlight.name}
                      </h3>
                      <p className="text-[#1C355E]/60 text-xs mt-1">
                        {activeSpotlight.subtitle}
                      </p>

                      {/* Price & Action Row */}
                      <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-[#E4DFD3]/50">
                        <div className="text-left">
                          <span className="text-[10px] text-[#1C355E]/50 uppercase font-mono block">Price</span>
                          <span className="font-playfair text-xl font-bold text-[#1C355E]">
                            ₹{activeProduct?.price || 899}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {onQuickView && activeProduct && (
                            <button
                              onClick={() => onQuickView(activeProduct)}
                              className="px-3.5 py-2 rounded-full glass-pill hover:bg-white text-[#1C355E] text-[11px] font-mono uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              Quick View
                            </button>
                          )}
                          {onAddToCart && activeProduct && (
                            <button
                              onClick={() => onAddToCart(activeProduct)}
                              className="bg-[#D47A3B] hover:bg-[#1C355E] text-white px-4 py-2 rounded-full text-[11px] font-mono uppercase tracking-wider font-semibold transition-colors shadow-sm hover:shadow-md cursor-pointer flex items-center gap-1.5"
                            >
                              <span>Add</span>
                              <span>+</span>
                            </button>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

      {/* ══════════════════════════════════════════════
          2. MARQUEE TRUST STRIP
      ══════════════════════════════════════════════ */}
      <div className="bg-[#1C355E] overflow-hidden py-3 flex shrink-0">
        <div className="flex animate-marquee whitespace-nowrap w-max hover:[animation-play-state:paused]">
          {[...Array(2)].map((_, groupIndex) => (
            <div key={groupIndex} className="flex items-center px-3 md:px-5">
              {['23 Premium Health Products', 'Top Quality Made', '100% Transparent Labels', '4.8★ Average Rating', 'Free Shipping ₹999+', 'No Artificial Fillers', 'Proper Health Doses'].map((item, i) => (
                <span key={i} className="flex items-center gap-6 md:gap-10 px-3 md:px-5 text-[11px] font-mono uppercase tracking-wider text-white/90 whitespace-nowrap">
                  {item}
                  <span className="w-1 h-1 rounded-full bg-[#D47A3B]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      </div> {/* End Hero + Marquee Wrapper */}

      {/* ══════════════════════════════════════════════
          3. SHOP BY CATEGORY GRID
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-[#4A6B4A] font-mono uppercase tracking-wider text-[11px] font-semibold block mb-1">Find Your Goal</span>
            <h2 className="text-3xl md:text-4xl font-playfair text-[#1C355E]">Shop by Category</h2>
          </div>
          <button onClick={() => setCurrentSection('shop')} className="hidden sm:block text-xs font-semibold text-[#1C355E] hover:text-[#4A6B4A] border border-[#1C355E]/20 hover:border-[#4A6B4A]/50 px-5 py-2 rounded-full transition-all cursor-pointer uppercase tracking-wider">
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
              <span className="text-[10px] text-[#1C355E]/50 font-mono">{cat.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. BESTSELLERS SHELF (Carousel)
      ══════════════════════════════════════════════ */}
      <section className="py-12 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-[#4A6B4A] font-mono uppercase tracking-wider text-[11px] font-semibold block mb-1">Customer Favorites</span>
              <h2 className="text-3xl md:text-4xl font-playfair text-[#1C355E]">Bestsellers</h2>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <button onClick={() => scrollCarousel('left')} className="p-2 rounded-full border border-[#1C355E]/20 hover:bg-white text-[#1C355E] transition-all cursor-pointer">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button onClick={() => scrollCarousel('right')} className="p-2 rounded-full border border-[#1C355E]/20 hover:bg-white text-[#1C355E] transition-all cursor-pointer">
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
            <button onClick={() => scrollCarousel('left')} className="p-2 rounded-full border border-[#1C355E]/20 text-[#1C355E] active:bg-[#1C355E]/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onClick={() => scrollCarousel('right')} className="p-2 rounded-full border border-[#1C355E]/20 text-[#1C355E] active:bg-[#1C355E]/10">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
          
          <div className="text-center mt-10">
            <button onClick={() => setCurrentSection('shop')} className="text-xs font-semibold text-[#1C355E] hover:text-[#4A6B4A] border border-[#1C355E]/20 hover:border-[#4A6B4A]/50 px-6 py-2.5 rounded-full uppercase tracking-wider cursor-pointer transition-all">
              View All Bestsellers →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. SHOP BY SERIES — 4-col feature cards
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#4A6B4A] font-mono uppercase tracking-wider text-[11px] font-semibold">Product Lines</span>
          <h2 className="text-3xl md:text-4xl font-playfair text-[#1C355E] mt-2">Shop by Series</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {[
            {
              series: 'Core Series',
              badge: 'Daily Basics',
              count: '7 products',
              desc: 'Everyday nutrients to keep you healthy — easy-to-absorb minerals, fish oil, and daily vitamins.',
              accent: 'border-[#4A6B4A]/30 bg-gradient-to-br from-[#4A6B4A]/5 to-[#4A6B4A]/12',
              btnColor: 'text-[#4A6B4A] border-[#4A6B4A]/30 hover:bg-[#4A6B4A] hover:text-white',
              dotColor: 'bg-[#4A6B4A]',
              pattern: "url('/patterns/pattern-green.jpg')",
            },
            {
              series: 'Wellness Series',
              badge: 'Targeted Health',
              count: '12 products',
              desc: 'Specific products for your joints, liver, gut, sleep, and keeping your hormones balanced.',
              accent: 'border-[#D47A3B]/30 bg-gradient-to-br from-[#D47A3B]/5 to-[#D47A3B]/12',
              btnColor: 'text-[#D47A3B] border-[#D47A3B]/30 hover:bg-[#D47A3B] hover:text-white',
              dotColor: 'bg-[#D47A3B]',
              pattern: "url('/patterns/pattern-rust.jpg')",
            },
            {
              series: 'Liposomal Series',
              badge: 'Healthy Aging',
              count: '4 products',
              desc: 'Products like NAD+ and Vitamin C made with special technology so your body absorbs them perfectly.',
              accent: 'border-[#1C355E]/30 bg-gradient-to-br from-[#1C355E]/5 to-[#1C355E]/12',
              btnColor: 'text-[#1C355E] border-[#1C355E]/30 hover:bg-[#1C355E] hover:text-white',
              dotColor: 'bg-[#1C355E]',
              pattern: "url('/patterns/pattern-blue.jpg')",
            },
            {
              series: 'Performance Series',
              badge: 'Fitness & Energy',
              count: '5 products',
              desc: 'Powerful formulas to help you work out harder, recover faster, and stay focused.',
              accent: 'border-[#1C355E]/20 bg-gradient-to-br from-[#1C355E]/5 to-[#1C355E]/10',
              btnColor: 'text-[#1C355E] border-[#1C355E]/30 hover:bg-[#1C355E] hover:text-white',
              dotColor: 'bg-[#1C355E]',
              pattern: "url('/patterns/pattern-blue.jpg')",
            },
          ].map((s) => (
            <div
              key={s.series}
              className={`group relative rounded-2xl border ${s.accent} p-4 sm:p-7 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col bg-white/80 overflow-hidden`}
              onClick={() => filterSeries(s.series)}
            >
              {/* Botanical Pattern Watermark */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300 bg-repeat"
                style={{ backgroundImage: s.pattern, backgroundSize: '240px auto' }}
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-0 mb-3 sm:mb-5">
                  <span className={`inline-flex items-center gap-1 sm:gap-1.5 text-[8px] sm:text-[10px] font-mono uppercase tracking-wider font-semibold`}>
                    <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${s.dotColor}`} />
                    {s.badge}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-[#1C355E]/40 font-mono">{s.count}</span>
                </div>
                <h3 className="font-playfair text-lg sm:text-2xl text-[#1C355E] mb-2 sm:mb-3 group-hover:text-inherit transition-colors">{s.series}</h3>
                <p className="text-[11px] sm:text-sm text-[#1C355E]/65 leading-relaxed flex-grow">{s.desc}</p>
                <button className={`mt-4 sm:mt-6 w-full border rounded-full py-2 sm:py-2.5 text-[9px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${s.btnColor}`}>
                  Explore <span className="hidden sm:inline">{s.series} </span>→
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. INTERACTIVE STACK BUILDER & QUIZ PROMO
      ══════════════════════════════════════════════ */}
      <section className="py-20 bg-[#1C355E] relative overflow-hidden">
        {/* Botanical pattern backdrop */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 bg-repeat"
          style={{ backgroundImage: "url('/patterns/pattern-blue.jpg')", backgroundSize: '360px auto' }}
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#1C355E]/60 via-transparent to-[#1C355E]/80" />

        {/* Large decorative BG text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-playfair text-[18vw] font-bold text-white/[0.03] leading-none">QUIZ</span>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <span className="text-[#D47A3B] font-mono uppercase tracking-widest text-xs font-bold mb-4 block">
            Don't Know What To Buy?
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl mb-5 leading-tight">
            Take the 60-Second Quiz<br />
            <span className="italic font-light text-[#E4DFD3]">&amp; Find Exactly What You Need</span>
          </h2>
          <p className="text-white/85 text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Answer 3 quick questions about your daily routine. We’ll analyze your goals and build the exact right supplement plan made just for your body.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentSection('quiz')}
              className="bg-[#D47A3B] hover:bg-[#4A6B4A] text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-bold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
            >
              Take the Quiz →
            </button>
            <button
              onClick={() => setCurrentSection('builder')}
              className="border-2 border-white/40 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-full text-sm uppercase tracking-widest font-semibold transition-all cursor-pointer"
            >
              Custom Stack Builder
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. TRUST / WHY KENWELL — 4 icon cards
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-[#4A6B4A] font-mono uppercase tracking-wider text-[11px] font-semibold">The Kenwell Standard</span>
          <h2 className="text-3xl md:text-4xl font-playfair text-[#1C355E] mt-2">Why We're Different</h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {TRUST_POINTS.map((t) => (
            <div key={t.title} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E4DFD3] p-4 sm:p-6 hover:shadow-lg hover:border-[#4A6B4A]/40 transition-all duration-300 text-left">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#4A6B4A]/10 border border-[#4A6B4A]/20 flex items-center justify-center mb-3 sm:mb-4">
                <div className="scale-75 sm:scale-100">{t.icon}</div>
              </div>
              <h3 className="font-playfair text-sm sm:text-lg font-bold text-[#1C355E] mb-1.5 sm:mb-2">{t.title}</h3>
              <p className="text-[10px] sm:text-sm text-[#1C355E]/65 leading-relaxed">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. REVIEWS — Customer Testimonials
      ══════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-t border-[#EAEAEA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#4A6B4A] font-mono uppercase tracking-wider text-[11px] font-semibold">Verified Reviews</span>
            <h2 className="text-3xl md:text-4xl font-playfair text-[#1C355E] mt-2">What Customers Say</h2>
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
              ].map((r, i) => (
                <div key={i} className="w-[300px] sm:w-[380px] flex-shrink-0 bg-white/85 backdrop-blur-sm rounded-2xl border border-[#E4DFD3] p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow mr-4 sm:mr-5 whitespace-normal">
                  <div className="space-y-3">
                    <Stars n={r.stars} />
                    <h4 className="font-playfair text-lg font-bold text-[#1C355E]">{r.quote}</h4>
                    <p className="text-sm text-[#1C355E]/70 leading-relaxed">{r.body}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-[#E4DFD3] flex items-end justify-between">
                    <div>
                      <span className="block text-sm font-bold text-[#1C355E]">{r.name}</span>
                      <span className="text-[10px] text-[#1C355E]/50">{r.role}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-[#1C355E]/40 uppercase tracking-wider block">Using</span>
                      <span className="text-[10px] font-semibold text-[#4A6B4A]">{r.product}</span>
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
      <section className="py-20 px-4 text-center bg-white border-t border-[#EAEAEA]">
        <span className="text-[#4A6B4A] font-mono uppercase tracking-wider text-[11px] font-semibold">The Full Collection</span>
        <h2 className="text-3xl md:text-4xl font-playfair text-[#1C355E] mt-3 mb-4">
          23 Premium Health Products
        </h2>
        <p className="text-[#1C355E]/60 text-sm max-w-md mx-auto mb-8 leading-relaxed">
          Transparent labels · Proper doses · Easy to absorb · No artificial junk
        </p>
        <button
          onClick={() => setCurrentSection('shop')}
          className="bg-[#1C355E] hover:bg-[#D47A3B] text-white px-10 py-4 rounded-full text-sm uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
        >
          Browse the Full Shop →
        </button>
      </section>

    </div>
  )
}

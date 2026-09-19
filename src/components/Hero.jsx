import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
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
    name: 'KSM 66® Ashwagandha',
    subtitle: 'Full Spectrum Organic Root Extract',
    dose: '600mg Clinical Dose',
    metric: '27% Cortisol Drop',
    tag: 'Stress & Cortisol',
    accent: '#1C355E',
    badge: 'Core Series',
  },
  {
    slug: 'chelated-magnesium-glycinate',
    name: 'Chelated Magnesium Glycinate',
    subtitle: 'High Bioavailability Dipeptide Delivery',
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
    dose: 'Sub Cellular Fuel',
    metric: 'Sirtuin Activation',
    tag: 'Longevity & Focus',
    accent: '#1C355E',
    badge: 'Liposomal Series',
  },
  {
    slug: 'triple-strength-fish-oil',
    name: 'Triple Strength Fish Oil',
    subtitle: 'Pure Triglyceride Molecular Distillation',
    dose: 'Ultra Pure EPA & DHA',
    metric: '70% Higher Uptake',
    tag: 'Heart & Joint Vitality',
    accent: '#1C355E',
    badge: 'Core Series',
  },
  {
    slug: 'glutathione-reduced',
    name: 'Liposomal Glutathione',
    subtitle: 'Active Reduced L Glutathione Tripeptide',
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
    body: 'Every ingredient is used in the right amount to actually work. We don\'t hide tiny amounts in secret blends.',
    icon: <svg className={TRUST_SVG_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" /></svg>,
  },
  {
    title: 'No Junk Fillers',
    body: 'No talc, cheap chemicals, or fake colors. We show every single ingredient on the label so you know what you are taking.',
    icon: <svg className={TRUST_SVG_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
  },
  {
    title: 'Top Quality Made',
    body: 'Made in top quality facilities. Every single batch is tested for safety and purity before it reaches you.',
    icon: <svg className={TRUST_SVG_CLS} fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  },
  {
    title: 'Lab Verified',
    body: 'A third party lab checks every product. You can scan the QR code on your bottle to see the proof yourself.',
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
   COMPONENTS
═══════════════════════════════════════════════════════════════ */
function SeriesCard({ s, filterSeries }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])

  return (
    <div
      ref={ref}
      className={`group relative rounded-2xl border ${s.borderColor} p-6 sm:p-8 hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col justify-center items-center text-center ${s.bgColor} overflow-hidden min-h-[180px] sm:min-h-[220px]`}
      onClick={() => filterSeries(s.series)}
    >
      {/* Botanical Packaging Print Backdrop */}
      <motion.div 
        className="absolute -inset-[50%] pointer-events-none opacity-40 bg-repeat"
        style={{ backgroundImage: s.pattern, backgroundSize: '360px auto', y }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center gap-3 w-full">
        <h3 className="font-playfair text-2xl sm:text-3xl text-white font-semibold transition-colors drop-shadow-md">
          {s.series}
        </h3>
        <p className="text-[11px] sm:text-xs text-white/80 leading-relaxed font-light mb-2 max-w-[200px] sm:max-w-[240px]">
          {s.desc}
        </p>
        <button className={`px-8 border rounded-full py-2.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${s.btnStyle}`}>
          Explore <span className="hidden sm:inline">{s.series} </span>→
        </button>
      </div>
    </div>
  )
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
  const { products, stacks } = useProducts()
  const [selectedSlug, setSelectedSlug] = useState('ksm-66-ashwagandha')
  const [imgFading, setImgFading] = useState(false)
  const heroRef = useRef(null)
  const carouselRef = useRef(null)
  const quizRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '30%'])

  const { scrollYProgress: quizScroll } = useScroll({ target: quizRef, offset: ["start end", "end start"] })
  const quizY = useTransform(quizScroll, [0, 1], ['-20%', '20%'])

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

  const handleAddStackToCart = (stack) => {
    const stackProducts = stack.productIds.map(id => products.find(p => p.id === id)).filter(Boolean)
    stackProducts.forEach((prod) => {
      const itemPrice = stack.discountedItems ? stack.discountedItems[prod.id] || prod.price : Math.round(prod.price * 0.85)
      onAddToCart?.({
        ...prod,
        price: itemPrice,
        name: prod.name
      })
    })
    window.dispatchEvent(new Event('kenwell:openCart'))
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
        <section ref={heroRef} className="relative w-full h-screen min-h-[600px] flex items-center overflow-hidden">
          {/* Background Image */}
          <motion.div 
            className="absolute -inset-[10%] bg-cover bg-[position:80%_center] md:bg-right bg-no-repeat transition-transform duration-[20s] ease-out hover:scale-105"
            style={{ 
              backgroundImage: "url('/hero_bg_new.jpg')",
              y: heroY
            }}
          />
          {/* Subtle overlay to ensure text legibility */}
          <div className="absolute inset-0 bg-[#FAF8F5]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5]/40 to-transparent" />

          {/* Content Container */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.2 }}
            className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col items-center text-center"
          >
            <div className="max-w-2xl space-y-6 mt-10 md:mt-0">
              
              {/* Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-7xl font-serif text-[#1C355E] leading-[1.05] tracking-tight"
              >
                Feel Good.<br />
                <span className="italic font-light text-[#4A6B4A]">Live Well.</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-[#1C355E]/90 text-[15px] sm:text-xl leading-relaxed font-body font-light mx-auto max-w-lg"
              >
                Clinical strength nutraceuticals rooted in purity and science. 
                Experience wellness without compromises.
              </motion.p>

              {/* CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10 sm:pt-12"
              >
                <button
                  onClick={() => setCurrentSection('shop')}
                  className="bg-[#1C355E] hover:bg-[#4A6B4A] text-white px-8 py-4 text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm hover:shadow-md"
                >
                  <span>Explore Collection</span>
                  <span>→</span>
                </button>
                <button
                  onClick={() => setCurrentSection('quiz')}
                  className="border border-[#1C355E]/20 hover:border-[#1C355E]/40 bg-white/60 hover:bg-white/80 backdrop-blur-md text-[#1C355E] px-8 py-4 text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer w-full sm:w-auto"
                >
                  Take the Wellness Quiz
                </button>
              </motion.div>

            </div>
          </motion.div>
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <span className="text-[#4A6B4A] font-mono uppercase tracking-wider text-[11px] font-semibold block mb-2">Find Your Goal</span>
          <h2 className="text-3xl md:text-4xl font-playfair text-[#1C355E]">Shop by Category</h2>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.label}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 15 } }
              }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => filterGoal(cat.goal)}
              className={`group flex flex-col items-center gap-3 p-5 rounded-2xl border ${cat.color} transition-colors duration-300 hover:shadow-md cursor-pointer text-center`}
            >
              <span className={cat.text}>{cat.icon}</span>
              <span className={`font-semibold text-sm ${cat.text}`}>{cat.label}</span>
              <span className="text-[10px] text-[#1C355E]/50 font-mono">{cat.desc}</span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mt-10"
        >
          <button onClick={() => setCurrentSection('shop')} className="text-xs font-semibold text-[#1C355E] hover:text-[#4A6B4A] border border-[#1C355E]/20 hover:border-[#4A6B4A]/50 px-6 py-2 rounded-sm transition-all cursor-pointer uppercase tracking-wider shadow-sm hover:shadow-md">
            All Products →
          </button>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════
          QUIZ PROMO
      ══════════════════════════════════════════════ */}
      <section ref={quizRef} className="py-20 bg-[#1C355E] relative overflow-hidden">
        {/* Botanical pattern backdrop */}
        <motion.div 
          className="absolute -inset-[50%] pointer-events-none opacity-40 bg-repeat"
          style={{ backgroundImage: "url('/patterns/pattern-blue.jpg')", backgroundSize: '360px auto', y: quizY }}
        />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#1C355E]/40 via-transparent to-[#1C355E]/60" />

        {/* Large decorative BG text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-playfair text-[18vw] font-bold text-white/[0.03] leading-none">QUIZ</span>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white mt-8">
          <span className="text-[#D47A3B] font-mono uppercase tracking-widest text-xs font-bold mb-4 block">
            Don't Know What To Buy?
          </span>
          <h2 className="font-playfair text-4xl sm:text-5xl mb-5 leading-tight">
            Take the 60 Second Quiz<br />
            <span className="italic font-light text-[#E4DFD3]">&amp; Find Exactly What You Need</span>
          </h2>
          <p className="text-white/85 text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Answer 3 quick questions about your daily routine. We’ll analyze your goals and build the exact right supplement plan made just for your body.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentSection('quiz')}
              className="bg-[#D47A3B] hover:bg-[#4A6B4A] text-white px-8 py-4 rounded-sm text-sm uppercase tracking-widest font-bold transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              Take the Quiz →
            </button>
            <button
              onClick={() => setCurrentSection('builder')}
              className="border border-white/40 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-sm text-sm uppercase tracking-widest font-semibold transition-all cursor-pointer"
            >
              Custom Stack Builder
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. BESTSELLERS SHELF (Carousel)
      ══════════════════════════════════════════════ */}
      <section className="py-12 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <span className="text-[#4A6B4A] font-mono uppercase tracking-wider text-[11px] font-semibold block mb-1">Customer Favorites</span>
            <h2 className="text-3xl md:text-4xl font-playfair text-[#1C355E]">Bestsellers</h2>
          </motion.div>

          {/* Infinite Swipe Carousel */}
          <div className="relative -mx-4 sm:mx-0 pb-4 mt-8">
            {/* Fade edges for smooth disappearing effect */}
            <div className="absolute top-0 left-0 w-4 sm:w-8 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute top-0 right-0 w-4 sm:w-8 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 sm:px-0">
              {[0, 1, 2, 3].map(setNum => (
                <React.Fragment key={`set-${setNum}`}>
                  {bestsellers.map(p => (
                    <div 
                      key={`set${setNum}-${p.id}`}
                      className="w-[240px] sm:w-[260px] lg:w-[280px] flex-shrink-0 snap-center"
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
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="text-center mt-10">
            <button onClick={() => setCurrentSection('shop')} className="text-xs font-semibold text-[#1C355E] hover:text-[#4A6B4A] border border-[#1C355E]/20 hover:border-[#4A6B4A]/50 px-6 py-2.5 rounded-full uppercase tracking-wider cursor-pointer transition-all">
              View All Bestsellers →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. SHOP BY SERIES — 4 column feature cards
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
              desc: 'Daily essentials for foundational health.',
              bgColor: 'bg-[#4A6B4A]',
              borderColor: 'border-[#4A6B4A] hover:border-white/50 hover:shadow-[0_12px_32px_rgba(74,107,74,0.35)]',
              btnStyle: 'border-white/30 text-white bg-black/10 hover:bg-white hover:text-[#4A6B4A]',
              pattern: "url('/patterns/pattern-blue.jpg')",
            },
            {
              series: 'Wellness Series',
              desc: 'Targeted support for holistic balance.',
              bgColor: 'bg-[#D47A3B]',
              borderColor: 'border-[#D47A3B] hover:border-white/50 hover:shadow-[0_12px_32px_rgba(212,122,59,0.35)]',
              btnStyle: 'border-white/30 text-white bg-black/10 hover:bg-white hover:text-[#D47A3B]',
              pattern: "url('/patterns/pattern-blue.jpg')",
            },
            {
              series: 'Liposomal Series',
              desc: 'High-absorption cellular nutrients.',
              bgColor: 'bg-[#1C355E]',
              borderColor: 'border-[#1C355E] hover:border-white/50 hover:shadow-[0_12px_32px_rgba(28,53,94,0.35)]',
              btnStyle: 'border-white/30 text-white bg-black/10 hover:bg-white hover:text-[#1C355E]',
              pattern: "url('/patterns/pattern-blue.jpg')",
            },
            {
              series: 'Performance Series',
              desc: 'Potent formulas for peak performance.',
              bgColor: 'bg-[#131E2B]',
              borderColor: 'border-[#131E2B] hover:border-white/50 hover:shadow-[0_12px_32px_rgba(19,30,43,0.35)]',
              btnStyle: 'border-white/30 text-white bg-black/10 hover:bg-white hover:text-[#131E2B]',
              pattern: "url('/patterns/pattern-blue.jpg')",
            },
          ].map((s) => (
            <SeriesCard key={s.series} s={s} filterSeries={filterSeries} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. CURATED STACKS SECTION (BIG PHOTOS & CLEAN STAGING)
      ══════════════════════════════════════════════ */}
      <section className="py-20 border-t border-[#EAEAEA] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="text-[#4A6B4A] font-mono uppercase tracking-widest text-[11px] font-semibold block mb-2">Curated Combinations</span>
            <h2 className="text-3xl md:text-4xl font-playfair text-[#1C355E] leading-tight">Ready Made Stacks</h2>
            <p className="text-[#1C355E]/60 text-sm sm:text-base mt-2 max-w-lg mx-auto leading-relaxed">
              Expertly formulated combos to buy together and save compared to buying individually.
            </p>
          </motion.div>

          {/* Infinite Swipe Carousel for Stacks */}
          {stacks.length > 0 ? (
            <div className="relative -mx-4 sm:mx-0 pb-4 mt-8">
              {/* Fade edges for smooth disappearing effect */}
              <div className="absolute top-0 left-0 w-4 sm:w-8 h-full bg-gradient-to-r from-[#FAF8F5] to-transparent z-10 pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-4 sm:w-8 h-full bg-gradient-to-l from-[#FAF8F5] to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4 sm:px-0">
                {[0, 1, 2, 3].map(setNum => (
                  <React.Fragment key={`set-${setNum}`}>
                    {stacks.slice(0, 4).map((stack) => {
                      const stackProducts = stack.productIds
                        .map(id => products.find(p => p.id === id))
                        .filter(Boolean)
                      const savings = stack.originalPrice - stack.comboPrice
                      const savingsPct = stack.originalPrice > 0
                        ? Math.round((savings / stack.originalPrice) * 100)
                        : 0

                      return (
                        <div
                          key={`set${setNum}-${stack.id}`}
                          className="w-[280px] sm:w-[320px] lg:w-[360px] flex-shrink-0 snap-center group bg-white border border-[#E4DFD3] rounded-3xl overflow-hidden hover:border-[#1C355E]/30 hover:shadow-xl transition-all duration-300 flex flex-col"
                        >
                    {/* Big Showcase Image Area */}
                    <div className="relative w-full h-48 sm:h-56 bg-white border-b border-[#EAE5DC] flex overflow-hidden">
                      {/* Badges Overlay */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                        {stack.badge ? (
                          <span className="bg-white/90 backdrop-blur-md text-[#4A6B4A] border border-[#4A6B4A]/25 text-[10px] font-mono uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-sm">
                            {stack.badge.replace(/[—–]/g, ' ').replace(/-/g, ' ')}
                          </span>
                        ) : (
                          <span className="bg-white/90 backdrop-blur-md text-[#1C355E]/70 border border-[#E4DFD3] text-[10px] font-mono uppercase tracking-widest font-bold px-3 py-1 rounded-full shadow-sm">
                            {stackProducts.length} Products Combo
                          </span>
                        )}
                        {savingsPct > 0 && (
                          <span className="bg-[#D47A3B] text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                            Save {savingsPct}%
                          </span>
                        )}
                      </div>

                      {/* Staged Large Bottle Display */}
                      <div className="relative flex w-full h-full z-10">
                        {stackProducts.map((p, idx) => (
                          <div
                            key={p.id}
                            className="relative flex-1 h-full overflow-hidden cursor-pointer"
                            onClick={() => onQuickView?.(p)}
                            title={p.name.replace(/-/g, ' ')}
                          >
                            <img
                              src={p.image}
                              alt={p.name.replace(/-/g, ' ')}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                            {/* Inner border to separate side-by-side images if there are multiple */}
                            {idx > 0 && <div className="absolute inset-y-0 left-0 w-px bg-white/50 z-10" />}
                          </div>
                        ))}
                      </div>

                      {/* Floating Product Count Pill */}
                      <div className="absolute bottom-3 bg-white/90 backdrop-blur-sm border border-[#E4DFD3] px-3.5 py-1 rounded-full shadow-sm text-[10px] font-mono text-[#1C355E]/70 z-20">
                        Includes {stackProducts.map(p => p.name.split(' ')[0].replace(/-/g, ' ')).join(' + ')}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 sm:p-7 flex flex-col flex-grow justify-between gap-5">
                      <div className="space-y-2">
                        <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#1C355E] leading-snug">
                          {stack.name.replace(/[—–]/g, ' ').replace(/-/g, ' ')}
                        </h3>
                        {stack.tagline && (
                          <p className="text-xs sm:text-sm text-[#1C355E]/65 leading-relaxed">
                            {stack.tagline.replace(/[—–]/g, ' ').replace(/-/g, ' ')}
                          </p>
                        )}
                      </div>

                      {/* Focus Pills */}
                      {stack.focus?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {stack.focus.slice(0, 3).map(f => (
                            <span key={f} className="text-[11px] bg-[#FAF8F5] border border-[#E4DFD3] text-[#1C355E]/70 px-3 py-1 rounded-full font-medium">
                              {f.replace(/[—–]/g, ' ').replace(/-/g, ' ')}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Pricing Bar */}
                      <div className="flex items-center justify-between pt-4 border-t border-[#F0ECE5] mt-auto">
                        <div className="flex items-baseline gap-3">
                          <span className="text-2xl sm:text-3xl font-playfair font-bold text-[#1C355E]">
                            ₹{stack.comboPrice.toLocaleString('en-IN')}
                          </span>
                          {savings > 0 && (
                            <span className="text-sm text-[#1C355E]/40 line-through">
                              ₹{stack.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        {savings > 0 && (
                          <span className="text-xs sm:text-sm text-[#4A6B4A] font-bold bg-[#4A6B4A]/10 px-3 py-1 rounded-full">
                            You save ₹{savings.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* CTA Buttons */}
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <button
                          onClick={() => handleAddStackToCart(stack)}
                          className="w-full bg-[#1C355E] hover:bg-[#D47A3B] text-white py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center gap-1.5"
                        >
                          <span>Add to Cart</span>
                        </button>
                        <button
                          onClick={() => setCurrentSection('builder')}
                          className="w-full border border-[#1C355E]/20 hover:border-[#1C355E]/50 hover:bg-[#1C355E]/5 text-[#1C355E] py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                        >
                          View Stack
                        </button>
                      </div>
                    </div>
                  </div>
                        )
                      })}
                  </React.Fragment>
                ))}
              </div>
            </div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-[#E4DFD3] rounded-3xl p-6 h-80 animate-pulse" />
              ))}
            </div>
          )}

          {/* Bottom Action Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <button
              onClick={() => setCurrentSection('builder')}
              className="w-full sm:w-auto bg-[#1C355E] hover:bg-[#D47A3B] text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg text-center"
            >
              Build Your Own Stack →
            </button>
            <button
              onClick={() => setCurrentSection('quiz')}
              className="w-full sm:w-auto border border-[#1C355E]/20 hover:border-[#1C355E]/40 text-[#1C355E] px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer bg-white/60 hover:bg-white text-center"
            >
              Take the Wellness Quiz →
            </button>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. TRUST / WHY KENWELL — 4 icon cards
      ══════════════════════════════════════════════ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <span className="text-[#4A6B4A] font-mono uppercase tracking-wider text-[11px] font-semibold">The Kenwell Standard</span>
          <h2 className="text-3xl md:text-4xl font-playfair text-[#1C355E] mt-2">Why We're Different</h2>
        </motion.div>

        <motion.div 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: "-50px" }} 
          transition={{ staggerChildren: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
        >
          {TRUST_POINTS.map((t) => (
            <motion.div 
              key={t.title}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-[#E4DFD3] p-4 sm:p-6 hover:shadow-lg hover:border-[#4A6B4A]/40 transition-all duration-300 text-left"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#4A6B4A]/10 border border-[#4A6B4A]/20 flex items-center justify-center mb-3 sm:mb-4">
                <div className="scale-75 sm:scale-100">{t.icon}</div>
              </div>
              <h3 className="font-playfair text-sm sm:text-lg font-bold text-[#1C355E] mb-1.5 sm:mb-2">{t.title}</h3>
              <p className="text-[10px] sm:text-sm text-[#1C355E]/65 leading-relaxed">{t.body}</p>
            </motion.div>
          ))}
        </motion.div>
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
                { quote: '"Amazing recovery times"', body: 'Switched to the Chelated Magnesium and Ashwagandha stack. Sleep latency dropped from 45 min to under 15. Wake up without grogginess.', name: 'Rahul K.', role: 'CrossFit Athlete', product: 'Magnesium + Ashwagandha', stars: 5 },
                { quote: '"Legitimate open labels"', body: 'As a clinical nutritionist I examine every supplement closely. Kenwell is the first Indian brand I actively recommend, with verified purity assays and zero undisclosed fillers.', name: 'Dr. Priya M.', role: 'Clinical Nutritionist', product: 'Multivitamin with Probiotics', stars: 5 },
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
          9b. UGC JOURNEY REVIEWS
      ══════════════════════════════════════════════ */}
      <UGCSection />

      {/* ══════════════════════════════════════════════
          10. SCIENCE LIBRARY TEASER
      ══════════════════════════════════════════════ */}

      <section className="py-16 border-t border-[#EAEAEA] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#4A6B4A] font-mono uppercase tracking-widest text-[11px] font-semibold">The Kenwell Knowledge Hub</span>
            <h2 className="text-3xl md:text-4xl font-playfair text-[#1C355E] mt-2">Science Backed, Not Marketing Backed</h2>
          </div>
          {/* 3 article cards — text only, minimal */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            {[
              { topic: 'Absorption', title: 'Why Liposomal Delivery Changes Everything', time: '6 min read', product: '/bottle_glutathione-reduced.png' },
              { topic: 'Longevity', title: 'The NAD+ Decline & What It Means After 30', time: '7 min read', product: '/bottle_nad.png' },
              { topic: 'Stress', title: 'KSM 66 Ashwagandha: The Adaptogen With Real Clinical Evidence', time: '6 min read', product: '/bottle_ksm-66-ashwagandha.png' },
            ].map((a) => (
              <button
                key={a.title}
                onClick={() => setCurrentSection('library')}
                className="text-left group bg-[#FAF8F5] hover:bg-white border border-[#E4DFD3] hover:border-[#1C355E]/20 rounded-2xl p-5 transition-all duration-200 hover:shadow-md cursor-pointer flex gap-4 items-start"
              >
                <img src={a.product} alt="" className="w-12 h-16 object-contain flex-shrink-0 mt-1 drop-shadow" />
                <div>
                  <span className="text-[#4A6B4A] text-[10px] font-semibold uppercase tracking-wider block mb-1">{a.topic} · {a.time}</span>
                  <p className="text-[#1C355E] text-sm font-semibold leading-snug group-hover:text-[#D47A3B] transition-colors">{a.title}</p>
                </div>
              </button>
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={() => setCurrentSection('library')}
              className="border border-[#1C355E]/20 hover:border-[#1C355E]/50 text-[#1C355E] text-xs font-semibold uppercase tracking-widest px-8 py-3 rounded-full transition-all cursor-pointer"
            >
              Read All Articles →
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          11. STORE LOCATOR + PARTNER — two column info strip
      ══════════════════════════════════════════════ */}
      <section className="border-t border-[#EAEAEA] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#EAEAEA]">

            {/* Store Locator */}
            <div className="px-8 sm:px-12 lg:px-16 py-12 flex flex-col items-center justify-between gap-8 text-center">
              <div>
                <span className="text-[#4A6B4A] font-mono uppercase tracking-widest text-[11px] font-semibold block mb-3">Available Offline</span>
                <h3 className="text-2xl font-playfair text-[#1C355E] mb-3">Find Kenwell Near You</h3>
                <p className="text-[#1C355E]/55 text-sm leading-relaxed max-w-sm mx-auto">
                  Available at select pharmacies, wellness centres, and gyms across India.
                </p>
              </div>
              <div className="flex justify-center gap-8 text-center">
                {[['50+', 'Partner Stores'], ['12', 'Cities'], ['100%', 'Authentic Stock']].map(([num, label]) => (
                  <div key={label}>
                    <div className="text-xl font-playfair font-bold text-[#1C355E]">{num}</div>
                    <div className="text-[10px] uppercase tracking-wider text-[#1C355E]/45 font-semibold mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCurrentSection('stores')}
                className="border border-[#1C355E]/25 hover:bg-[#1C355E] hover:text-white text-[#1C355E] px-7 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer"
              >
                Find a Store →
              </button>
            </div>

            {/* Partner With Us */}
            <div className="px-8 sm:px-12 lg:px-16 py-12 flex flex-col items-center justify-between gap-8 text-center">
              <div>
                <span className="text-[#D47A3B] font-mono uppercase tracking-widest text-[11px] font-semibold block mb-3">B2B & Retail</span>
                <h3 className="text-2xl font-playfair text-[#1C355E] mb-3">Become a Kenwell Partner</h3>
                <p className="text-[#1C355E]/55 text-sm leading-relaxed max-w-sm mx-auto">
                  Pharmacy, gym, or health store? Stock Kenwell and offer customers India's most transparent supplement brand.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2">
                {['Competitive wholesale margins', 'Dedicated distributor support', 'QR verified authentic stock only'].map(b => (
                  <div key={b} className="flex items-center gap-2 text-[#1C355E]/65 text-xs">
                    <div className="w-1 h-1 rounded-full bg-[#4A6B4A] flex-shrink-0" />
                    {b}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setCurrentSection('partner')}
                className="bg-[#1C355E] hover:bg-[#D47A3B] text-white px-7 py-2.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 cursor-pointer"
              >
                Apply to Partner →
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          12. FINAL CTA BANNER
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



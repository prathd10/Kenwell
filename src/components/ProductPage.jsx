import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import { setPageMeta, buildProductJsonLd } from '../lib/seo'
import Navbar from './Navbar'
import Footer from './Footer'
import ProductCard from './ProductCard'
import VideoCard from './VideoCard'
import BackButton from './BackButton'

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { products, loading } = useProducts()
  const {
    cartItems, wishlistItems, addToCart, removeFromCart,
    updateCartQuantity, clearCart, toggleWishlist,
  } = useCart()
  const [videos, setVideos] = useState([])
  const [activeTab, setActiveTab] = useState('details')

  const product = products.find(p => p.slug === slug)

  // Scroll to top whenever the product page loads or slug changes & unlock scroll
  useEffect(() => {
    document.body.style.overflow = ''
    document.body.style.overflowY = 'auto'
    document.documentElement.style.overflow = ''
    document.documentElement.style.overflowY = 'auto'
    window.scrollTo(0, 0)
    return () => {
      document.body.style.overflow = ''
      document.body.style.overflowY = 'auto'
      document.documentElement.style.overflow = ''
      document.documentElement.style.overflowY = 'auto'
    }
  }, [slug])

  useEffect(() => {
    if (!product) return
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin
    const url = `${siteUrl}/products/${product.slug}`
    setPageMeta({
      title: `${product.name} — ${product.tagline} | Kenwell`,
      description: product.description || product.tagline,
      image: product.image,
      url,
      jsonLd: buildProductJsonLd(product, url),
    })
  }, [product])

  useEffect(() => {
    if (!product) return
    supabase
      .from('ugc_videos')
      .select('*')
      .eq('active', true)
      .eq('product_id', product.id)
      .order('sort_order', { ascending: true })
      .then(({ data }) => setVideos(data || []))
  }, [product])

  if (loading) return null

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar
          currentSection=""
          setCurrentSection={() => navigate('/')}
          stackCount={0}
          wishlistItems={wishlistItems}
          toggleWishlist={toggleWishlist}
          cartItems={cartItems}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          updateCartQuantity={updateCartQuantity}
          onSelectFilter={() => navigate('/')}
          onQuickView={(item) => navigate(`/products/${item.slug}`)}
          clearCart={clearCart}
        />
        <div className="flex-grow flex flex-col items-center justify-center py-24 text-center px-4">
          <h1 className="font-serif text-3xl text-primary-green mb-3">Product Not Found</h1>
          <p className="text-charcoal/60 text-sm mb-6">This product may have been discontinued or the link is incorrect.</p>
          <Link to="/" className="px-6 py-3 rounded-full bg-primary-green text-white text-xs font-semibold uppercase tracking-wider hover:bg-sage transition-colors">
            Back to Home
          </Link>
        </div>
        <Footer setCurrentSection={() => navigate('/')} />
      </div>
    )
  }

  const isInWishlist = wishlistItems.some(item => item.id === product.id)
  const mrp = Math.round(product.price * 1.25)

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.series === product.series || p.healthGoals?.some(g => product.healthGoals?.includes(g))))
    .slice(0, 4)

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'nutrition', label: 'Supplement Facts' },
    { id: 'science', label: 'The Science' },
  ]

  return (
    <div className="bg-white text-charcoal font-body antialiased min-h-screen flex flex-col">
      <Navbar
        currentSection=""
        setCurrentSection={() => navigate('/')}
        stackCount={0}
        wishlistItems={wishlistItems}
        toggleWishlist={toggleWishlist}
        cartItems={cartItems}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        updateCartQuantity={updateCartQuantity}
        onSelectFilter={() => navigate('/')}
        onQuickView={(item) => navigate(`/products/${item.slug}`)}
        clearCart={clearCart}
      />

      <main className="flex-grow">

        {/* ── Top Navigation & Breadcrumb ── */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BackButton />
            <nav className="flex items-center gap-2 text-xs text-charcoal/40">
              <Link to="/" className="hover:text-charcoal transition-colors">Home</Link>
              <span>/</span>
              <span className="text-charcoal/70">{product.name}</span>
            </nav>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            HERO SECTION — the most important block
        ══════════════════════════════════════════ */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">

            {/* Product Image — sticky only on desktop */}
            <div className="md:sticky md:top-24">
              <div
                className="relative overflow-hidden rounded-2xl flex items-center justify-center p-8 md:p-12 border border-[#E4DFD3] bg-[#FAF8F5]"
                style={{ background: `linear-gradient(145deg, #FAF8F5 0%, ${product.accentColor || '#616F3E'}15 100%)` }}
              >
                {/* Botanical Pattern Watermark */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.06] bg-repeat"
                  style={{ backgroundImage: "url('/patterns/pattern-green.jpg')", backgroundSize: '240px auto' }}
                />
                <img
                  src={product.image}
                  alt={product.name}
                  className="relative z-10 w-full max-h-[280px] md:max-h-[420px] object-contain drop-shadow-xl"
                  loading="eager"
                  decoding="async"
                />
              </div>
              {/* Trust badges under image */}
              <div className="mt-4 flex items-center justify-center gap-6 text-[10px] text-[#203348]/50 font-mono uppercase tracking-widest">
                <span>GMP Certified</span>
                <span>·</span>
                <span>ISO 9001</span>
                <span>·</span>
                <span>Open Label</span>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-6 text-left">

              {/* Series & Name */}
              <div>
                {product.series && (
                  <p className="text-xs font-mono uppercase tracking-widest text-[#616F3E] font-semibold mb-2">{product.series}</p>
                )}
                <h1 className="font-serif text-4xl font-bold text-[#203348] leading-tight">{product.name}</h1>
                {product.tagline && (
                  <p className="mt-2 text-base text-[#203348]/60 leading-snug">{product.tagline}</p>
                )}
              </div>

              {/* Health Goal Tags */}
              {product.healthGoals?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.healthGoals.map(goal => (
                    <span key={goal} className="text-[11px] font-medium px-3 py-1 rounded-full border border-[#E4DFD3] text-[#203348]/75 bg-[#F2EEE5]">
                      {goal}
                    </span>
                  ))}
                </div>
              )}

              {/* ── PRICE — most important ── */}
              <div className="border-t border-b border-[#E4DFD3] py-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-[#203348]/50 mb-1">Price</p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-3xl font-extrabold text-[#203348]">₹{product.price}</span>
                    <span className="font-mono text-sm text-[#203348]/40 line-through">₹{mrp}</span>
                    <span className="text-xs font-bold text-[#A5492B] bg-[#A5492B]/10 px-2.5 py-0.5 rounded-full">20% OFF</span>
                  </div>
                  {product.servings && (
                    <p className="text-xs text-[#203348]/50 mt-1">{product.servings} servings · ₹{Math.round(product.price / product.servings)} per serving</p>
                  )}
                </div>
                <div className="text-right text-xs text-[#203348]/50">
                  {product.form && <p className="font-mono uppercase tracking-wider">{product.form}</p>}
                </div>
              </div>

              {/* ── CTA BUTTONS — second most important ── */}
              <div className="flex gap-3">
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 py-4 rounded-xl text-sm font-semibold uppercase tracking-wider text-white transition-all cursor-pointer shadow-sm hover:shadow-md bg-[#203348] hover:bg-[#A5492B]"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    isInWishlist
                      ? 'border-[#A5492B] bg-[#A5492B]/10 text-[#A5492B]'
                      : 'border-[#E4DFD3] text-[#203348]/40 hover:border-[#203348]/40 hover:text-[#203348]'
                  }`}
                  title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <svg className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {/* ── KEY BENEFITS — third most important ── */}
              {product.benefits?.length > 0 && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-[#203348]/50 mb-3">Why it works</p>
                  <ul className="space-y-2.5">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[#203348]/80 leading-snug">
                        <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 bg-[#616F3E]">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <p className="text-sm text-[#203348]/60 leading-relaxed border-t border-[#E4DFD3] pt-5">
                  {product.description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            TABS — Details / Supplement Facts / Science
        ══════════════════════════════════════════ */}
        <section className="border-t border-[#E4DFD3] mt-2">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tab Bar — horizontally scrollable on mobile */}
            <div className="flex border-b border-[#E4DFD3] overflow-x-auto scrollbar-none">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer border-b-2 -mb-[1px] ${
                    activeTab === tab.id
                      ? 'border-[#203348] text-[#203348]'
                      : 'border-transparent text-[#203348]/40 hover:text-[#203348]/70'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="py-10 text-left">

              {/* ── DETAILS TAB ── */}
              {activeTab === 'details' && (
                <div className="max-w-3xl space-y-10">

                  {/* Dosage */}
                  {product.howToUse?.dosage && (
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#203348] mb-4">How to Take</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border border-[#E4DFD3] rounded-xl p-5 bg-[#FAF8F5]">
                          <p className="text-[10px] font-mono uppercase tracking-widest text-[#203348]/60 mb-2">Dosage</p>
                          <p className="text-sm font-semibold text-[#203348]">{product.howToUse.dosage}</p>
                        </div>
                        <div className="border border-[#E4DFD3] rounded-xl p-5 bg-[#FAF8F5]">
                          <p className="text-[10px] font-mono uppercase tracking-widest text-[#203348]/60 mb-2">Best Time to Take</p>
                          <p className="text-sm text-[#203348]/80 leading-relaxed">{product.howToUse.timing}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stacking */}
                  {product.howToUse?.stacking && (
                    <div className="border border-[#E4DFD3] rounded-xl p-5 bg-[#FAF8F5]">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#203348]/60 mb-2">Stack With</p>
                      <p className="text-sm text-[#203348]/80 leading-relaxed">{product.howToUse.stacking}</p>
                    </div>
                  )}

                  {/* Warning */}
                  {product.howToUse?.warnings && (
                    <div className="border border-[#A5492B]/40 rounded-xl p-5 bg-[#A5492B]/5">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#A5492B] font-bold mb-2">⚠ Caution</p>
                      <p className="text-sm text-[#203348]/80 leading-relaxed">{product.howToUse.warnings}</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── SUPPLEMENT FACTS TAB ── */}
              {activeTab === 'nutrition' && product.nutritionalFacts?.ingredients?.length > 0 && (
                <div className="max-w-sm">
                  {/* Official-style supplement facts panel */}
                  <div className="border-2 border-[#203348] p-4 bg-white text-[#203348] text-xs font-sans">
                    <h3 className="font-black text-2xl leading-tight border-b-[6px] border-[#203348] pb-1 mb-2">Supplement Facts</h3>
                    <div className="border-b border-[#203348] py-1.5 flex justify-between">
                      <span>Serving Size</span>
                      <span className="font-bold">{product.nutritionalFacts.servingSize}</span>
                    </div>
                    <div className="border-b-4 border-[#203348] py-1.5 flex justify-between">
                      <span>Servings Per Container</span>
                      <span className="font-bold">{product.nutritionalFacts.servingsPerContainer}</span>
                    </div>
                    <div className="flex justify-between font-bold border-b-2 border-[#203348] py-1 text-[10px]">
                      <span>{product.nutritionalFacts.headers?.[0]}</span>
                      <span>{product.nutritionalFacts.headers?.[1]}</span>
                    </div>
                    <div className="divide-y divide-[#203348]/20">
                      {product.nutritionalFacts.ingredients.map((ing, idx) => (
                        <div key={idx} className="flex justify-between py-1.5">
                          <span className={ing.name.startsWith('  ') ? 'pl-4 italic text-[#203348]/60' : 'font-semibold'}>
                            {ing.name}
                          </span>
                          <div className="flex gap-5 shrink-0">
                            <span>{ing.amount}</span>
                            <span className="font-bold w-10 text-right">{ing.dv}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t-4 border-[#203348] pt-2 mt-1 text-[9px] text-[#203348]/60 leading-relaxed">
                      * Percent Daily Values (RDA) are based on ICMR/RDA guidelines.<br />
                      ** Daily Value not established.
                    </div>
                  </div>
                </div>
              )}

              {/* ── SCIENCE TAB ── */}
              {activeTab === 'science' && product.scienceText && (
                <div className="max-w-3xl space-y-8">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#203348] mb-4">Clinical Mechanism</h3>
                    <div className="text-sm text-[#203348]/75 leading-relaxed whitespace-pre-wrap space-y-3">
                      {product.scienceText.split('Citations:')[0].trim()}
                    </div>
                  </div>

                  {product.scienceText.includes('Citations:') && (
                    <div className="border-t border-[#E4DFD3] pt-6">
                      <p className="text-[10px] font-mono uppercase tracking-widest text-[#203348]/50 mb-4">Scientific References</p>
                      <div className="space-y-3">
                        {product.scienceText.split('Citations:')[1].trim().split('\n').filter(l => l.trim()).map((citation, idx) => (
                          <div key={idx} className="flex items-start gap-3 text-xs text-[#203348]/60 leading-relaxed">
                            <span className="text-[#616F3E] font-bold shrink-0 mt-0.5">[{idx + 1}]</span>
                            <p>{citation.replace(/^\d+\.\s*/, '')}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </section>

        {/* ── Video Testimonials ── */}
        {videos.length > 0 && (
          <section className="py-14 bg-[#203348]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-white mb-6">Real Customer Videos</h2>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-stretch">
                {videos.map((video, i) => (
                  <VideoCard key={video.id} video={video} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-[#E4DFD3] py-14">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-[#203348] mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map(p => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onQuickView={() => navigate(`/products/${p.slug}`)}
                    onToggleWishlist={toggleWishlist}
                    isInWishlist={wishlistItems.some(item => item.id === p.id)}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

      </main>

      <Footer setCurrentSection={() => navigate('/')} />
    </div>
  )
}

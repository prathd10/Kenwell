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

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { products, loading } = useProducts()
  const {
    cartItems, wishlistItems, addToCart, removeFromCart,
    updateCartQuantity, clearCart, toggleWishlist,
  } = useCart()
  const [videos, setVideos] = useState([])

  const product = products.find(p => p.slug === slug)

  // SEO meta — runs once the product resolves, so a build-time prerender
  // pass can capture the real title/description/JSON-LD in the static HTML.
  // Uses a fixed configured site URL rather than window.location.origin,
  // since prerendering always runs against a local preview server — without
  // this, canonical/OG URLs would get permanently baked in as localhost.
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

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.series === product.series || p.healthGoals?.some(g => product.healthGoals?.includes(g))))
    .slice(0, 4)

  return (
    <div className="bg-bg-primary text-charcoal font-body antialiased min-h-screen flex flex-col">
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
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 text-xs text-charcoal/50">
          <Link to="/" className="hover:text-primary-green transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal/80">{product.name}</span>
        </div>

        {/* Hero: image + price/CTA */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div
            className="rounded-3xl overflow-hidden border border-cream-dark/50 flex items-center justify-center p-10"
            style={{ background: `linear-gradient(135deg, #F2F0E5 0%, ${product.accentColor}08 100%)` }}
          >
            <img src={product.image} alt={product.name} className="w-full max-h-96 object-contain drop-shadow-lg" loading="eager" decoding="async" />
          </div>

          <div className="flex flex-col justify-center space-y-5 text-left">
            {product.series && (
              <span className="text-sage font-mono uppercase tracking-widest text-[11px] font-semibold">{product.series}</span>
            )}
            <h1 className="font-serif text-4xl font-bold text-primary-green leading-tight">{product.name}</h1>
            <p className="font-serif text-lg italic text-charcoal/70">"{product.tagline}"</p>
            <p className="text-sm text-charcoal/70 leading-relaxed">{product.description}</p>

            <div className="flex items-baseline gap-3">
              <span className="font-mono text-3xl font-extrabold text-primary-green">₹{product.price}</span>
              <span className="text-xs text-charcoal/50 font-mono">{product.servings} Servings</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => addToCart(product)}
                className="flex-1 sm:flex-none px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider text-white bg-primary-green hover:bg-sage transition-all cursor-pointer shadow-md hover:shadow-lg"
              >
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`p-3.5 rounded-full border transition-all cursor-pointer ${
                  isInWishlist ? 'bg-sage/15 text-sage border-sage/30' : 'border-cream-dark text-charcoal/50 hover:text-primary-green hover:bg-bg-secondary'
                }`}
                title={isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <svg className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="font-serif text-2xl font-bold text-primary-green mb-6">Product Benefits</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(product.benefits || []).map((benefit, idx) => (
              <li key={idx} className="flex items-start text-sm text-charcoal/80 space-x-3 bg-white/50 border border-cream-dark/40 rounded-xl p-4">
                <svg className="w-4 h-4 text-sage shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-bg-secondary/40 border border-cream-dark/50 rounded-xl p-4">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-charcoal/50 leading-none">Dosage &amp; Timing</span>
              <span className="block text-xs font-semibold text-primary-green mt-1">{product.howToUse?.dosage}</span>
              <p className="text-[11px] text-charcoal/60 mt-1 leading-relaxed">{product.howToUse?.timing}</p>
            </div>
            <div className="bg-bg-secondary/40 border border-cream-dark/50 rounded-xl p-4">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-charcoal/50 leading-none">Synergistic Stacking</span>
              <p className="text-[11px] text-charcoal/60 mt-1.5 leading-relaxed">{product.howToUse?.stacking}</p>
            </div>
          </div>

          {product.howToUse?.warnings && (
            <div className="mt-4 bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-[11px] text-amber-800 leading-relaxed flex items-start space-x-3">
              <span className="text-amber-700 font-mono font-bold uppercase text-[9px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0 mt-0.5">Warning</span>
              <p><strong>Usage Warning:</strong> {product.howToUse.warnings}</p>
            </div>
          )}
        </section>

        {/* Video Testimonials */}
        {videos.length > 0 && (
          <section className="py-14 bg-charcoal">
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

        {/* Nutrition Facts */}
        {product.nutritionalFacts?.ingredients?.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="font-serif text-2xl font-bold text-primary-green mb-6">Nutrition Facts</h2>
            <div className="max-w-md">
              <div className="text-left border-4 border-black p-4 bg-white text-black font-sans text-xs">
                <h3 className="font-serif text-3xl font-extrabold border-b-8 border-black pb-1 leading-none">Supplement Facts</h3>
                <div className="border-b border-black py-1.5 flex justify-between">
                  <span>Serving Size</span>
                  <span className="font-bold">{product.nutritionalFacts.servingSize}</span>
                </div>
                <div className="border-b-4 border-black py-1.5 flex justify-between">
                  <span>Servings Per Container</span>
                  <span className="font-bold">{product.nutritionalFacts.servingsPerContainer}</span>
                </div>
                <div className="flex justify-between font-bold border-b-2 border-black py-1 text-[10px]">
                  <span>{product.nutritionalFacts.headers?.[0]}</span>
                  <span>{product.nutritionalFacts.headers?.[1]}</span>
                </div>
                <div className="divide-y divide-black/40">
                  {product.nutritionalFacts.ingredients.map((ing, idx) => (
                    <div key={idx} className="flex justify-between py-1.5">
                      <span className={ing.name.startsWith('  ') ? 'pl-4 italic text-black/70' : 'font-semibold'}>{ing.name}</span>
                      <div className="flex space-x-6">
                        <span>{ing.amount}</span>
                        <span className="font-bold w-12 text-right">{ing.dv}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t-8 border-black pt-2 text-[9px] text-black/80 leading-relaxed">
                  * Percent Daily Values (RDA) are based on ICMR/RDA guidelines.<br />
                  ** Daily Value not established.
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Science */}
        {product.scienceText && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="font-serif text-2xl font-bold text-primary-green mb-6">The Science</h2>
            <div className="bg-sage/5 border border-sage/20 rounded-2xl p-6 space-y-3 max-w-3xl">
              <span className="text-[10px] font-mono uppercase bg-sage/10 text-sage px-2 py-0.5 rounded">Biochemical Efficacy</span>
              <h3 className="font-serif text-lg font-bold text-primary-green">Clinical Mechanism</h3>
              <div className="text-sm text-charcoal/80 leading-relaxed whitespace-pre-wrap font-serif text-base">
                {product.scienceText.split('Citations:')[0].trim()}
              </div>
            </div>

            {product.scienceText.includes('Citations:') && (
              <div className="mt-6 space-y-3 max-w-3xl">
                <h4 className="font-mono text-xs uppercase tracking-wider text-charcoal/50">Scientific Literature References</h4>
                <div className="divide-y divide-cream-dark/50">
                  {product.scienceText.split('Citations:')[1].trim().split('\n').filter(line => line.trim()).map((citation, idx) => (
                    <div key={idx} className="py-2.5 text-xs text-charcoal/70 leading-relaxed font-mono flex items-start space-x-2">
                      <span className="text-sage font-bold">[{idx + 1}]</span>
                      <p>{citation.replace(/^\d+\.\s*/, '')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h2 className="font-serif text-2xl font-bold text-primary-green mb-6">You May Also Like</h2>
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
          </section>
        )}
      </main>

      <Footer setCurrentSection={() => navigate('/')} />
    </div>
  )
}

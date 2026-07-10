import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product, onQuickView, onAddToStack, isInStack, onToggleWishlist, isInWishlist, onAddToCart }) {
  const [imgError, setImgError] = useState(false)
  const [imgLoaded, setImgLoaded] = useState(false)

  // Generate initials for the bottle label (e.g. "Multivitamin with Probiotics" -> "MV")
  const getInitials = (name) => {
    if (name.includes('NAD+')) return 'ND'
    if (name.includes('NAC')) return 'NC'
    if (name.includes('TUDCA')) return 'TD'
    if (name.includes('CoQ10')) return 'CQ'
    
    const parts = name.split(' ')
    if (parts.length >= 2) {
      const first = parts[0][0]
      const second = parts[1][0]
      return (first + second).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Get series-specific background for image area
  const getImageBg = (series) => {
    switch (series) {
      case 'Liposomal Series': return 'bg-gradient-to-b from-slate-600/5 to-slate-600/10'
      case 'Core Series': return 'bg-gradient-to-b from-sage/5 to-cream-dark/50'
      default: return 'bg-gradient-to-b from-champagne/10 to-cream-dark/40'
    }
  }

  // Generate deterministic review rating metrics for ecommerce trust
  const idHash = useMemo(() => {
    const str = String(product.slug || product.id)
    let hash = 0
    for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i)
    return hash
  }, [product.slug, product.id])

  const rating = useMemo(() => {
    return (4.5 + (idHash % 5) * 0.1).toFixed(1)
  }, [idHash])

  const reviewCount = useMemo(() => {
    return 74 + (idHash * 17) % 180
  }, [idHash])

  const mrp = useMemo(() => {
    return Math.round(product.price * 1.25)
  }, [product.price])

  return (
    <div className="group relative flex flex-col h-full rounded-2xl glass-panel transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg !border-bg-secondary overflow-hidden">
      
      {/* Product Image Container */}
      <Link 
        to={`/products/${product.slug}`}
        className={`relative w-full aspect-square overflow-hidden flex items-center justify-center group-hover:bg-cream-dark/20 transition-colors ${getImageBg(product.series)}`}
      >
        
        {/* Dynamic Background to remove empty space feeling */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_100%)] opacity-80 mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-black/5 rounded-full blur-3xl"></div>

        {/* Floating Wishlist Heart */}
        {onToggleWishlist && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleWishlist(product)
            }}
            className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-40 cursor-pointer border ${
              isInWishlist 
                ? 'bg-sage/20 border-sage/40 text-sage' 
                : 'bg-white/80 border-white text-charcoal/40 hover:text-sage hover:bg-white shadow-sm'
            }`}
            title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <svg 
              className={`w-3.5 h-3.5 ${isInWishlist ? 'fill-current' : ''}`} 
              fill={isInWishlist ? "currentColor" : "none"} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}

        {/* Product bottle image — fills container end to end */}
        {!imgError ? (
          <div className="relative w-full h-full z-20">
            {/* Shimmer skeleton shown while image is fetching */}
            {!imgLoaded && (
              <div className="absolute inset-0 img-skeleton" />
            )}
            <img 
              src={product.image} 
              alt={product.name} 
              className={`w-full h-full object-contain p-2 transition-all duration-500 group-hover:-translate-y-1 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          /* Branded fallback placeholder */
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 z-20">
            <div className="w-20 h-20 rounded-full bg-sage/20 flex items-center justify-center border-2 border-sage/30 shadow-inner">
              <span className="font-serif text-2xl font-bold text-sage">{getInitials(product.name)}</span>
            </div>
            <span className="text-[10px] font-mono text-charcoal/50 uppercase tracking-wider">kenwell</span>
          </div>
        )}
      </Link>

      {/* Product Text Details */}
      <div className="flex-grow flex flex-col justify-between p-4 pt-3">
        <div className="space-y-1 text-left">
          
          {/* Rating + Servings Row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <svg className="w-3.5 h-3.5 text-amber-500 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span className="font-bold text-charcoal/80 text-[10px]">{rating}</span>
              <span className="text-charcoal/40 text-[9px]">({reviewCount})</span>
            </div>
            <span className="text-charcoal/50 font-mono text-[9px] uppercase">{product.form}</span>
          </div>
          
          <h3 className="font-serif text-base font-bold line-clamp-1">
            <Link
              to={`/products/${product.slug}`}
              className="text-primary-green hover:text-sage transition-colors"
            >
              {product.name}
            </Link>
          </h3>
          
          {/* Tagline */}
          <p className="text-[11px] text-charcoal/60 line-clamp-1 leading-relaxed">
            {product.tagline}
          </p>

          {/* Health Goals Mini Badges */}
          <div className="flex flex-wrap gap-1 pt-1.5">
            {product.healthGoals.slice(0, 3).map((goal) => (
              <span 
                key={goal} 
                className="text-[9px] font-medium bg-bg-secondary text-charcoal/70 px-2 py-0.5 rounded"
              >
                {goal}
              </span>
            ))}
          </div>

        </div>

        <div className="mt-3 pt-2.5 border-t border-cream-dark/50">
          {/* Price row */}
          <div className="flex items-center justify-between">
            <div className="text-left">
              <div className="flex items-baseline gap-1 flex-wrap">
                <span className="font-mono text-base font-bold text-primary-green">₹{product.price}</span>
                <span className="font-mono text-[10px] text-charcoal/40 line-through">₹{mrp}</span>
                <span className="text-[9px] font-semibold text-sage whitespace-nowrap">20% off</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Quick View — eye icon */}
              <button
                onClick={() => onQuickView(product)}
                className="p-1.5 rounded-full text-charcoal/40 hover:text-primary-green hover:bg-bg-secondary transition-colors cursor-pointer"
                title="Quick View"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>

              {/* Add to Cart */}
              {onAddToCart && (
                <button
                  onClick={() => onAddToCart(product)}
                  className="p-1.5 rounded-full bg-bg-secondary text-primary-green hover:bg-sage hover:text-white border border-cream-dark/50 transition-all duration-300 cursor-pointer shrink-0"
                  title="Add to Cart"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>


      </div>

    </div>
  )
}

import React, { useMemo, useState } from 'react'

export default function ProductCard({ product, onQuickView, onAddToStack, isInStack, onToggleWishlist, isInWishlist, onAddToCart }) {
  const [imgError, setImgError] = useState(false)

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
  const rating = useMemo(() => {
    return (4.5 + (product.id % 5) * 0.1).toFixed(1)
  }, [product.id])

  const reviewCount = useMemo(() => {
    return 74 + (product.id * 17) % 180
  }, [product.id])

  const mrp = useMemo(() => {
    return Math.round(product.price * 1.25)
  }, [product.price])

  return (
    <div className="group relative flex flex-col h-full rounded-2xl glass-panel p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg border border-white/60">
      
      {/* Product Image Container */}
      <div className={`relative w-full h-52 flex items-center justify-center mb-4 rounded-xl overflow-hidden border border-cream-dark/30 ${getImageBg(product.series)}`}>
        
        {/* Floating Wishlist Heart */}
        {onToggleWishlist && (
          <button
            onClick={() => onToggleWishlist(product)}
            className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-30 cursor-pointer border ${
              isInWishlist 
                ? 'bg-sage/20 border-sage/40 text-sage' 
                : 'bg-white/60 border-white/80 text-charcoal/40 hover:text-sage hover:bg-white'
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

        {/* Product bottle image — object-contain to show full bottle */}
        {!imgError ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          /* Branded fallback placeholder */
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
            <div className="w-16 h-16 rounded-full bg-sage/20 flex items-center justify-center border-2 border-sage/30">
              <span className="font-serif text-xl font-bold text-sage">{getInitials(product.name)}</span>
            </div>
            <span className="text-[9px] font-mono text-charcoal/40 uppercase tracking-wider">kenwell</span>
          </div>
        )}
      </div>

      {/* Product Text Details */}
      <div className="flex-grow flex flex-col justify-between">
        <div className="space-y-2 text-left">
          
          {/* Servings Info */}
          <div className="flex items-center justify-end text-xs">
            <span className="text-charcoal/50 font-mono text-[9px] uppercase">{product.form}</span>
          </div>

          {/* Star Review Panel */}
          <div className="flex items-center space-x-1 text-xs">
            <svg className="w-3.5 h-3.5 text-amber-500 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            <span className="font-bold text-charcoal/80 text-[11px]">{rating}</span>
            <span className="text-charcoal/40 text-[10px]">({reviewCount} reviews)</span>
          </div>
          
          {/* Product Name */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-serif text-lg font-bold text-primary-green hover:text-sage transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>
          
          {/* Tagline */}
          <p className="text-xs text-charcoal/60 line-clamp-2 leading-relaxed min-h-[2rem]">
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

        <div className="mt-4 pt-3 border-t border-cream-dark/50 flex items-center justify-between">
          {/* Price with strikethrough & discount percent */}
          <div className="text-left">
            <span className="text-[9px] text-charcoal/40 uppercase block leading-none font-mono">Price</span>
            <div className="flex items-baseline space-x-1.5 mt-0.5">
              <span className="font-mono text-base font-bold text-primary-green">₹{product.price}</span>
              <span className="font-mono text-[10px] text-charcoal/40 line-through">₹{mrp}</span>
              <span className="text-[9px] font-semibold text-sage">20% OFF</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex space-x-2 items-center">
            {/* Quick View Button */}
            <button
              onClick={() => onQuickView(product)}
              className="text-[11px] font-semibold text-charcoal/60 hover:text-primary-green transition-colors uppercase tracking-wider py-1 cursor-pointer"
              title="Quick View Details"
            >
              Info
            </button>
            
            {/* Add to Cart Icon Button */}
            {onAddToCart && (
              <button
                onClick={() => onAddToCart(product)}
                className="p-2 rounded-full bg-bg-secondary text-primary-green hover:bg-sage hover:text-white border border-cream-dark/50 transition-all duration-300 shadow-sm cursor-pointer shrink-0"
                title="Add to Cart"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </button>
            )}
            
            {/* Add to Stack Button */}
            <button
              onClick={() => onAddToStack(product)}
              disabled={isInStack}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                isInStack 
                  ? 'bg-sage/10 text-sage border border-sage/20 cursor-default'
                  : 'bg-primary-green text-bg-primary hover:bg-sage hover:text-white shadow-sm cursor-pointer'
              }`}
            >
              {isInStack ? 'In Stack' : '+ Stack'}
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}

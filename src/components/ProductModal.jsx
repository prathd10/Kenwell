import React, { useState, useEffect } from 'react'

export default function ProductModal({ product, onClose, onAddToStack, isInStack, onToggleWishlist, isInWishlist, onAddToCart }) {
  const [activeTab, setActiveTab] = useState('overview')

  // Block scrolling on body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleOutsideClick = (e) => {
    if (e.target.id === 'modal-backdrop') {
      onClose()
    }
  }

  return (
    <div 
      id="modal-backdrop"
      onClick={handleOutsideClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-sm transition-all duration-300"
    >
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-bg-primary rounded-3xl overflow-hidden shadow-2xl border border-white/50 flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Left Side: Product Art Frame */}
        <div 
          className="w-full md:w-2/5 p-8 flex flex-col items-center justify-center relative overflow-hidden border-b md:border-b-0 md:border-r border-cream-dark/50"
          style={{ background: `linear-gradient(135deg, #F2F0E5 0%, ${product.accentColor}08 100%)` }}
        >
          {/* Product Image Frame */}
          <div className="w-full h-64 rounded-2xl overflow-hidden border border-cream-dark/45 shadow-sm bg-white/80 mt-4 flex items-center justify-center">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-contain p-4 drop-shadow-lg"
              loading="lazy"
              decoding="async"
            />
          </div>
          
          <div className="mt-8 text-center z-10">
            <h2 className="font-serif text-2xl font-bold text-primary-green mt-3">{product.name}</h2>
            <p className="font-mono text-sm font-semibold text-charcoal/60 mt-1">₹{product.price} • {product.servings} Servings</p>
          </div>
        </div>

        {/* Right Side: Product Details & Tabs */}
        <div className="w-full md:w-3/5 flex flex-col h-full max-h-[90vh]">
          
          {/* Header & Tabs Selector */}
          <div className="p-6 pb-2 border-b border-cream-dark/50 flex justify-between items-start">
            <div className="flex space-x-6">
              {['overview', 'nutrition', 'science'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-semibold tracking-wider uppercase pb-3 relative transition-colors cursor-pointer ${
                    activeTab === tab ? 'text-primary-green' : 'text-charcoal/50 hover:text-charcoal'
                  }`}
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'nutrition' && 'Supplement Facts'}
                  {tab === 'science' && 'Science & Citations'}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-sage rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
            
            <button 
              onClick={onClose}
              className="text-charcoal/40 hover:text-charcoal transition-colors p-1 -mt-2 cursor-pointer text-xl"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Details Scroll Area */}
          <div className="p-8 overflow-y-auto flex-grow max-h-[55vh] md:max-h-[65vh]">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 text-left">
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-bold text-primary-green uppercase tracking-wide">Key Benefits</h3>
                  <p className="text-sm text-charcoal/80 leading-relaxed font-serif text-lg italic">
                    "{product.tagline}"
                  </p>
                  <p className="text-sm text-charcoal/70 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                
                <ul className="space-y-2 pt-2">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start text-sm text-charcoal/80 space-x-3">
                      <svg className="w-4 h-4 text-sage shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <div className="gold-divider"></div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-bg-secondary/40 border border-cream-dark/50 rounded-xl p-4">
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-charcoal/50 leading-none">Dosage & Timing</span>
                    <span className="block text-xs font-semibold text-primary-green mt-1">{product.howToUse.dosage}</span>
                    <p className="text-[11px] text-charcoal/60 mt-1 leading-relaxed">{product.howToUse.timing}</p>
                  </div>
                  <div className="bg-bg-secondary/40 border border-cream-dark/50 rounded-xl p-4">
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-charcoal/50 leading-none">Synergistic Stacking</span>
                    <p className="text-[11px] text-charcoal/60 mt-1.5 leading-relaxed">{product.howToUse.stacking}</p>
                  </div>
                </div>

                {product.howToUse.warnings && (
                  <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 text-[11px] text-amber-800 leading-relaxed flex items-start space-x-3">
                    <span className="text-amber-700 font-mono font-bold uppercase text-[9px] bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 shrink-0 mt-0.5">Warning</span>
                    <p><strong>Usage Warning:</strong> {product.howToUse.warnings}</p>
                  </div>
                )}
              </div>
            )}

            {/* SUPPLEMENT FACTS (FDA LABEL) */}
            {activeTab === 'nutrition' && (
              <div className="max-w-md mx-auto">
                <div className="nutrition-label-container text-left border-4 border-black p-4 bg-white text-black font-sans text-xs">
                  <h2 className="nutrition-label-title font-serif text-3xl font-extrabold border-b-8 border-black pb-1 leading-none">Supplement Facts</h2>
                  
                  <div className="border-b border-black py-1.5 flex justify-between">
                    <span>Serving Size</span>
                    <span className="font-bold">{product.nutritionalFacts.servingSize}</span>
                  </div>
                  <div className="border-b-4 border-black py-1.5 flex justify-between">
                    <span>Servings Per Container</span>
                    <span className="font-bold">{product.nutritionalFacts.servingsPerContainer}</span>
                  </div>
                  
                  <div className="flex justify-between font-bold border-b-2 border-black py-1 text-[10px]">
                    <span>{product.nutritionalFacts.headers[0]}</span>
                    <span>{product.nutritionalFacts.headers[1]}</span>
                  </div>

                  <div className="divide-y divide-black/40">
                    {product.nutritionalFacts.ingredients.map((ing, idx) => (
                      <div key={idx} className="flex justify-between py-1.5">
                        <span className={ing.name.startsWith('  ') ? 'pl-4 italic text-black/70' : 'font-semibold'}>
                          {ing.name}
                        </span>
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
            )}

            {/* SCIENCE & CITATIONS TAB */}
            {activeTab === 'science' && (
              <div className="space-y-6 text-left">
                <div className="bg-sage/5 border border-sage/20 rounded-2xl p-5 space-y-3">
                  <span className="text-[10px] font-mono uppercase bg-sage/10 text-sage px-2 py-0.5 rounded">Biochemical Efficacy</span>
                  <h3 className="font-serif text-lg font-bold text-primary-green">Clinical Mechanism</h3>
                  <div className="text-sm text-charcoal/80 leading-relaxed whitespace-pre-wrap font-serif text-base">
                    {product.scienceText.split('Citations:')[0].trim()}
                  </div>
                </div>

                {product.scienceText.includes('Citations:') && (
                  <div className="space-y-3">
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
              </div>
            )}

          </div>

          {/* Modal Actions Footer */}
          <div className="p-6 border-t border-cream-dark/50 bg-bg-secondary/20 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-left w-full sm:w-auto">
              <span className="text-[10px] font-mono uppercase text-charcoal/40 block leading-none">Total Formulation Cost</span>
              <span className="font-mono text-xl font-extrabold text-primary-green">₹{product.price}</span>
            </div>
            
            <div className="flex space-x-2 w-full sm:w-auto justify-end items-center">
              {/* Wishlist Toggle Button */}
              {onToggleWishlist && (
                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`p-3 rounded-full border transition-all cursor-pointer ${
                    isInWishlist 
                      ? 'bg-sage/15 text-sage border-sage/30 text-sage' 
                      : 'border-cream-dark text-charcoal/50 hover:text-primary-green hover:bg-bg-secondary'
                  }`}
                  title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <svg 
                    className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} 
                    fill={isInWishlist ? "currentColor" : "none"} 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              )}

              {/* Add to Cart Button */}
              {onAddToCart && (
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full sm:w-auto px-7 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-bg-primary bg-primary-green hover:bg-sage hover:text-white transition-all cursor-pointer text-center shadow-md hover:shadow-lg"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

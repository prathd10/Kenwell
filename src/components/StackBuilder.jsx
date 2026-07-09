import React, { useMemo, useState } from 'react'
import { useProducts } from '../context/ProductsContext'

export default function StackBuilder({ onQuickView, onAddToCart }) {
  const { products, stacks } = useProducts()
  const [activeTab, setActiveTab] = useState('pre-made')
  const [selectedDetailStack, setSelectedDetailStack] = useState(null)

  // Custom Stack States
  const [customInput, setCustomInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [customStack, setCustomStack] = useState(null)

  const handleAddBundleToCart = (bundle) => {
    const bundleProducts = bundle.productIds.map(id => products.find(p => p.id === id)).filter(Boolean)
    bundleProducts.forEach((prod) => {
      let itemPrice = bundle.discountedItems ? bundle.discountedItems[prod.id] || prod.price : Math.round(prod.price * 0.85); // 15% off custom
      onAddToCart({
        ...prod,
        price: itemPrice,
        name: prod.name
      })
    })
    window.dispatchEvent(new Event('kenwell:openCart'))
  }

  const handleGenerateCustomStack = () => {
    if (!customInput.trim()) return;
    setIsAnalyzing(true)
    setCustomStack(null)

    setTimeout(() => {
      const lower = customInput.toLowerCase()
      let suggestedSlugs = []
      let customName = "Your Custom Stack"
      let customSynergy = "Based on your description, we selected these products to work together to support your specific needs."

      if (lower.includes('sleep') || lower.includes('stress') || lower.includes('anxiety')) {
        suggestedSlugs = ['chelated-magnesium-glycinate', 'melatonin-sleep-support', 'ksm-66-ashwagandha']
        customName = "Relaxation & Recovery Stack"
      } else if (lower.includes('energy') || lower.includes('tired') || lower.includes('workout')) {
        suggestedSlugs = ['nad', 'coq10-ubiquinone', 'vitamin-b12']
        customName = "Energy & Vitality Stack"
      } else if (lower.includes('liver') || lower.includes('detox') || lower.includes('drink')) {
        suggestedSlugs = ['milk-thistle', 'nac', 'tudca']
        customName = "Total Detox Stack"
      } else if (lower.includes('joint') || lower.includes('pain') || lower.includes('bones')) {
        suggestedSlugs = ['joint-support', 'vitamin-d3-k2-calcium', 'triple-strength-fish-oil']
        customName = "Mobility & Joint Stack"
      } else if (lower.includes('gut') || lower.includes('digestion') || lower.includes('bloat')) {
        suggestedSlugs = ['prebiotics-probiotics', 'liver-support-blend']
        customName = "Gut Harmony Stack"
      } else {
        suggestedSlugs = ['multivitamin-with-probiotics', 'single-strength-fish-oil']
        customName = "Daily Foundation Stack"
        customSynergy = "These are our core essentials to build a strong foundation for your daily health."
      }

      const matchedProducts = suggestedSlugs.map(slug => products.find(p => p.slug === slug)).filter(Boolean)
      const original = matchedProducts.reduce((sum, p) => sum + p.price, 0)
      const discountedPrice = Math.round(original * 0.85) // Custom stacks get a 15% discount

      setCustomStack({
        id: 'custom-' + Date.now(),
        name: customName,
        tagline: "Personalized based on your goals",
        productIds: matchedProducts.map(p => p.id),
        originalPrice: original,
        comboPrice: discountedPrice,
        badge: "Custom Plan",
        focus: ["Personalized", "Targeted"],
        synergy: customSynergy,
        schedule: {
          morning: "Take morning products with your first meal.",
          afternoon: "Take afternoon products with lunch.",
          evening: "Take evening products 30 mins before bed."
        }
      })
      setIsAnalyzing(false)
    }, 1500)
  }

  return (
    <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-sage font-mono uppercase tracking-widest text-[10px] font-semibold border border-cream-dark px-3 py-1 rounded-full bg-bg-secondary/40">
          Smart Stacks
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-primary-green">Supplement Combos</h1>
        <div className="gold-divider max-w-xs mx-auto"></div>
        <p className="text-charcoal/70 text-sm leading-relaxed">
          Carefully chosen products that work better together. Buy them as a combo to save money and get the best results for your health.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-bg-secondary/50 border border-cream-dark p-1 rounded-full">
          <button
            onClick={() => setActiveTab('pre-made')}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'pre-made' ? 'bg-primary-green text-white shadow-sm' : 'text-charcoal/60 hover:text-primary-green'
            }`}
          >
            Pre-Made Combos
          </button>
          <button
            onClick={() => setActiveTab('build-your-own')}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'build-your-own' ? 'bg-primary-green text-white shadow-sm' : 'text-charcoal/60 hover:text-primary-green'
            }`}
          >
            Make Your Own Stack
          </button>
        </div>
      </div>

      {activeTab === 'build-your-own' && (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-cream-dark/50 text-center">
            <h2 className="font-serif text-2xl text-primary-green mb-3">Tell us about your routine</h2>
            <p className="text-sm text-charcoal/70 mb-6">Describe your health goals, current diet, or the issues you want to address. We'll suggest a custom stack and give you a 15% discount when you buy them together.</p>
            
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="E.g., I have trouble falling asleep and my joints hurt after playing tennis. I also feel tired in the afternoons..."
              className="w-full h-32 p-4 bg-bg-primary border border-cream-dark rounded-xl text-sm focus:outline-none focus:border-sage mb-4 resize-none placeholder-charcoal/30"
            ></textarea>
            
            <button
              onClick={handleGenerateCustomStack}
              disabled={isAnalyzing || !customInput.trim()}
              className="bg-primary-green text-white hover:bg-sage px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
            >
              {isAnalyzing ? 'Analyzing your needs...' : 'Generate My Stack'}
            </button>
          </div>

          {customStack && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <h3 className="font-serif text-xl text-center text-primary-green mb-6">Your Recommended Plan</h3>
              <div 
                className="group relative flex flex-col md:flex-row bg-white rounded-2xl transition-all shadow-md border border-sage/20 overflow-hidden"
              >
                {/* Visual stacked presentation of bottles */}
                <div className="relative w-full md:w-1/3 h-64 md:h-auto overflow-hidden bg-bg-secondary flex items-center justify-center border-b md:border-b-0 md:border-r border-cream-dark/30">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_100%)] opacity-80"></div>
                  <div className="relative flex flex-wrap items-center justify-center w-full h-full min-h-[250px] p-4 md:p-6 z-10">
                    {customStack.productIds.map((id, index) => {
                      const prod = products.find(p => p.id === id);
                      if (!prod) return null;

                      return (
                        <React.Fragment key={prod.id}>
                          {index > 0 && (
                            <div className="text-2xl font-black text-sage/60 mx-2 md:mx-3">+</div>
                          )}
                          <div 
                            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-[0_0_25px_10px_rgba(0,0,0,0.15)] transition-transform hover:scale-105 bg-white shrink-0 ring-1 ring-black/5"
                          >
                            <img 
                              src={prod.image} 
                              alt={prod.name} 
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        </React.Fragment>
                      )
                    })}
                  </div>
                  <div className="absolute top-4 right-4 bg-sage text-white text-[10px] font-mono px-3 py-1 rounded-full shadow-md font-bold tracking-widest uppercase z-40">
                    Save 15%
                  </div>
                </div>

                {/* Info */}
                <div className="flex-grow flex flex-col justify-between p-6">
                  <div className="space-y-3">
                    <span className="text-[9px] font-mono text-charcoal/40 uppercase tracking-widest bg-sage/10 px-2 py-1 rounded text-sage font-bold inline-block">Perfect Match</span>
                    <h3 className="font-serif text-2xl font-bold text-primary-green">{customStack.name}</h3>
                    <p className="text-sm text-charcoal/70">{customStack.synergy}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                      {customStack.productIds.map(id => products.find(p => p.id === id)).filter(Boolean).map(prod => (
                        <div key={prod.id} className="flex items-center gap-2 border border-cream-dark/30 rounded p-2 bg-bg-primary/50">
                          <div className="w-8 h-8 rounded shrink-0 overflow-hidden border border-white shadow-sm">
                            <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                          </div>
                          <div className="text-xs font-semibold text-primary-green">{prod.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-cream-dark/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-charcoal/50 uppercase block font-mono">Custom Combo Price</span>
                      <div className="flex items-baseline space-x-2 mt-0.5">
                        <span className="font-mono text-2xl font-bold text-primary-green">₹{customStack.comboPrice}</span>
                        <span className="font-mono text-sm text-charcoal/40 line-through">₹{customStack.originalPrice}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddBundleToCart(customStack)}
                      className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 bg-primary-green text-white hover:bg-sage shadow-md cursor-pointer"
                    >
                      Add Custom Stack
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'pre-made' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {stacks.map((bundle) => {
            const bundleProducts = bundle.productIds.map(id => products.find(p => p.id === id)).filter(Boolean)
            const basePrice = bundle.comboPrice
            const currentPrice = basePrice
            const originalPrice = bundle.originalPrice
            const savings = originalPrice - currentPrice
            const savingsPercent = Math.round((savings / originalPrice) * 100)

            return (
              <div 
                key={bundle.id}
                className="group relative flex flex-col h-full rounded-2xl glass-panel transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg border border-white/60 overflow-hidden"
              >
                {/* Product Bottle Image Area */}
                <div className="relative w-full h-64 overflow-hidden border-b border-cream-dark/30 bg-bg-secondary flex items-center justify-center group-hover:bg-cream-dark/20 transition-colors">
                  
                  {/* Dynamic Background to remove empty space feeling */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_100%)] opacity-80"></div>
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-sage/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-green/10 rounded-full blur-3xl"></div>

                  {/* Visual stacked presentation of bottles in the combo */}
                  <div className="relative flex items-center justify-center -space-x-12 w-full h-full pt-4 px-4">
                    {bundleProducts.map((prod, index) => (
                      <div 
                        key={prod.id} 
                        className="relative transition-all duration-500 hover:scale-110 hover:-translate-y-2 hover:z-30 w-32 h-48 md:w-44 md:h-60"
                        style={{ zIndex: 20 - index }}
                      >
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="w-full h-full object-contain mix-blend-multiply drop-shadow-[0_15px_25px_rgba(0,0,0,0.2)]"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Savings Badge */}
                  <div className="absolute top-4 right-4 bg-sage text-white text-[10px] font-mono px-3 py-1 rounded-full shadow-md font-bold tracking-widest uppercase z-40">
                    Save {savingsPercent}%
                  </div>
                </div>

                {/* Stack Details (similar to ProductCard details) */}
                <div className="flex-grow flex flex-col justify-between p-5 pt-4 text-left">
                  <div className="space-y-2">
                    
                    {/* Category / Formulations count */}
                    <div className="flex items-center justify-between text-[9px] font-mono text-charcoal/40 uppercase tracking-widest">
                      <span>{bundle.badge}</span>
                      <span>{bundleProducts.length} Products</span>
                    </div>

                    {/* Stack Name */}
                    <h3 
                      onClick={() => setSelectedDetailStack(bundle)}
                      className="font-serif text-lg font-bold text-primary-green hover:text-sage transition-colors cursor-pointer line-clamp-1"
                    >
                      {bundle.name}
                    </h3>

                    {/* Tagline */}
                    <p className="text-xs text-charcoal/60 line-clamp-2 leading-relaxed min-h-[2rem]">
                      {bundle.tagline}
                    </p>

                    {/* Focus Area Badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {bundle.focus.map((goal) => (
                        <span 
                          key={goal} 
                          className="text-[9px] font-medium bg-bg-secondary text-charcoal/70 px-2 py-0.5 rounded"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>

                  </div>

                  {/* Pricing & Footer Actions */}
                  <div className="mt-4 pt-3 border-t border-cream-dark/50 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-charcoal/40 uppercase block leading-none font-mono">Combo Price</span>
                      <div className="flex items-baseline space-x-1.5 mt-0.5">
                        <span className="font-mono text-base font-bold text-primary-green">₹{currentPrice}</span>
                        <span className="font-mono text-[10px] text-charcoal/40 line-through">₹{originalPrice}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedDetailStack(bundle)}
                        className="text-[11px] font-semibold text-charcoal/60 hover:text-primary-green transition-colors uppercase tracking-wider py-1 cursor-pointer"
                      >
                        Info
                      </button>

                      <button
                        onClick={() => handleAddBundleToCart(bundle)}
                        className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 bg-primary-green text-bg-primary hover:bg-sage hover:text-white shadow-sm cursor-pointer"
                      >
                        Buy Combo
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Elegant Stack Detail Modal (Info Modal) */}
      {selectedDetailStack && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-bg-primary max-w-2xl w-full rounded-3xl overflow-hidden border border-cream-dark shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 bg-white border-b border-cream-dark/40 flex justify-between items-center text-left">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-sage bg-sage/10 px-2 py-0.5 rounded">
                  Combo Details
                </span>
                <h3 className="font-serif text-2xl font-bold text-primary-green mt-1">
                  {selectedDetailStack.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedDetailStack(null)}
                className="text-charcoal/40 hover:text-charcoal text-xl p-1 cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-left">
              
              {/* Stack items breakdown */}
              <div className="space-y-3">
                <span className="text-[9px] font-mono font-bold uppercase text-charcoal/40 block">Products in this Combo</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {selectedDetailStack.productIds.map(id => products.find(p => p.id === id)).filter(Boolean).map((prod) => (
                    <div 
                      key={prod.id}
                      onClick={() => {
                        setSelectedDetailStack(null)
                        onQuickView(prod)
                      }}
                      className="flex items-center gap-2.5 p-2 bg-white rounded-xl border border-cream-dark/40 hover:border-sage/40 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border-2 border-white shadow-sm">
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif text-[11px] font-bold text-primary-green truncate">{prod.name}</h4>
                        <p className="text-[9px] font-mono text-charcoal/50">₹{prod.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Biochemical synergy advantage */}
              <div className="space-y-2">
                <h4 className="font-serif text-sm font-bold text-primary-green">Why they work great together</h4>
                <p className="text-xs text-charcoal/70 leading-relaxed bg-sage/5 p-4 rounded-xl border border-sage/15">
                  {selectedDetailStack.synergy}
                </p>
              </div>

              {/* Dosing administration guidelines */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-primary-green">When to take them</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="border border-cream-dark/40 rounded-xl p-3 bg-white">
                    <span className="text-[8px] font-mono uppercase text-charcoal/40 font-bold block mb-1">Morning</span>
                    <p className="text-[10px] text-charcoal/70 leading-relaxed italic">{selectedDetailStack.schedule.morning}</p>
                  </div>
                  <div className="border border-cream-dark/40 rounded-xl p-3 bg-white">
                    <span className="text-[8px] font-mono uppercase text-charcoal/40 font-bold block mb-1">Afternoon</span>
                    <p className="text-[10px] text-charcoal/70 leading-relaxed italic">{selectedDetailStack.schedule.afternoon}</p>
                  </div>
                  <div className="border border-cream-dark/40 rounded-xl p-3 bg-white">
                    <span className="text-[8px] font-mono uppercase text-charcoal/40 font-bold block mb-1">Evening</span>
                    <p className="text-[10px] text-charcoal/70 leading-relaxed italic">{selectedDetailStack.schedule.evening}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white border-t border-cream-dark/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-left">
              <div>
                <span className="text-[9px] font-mono text-charcoal/40 uppercase block">Combo Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xl font-bold text-primary-green">
                    ₹{selectedDetailStack.comboPrice}
                  </span>
                  <span className="font-mono text-xs text-charcoal/40 line-through">₹{selectedDetailStack.originalPrice}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  handleAddBundleToCart(selectedDetailStack)
                  setSelectedDetailStack(null)
                }}
                className="w-full sm:w-auto bg-primary-green text-bg-primary hover:bg-sage hover:text-white px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer text-center"
              >
                Buy Combo Stack
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

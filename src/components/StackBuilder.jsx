import React, { useMemo } from 'react'

export default function StackBuilder({ stackItems, onRemoveFromStack, onClearStack, onQuickView, setCurrentSection }) {
  
  // Total Cost Calculation
  const totalCost = useMemo(() => {
    return stackItems.reduce((sum, item) => sum + item.price, 0)
  }, [stackItems])

  // Daily Cost Calculation (assuming 30 servings average)
  const dailyCost = useMemo(() => {
    return (totalCost / 30).toFixed(2)
  }, [totalCost])

  // Synergy and Conflict Engine
  const stackInsights = useMemo(() => {
    const insights = []
    const ids = stackItems.map(item => item.id)
    
    // Check for D3 + K2 + Calcium (id 3 contains D3+K2+Calcium, id 8 contains Calcium, id 2 is Magnesium)
    // Magnesium + D3/Calcium (ids 2 and 3)
    if (ids.includes(2) && ids.includes(3)) {
      insights.append = false // just tracking
      insights.push({
        type: 'synergy',
        title: 'Synergy Match: D3 & Magnesium Glycinate',
        text: 'Magnesium is a vital cofactor required by enzymes in the liver and kidneys to convert Vitamin D3 into its active calcitriol form. Taking them together optimizes bone matrix density.'
      })
    }

    // Vitamin C + Glutathione (ids 14 and 15)
    if (ids.includes(14) && ids.includes(15)) {
      insights.push({
        type: 'synergy',
        title: 'Synergy Match: Vitamin C & Reduced Glutathione',
        text: 'Vitamin C is a powerful antioxidant that acts as an electron donor, recycling oxidized glutathione back to its active, reduced L-glutathione state, doubling cellular clearing speed.'
      })
    }

    // Fish Oil (5, 6, 7) + Multivitamin (1)
    const hasFishOil = ids.includes(5) || ids.includes(6) || ids.includes(7)
    if (ids.includes(1) && hasFishOil) {
      insights.push({
        type: 'synergy',
        title: 'Synergy Match: Lipophilic Nutrient Synergy',
        text: 'Healthy fatty acids in Fish Oil significantly boost the intestinal absorption of lipophilic (fat-soluble) vitamins (Vitamin A, D3, E) present in your Multivitamin.'
      })
    }

    // Magnesium (2) + Melatonin Sleep (18)
    if (ids.includes(2) && ids.includes(18)) {
      insights.push({
        type: 'synergy',
        title: 'Synergy Match: Neural Calming Protocol',
        text: 'Magnesium blocks calcium from entering NMDA glutamate channels (relieving muscle tension) while Melatonin activates MT1/MT2 receptors in the brain to trigger natural REM sleep.'
      })
    }

    // Ashwagandha (19) + Zinc (4)
    if (ids.includes(19) && ids.includes(4)) {
      insights.push({
        type: 'synergy',
        title: 'Synergy Match: Adaptogenic Hormone Support',
        text: 'Zinc picolonate cofactor support combined with KSM-66 adaptogenic root withanolides helps optimize natural testosterone production and decreases stress-related cortisol.'
      })
    }

    // Zinc (4) + Calcium (3 or 8)
    const hasCalcium = ids.includes(3) || ids.includes(8)
    if (ids.includes(4) && hasCalcium) {
      insights.push({
        type: 'warning',
        title: 'Timing Warning: Zinc & Calcium Absorption Competition',
        text: 'Both calcium and zinc minerals share the same divalent metal transporters in the small intestine. High calcium intake will inhibit zinc uptake. Take Zinc on an empty stomach at night and Calcium with breakfast.'
      })
    }

    // NAD+ (12) + Melatonin (18)
    if (ids.includes(12) && ids.includes(18)) {
      insights.push({
        type: 'warning',
        title: 'Timing Warning: NAD+ Energy Surge vs Melatonin',
        text: 'NAD+ precursors (NMN/NR) stimulate mitochondrial cellular respiration and ATP energy production. To prevent sleep disturbances, always take NAD+ early in the morning and Melatonin 30-45 minutes before sleep.'
      })
    }

    return insights
  }, [stackItems])

  // Custom Dosing Schedule Generator
  const dailySchedule = useMemo(() => {
    const morning = []
    const afternoon = []
    const evening = []

    stackItems.forEach((item) => {
      const timingText = item.howToUse.timing.toLowerCase()
      if (timingText.includes('morning') || timingText.includes('breakfast') || timingText.includes('first thing')) {
        morning.push(item)
      } else if (timingText.includes('lunch') || timingText.includes('mid-day') || timingText.includes('afternoon') || timingText.includes('with meals')) {
        afternoon.push(item)
      } else {
        evening.push(item)
      }
    })

    return { morning, afternoon, evening }
  }, [stackItems])

  return (
    <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-sage font-mono uppercase tracking-wider text-xs font-semibold">Interactive Stack Builder</span>
        <h1 className="text-4xl md:text-5xl font-serif text-primary-green">Your Wellness Protocol</h1>
        <div className="gold-divider max-w-xs mx-auto"></div>
        <p className="text-charcoal/70 text-sm leading-relaxed">
          Combine formulas, analyze clinical synergies, and configure an optimized daily dosing schedule. 
        </p>
      </div>

      {stackItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Stack Items List & Synergy Engine */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* List of items */}
            <div className="glass-panel rounded-2xl border border-white/50 overflow-hidden">
              <div className="p-6 bg-bg-secondary/40 border-b border-cream-dark/50 flex justify-between items-center">
                <h3 className="font-serif text-lg font-bold text-primary-green">Active Stack Formulas ({stackItems.length})</h3>
                <button 
                  onClick={onClearStack}
                  className="text-xs text-red-700 hover:text-red-900 font-semibold uppercase tracking-wider cursor-pointer"
                >
                  Clear Stack
                </button>
              </div>

              <div className="divide-y divide-cream-dark/40">
                {stackItems.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                    <div className="flex items-center space-x-4">
                      {/* Tiny Bottle Image */}
                      <div className="w-10 h-14 rounded-lg border border-cream-dark overflow-hidden shrink-0 bg-white">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div>
                        <h4 
                          onClick={() => onQuickView(item)}
                          className="font-serif text-base font-bold text-primary-green hover:text-sage transition-colors cursor-pointer"
                        >
                          {item.name}
                        </h4>
                        <p className="text-xs text-charcoal/50 font-mono mt-0.5">
                          {item.series} • {item.servings} servings • {item.form}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto space-x-6">
                      <span className="font-mono text-sm font-bold text-primary-green">₹{item.price}</span>
                      <button
                        onClick={() => onRemoveFromStack(item.id)}
                        className="text-xs text-charcoal/40 hover:text-red-700 transition-colors py-1 cursor-pointer font-medium uppercase tracking-wider"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Synergy & Timing Insights */}
            <div className="space-y-4 text-left">
              <h3 className="font-serif text-xl font-bold text-primary-green">Clinical Synergy Report</h3>
              {stackInsights.length > 0 ? (
                <div className="space-y-3">
                  {stackInsights.map((insight, idx) => (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-2xl border transition-all duration-300 ${
                        insight.type === 'synergy' 
                          ? 'bg-sage/5 border-sage/20 text-charcoal' 
                          : 'bg-amber-500/5 border-amber-500/20 text-charcoal'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                          insight.type === 'synergy' 
                            ? 'bg-sage/10 text-sage border border-sage/20' 
                            : 'bg-amber-500/10 text-amber-800 border border-amber-500/20'
                        }`}>
                          {insight.type === 'synergy' ? 'Synergy' : 'Timing'}
                        </span>
                        <div>
                          <h4 className={`font-semibold text-sm ${insight.type === 'synergy' ? 'text-sage' : 'text-amber-800'}`}>
                            {insight.title}
                          </h4>
                          <p className="text-xs text-charcoal/70 mt-1 leading-relaxed">
                            {insight.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-bg-secondary/40 border border-cream-dark/50 rounded-2xl p-6 text-center text-sm text-charcoal/60">
                  Add more related products to generate synergy pairings. Try stacking combinations like Vitamin C + Glutathione, Magnesium + Melatonin, or Multivitamin + Fish Oil.
                </div>
              )}
            </div>

            {/* Daily Dosing Schedule */}
            <div className="space-y-4 text-left">
              <h3 className="font-serif text-xl font-bold text-primary-green">Daily Administration Calendar</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Morning */}
                <div className="glass-panel p-5 rounded-2xl border border-white/50 space-y-3">
                  <div className="flex items-center space-x-2 border-b border-cream-dark/50 pb-2">
                    <h4 className="font-serif font-bold text-primary-green">Morning</h4>
                  </div>
                  {dailySchedule.morning.length > 0 ? (
                    <ul className="space-y-3">
                      {dailySchedule.morning.map(item => (
                        <li key={item.id} className="text-xs">
                          <span className="font-semibold block text-primary-green">{item.name}</span>
                          <span className="text-charcoal/60 block mt-0.5 leading-relaxed italic">{item.howToUse.dosage} — {item.howToUse.timing}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-charcoal/40 block italic">No morning items configured.</span>
                  )}
                </div>

                {/* Afternoon */}
                <div className="glass-panel p-5 rounded-2xl border border-white/50 space-y-3">
                  <div className="flex items-center space-x-2 border-b border-cream-dark/50 pb-2">
                    <h4 className="font-serif font-bold text-primary-green">Afternoon</h4>
                  </div>
                  {dailySchedule.afternoon.length > 0 ? (
                    <ul className="space-y-3">
                      {dailySchedule.afternoon.map(item => (
                        <li key={item.id} className="text-xs">
                          <span className="font-semibold block text-primary-green">{item.name}</span>
                          <span className="text-charcoal/60 block mt-0.5 leading-relaxed italic">{item.howToUse.dosage} — {item.howToUse.timing}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-charcoal/40 block italic">No afternoon items configured.</span>
                  )}
                </div>

                {/* Evening */}
                <div className="glass-panel p-5 rounded-2xl border border-white/50 space-y-3">
                  <div className="flex items-center space-x-2 border-b border-cream-dark/50 pb-2">
                    <h4 className="font-serif font-bold text-primary-green">Evening / Bedtime</h4>
                  </div>
                  {dailySchedule.evening.length > 0 ? (
                    <ul className="space-y-3">
                      {dailySchedule.evening.map(item => (
                        <li key={item.id} className="text-xs">
                          <span className="font-semibold block text-primary-green">{item.name}</span>
                          <span className="text-charcoal/60 block mt-0.5 leading-relaxed italic">{item.howToUse.dosage} — {item.howToUse.timing}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs text-charcoal/40 block italic">No evening items configured.</span>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* Right Column: Pricing & Checkout Summary */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border border-white/60 space-y-6 text-left">
              <h3 className="font-serif text-xl font-bold text-primary-green border-b border-cream-dark/50 pb-4">Protocol Summary</h3>
              
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between text-charcoal/60">
                  <span>Formulations ({stackItems.length})</span>
                  <span>₹{totalCost}</span>
                </div>
                <div className="flex justify-between text-charcoal/60">
                  <span>Shipping & Handling</span>
                  <span className="text-sage font-semibold uppercase">Free</span>
                </div>
                <div className="flex justify-between text-charcoal/60">
                  <span>Average Cost / Day</span>
                  <span>₹{dailyCost}</span>
                </div>
                
                <div className="gold-divider my-2"></div>
                
                <div className="flex justify-between text-base font-bold text-primary-green font-serif">
                  <span>Monthly Investment</span>
                  <span>₹{totalCost}</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => alert(`Your premium stack protocol totaling ₹${totalCost} has been compiled! In a live environment, this would proceed to our secure, transparent check-out.`)}
                  className="w-full bg-primary-green text-bg-primary hover:bg-sage hover:text-white py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer text-center"
                >
                  Configure Custom Order
                </button>
                
                <button
                  onClick={() => setCurrentSection('shop')}
                  className="w-full border border-primary-green/20 hover:border-primary-green text-primary-green bg-transparent py-4 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 hover:bg-primary-green/5 cursor-pointer text-center"
                >
                  + Add More Formulas
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Empty State */
        <div className="glass-panel p-16 rounded-3xl border border-cream-dark text-center space-y-6 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-xl bg-sage/10 text-sage flex items-center justify-center text-lg font-semibold font-mono mx-auto animate-float">
            KNW
          </div>
          <h3 className="font-serif text-3xl font-bold text-primary-green">Your Stack is Empty</h3>
          <p className="text-sm text-charcoal/70 max-w-sm mx-auto leading-relaxed">
            Build your personalized protocol by browsing our molecular formulations or taking our quick diagnostic quiz.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center pt-2">
            <button
              onClick={() => setCurrentSection('shop')}
              className="bg-primary-green text-bg-primary hover:bg-sage hover:text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-md cursor-pointer text-center"
            >
              Browse Shop
            </button>
            <button
              onClick={() => setCurrentSection('quiz')}
              className="border border-primary-green/20 hover:border-primary-green text-primary-green px-8 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 hover:bg-primary-green/5 cursor-pointer text-center"
            >
              Find Your Protocol
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

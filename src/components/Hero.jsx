import React from 'react'
import { PRODUCTS } from '../data'

export default function Hero({ setCurrentSection, onQuickView }) {
  // Select top 3 products for homepage bestsellers section
  const bestsellers = PRODUCTS.filter(p => [1, 2, 19].includes(p.id))

  // Helper to draw SVG stars for review ratings without emojis
  const renderSvgStars = () => {
    return (
      <div className="flex space-x-1 justify-center sm:justify-start">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} className="w-4.5 h-4.5 text-amber-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden divide-y divide-cream-dark/30">
      
      {/* SECTION 1: HERO INTRO */}
      <section className="relative pt-0 pb-16 md:pt-0 md:pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-sage/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Text Content */}
            <div className="lg:col-span-7 space-y-6 text-left py-1">
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-primary-green leading-[1.08] tracking-tight">
                Feel Good.<br />
                <span className="italic font-light text-sage">Live Well.</span>
              </h1>
              
              <p className="text-charcoal/80 text-lg md:text-xl max-w-xl leading-relaxed">
                We engineer clean, standard-controlled wellness supplements. Bypassing synthetic fillers and raw isolates, our formulas focus on organic chelations, liposomal delivery, and clinical efficacy.
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
                <button
                  onClick={() => setCurrentSection('shop')}
                  className="bg-primary-green text-bg-primary hover:bg-sage hover:text-white px-8 py-4 rounded-full text-sm uppercase tracking-widest font-semibold transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer text-center"
                >
                  Browse Shop
                </button>
                
                <button
                  onClick={() => setCurrentSection('quiz')}
                  className="border-2 border-primary-green/20 hover:border-primary-green text-primary-green bg-transparent px-8 py-4 rounded-full text-sm uppercase tracking-widest font-semibold transition-all duration-300 hover:bg-primary-green/5 cursor-pointer text-center"
                >
                  Take Wellness Quiz
                </button>
              </div>

              {/* Quick stats panel */}
              <div className="grid grid-cols-3 gap-6 pt-6 border-t border-cream-dark max-w-md">
                <div>
                  <span className="block font-serif text-3xl font-bold text-primary-green">100%</span>
                  <span className="text-xs text-charcoal/60 uppercase tracking-wider font-medium">Open Labels</span>
                </div>
                <div>
                  <span className="block font-serif text-3xl font-bold text-primary-green">Zero</span>
                  <span className="text-xs text-charcoal/60 uppercase tracking-wider font-medium">Synthetics</span>
                </div>
                <div>
                  <span className="block font-serif text-3xl font-bold text-primary-green">GMP</span>
                  <span className="text-xs text-charcoal/60 uppercase tracking-wider font-medium">Certified</span>
                </div>
              </div>

            </div>

            {/* Flat discovery counter concept card */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="relative mx-auto max-w-[420px] rounded-3xl overflow-hidden glass-panel shadow-2xl border border-white/60 p-6 group transition-all duration-500 hover:shadow-sage/20 hover:border-sage/30">
                
                {/* Product bottles jpeg image as visual header */}
                <div className="relative h-64 rounded-2xl overflow-hidden mb-6 bg-cream-dark">
                  <img 
                    src="/product bottles .jpeg" 
                    alt="Kenwell Premium Tabletop Counter Bottles" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent flex items-end p-4">
                    <span className="text-white font-serif text-xl font-medium tracking-wide">The Discovery Counter</span>
                  </div>
                </div>
                
                <div className="space-y-4 text-left">
                  <div className="flex items-center">
                    <span className="bg-sage/10 text-sage text-[10px] font-mono px-2 py-0.5 rounded">Scan and Trace</span>
                  </div>
                  
                  <h3 className="font-serif text-2xl text-primary-green font-bold">Tabletop Gym Station</h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed">
                    Look for our premium wooden counters in select gyms and wellness spaces. Scan the bottle QR code to access third-party lab assays, purity certificates, and active ingredient mapping.
                  </p>
                  
                  <div className="gold-divider opacity-50 my-2"></div>
                  
                  <div 
                    onClick={() => setCurrentSection('scanner')}
                    className="flex items-center justify-between bg-bg-secondary hover:bg-cream-dark/50 cursor-pointer p-3.5 rounded-xl border border-cream-dark transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-primary-green shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <div className="text-left">
                        <span className="block text-xs font-semibold text-primary-green">Try Lab Scanner</span>
                        <span className="text-[10px] text-charcoal/50">Verify bottle batch authenticity</span>
                      </div>
                    </div>
                    <span className="text-sage text-sm font-semibold group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: CURATED BESTSELLERS ON HOME */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sage font-mono uppercase tracking-wider text-xs font-semibold">Flagship Formulations</span>
          <h2 className="text-4xl md:text-5xl font-serif text-primary-green mt-2 mb-4">Customer Favorites</h2>
          <div className="gold-divider max-w-xs mx-auto mb-6"></div>
          <p className="text-charcoal/70 text-sm max-w-2xl mx-auto">
            Our most trusted and highly reviewed daily supplements. Clinically researched active compound limits for immediate physiological response.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bestsellers.map((prod) => (
            <div key={prod.id} className="glass-panel p-6 rounded-2xl border border-white/60 flex flex-col justify-between text-left hover:-translate-y-1.5 transition-all duration-300">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-mono text-charcoal/40">
                  <span className="bg-sage/10 text-sage px-2 py-0.5 rounded font-semibold uppercase">{prod.series}</span>
                  <span>{prod.form}</span>
                </div>
                
                <h3 
                  onClick={() => onQuickView(prod)}
                  className="font-serif text-2xl font-bold text-primary-green hover:text-sage transition-colors cursor-pointer"
                >
                  {prod.name}
                </h3>
                <p className="text-xs text-charcoal/60 leading-relaxed min-h-[3rem]">{prod.description}</p>
                
                <div className="flex space-x-1 items-center">
                  <svg className="w-3.5 h-3.5 text-amber-500 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="text-[11px] font-bold text-charcoal/70">4.8</span>
                  <span className="text-[10px] text-charcoal/40">(180+ reviews)</span>
                </div>

                <div className="pt-2 flex flex-wrap gap-1.5">
                  {prod.healthGoals.map(goal => (
                    <span key={goal} className="bg-bg-secondary text-charcoal/60 text-[9px] px-2 py-0.5 rounded font-medium">{goal}</span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-cream-dark/50 flex justify-between items-center">
                <div className="text-left font-mono">
                  <span className="block text-[8px] text-charcoal/40 uppercase">Sale Price</span>
                  <span className="text-base font-bold text-primary-green">₹{prod.price}</span>
                </div>
                <button 
                  onClick={() => onQuickView(prod)}
                  className="border border-primary-green/20 hover:border-primary-green text-primary-green px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button
            onClick={() => setCurrentSection('shop')}
            className="bg-primary-green text-bg-primary hover:bg-sage hover:text-white px-8 py-3 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer inline-block"
          >
            Explore All 23 Formulations
          </button>
        </div>
      </section>

      {/* SECTION 3: BIOAVAILABILITY GUIDE (COMPARISON) */}
      <section className="py-20 bg-bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-6 text-left">
              <span className="text-sage font-mono uppercase tracking-wider text-xs font-semibold">Clinical Bioavailability</span>
              <h2 className="text-4xl md:text-5xl font-serif text-primary-green leading-tight">Chelations vs Synthetics</h2>
              <div className="w-16 h-0.5 bg-sage"></div>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                Cheap, low-cost commercial supplements often utilize inorganic mineral salts (like Magnesium Oxide or Zinc Sulfate) because they are inexpensive to synthesize.
              </p>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                However, these molecules register absorption rates under 5% in human intestinal tracts. Unabsorbed ions remain in the gut lumen, drawing water in and causing digestive upset. 
              </p>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                Kenwell uses fully chelated organic minerals (glycinates and picolinates) that are absorbed intact through dipeptide pathways, yielding 5x higher cellular levels with absolute gut comfort.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="glass-panel rounded-2xl border border-white/60 overflow-hidden text-xs text-left shadow-md">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-bg-secondary/60 font-mono text-[9px] uppercase tracking-wider border-b border-cream-dark">
                      <th className="p-4">Mineral Parameter</th>
                      <th className="p-4">Standard Form (Competitors)</th>
                      <th className="p-4">Chelated Form (Kenwell)</th>
                      <th className="p-4 text-right">Efficacy Increase</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cream-dark/40">
                    <tr>
                      <td className="p-4 font-bold text-primary-green">Magnesium</td>
                      <td className="p-4 text-charcoal/60">Magnesium Oxide (4% absorption)</td>
                      <td className="p-4 font-semibold">Magnesium Glycinate (Chelated)</td>
                      <td className="p-4 text-right font-bold text-sage">5.4x Higher</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-primary-green">Zinc</td>
                      <td className="p-4 text-charcoal/60">Zinc Sulfate (competitive channels)</td>
                      <td className="p-4 font-semibold">Zinc Picolinate (organic carrier)</td>
                      <td className="p-4 text-right font-bold text-sage">3.1x Higher</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-primary-green">Vitamin C</td>
                      <td className="p-4 text-charcoal/60">Ascorbic Acid (gut saturation limits)</td>
                      <td className="p-4 font-semibold">Liposomal Ascorbic (lipid wrapper)</td>
                      <td className="p-4 text-right font-bold text-sage">4.8x Higher</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-bold text-primary-green">Glutathione</td>
                      <td className="p-4 text-charcoal/60">Standard L-Glutathione (acid damage)</td>
                      <td className="p-4 font-semibold">Reduced L-Glutathione (acid stable)</td>
                      <td className="p-4 text-right font-bold text-sage">4.2x Higher</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 4: THE BOTTLE TRANSPARENCY PHILOSOPHY */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="glass-panel p-8 rounded-2xl border border-white/60 space-y-4 hover:border-sage/40 transition-colors text-left">
            <span className="font-mono text-xs uppercase tracking-wider text-sage font-bold">01 - Bioavailability</span>
            <h3 className="font-serif text-2xl font-bold text-primary-green">Targeted Absorption</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              Every formula is customized to pass gut limits. By utilizing molecular complexes that utilize dipeptide pathways, we bypass standard mineral transport channels.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/60 space-y-4 hover:border-sage/40 transition-colors text-left">
            <span className="font-mono text-xs uppercase tracking-wider text-sage font-bold">02 - Zero Fillers</span>
            <h3 className="font-serif text-2xl font-bold text-primary-green">Open Ingredient List</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              We never pack cheap silicon dioxide, talc, or chemical glazes. We disclose every single inactive stabilizer and capsule wrapper directly on our open label.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-2xl border border-white/60 space-y-4 hover:border-sage/40 transition-colors text-left">
            <span className="font-mono text-xs uppercase tracking-wider text-sage font-bold">03 - Origin Sourced</span>
            <h3 className="font-serif text-2xl font-bold text-primary-green">Origin Traceability</h3>
            <p className="text-xs text-charcoal/70 leading-relaxed">
              We trace each botanical extract to its geographical source (like KSM-66 from Rajasthan). Our active chemical compounds are sourced from verified GMP facilities.
            </p>
          </div>

        </div>
      </section>

      {/* SECTION 5: CLINICAL CUSTOMER REVIEWS */}
      <section className="py-20 bg-bg-secondary/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span className="text-sage font-mono uppercase tracking-wider text-xs font-semibold">User Verification</span>
            <h2 className="text-4xl md:text-5xl font-serif text-primary-green mt-2 mb-4">Reviews from the Field</h2>
            <div className="gold-divider max-w-xs mx-auto mb-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Review 1 */}
            <div className="glass-panel p-8 rounded-2xl border border-white/65 space-y-6 text-left flex flex-col justify-between">
              <div className="space-y-4">
                {renderSvgStars()}
                <h4 className="font-serif text-lg font-bold text-primary-green">"Amazing recovery times"</h4>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  I switched to the Chelated Magnesium Glycinate and Ashwagandha stack. My sleep latency dropped from 45 minutes to under 15, and I wake up without morning grogginess. The label breakdown is completely clear.
                </p>
              </div>
              <div className="border-t border-cream-dark/40 pt-4 flex items-center justify-between text-xs text-charcoal/50">
                <span className="font-bold">Rahul K.</span>
                <span>Verified Crossfit Athlete</span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="glass-panel p-8 rounded-2xl border border-white/65 space-y-6 text-left flex flex-col justify-between">
              <div className="space-y-4">
                {renderSvgStars()}
                <h4 className="font-serif text-lg font-bold text-primary-green">"Legitimate open labels"</h4>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  As a clinical nutritionist, I examine client supplement panels closely. Kenwell is the first Indian brand I have recommended that discloses every inactive filler and capsule stabilizer. Purity assays are verified.
                </p>
              </div>
              <div className="border-t border-cream-dark/40 pt-4 flex items-center justify-between text-xs text-charcoal/50">
                <span className="font-bold">Dr. Priya M.</span>
                <span>Clinical Nutrition Specialist</span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="glass-panel p-8 rounded-2xl border border-white/65 space-y-6 text-left flex flex-col justify-between">
              <div className="space-y-4">
                {renderSvgStars()}
                <h4 className="font-serif text-lg font-bold text-primary-green">"Mitochondrial fuel works"</h4>
                <p className="text-xs text-charcoal/70 leading-relaxed">
                  The NAD+ and CoQ10 stack has made a noticeable change in my mid-afternoon focus. I no longer experience brain fog during coding blocks. The transparency scanner Certificate of Analysis verified the active assays.
                </p>
              </div>
              <div className="border-t border-cream-dark/40 pt-4 flex items-center justify-between text-xs text-charcoal/50">
                <span className="font-bold">Vikram S.</span>
                <span>Software Systems Architect</span>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  )
}

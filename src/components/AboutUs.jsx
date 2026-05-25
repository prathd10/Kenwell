import React from 'react'

export default function AboutUs() {
  return (
    <div className="py-12 px-4 md:px-8 max-w-5xl mx-auto space-y-16 text-left animate-in fade-in duration-300">
      
      {/* Editorial Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-sage font-mono uppercase tracking-wider text-xs font-semibold">Our Philosophy</span>
        <h1 className="text-4xl md:text-6xl font-serif text-primary-green leading-tight">
          We Have Nothing To Hide
        </h1>
        <div className="w-20 h-0.5 bg-sage"></div>
        <p className="text-charcoal/80 font-serif text-xl italic leading-relaxed">
          "Kenwell was founded on a simple premise: supplements should be clean, clinically studied, and 100% transparent. No proprietary formulas, no synthetic binders, and no marketing jargon."
        </p>
      </div>

      {/* Grid: Pillars of Transparency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold text-primary-green">The Transparency Sourcing Model</h3>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            Many supplement brands hide their low active ingredient dosages behind proprietary blends. We believe you have a right to know exactly what goes into your body. Every Kenwell label lists the precise milligram weight of all active ingredients and every filler used in our capsules.
          </p>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            Our raw botanical extracts are harvested directly from origin environments—such as KSM-66 Ashwagandha from Rajasthan, India—and our minerals are fully chelated organic salts for optimal gut tolerance.
          </p>
        </div>

        <div className="bg-bg-secondary p-8 rounded-3xl border border-cream-dark/50 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-serif text-xl font-bold text-primary-green">Our Quality Commitment</h4>
            <div className="space-y-3 text-xs text-charcoal/70">
              <div className="flex items-start space-x-2">
                <span className="text-sage font-bold">-</span>
                <p><strong>Assay Testing:</strong> Every manufacturing batch undergoes third-party HPLC assay verification to validate active strength.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-sage font-bold">-</span>
                <p><strong>Heavy Metals Screen:</strong> Strict limits on lead, cadmium, arsenic, and mercury below detectable thresholds.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-sage font-bold">-</span>
                <p><strong>GMP Accredited:</strong> Manufactured in compliance with national and international GMP, ISO, and FSSAI standards.</p>
              </div>
            </div>
          </div>
          <div className="border-t border-cream-dark/50 pt-4 mt-6 flex justify-between text-[10px] font-mono text-charcoal/50">
            <span>REGISTRATION NO: KNW-GMP-901</span>
            <span>STANDARD CONTROL REGISTER</span>
          </div>
        </div>
      </div>

      {/* Section: Offline Counter Concept */}
      <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/60 space-y-6">
        <h3 className="font-serif text-3xl font-bold text-primary-green">The Discovery Counter Concept</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-sm text-charcoal/70 leading-relaxed">
              We operate on an offline-discovery, online-conversion model. Our premium wood-and-glass tabletop counters are placed in select high-end gyms, crossfit boxes, and wellness spaces.
            </p>
            <p className="text-sm text-charcoal/70 leading-relaxed">
              Instead of forcing gyms to carry heavy inventory risk, the tabletop counter serves as an educational station. Customers scan the container QR code to check the lab verification Certificate of Analysis (CoA) and order directly online, with a shared revenue model for fitness partners.
            </p>
          </div>
          
          <div className="space-y-4 font-mono text-xs text-charcoal/60 bg-bg-primary/50 p-6 rounded-2xl border border-cream-dark/30">
            <h4 className="font-serif font-bold text-sm text-primary-green uppercase tracking-wide">Distribution Model Parameters</h4>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-cream-dark/50 pb-1">
                <span>Inventory Cost for Gyms</span>
                <span className="font-bold text-sage">Zero Risk</span>
              </div>
              <div className="flex justify-between border-b border-cream-dark/50 pb-1">
                <span>Direct Sourcing Verification</span>
                <span className="font-bold text-sage">QR QR-code Scan</span>
              </div>
              <div className="flex justify-between border-b border-cream-dark/50 pb-1">
                <span>Partner Commission</span>
                <span className="font-bold text-sage">Shared Revenue</span>
              </div>
            </div>
            <p className="text-[10px] text-charcoal/50 leading-relaxed pt-2">
              Our partner network spans across premium gyms in major metro areas, driving transparent product interaction before purchasing.
            </p>
          </div>
        </div>
      </div>

      {/* Corporate Info Footer */}
      <div className="text-center max-w-md mx-auto pt-6 text-xs text-charcoal/50 space-y-1">
        <p>Kenwell Nutraceuticals Private Limited</p>
        <p>Corporate Office: Bandra Kurla Complex, Mumbai, India</p>
        <p>Contact: partnership@kenwell.co</p>
      </div>

    </div>
  )
}

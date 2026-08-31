import React from 'react'
import BackButton from './BackButton'

export default function AboutUs() {
  return (
    <div className="py-12 px-4 md:px-8 max-w-5xl mx-auto space-y-16 text-left animate-in fade-in duration-300">
      
      {/* Editorial Header */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-[#616F3E] font-mono uppercase tracking-wider text-xs font-semibold">Our Philosophy</span>
        <h1 className="text-4xl md:text-6xl font-serif text-[#203348] leading-tight">
          We Have Nothing To Hide
        </h1>
        <div className="w-20 h-0.5 bg-[#616F3E]"></div>

      <BackButton className='mb-6' />
        <p className="text-[#203348]/80 font-serif text-xl italic leading-relaxed">
          "Kenwell was founded on a simple premise: supplements should be clean, clinically studied, and 100% transparent. No proprietary formulas, no synthetic binders, and no marketing jargon."
        </p>
      </div>

      {/* Grid: Pillars of Transparency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#203348]">The Transparency Sourcing Model</h3>
          <p className="text-sm text-[#203348]/70 leading-relaxed">
            Many supplement brands hide their low active ingredient dosages behind proprietary blends. We believe you have a right to know exactly what goes into your body. Every Kenwell label lists the precise milligram weight of all active ingredients and every filler used in our capsules.
          </p>
          <p className="text-sm text-[#203348]/70 leading-relaxed">
            Our raw botanical extracts are harvested directly from origin environments—such as KSM-66 Ashwagandha from Rajasthan, India—and our minerals are fully chelated organic salts for optimal gut tolerance.
          </p>
        </div>

        <div className="relative overflow-hidden bg-[#FAF8F5] p-8 rounded-3xl border border-[#E4DFD3] flex flex-col justify-between">
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.05] bg-repeat"
            style={{ backgroundImage: "url('/patterns/pattern-green.jpg')", backgroundSize: '280px auto' }}
          />
          <div className="relative z-10 space-y-4">
            <h4 className="font-serif text-xl font-bold text-[#203348]">Our Quality Commitment</h4>
            <div className="space-y-3 text-xs text-[#203348]/70">
              <div className="flex items-start space-x-2">
                <span className="text-[#616F3E] font-bold">-</span>
                <p><strong>Assay Testing:</strong> Every manufacturing batch undergoes third-party HPLC assay verification to validate active strength.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-[#616F3E] font-bold">-</span>
                <p><strong>Heavy Metals Screen:</strong> Strict limits on lead, cadmium, arsenic, and mercury below detectable thresholds.</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-[#616F3E] font-bold">-</span>
                <p><strong>GMP Accredited:</strong> Manufactured in compliance with national and international GMP, ISO, and FSSAI standards.</p>
              </div>
            </div>
          </div>
          <div className="relative z-10 border-t border-[#E4DFD3] pt-4 mt-6 flex justify-between text-[10px] font-mono text-[#203348]/50">
            <span>REGISTRATION NO: KNW-GMP-901</span>
            <span>STANDARD CONTROL REGISTER</span>
          </div>
        </div>
      </div>

      {/* Section: Offline Counter Concept */}
      <div className="relative overflow-hidden bg-white p-8 md:p-10 rounded-3xl border border-[#E4DFD3] shadow-sm space-y-6">
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.04] bg-repeat"
          style={{ backgroundImage: "url('/patterns/pattern-blue.jpg')", backgroundSize: '320px auto' }}
        />
        <div className="relative z-10 space-y-6">
          <h3 className="font-serif text-3xl font-bold text-[#203348]">The Discovery Counter Concept</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-sm text-[#203348]/70 leading-relaxed">
              We operate on an offline-discovery, online-conversion model. Our premium wood-and-glass tabletop counters are placed in select high-end gyms, crossfit boxes, and wellness spaces.
            </p>
            <p className="text-sm text-[#203348]/70 leading-relaxed">
              Instead of forcing gyms to carry heavy inventory risk, the tabletop counter serves as an educational station. Customers scan the container QR code to check the lab verification Certificate of Analysis (CoA) and order directly online, with a shared revenue model for fitness partners.
            </p>
          </div>
          
          <div className="space-y-4 font-mono text-xs text-[#203348]/70 bg-[#FAF8F5] p-6 rounded-2xl border border-[#E4DFD3]">
            <h4 className="font-serif font-bold text-sm text-[#203348] uppercase tracking-wide">Distribution Model Parameters</h4>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-[#E4DFD3] pb-1">
                <span>Inventory Cost for Gyms</span>
                <span className="font-bold text-[#616F3E]">Zero Risk</span>
              </div>
              <div className="flex justify-between border-b border-[#E4DFD3] pb-1">
                <span>Direct Sourcing Verification</span>
                <span className="font-bold text-[#616F3E]">QR Code Scan</span>
              </div>
              <div className="flex justify-between border-b border-[#E4DFD3] pb-1">
                <span>Partner Commission</span>
                <span className="font-bold text-[#A5492B]">Shared Revenue</span>
              </div>
            </div>
            <p className="text-[10px] text-[#203348]/50 leading-relaxed pt-2">
              Our partner network spans across premium gyms in major metro areas, driving transparent product interaction before purchasing.
            </p>
          </div>
        </div>
        </div>
      </div>

      {/* Corporate Info Footer */}
      <div className="text-center max-w-md mx-auto pt-6 text-xs text-[#203348]/50 space-y-1">
        <p>Kenwell Nutraceuticals Private Limited</p>
        <p>Corporate Office: Bandra Kurla Complex, Mumbai, India</p>
        <p>Contact: partnership@kenwell.co</p>
      </div>

    </div>
  )
}

import React, { useState } from 'react'
import BackButton from './BackButton'
import { useProducts } from '../context/ProductsContext'

export default function LabScanner() {
  const { products } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [reportRetrieved, setReportRetrieved] = useState(false)

  // Sourcing list to match products
  const getSourcingLocation = (productSlug) => {
    const sourcingMap = {
      'multivitamin-with-probiotics': { active: 'L. acidophilus blend', source: 'Frankfurt, Germany', base: 'Yeast free organic base' },
      'chelated-magnesium-glycinate': { active: 'Fully Chelated Magnesium Glycinate', source: 'Munich, Germany', base: 'Soluble cellulose binder' },
      'vitamin-d3-k2-calcium': { active: 'trans-MK7 Vitamin K2', source: 'Oslo, Norway', base: 'Organic calcium malate' },
      'zinc-picolonate-magnesium': { active: 'Zinc Picolinate', source: 'Gujarat, India', base: 'Microcrystalline cellulose' },
      'single-strength-fish-oil': { active: 'EPA/DHA Fish Oil', source: 'Coastal Chimbote, Peru', base: 'Triglyceride concentrate' },
      'triple-strength-fish-oil': { active: 'Triple Strength Fish Oil', source: 'Coastal Chimbote, Peru', base: 'Triglyceride concentrate' },
      'vegetarian-omega': { active: 'Marine Algal Oil', source: 'Nova Scotia, Canada', base: 'Vegan softgel starch wrapper' },
      'nad': { active: 'Nicotinamide Mononucleotide (NMN)', source: 'Kyoto, Japan', base: 'Trimethylglycine methyl donor' },
      'vitamin-c': { active: 'Liposomal Ascorbic Acid', source: 'Zurich, Switzerland', base: 'Sunflower lecithin carrier' },
      'glutathione-reduced': { active: 'Reduced L-Glutathione', source: 'Tokyo, Japan', base: 'Milk thistle standard matrix' },
      'ksm-66-ashwagandha': { active: 'KSM-66 Ashwagandha Root Extract', source: 'Rajasthan, India', base: 'Standardized root withanolides' },
      'berberine-hcl': { active: 'Berberine HCl', source: 'Himalayan Foothills, India', base: 'Chromium picolonate blend' }
    }

    return sourcingMap[productSlug] || { active: 'Active Botanical Extract', source: 'Western Ghats, India', base: 'Clean label vegetable capsules' }
  }

  const handleScan = (product) => {
    setSelectedProduct(product)
    setScanning(true)
    setReportRetrieved(false)

    // Simulate scanner sweep loading state
    setTimeout(() => {
      setScanning(false)
      setReportRetrieved(true)
    }, 1800)
  }

  const handleReset = () => {
    setSelectedProduct(null)
    setScanning(false)
    setReportRetrieved(false)
  }

  return (
    <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[#616F3E] font-mono uppercase tracking-wider text-xs font-semibold">Label Integrity Portal</span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#203348]">Lab Transparency Scanner</h1>
        <div className="gold-divider max-w-xs mx-auto"></div>
        <p className="text-[#203348]/70 text-sm leading-relaxed">
          Verify your batch Certificate of Analysis (CoA), purity percentages, heavy metals panel, and geographic botanical origin.
        </p>
      </div>

      <BackButton />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Column: Simulated Phone Scanner Screen */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[360px] h-[580px] bg-[#203348] rounded-[40px] border-8 border-[#E4DFD3] shadow-2xl p-4 overflow-hidden flex flex-col justify-between text-white font-sans">
            
            {/* Phone Speaker & Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#E4DFD3] rounded-b-2xl z-20 flex justify-center items-center">
              <div className="w-12 h-1 bg-[#203348]/50 rounded-full"></div>
            </div>

            {/* Scanning viewport */}
            <div className="relative flex-grow rounded-2xl overflow-hidden bg-black/90 border border-white/10 mt-6 flex flex-col items-center justify-center p-4">
              
              {/* Scan Jpeg Overlay backdrop if no report */}
              {!reportRetrieved && (
                <div className="absolute inset-0 opacity-40">
                  <img 
                    src="/scannable qr and counter.jpeg" 
                    alt="Scan Background" 
                    className="w-full h-full object-cover blur-[2px]"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
              )}

              {/* Scanning Active Overlay Sweep Line */}
              {scanning && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#616F3E] animate-[bounce_2s_infinite] shadow-[0_0_15px_#616F3E] z-20"></div>
              )}

              {/* Viewport UI states */}
              {!selectedProduct && (
                <div className="z-10 text-center space-y-4 p-4">
                  <div className="w-20 h-20 border-2 border-dashed border-white/40 rounded-2xl mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <circle cx="12" cy="13" r="3" strokeWidth="1.5" />
                    </svg>
                  </div>
                  <h4 className="font-serif text-lg font-bold">Align QR Code</h4>
                  <p className="text-[10px] text-white/60 leading-relaxed max-w-[180px] mx-auto">
                    Select a Kenwell formula below to align its container with your camera lens.
                  </p>
                </div>
              )}

              {selectedProduct && scanning && (
                <div className="z-10 text-center space-y-3">
                  <div className="w-24 h-24 border-2 border-[#616F3E] rounded-2xl mx-auto flex items-center justify-center">
                    <svg className="w-10 h-10 text-[#616F3E] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 6H16" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-semibold tracking-wider uppercase text-[#616F3E]">Scanning Batch QR...</h4>
                  <p className="text-[10px] text-white/50">{selectedProduct.name}</p>
                </div>
              )}

              {selectedProduct && reportRetrieved && (
                <div className="z-10 text-center space-y-4 p-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 bg-[#616F3E]/20 border border-[#616F3E]/50 text-[#616F3E] rounded-full mx-auto flex items-center justify-center">
                    <svg className="w-8 h-8 text-[#616F3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-[#616F3E] tracking-wider uppercase">Authenticity Verified</span>
                    <h4 className="font-serif text-base font-bold text-white mt-1">{selectedProduct.name}</h4>
                    <p className="text-[10px] text-white/40 mt-0.5">Batch #KNW-2026-A22</p>
                  </div>
                  <button 
                    onClick={handleReset}
                    className="bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono uppercase tracking-wider py-2 px-4 rounded-full transition-all cursor-pointer"
                  >
                    Scan Another
                  </button>
                </div>
              )}

              {/* Target Scan Reticle Box */}
              {!scanning && !reportRetrieved && (
                <div className="absolute w-44 h-44 border-2 border-white/20 rounded-3xl flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-[#616F3E] -mt-1 -ml-1 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-[#616F3E] -mt-1 -mr-1 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-[#616F3E] -mb-1 -ml-1 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-[#616F3E] -mb-1 -mr-1 rounded-br-lg"></div>
                  <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">Align QR Code</span>
                </div>
              )}

            </div>

            {/* Select product list in-phone */}
            <div className="h-44 flex flex-col justify-end py-2 bg-[#203348]/90">
              <span className="block text-[8px] font-mono uppercase text-white/40 tracking-wider text-left mb-1.5">Select Formula to verify</span>
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
                {products.slice(0, 10).map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => handleScan(prod)}
                    disabled={scanning}
                    className={`flex-shrink-0 px-3 py-2 rounded-xl text-[10px] font-semibold text-left transition-all border w-28 cursor-pointer ${
                      selectedProduct?.id === prod.id 
                        ? 'bg-[#616F3E] border-[#616F3E] text-white' 
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="block truncate">{prod.name}</span>
                    <span className="block text-[8px] text-white/40 font-mono mt-0.5">{prod.series.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Lab CoA Sheet & Sourcing Map */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          {reportRetrieved && selectedProduct ? (
            <div className="relative overflow-hidden bg-white p-8 rounded-3xl border border-[#E4DFD3] shadow-md space-y-6 text-left animate-in fade-in duration-400">
              {/* Botanical watermark */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.04] bg-repeat"
                style={{ backgroundImage: "url('/patterns/pattern-green.jpg')", backgroundSize: '300px auto' }}
              />
              
              {/* CoA Title Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#E4DFD3] pb-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#203348]">Certificate of Analysis (CoA)</h3>
                  <p className="text-xs text-[#203348]/50 font-mono mt-0.5">
                    Batch Code: <span className="font-bold text-[#203348]">KNW-2026-A22</span> | Manufacture: March 2026
                  </p>
                </div>
                <div className="bg-[#616F3E]/10 text-[#616F3E] border border-[#616F3E]/20 rounded-full px-3 py-1 text-xs font-mono font-semibold uppercase tracking-wider">
                  Pass / Approved
                </div>
              </div>

              {/* Lab Assays (Assay, Heavy Metals, Microbe) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Active Purity Assay */}
                <div className="bg-[#FAF8F5] border border-[#E4DFD3] rounded-xl p-4 space-y-3">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-[#203348]/50 font-bold border-b border-[#E4DFD3] pb-1">Chemical Assay Purity</h4>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#203348]">{getSourcingLocation(selectedProduct.slug).active}</span>
                    <span className="font-mono text-[#616F3E] font-bold">103.2%</span>
                  </div>
                  <p className="text-[10px] text-[#203348]/60 leading-relaxed">
                    HPLC verified active compound levels match 100%+ label guidelines with zero synthetic overages.
                  </p>
                </div>

                {/* Sourcing Location Card */}
                <div className="bg-[#FAF8F5] border border-[#E4DFD3] rounded-xl p-4 space-y-3">
                  <h4 className="font-mono text-[9px] uppercase tracking-wider text-[#203348]/50 font-bold border-b border-[#E4DFD3] pb-1">Origin Sourcing Check</h4>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#203348]">Botanical Origin</span>
                    <span className="font-mono text-[#616F3E] font-bold">{getSourcingLocation(selectedProduct.slug).source}</span>
                  </div>
                  <p className="text-[10px] text-[#203348]/60 leading-relaxed">
                    Raw extract harvested directly from regional source; verified trace coordinates.
                  </p>
                </div>

              </div>

              {/* Lab Panel Table */}
              <div className="border border-[#E4DFD3] rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F2EEE5] font-mono text-[9px] uppercase tracking-wider border-b border-[#E4DFD3] text-[#203348]">
                      <th className="p-3">Assay Parameter</th>
                      <th className="p-3">Specification Limit</th>
                      <th className="p-3">Tested Result</th>
                      <th className="p-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4DFD3]">
                    <tr>
                      <td className="p-3 font-semibold text-[#203348]">Lead (Pb)</td>
                      <td className="p-3 font-mono text-[#203348]/60">&lt; 0.5 ppm</td>
                      <td className="p-3 font-mono font-bold text-[#203348]">0.02 ppm</td>
                      <td className="p-3 text-right font-bold text-[#616F3E]">Pass</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#203348]">Arsenic (As)</td>
                      <td className="p-3 font-mono text-[#203348]/60">&lt; 0.5 ppm</td>
                      <td className="p-3 font-mono font-bold text-[#203348]">&lt; 0.01 ppm</td>
                      <td className="p-3 text-right font-bold text-[#616F3E]">Pass</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#203348]">Cadmium (Cd)</td>
                      <td className="p-3 font-mono text-[#203348]/60">&lt; 0.3 ppm</td>
                      <td className="p-3 font-mono font-bold text-[#203348]">&lt; 0.01 ppm</td>
                      <td className="p-3 text-right font-bold text-[#616F3E]">Pass</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#203348]">Total Yeast & Mold</td>
                      <td className="p-3 font-mono text-[#203348]/60">&lt; 100 CFU/g</td>
                      <td className="p-3 font-mono font-bold text-[#203348]">Absent</td>
                      <td className="p-3 text-right font-bold text-[#616F3E]">Pass</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-[#203348]">E. Coli & Salmonella</td>
                      <td className="p-3 font-mono text-[#203348]/60">Absent / 10g</td>
                      <td className="p-3 font-mono font-bold text-[#203348]">Absent</td>
                      <td className="p-3 text-right font-bold text-[#616F3E]">Pass</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Transparent Excipient Badge */}
              <div className="bg-[#FAF8F5] border border-[#E4DFD3] rounded-2xl p-5 space-y-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#203348]/40 font-bold block">100% Disclosure Excipient Profile</span>
                <p className="text-xs text-[#203348]/70 leading-relaxed">
                  In addition to the active molecular raw compounds, this batch utilizes: <strong>{getSourcingLocation(selectedProduct.slug).base}</strong>. Absolutely zero titanium dioxide, talc, artificial colorings, or synthetic glazing agents were used in formulation.
                </p>
              </div>

            </div>
          ) : (
            /* Standby State with Brand image card */
            <div className="bg-white p-8 rounded-3xl border border-[#E4DFD3] shadow-md flex flex-col justify-center items-center text-center space-y-6 min-h-[480px]">
              
              <div className="relative w-full max-w-[480px] h-60 rounded-2xl overflow-hidden bg-[#FAF8F5] shadow-md border border-[#E4DFD3]">
                <img 
                  src="/scannable qr and counter.jpeg" 
                  alt="Kenwell Tabletop Counter Concept" 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#203348]/80 via-[#203348]/30 to-transparent flex flex-col justify-end p-6 text-left text-white">
                  <span className="text-xs font-mono text-[#A5492B] uppercase tracking-widest font-bold">We Have Nothing To Hide</span>
                  <h3 className="font-serif text-2xl font-bold mt-1">Transparency First Sourcing</h3>
                </div>
              </div>
              
              <div className="max-w-md space-y-3">
                <h3 className="font-serif text-2xl font-semibold text-[#203348]">Acknowledge Active Batches</h3>
                <p className="text-sm text-[#203348]/70 leading-relaxed">
                  Every single bottle shipped features a unique scannable QR code on the back label. Scan this code using your mobile device or select a formula on the phone mock layout to trace third-party testing logs and active ingredients assays.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[#203348]/60 font-mono">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-[#616F3E] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  heavy metals tested
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-[#616F3E] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  active molecule assays
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-[#616F3E] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  excipient disclosure
                </span>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  )
}

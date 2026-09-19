import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DOMPurify from 'dompurify'
import BackButton from './BackButton'
import { ARTICLES } from '../data'

// Map of scientific terms to their definitions for hover tooltips
const SCIENTIFIC_GLOSSARY = {
  'Magnesium': 'An essential mineral that operates as a cofactor in over 300 enzyme complexes, governing ATP synthesis and nerve signals.',
  'Magnesium Glycinate': 'Magnesium bound to glycine, forming an organic chelation that is absorbed through dipeptide channels rather than standard mineral transporters.',
  'glycine': 'An amino acid that acts as an inhibitory neurotransmitter in the brain, binding to NMDA receptors to quiet neural firing and promote sleep.',
  'bioavailability': 'The fraction of an administered nutrient dosage that enters systemic circulation to be active in target cells.',
  'Magnesium Oxide': 'An inorganic magnesium salt with low bioavailability (~4%) that remains in the gut and acts as an osmotic laxative.',
  'chelated': 'Chemically bound to an organic molecule (such as an amino acid) to protect the mineral from binding dietary antagonists in the gut.',
  'dipeptide channels': 'Peptide transporters (PepT1) in the intestinal wall that absorb amino acid pairs quickly, avoiding standard mineral channel bottlenecks.',
  'NMDA receptors': 'Receptors in the brain that regulate synaptic plasticity and memory. Over-activation causes excitotoxicity and sleep disruption.',
  'liposome': 'A microscopic spherical lipid vesicle composed of a bilayer of phospholipids, matching human cell membrane structures to protect encapsulated cargo.',
  'Glutathione': 'A tripeptide antioxidant synthesized in cells. Known as the master antioxidant, it recycles other vitamins and clears liver toxins.',
  'SVCT-1': 'Sodium-Dependent Vitamin C Transporter 1, the primary channel that absorbs standard ascorbic acid in the gut; saturates at low doses.',
  'phospholipids': 'Lipids containing a phosphate group, forming the structural double layer of all biological cellular membranes.',
  'lymphatic system': 'Part of the circulatory system that absorbs fat-soluble nutrients directly, bypassing immediate liver filtration.',
  'first-pass liver metabolism': 'The metabolic clearing process where substances absorbed from the gut go straight to the liver to be broken down before reaching blood circulation.',
  'plasma concentration': 'The actual amount of a compound circulating in the blood fluid, determining its biological availability to cells.',
  'NAD+': 'Nicotinamide Adenine Dinucleotide, a critical coenzyme present in all cells that carries electrons in mitochondria to synthesize ATP (cellular energy).',
  'mitochondria': 'The cellular powerhouses that convert oxygen and nutrients into ATP through the electron transport chain.',
  'ATP': 'Adenosine Triphosphate, the fundamental energy currency used by cells to perform biological work.',
  'sirtuins': 'Histone deacetylase enzymes (SIRT1-7) that regulate epigenetic silencing, cellular lifespan, DNA repair, and mitochondrial generation.',
  'withanolides': 'Active chemical compounds found in ashwagandha root that exert adaptogenic, anti-inflammatory, and neuroprotective effects.',
  'HPA axis': 'The Hypothalamic-Pituitary-Adrenal system, the biological feedback loop that governs our hormonal response to stress and cortisol levels.',
  'cortisol': 'The primary glucocorticoid stress hormone synthesized by adrenal glands; chronic elevation leads to fatigue, weight gain, and muscle loss.',
  'adaptogen': 'A natural substance (herbal or botanical) that increases the body\'s resistance to physical, environmental, or psychological stress.',
  'AMPK': 'Adenosine Monophosphate-Activated Protein Kinase, the master energy-sensing metabolic switch that regulates glucose and lipid balance.',
  'gluconeogenesis': 'The hepatic process of synthesizing glucose from non-carbohydrate sources (such as amino acids or lipids).',
  'serotonin': 'A primary neurotransmitter regulating mood, sleep, and digestion; approximately 90% is synthesized in the gut mucosa.',
  'vagus nerve': 'The principal cranial nerve connecting the enteric nervous system of the gut directly to the central nervous system in the brain.',
  'excipient': 'An inactive substance formulated alongside active ingredients, acting as a binder, capsule shell, or flow agent.'
}

export default function ScienceLibrary() {
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredTerm, setHoveredTerm] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  // Filter articles by topic and query search
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesTopic = selectedTopic === 'All' || article.topic === selectedTopic
      const matchesSearch = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchesTopic && matchesSearch
    })
  }, [selectedTopic, searchQuery])

  // Wrap glossary terms with tooltip triggers dynamically in the content html
  const renderInteractiveContent = (htmlContent) => {
    let modifiedHtml = htmlContent
    
    // Sort terms by length descending to avoid matching substrings inside larger terms first
    const sortedTerms = Object.keys(SCIENTIFIC_GLOSSARY).sort((a, b) => b.length - a.length)
    
    sortedTerms.forEach((term) => {
      const regex = new RegExp(`\\b(${term})\\b`, 'gi')
      modifiedHtml = modifiedHtml.replace(regex, `<span class="border-b border-dashed border-[#616F3E] text-[#616F3E] cursor-help font-semibold transition-colors hover:bg-[#616F3E]/10" data-glossary="${term}">$1</span>`)
    })

    return { __html: DOMPurify.sanitize(modifiedHtml) }
  }

  const handleContentInteraction = (e) => {
    const glossaryTerm = e.target.getAttribute('data-glossary')
    if (glossaryTerm) {
      const normalizedTerm = Object.keys(SCIENTIFIC_GLOSSARY).find(
        key => key.toLowerCase() === glossaryTerm.toLowerCase()
      )
      
      if (normalizedTerm) {
        setHoveredTerm({
          term: normalizedTerm,
          definition: SCIENTIFIC_GLOSSARY[normalizedTerm]
        })
        
        // Position tooltip relative to cursor or element
        const rect = e.target.getBoundingClientRect()
        setTooltipPos({
          x: rect.left + window.scrollX + (rect.width / 2),
          y: rect.top + window.scrollY - 10
        })
      }
    } else {
      setHoveredTerm(null)
    }
  }

  const handleClearGlossary = () => {
    setHoveredTerm(null)
  }

  return (
    <div className="py-16 px-6 md:px-12 lg:px-20 max-w-[1600px] mx-auto min-h-screen relative bg-[#FAF8F5]">
      
      <div className="mb-8 relative z-20">
        <BackButton />
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-8 mb-16 max-w-4xl mx-auto relative z-10 text-center"
      >
        <span className="text-[#616F3E] font-mono uppercase tracking-widest text-xs font-bold mb-6 block">
          Editorial & Research
        </span>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-[#203348] leading-[1.1] tracking-tight">
          The Science of<br/>Well-being.
        </h1>
        <p className="text-[#203348]/60 text-lg md:text-xl mt-8 max-w-2xl mx-auto font-light leading-relaxed">
          Explore our library of research-backed articles, clinical insights, and the biological mechanisms behind our formulas.
        </p>
      </motion.div>

      {/* Minimal Search & Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16 border-b border-[#203348]/10 pb-6 relative z-10"
      >
        {/* Topic Filters */}
        <div className="flex flex-wrap gap-8 md:gap-10">
          {['All', 'Vitamins', 'Performance', 'Longevity', 'Stress', 'Gut Health'].map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`text-xs md:text-sm font-semibold tracking-widest uppercase transition-all relative pb-3 cursor-pointer ${
                selectedTopic === topic
                  ? 'text-[#203348]'
                  : 'text-[#203348]/40 hover:text-[#203348]/80'
              }`}
            >
              {topic}
              {selectedTopic === topic && (
                <motion.div 
                  layoutId="activeTopic"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#203348]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Minimal Search */}
        <div className="relative w-full lg:w-72 group">
          <input
            type="text"
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b border-[#203348]/20 px-0 py-2 text-sm focus:outline-none focus:border-[#203348] placeholder-[#203348]/30 text-[#203348] transition-colors"
          />
          <svg className="w-4 h-4 text-[#203348]/30 absolute right-0 top-1/2 -translate-y-1/2 group-focus-within:text-[#203348] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </motion.div>

      {/* Publications Grid - Editorial Style */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-20 pb-24 relative z-10"
      >
        <AnimatePresence mode="popLayout">
          {filteredArticles.map((article, idx) => (
            <motion.article 
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer flex flex-col h-full"
            >
              <div className="flex items-center gap-3 text-[10px] font-mono text-[#203348]/40 uppercase tracking-widest mb-5">
                <span className="text-[#616F3E] font-bold">{article.topic}</span>
                <span className="w-1 h-1 rounded-full bg-[#203348]/20"></span>
                <span>{article.readTime}</span>
              </div>

              <h3 className="font-serif text-3xl font-medium text-[#203348] group-hover:text-[#616F3E] transition-colors leading-[1.2] mb-5">
                {article.title}
              </h3>
              
              <p className="text-sm text-[#203348]/60 leading-relaxed font-light line-clamp-3 mb-8 flex-grow">
                {article.summary}
              </p>

              <div className="flex items-center gap-3 text-xs font-semibold text-[#203348] group-hover:gap-5 transition-all uppercase tracking-widest mt-auto pt-6 border-t border-[#203348]/10">
                <span>Read Story</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ARTICLE READER DRAWER */}
      <AnimatePresence>
        {selectedArticle && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 z-[60] bg-[#203348]/30 backdrop-blur-sm cursor-pointer"
            />
            
            {/* Drawer */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-[70] w-full md:max-w-2xl bg-[#FAF8F5] shadow-2xl flex flex-col text-left overflow-hidden border-l border-[#203348]/5"
              onClick={handleContentInteraction}
              onMouseLeave={handleClearGlossary}
            >
              {/* Botanical Texture Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.03] bg-repeat z-0"
                style={{ backgroundImage: "url('/patterns/pattern-green.jpg')", backgroundSize: '400px auto' }}
              />

              {/* Reader Header */}
              <div className="p-8 md:p-12 pb-6 flex justify-between items-center relative z-20">
                <div className="flex items-center gap-3 text-[10px] font-mono text-[#203348]/50 uppercase tracking-widest">
                  <span className="text-[#616F3E] font-bold">{selectedArticle.topic}</span>
                  <span className="w-1 h-1 rounded-full bg-[#203348]/20"></span>
                  <span>{selectedArticle.readTime}</span>
                </div>
                
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="w-10 h-10 rounded-full border border-[#203348]/10 flex items-center justify-center text-[#203348]/50 hover:text-[#203348] hover:bg-white transition-all cursor-pointer bg-transparent"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Reader Content */}
              <div className="px-8 md:px-12 pb-12 overflow-y-auto relative flex-grow z-10 scroll-smooth">
                <div className="max-w-xl mx-auto">
                  <h2 className="font-serif text-4xl md:text-5xl font-medium text-[#203348] mb-10 leading-[1.15]">
                    {selectedArticle.title}
                  </h2>
                  
                  {/* Interactive Editorial Text Body */}
                  <div 
                    className="prose prose-sm md:prose-base prose-headings:font-serif prose-headings:font-medium prose-headings:text-[#203348] prose-p:font-serif prose-p:text-[#203348]/80 prose-p:leading-loose space-y-8 max-w-none marker:text-[#616F3E]"
                    dangerouslySetInnerHTML={renderInteractiveContent(selectedArticle.content)}
                  />

                  <div className="h-px w-full bg-[#203348]/10 my-16" />

                  {/* Informative bottom banner explaining how to interact */}
                  <div className="bg-white border border-[#203348]/10 rounded-2xl p-6 text-xs text-[#203348]/60 leading-relaxed flex items-start gap-4 shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-[#616F3E]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-[#616F3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-[#203348] block mb-1">Science Dictionary</strong>
                      Hover over or click dashed underlined words (like <span className="border-b border-dashed border-[#616F3E] text-[#616F3E] font-medium">HPA axis</span>) to see clinical definitions in real-time.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DYNAMIC BIOCHEMICAL TOOLTIP CARD */}
      <AnimatePresence>
        {hoveredTerm && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-[100] bg-[#203348] p-5 rounded-2xl shadow-2xl max-w-[280px] text-left pointer-events-none border border-white/10"
            style={{ 
              left: `${tooltipPos.x}px`, 
              top: `${tooltipPos.y - 140}px`,
              transform: 'translateX(-50%)'
            }}
          >
            <span className="block text-[9px] font-mono uppercase tracking-widest text-white/50 font-semibold mb-2">Clinical Definition</span>
            <span className="block text-sm font-bold text-white mb-2">{hoveredTerm.term}</span>
            <p className="text-xs text-white/80 leading-relaxed font-light">{hoveredTerm.definition}</p>
            
            {/* Tooltip Triangle */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#203348] rotate-45 border-r border-b border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

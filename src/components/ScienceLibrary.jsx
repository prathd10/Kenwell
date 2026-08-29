import React, { useState, useMemo } from 'react'
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
      // Find term matches that are not already part of an HTML tag
      // Use a regex that matches terms surrounded by word boundaries, but not inside tags
      // Since simple regex replacements in HTML can break if we aren't careful, we will match exact strings
      const regex = new RegExp(`\\b(${term})\\b`, 'gi')
      
      // Replace matches with a custom span containing interactive data
      // We use a specific attribute to trace them later during rendering or just rely on react-html parsing
      // For safety in this frontend mock, we can parse it simple.
      modifiedHtml = modifiedHtml.replace(regex, `<span class="border-b border-dashed border-sage text-primary-green cursor-help font-semibold" data-glossary="${term}">$1</span>`)
    })

    return { __html: modifiedHtml }
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
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY - 10
        })
      }
    }
  }

  const handleClearGlossary = () => {
    setHoveredTerm(null)
  }

  return (
    <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-10 relative">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-sage font-mono uppercase tracking-wider text-xs font-semibold">Health Articles</span>
        <h1 className="text-4xl md:text-5xl font-serif text-primary-green">Wellness Library</h1>
        <div className="gold-divider max-w-xs mx-auto"></div>
        <p className="text-charcoal/70 text-sm leading-relaxed">
          Learn the science behind our supplements. Read easy-to-understand articles about how our products help your body.
        </p>
      </div>

      <BackButton />

      {/* Search & Filter Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-white/50 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search for topics or health benefits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg-primary border border-cream-dark px-10 py-3 rounded-full text-sm focus:outline-none focus:border-sage placeholder-charcoal/40"
          />
        </div>

        {/* Topic Filters */}
        <div className="flex flex-wrap gap-2 justify-end w-full md:w-auto">
          {['All', 'Vitamins', 'Performance', 'Longevity', 'Stress', 'Gut Health'].map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedTopic === topic
                  ? 'bg-primary-green text-bg-primary shadow-sm'
                  : 'bg-bg-primary hover:bg-cream-dark/30 text-charcoal/80 border border-cream-dark/50'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Publications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
        {filteredArticles.map((article) => (
          <article 
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="group cursor-pointer rounded-2xl glass-panel p-6 border border-white/40 hover:border-sage/30 hover:bg-white/80 transition-all duration-300 flex flex-col justify-between h-full"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-charcoal/50">
                <span className="bg-sage/10 text-sage px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">
                  {article.topic}
                </span>
                <span>{article.readTime}</span>
              </div>

              <h3 className="font-serif text-2xl font-bold text-primary-green group-hover:text-sage transition-colors leading-tight">
                {article.title}
              </h3>
              
              <p className="text-xs text-charcoal/60 leading-relaxed line-clamp-3">
                {article.summary}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-cream-dark/30 flex justify-between items-center">
              <span className="text-[10px] font-mono text-charcoal/40 uppercase">{article.date}</span>
              <span className="text-xs font-semibold text-sage group-hover:translate-x-1.5 transition-transform">
                Read Article →
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* ARTICLE READER DRAWER */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex justify-end bg-charcoal/40 backdrop-blur-sm animate-in fade-in duration-300">
          
          <div 
            onClick={() => setSelectedArticle(null)}
            className="flex-grow hidden md:block cursor-pointer"
          ></div>
          
          <div 
            className="w-full md:max-w-2xl bg-bg-primary h-full overflow-y-auto shadow-2xl p-8 border-l border-cream-dark flex flex-col justify-between text-left animate-in slide-in-from-right duration-300"
            onClick={handleContentInteraction}
            onMouseLeave={handleClearGlossary}
          >
            
            {/* Reader Header */}
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex space-x-3 text-xs font-mono text-charcoal/50">
                  <span className="bg-sage/10 text-sage px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold">{selectedArticle.topic}</span>
                  <span className="py-0.5">{selectedArticle.date}</span>
                  <span className="py-0.5">•</span>
                  <span className="py-0.5">{selectedArticle.readTime}</span>
                </div>
                
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="text-charcoal/40 hover:text-charcoal text-xl p-1 -mt-2 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-primary-green mb-8 leading-tight">
                {selectedArticle.title}
              </h2>
              
              <div className="gold-divider mb-8"></div>

              {/* Interactive Editorial Text Body */}
              <div 
                className="prose prose-sm font-serif text-base text-charcoal/80 leading-relaxed space-y-6 max-w-none"
                dangerouslySetInnerHTML={renderInteractiveContent(selectedArticle.content)}
              />

              <div className="gold-divider my-10"></div>

              {/* Informative bottom banner explaining how to interact */}
              <div className="bg-bg-secondary/40 border border-cream-dark/50 rounded-2xl p-4 text-[10px] text-charcoal/60 leading-relaxed font-mono flex items-start gap-2.5">
                <svg className="w-4 h-4 text-sage flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <strong>Science Dictionary:</strong> Hover over or click dashed underlined words (like <span className="border-b border-dashed border-sage text-primary-green font-semibold">HPA axis</span>) in the article to see a simple explanation.
                </div>
              </div>
            </div>

            <div className="pt-10 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-primary-green text-bg-primary hover:bg-sage hover:text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer text-center"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

      {/* DYNAMIC BIOCHEMICAL TOOLTIP CARD */}
      {hoveredTerm && (
        <div 
          className="absolute z-65 glass-panel p-4 rounded-xl shadow-lg border border-sage/30 bg-white max-w-[240px] text-left animate-in fade-in duration-200"
          style={{ 
            left: `${tooltipPos.x}px`, 
            top: `${tooltipPos.y - 120}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <span className="block text-[8px] font-mono uppercase tracking-wider text-sage font-bold">Science Term</span>
          <span className="block text-xs font-bold text-primary-green mt-0.5">{hoveredTerm.term}</span>
          <p className="text-[10px] text-charcoal/80 mt-1 leading-relaxed">{hoveredTerm.definition}</p>
        </div>
      )}

    </div>
  )
}

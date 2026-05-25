import React, { useState } from 'react'
import { PRODUCTS } from '../data'

export default function WellnessQuiz({ onAddStackToBuilder, setCurrentSection }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState({
    objective: '',
    stress: '',
    diet: ''
  })
  const [calculating, setCalculating] = useState(false)
  const [showResult, setShowResult] = useState(false)

  const steps = {
    1: {
      question: 'What is your primary wellness objective?',
      field: 'objective',
      options: [
        { value: 'sleep-stress', icon: 'sleep', label: 'Improve sleep latency, rest quality, and ease daily stress', desc: 'Designed to target cortisol levels and neuromuscular relaxation.' },
        { value: 'performance-energy', icon: 'energy', label: 'Maximize physical performance, muscle recovery, and stamina', desc: 'Focuses on mitochondrial fuel and cellular ATP production.' },
        { value: 'longevity-brain', icon: 'longevity', label: 'Support healthy aging, cognitive clarity, and cellular health', desc: 'Precursors and master antioxidants designed for cellular lifespan.' },
        { value: 'gut-detox', icon: 'gut', label: 'Restore gut microbiome flora, digestion comfort, and liver health', desc: 'Comprehensive synbiotics and phase II hepatic clearance pathways.' }
      ]
    },
    2: {
      question: 'What describes your current stress and fatigue levels?',
      field: 'stress',
      options: [
        { value: 'low', label: 'Calm & Rested', desc: 'My daily stress is low or highly manageable.' },
        { value: 'moderate', label: 'Fluctuating / Tense', desc: 'I feel moderate stress or occasional mid-afternoon slumps.' },
        { value: 'high', label: 'Chronically Fatigued / Wired', desc: 'I feel high daily stress and wake up feeling tired.' }
      ]
    },
    3: {
      question: 'What best describes your dietary profile?',
      field: 'diet',
      options: [
        { value: 'omnivore', label: 'Balanced Whole Foods / Omnivore', desc: 'Eat a combination of plants, dairy, and animal proteins.' },
        { value: 'vegetarian', label: 'Vegetarian / Vegan / Plant-Based', desc: 'Strictly plant-based. Might require B12 and non-fish omegas.' },
        { value: 'convenience', label: 'Convenience / Busy Lifestyle', desc: 'Frequent dining out, packaged snacks, or inconsistent eating schedule.' }
      ]
    }
  }

  const getQuizIcon = (name) => {
    switch (name) {
      case 'sleep':
        return (
          <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )
      case 'energy':
        return (
          <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case 'longevity':
        return (
          <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      case 'gut':
        return (
          <svg className="w-6 h-6 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        )
      default:
        return null
    }
  }

  const handleSelectOption = (value) => {
    const field = steps[currentStep].field
    setAnswers({ ...answers, [field]: value })
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    } else {
      // Last step, trigger calculation loading state
      setCalculating(true)
      setTimeout(() => {
        setCalculating(false)
        setShowResult(true)
      }, 1600)
    }
  }

  const handleGoBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleResetQuiz = () => {
    setAnswers({ objective: '', stress: '', diet: '' })
    setCurrentStep(1)
    setShowResult(false)
  }

  // Get recommended products list from products database based on answers
  const recommendations = React.useMemo(() => {
    if (!showResult) return []
    
    const objective = answers.objective
    const isVeg = answers.diet === 'vegetarian'
    const isHighStress = answers.stress === 'high'

    let pIds = []

    if (objective === 'sleep-stress') {
      pIds = [2, 18] // Magnesium Glycinate, Melatonin Sleep
      if (isHighStress) pIds.push(19) // Add Ashwagandha if high stress
    } 
    else if (objective === 'performance-energy') {
      pIds = [1, 17] // Multivitamin, CoQ10
      // If vegetarian, add Vegetarian Omega (7) instead of standard Fish oil, or B12
      if (isVeg) {
        pIds.push(7) // Vegetarian Omega
      } else {
        pIds.push(6) // Triple Strength Fish Oil
      }
    } 
    else if (objective === 'longevity-brain') {
      pIds = [12, 15] // NAD+ Longevity, Glutathione Reduced
      if (isVeg) {
        pIds.push(16) // Vitamin B12 (vital for vegans)
      } else {
        pIds.push(14) // Vitamin C Liposomal
      }
    } 
    else { // gut-detox
      pIds = [21, 9] // Prebiotics+Probiotics, Milk Thistle
      if (isHighStress || answers.diet === 'convenience') {
        pIds.push(11) // TUDCA (Advanced liver bile flow)
      }
    }

    return PRODUCTS.filter(p => pIds.includes(p.id))
  }, [showResult, answers])

  const getObjectiveTitle = () => {
    switch(answers.objective) {
      case 'sleep-stress': return 'Sleep & Stress Recovery Protocol'
      case 'performance-energy': return 'Mitochondrial Energy & Performance Stack'
      case 'longevity-brain': return 'Epigenetic Longevity & Brain Health Matrix'
      default: return 'Gastrointestinal & Hepatic Clearance Protocol'
    }
  }

  const getObjectiveSummaryText = () => {
    switch(answers.objective) {
      case 'sleep-stress': 
        return 'Based on your health objectives and stress points, your custom protocol is formulated to regulate the Hypothalamic-Pituitary-Adrenal (HPA) axis, lower systemic cortisol levels, and supply inhibitory neurotransmitter support to ease neural firing before rest.'
      case 'performance-energy': 
        return 'To maximize physical recovery and cell stamina, your protocol supplies cellular ATP cofactors (CoQ10) combined with baseline micronutrients and essential omega fatty acids to optimize cardiac output, muscle recovery, and oxygen absorption.'
      case 'longevity-brain': 
        return 'Your longevity matrix focuses on cellular rejuvenation. By supplying direct NAD+ precursors to fuel sirtuin longevity pathways and reduced L-glutathione (the master antioxidant), your cells are shielded from free-radical decay and epigenetic aging.'
      default: 
        return 'Your gastrointestinal protocol focuses on synbiotic colon seeding. Seeding 30 Billion CFU of clinically studied strains combined with artichoke leaf and milk thistle silymarin supports hepatic Phase II filtration and nutrient assimilation.'
    }
  }

  return (
    <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Page Header */}
      {!showResult && (
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-sage font-mono uppercase tracking-wider text-xs font-semibold">Biomarker Consultation</span>
          <h1 className="text-4xl md:text-5xl font-serif text-primary-green">Find Your Protocol</h1>
          <div className="gold-divider max-w-xs mx-auto"></div>
          <p className="text-charcoal/70 text-sm leading-relaxed">
            Answer a few quick questions about your objectives and lifestyle. Our diagnostic logic will compile an optimized wellness stack built specifically for your cells.
          </p>
        </div>
      )}

      {/* QUIZ QUESTION VIEWS */}
      {!showResult && !calculating && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
          
          {/* Progress bar */}
          <div className="w-full bg-cream-dark/30 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-sage h-full transition-all duration-500"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-charcoal/40">
            <span>QUESTION {currentStep} OF 3</span>
            {currentStep > 1 && (
              <button 
                onClick={handleGoBack}
                className="hover:text-primary-green cursor-pointer font-semibold"
              >
                ← Back
              </button>
            )}
          </div>

          <div className="space-y-6 text-left">
            <h2 className="font-serif text-3xl font-bold text-primary-green leading-tight">
              {steps[currentStep].question}
            </h2>

            <div className="space-y-4">
              {steps[currentStep].options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelectOption(opt.value)}
                  className="group cursor-pointer rounded-2xl glass-panel p-6 border border-white/50 hover:border-sage/40 hover:bg-white/80 transition-all duration-300 hover:shadow-md active:scale-[0.99]"
                >
                  <div className="flex justify-between items-center">
                    <div className="space-y-1 flex items-start gap-4">
                      {opt.icon && (
                        <div className="mt-1 flex-shrink-0 text-sage">
                          {getQuizIcon(opt.icon)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-serif text-lg font-bold text-primary-green group-hover:text-sage transition-colors">
                          {opt.label}
                        </h4>
                        <p className="text-xs text-charcoal/60 leading-relaxed mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-charcoal/30 group-hover:translate-x-2 transition-transform font-bold text-lg">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* LOADING CALCULATION STATE */}
      {calculating && (
        <div className="max-w-md mx-auto py-20 text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 border-4 border-sage/20 border-t-sage rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-widest text-sage animate-pulse font-bold block">Biomarker Matching Engine</span>
            <h3 className="font-serif text-2xl font-bold text-primary-green">Compiling Sourcing Matrix</h3>
            <p className="text-xs text-charcoal/60 leading-relaxed">
              Evaluating cellular objectives, mineral absorption channels, and dietary requirements to format your clean label stack...
            </p>
          </div>
        </div>
      )}

      {/* RESULTS DISPLAY PANEL */}
      {showResult && !calculating && (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-500 text-left">
          
          {/* Result Banner Cards */}
          <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/50 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-gradient-to-br from-bg-secondary/30 to-sage/5">
            <div className="md:col-span-8 space-y-4">
              <span className="text-[10px] font-mono uppercase bg-sage/10 text-sage px-3 py-1 rounded-full font-bold tracking-wider">Your Personalized Protocol</span>
              <h2 className="font-serif text-4xl md:text-5xl font-extrabold text-primary-green leading-none">
                {getObjectiveTitle()}
              </h2>
              <p className="text-sm text-charcoal/80 leading-relaxed">
                {getObjectiveSummaryText()}
              </p>
              
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-charcoal/50">
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 text-sage mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  {answers.stress === 'high' ? 'Cortisol Targeted' : 'Restoration Formula'}
                </span>
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 text-sage mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  {answers.diet === 'vegetarian' ? 'Vegan Friendly Selection' : 'Standard Formula'}
                </span>
                <span className="flex items-center">
                  <svg className="w-3.5 h-3.5 text-sage mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Divalent Absorption Balanced
                </span>
              </div>
            </div>
            
            {/* Direct Stack Order Box */}
            <div className="md:col-span-4 glass-panel bg-white p-6 rounded-2xl border border-cream-dark/50 space-y-4 text-center">
              <div>
                <span className="text-[9px] font-mono uppercase text-charcoal/40 block">Compiled Stack Cost</span>
                <span className="font-mono text-3xl font-extrabold text-primary-green">
                  ₹{recommendations.reduce((sum, item) => sum + item.price, 0)}
                </span>
                <span className="text-[10px] text-charcoal/50 block mt-0.5">3 Formulations Included</span>
              </div>

              <button
                onClick={() => onAddStackToBuilder(recommendations)}
                className="w-full bg-primary-green text-bg-primary hover:bg-sage hover:text-white py-3 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer block text-center"
              >
                Add Protocol to Builder
              </button>
              
              <button
                onClick={handleResetQuiz}
                className="text-xs text-charcoal/50 hover:text-primary-green hover:underline cursor-pointer"
              >
                Retake Diagnostic Quiz
              </button>
            </div>
          </div>

          {/* Recommended Products Grid */}
          <div className="space-y-6">
            <h3 className="font-serif text-2xl font-bold text-primary-green">Protocol Ingredient Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((prod) => (
                <div 
                  key={prod.id}
                  className="glass-panel p-6 rounded-2xl border border-white/50 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      {/* Small dynamic bottle representation */}
                      <div className="w-8 h-12 bg-bg-secondary rounded-lg border border-cream-dark flex flex-col items-center justify-center p-0.5 select-none">
                        <span className="text-[10px] font-serif font-bold leading-none" style={{ color: prod.accentColor }}>
                          {prod.name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      
                      <span className="bg-bg-secondary text-charcoal/50 font-mono text-[9px] px-2 py-0.5 rounded uppercase">
                        {prod.form}
                      </span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-primary-green">{prod.name}</h4>
                    <p className="text-xs text-charcoal/60 leading-relaxed min-h-[3rem]">{prod.description}</p>
                    
                    <div className="border-t border-cream-dark/50 pt-2 text-[10px] text-charcoal/70">
                      <strong>Administration:</strong> {prod.howToUse.dosage} — {prod.howToUse.timing}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-cream-dark/30 flex justify-between items-center">
                    <span className="font-mono text-sm font-bold text-primary-green">₹{prod.price}</span>
                    <button
                      onClick={() => {
                        // Open details modal
                        alert(`Opening formulation details for ${prod.name}`);
                      }}
                      className="text-xs text-sage font-semibold hover:underline cursor-pointer"
                    >
                      View Science facts
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

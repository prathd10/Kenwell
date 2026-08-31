import React, { useState } from 'react'
import BackButton from './BackButton'
import { useProducts } from '../context/ProductsContext'

export default function WellnessQuiz({ onAddStackToBuilder, setCurrentSection }) {
  const { products } = useProducts()
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
      question: 'What do you want help with most?',
      subtitle: 'Pick your main goal and we’ll build your routine around it.',
      field: 'objective',
      options: [
        { 
          value: 'sleep-stress', 
          icon: 'sleep', 
          label: 'Better Sleep & Less Stress', 
          desc: 'Fall asleep faster, wake up refreshed, and feel calm and relaxed during the day.' 
        },
        { 
          value: 'performance-energy', 
          icon: 'energy', 
          label: 'More Energy & Daily Stamina', 
          desc: 'Beat afternoon tiredness, stay energized all day, and bounce back faster from workouts.' 
        },
        { 
          value: 'longevity-brain', 
          icon: 'longevity', 
          label: 'Sharp Focus & Healthy Aging', 
          desc: 'Clear mental brain fog, protect your cells, and keep your mind and body feeling young.' 
        },
        { 
          value: 'gut-detox', 
          icon: 'gut', 
          label: 'Better Digestion & Gut Health', 
          desc: 'Relieve bloating, restore healthy digestion, and keep your stomach feeling light.' 
        }
      ]
    },
    2: {
      question: 'How stressed or tired have you been feeling?',
      subtitle: 'This helps us give you the right strength and calming ingredients.',
      field: 'stress',
      options: [
        { 
          value: 'low', 
          label: 'Calm & Well-Rested', 
          desc: 'My daily stress is low and my energy is generally steady.' 
        },
        { 
          value: 'moderate', 
          label: 'A Bit Drained or Tense', 
          desc: 'I feel occasional work stress, tension, or 3 PM energy crashes.' 
        },
        { 
          value: 'high', 
          label: 'Constantly Tired & Stressed', 
          desc: 'High daily pressure, waking up exhausted, or having trouble unwinding.' 
        }
      ]
    },
    3: {
      question: 'What’s your everyday diet like?',
      subtitle: 'We’ll make sure your supplements match your dietary lifestyle.',
      field: 'diet',
      options: [
        { 
          value: 'omnivore', 
          label: 'Regular Mixed Diet', 
          desc: 'I eat a combination of vegetables, grains, dairy, and eggs or meat.' 
        },
        { 
          value: 'vegetarian', 
          label: 'Vegetarian or Vegan', 
          desc: 'Plant-based only. We will provide 100% vegetarian alternatives.' 
        },
        { 
          value: 'convenience', 
          label: 'Busy / Eat on the Go', 
          desc: 'Frequent dining out, fast snacks, or irregular meal times.' 
        }
      ]
    }
  }

  const getQuizIcon = (name) => {
    switch (name) {
      case 'sleep':
        return (
          <svg className="w-6 h-6 text-[#203348]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )
      case 'energy':
        return (
          <svg className="w-6 h-6 text-[#616F3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
      case 'longevity':
        return (
          <svg className="w-6 h-6 text-[#A5492B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      case 'gut':
        return (
          <svg className="w-6 h-6 text-[#616F3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      setCalculating(true)
      setTimeout(() => {
        setCalculating(false)
        setShowResult(true)
      }, 1200)
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

  const recommendations = React.useMemo(() => {
    if (!showResult) return []
    
    const objective = answers.objective
    const isVeg = answers.diet === 'vegetarian'
    const isHighStress = answers.stress === 'high'

    let list = []

    switch (objective) {
      case 'sleep-stress':
        list.push(products.find(p => p.slug === 'chelated-magnesium-glycinate') || products[0])
        list.push(products.find(p => p.slug === 'ksm-66-ashwagandha') || products[1])
        if (isVeg) {
          list.push(products.find(p => p.slug === 'vegan-d3-k2') || products[2])
        } else {
          list.push(products.find(p => p.slug === 'triple-strength-fish-oil') || products[2])
        }
        break

      case 'performance-energy':
        list.push(products.find(p => p.slug === 'creatine-monohydrate-creapure') || products[0])
        list.push(products.find(p => p.slug === 'coq10-ubiquinone') || products[1])
        list.push(products.find(p => p.slug === 'multivitamin-with-probiotics') || products[2])
        break

      case 'longevity-brain':
        list.push(products.find(p => p.slug === 'nad') || products[0])
        list.push(products.find(p => p.slug === 'glutathione-reduced') || products[1])
        list.push(products.find(p => p.slug === 'chelated-magnesium-glycinate') || products[2])
        break

      case 'gut-detox':
        list.push(products.find(p => p.slug === 'tudca-liver-support') || products[0])
        list.push(products.find(p => p.slug === 'multivitamin-with-probiotics') || products[1])
        list.push(products.find(p => p.slug === 'zinc-carnosine') || products[2])
        break

      default:
        list = products.slice(0, 3)
    }

    if (isHighStress && !list.some(p => p.slug === 'ksm-66-ashwagandha')) {
      const ashwa = products.find(p => p.slug === 'ksm-66-ashwagandha')
      if (ashwa) list.push(ashwa)
    }

    return list.filter(Boolean)
  }, [showResult, answers, products])

  const getObjectiveTitle = () => {
    switch (answers.objective) {
      case 'sleep-stress': return 'Deep Sleep & Stress Reset Routine'
      case 'performance-energy': return 'Cellular Energy & Stamina Routine'
      case 'longevity-brain': return 'Longevity & Mental Clarity Routine'
      case 'gut-detox': return 'Digestive Health & Liver Cleanse Routine'
      default: return 'Custom Wellness Routine'
    }
  }

  const getObjectiveSummaryText = () => {
    switch (answers.objective) {
      case 'sleep-stress':
        return 'Designed to calm your nervous system, lower cortisol levels, and support deep REM recovery without daytime drowsiness.'
      case 'performance-energy':
        return 'Formulated with organic creatine, CoQ10, and key minerals to restore cellular ATP energy output and workout stamina.'
      case 'longevity-brain':
        return 'Advanced liposomal precursors designed to fuel mitochondrial repair, clear brain fog, and protect cellular longevity.'
      case 'gut-detox':
        return 'Gentle mucosal soothing nutrients and bile-acid liver support to resolve digestive bloating and support natural toxin clearance.'
      default:
        return 'A tailored routine matched to your personal health lifestyle.'
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
      
      {!showResult && (
        <>
          <div className="space-y-3 mb-10 text-center">
            <span className="text-[#616F3E] font-mono text-xs uppercase tracking-widest font-semibold">
              Personalized Recommendation
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#203348] tracking-tight">
              Don't Know What to Buy? Take the Quiz
            </h1>
            <p className="text-xs sm:text-base text-[#203348]/70 max-w-xl mx-auto leading-relaxed">
              Answer 3 simple questions. We'll find the exact right supplements for your body and goals — no guesswork needed.
            </p>
          </div>
          <BackButton />
        </>
      )}

      {!showResult && !calculating && (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
          
          <div className="space-y-2">
            <div className="w-full bg-[#E4DFD3] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-[#A5492B] h-full transition-all duration-500 rounded-full"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-[#203348]/50">
              <span className="font-bold text-[#616F3E]">STEP {currentStep} OF 3</span>
              {currentStep > 1 && (
                <button 
                  onClick={handleGoBack}
                  className="hover:text-[#203348] cursor-pointer font-semibold transition-colors"
                >
                  ← Back to Previous
                </button>
              )}
            </div>
          </div>

          <div className="space-y-5 text-left">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#203348] leading-snug">
                {steps[currentStep].question}
              </h2>
              {steps[currentStep].subtitle && (
                <p className="text-xs sm:text-sm text-[#203348]/60 mt-1">
                  {steps[currentStep].subtitle}
                </p>
              )}
            </div>

            <div className="space-y-3 sm:space-y-4">
              {steps[currentStep].options.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => handleSelectOption(opt.value)}
                  className="group cursor-pointer rounded-2xl bg-white p-5 sm:p-6 border border-[#E4DFD3] hover:border-[#616F3E] hover:bg-[#FAF8F5] transition-all duration-200 hover:shadow-md active:scale-[0.99]"
                >
                  <div className="flex justify-between items-center gap-3">
                    <div className="space-y-1 flex items-start gap-3.5 sm:gap-4">
                      {opt.icon && (
                        <div className="mt-0.5 flex-shrink-0 text-[#616F3E] bg-[#F2EEE5] p-2 rounded-xl">
                          {getQuizIcon(opt.icon)}
                        </div>
                      )}
                      <div>
                        <h4 className="font-serif text-base sm:text-lg font-bold text-[#203348] group-hover:text-[#616F3E] transition-colors">
                          {opt.label}
                        </h4>
                        <p className="text-xs text-[#203348]/65 leading-relaxed mt-0.5">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-[#616F3E] opacity-60 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all font-bold text-xl flex-shrink-0">
                      →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {calculating && (
        <div className="max-w-md mx-auto py-16 text-center space-y-5 animate-in fade-in duration-300">
          <div className="w-14 h-14 border-4 border-[#616F3E]/20 border-t-[#616F3E] rounded-full animate-spin mx-auto"></div>
          <div className="space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#616F3E] animate-pulse font-bold block">Matching Formulations</span>
            <h3 className="font-serif text-2xl font-bold text-[#203348]">Finding What You Need...</h3>
            <p className="text-xs text-[#203348]/60 leading-relaxed">
              Analyzing your goals to pick the clean, science-backed formulas tailored for you.
            </p>
          </div>
        </div>
      )}

      {showResult && !calculating && (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in zoom-in-95 duration-500 text-left">
          
          <div className="relative overflow-hidden p-6 sm:p-10 rounded-3xl border border-[#E4DFD3] grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white shadow-sm">
            {/* Botanical Pattern Watermark */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.06] bg-repeat"
              style={{ backgroundImage: "url('/patterns/pattern-green.jpg')", backgroundSize: '320px auto' }}
            />
            <div className="relative z-10 md:col-span-8 space-y-4">
              <span className="text-[10px] font-mono uppercase bg-[#616F3E]/15 text-[#616F3E] border border-[#616F3E]/25 px-3 py-1 rounded-full font-bold tracking-wider">
                ✓ Here Is What You Need
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#203348] leading-tight">
                {getObjectiveTitle()}
              </h2>
              <p className="text-sm sm:text-base text-[#203348]/80 leading-relaxed">
                {getObjectiveSummaryText()}
              </p>
              
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-mono text-[#203348]/65">
                <span className="flex items-center">
                  <svg className="w-4 h-4 text-[#616F3E] mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  {answers.stress === 'high' ? 'Stress & Fatigue Support' : 'Daily Balance'}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 text-[#616F3E] mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  {answers.diet === 'vegetarian' ? '100% Vegetarian Selection' : 'Clean Clinical Grade'}
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 text-[#616F3E] mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Full Dosage Transparency
                </span>
              </div>
            </div>
            
            <div className="md:col-span-4 bg-white p-6 rounded-2xl border border-[#E4DFD3] space-y-4 text-center shadow-sm">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#203348]/50 block">Your Complete Routine</span>
                <span className="font-mono text-3xl font-extrabold text-[#203348] block my-1">
                  ₹{recommendations.reduce((sum, item) => sum + item.price, 0).toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-[#616F3E] font-semibold block">
                  {recommendations.length} Formulations Selected
                </span>
              </div>

              <button
                onClick={() => onAddStackToBuilder(recommendations)}
                className="w-full bg-[#A5492B] text-white hover:bg-[#203348] py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md cursor-pointer block text-center"
              >
                Add Routine to Stack Builder →
              </button>
              
              <button
                onClick={handleResetQuiz}
                className="text-xs text-[#203348]/50 hover:text-[#203348] hover:underline cursor-pointer block mx-auto"
              >
                Retake Quiz
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between items-end border-b border-[#E4DFD3] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#616F3E] font-bold block">Recommended for You</span>
                <h3 className="font-serif text-2xl font-bold text-[#203348]">Your Daily Products</h3>
              </div>
              <span className="text-xs text-[#203348]/50 font-mono">{recommendations.length} Items</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recommendations.map((prod) => (
                <div 
                  key={prod.id}
                  className="bg-white p-6 rounded-2xl border border-[#E4DFD3] flex flex-col justify-between hover:shadow-md transition-all duration-200"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#E4DFD3] bg-[#FAF8F5] flex-shrink-0">
                        {prod.images?.[0] ? (
                          <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-serif text-xs font-bold text-[#203348]">
                            {prod.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      <span className="bg-[#F2EEE5] text-[#203348]/70 font-mono text-[9px] px-2.5 py-1 rounded-full uppercase font-semibold">
                        {prod.form}
                      </span>
                    </div>

                    <h4 className="font-serif text-base sm:text-lg font-bold text-[#203348]">{prod.name}</h4>
                    <p className="text-xs text-[#203348]/65 leading-relaxed min-h-[2.75rem]">{prod.description}</p>
                    
                    {prod.howToUse && (
                      <div className="border-t border-[#E4DFD3] pt-2 text-[11px] text-[#203348]/75 bg-[#FAF8F5] rounded-lg p-2">
                        <strong className="text-[#203348]">How to take:</strong> {prod.howToUse.dosage} • {prod.howToUse.timing}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E4DFD3] flex justify-between items-center">
                    <span className="font-mono text-sm font-bold text-[#203348]">₹{Number(prod.price).toLocaleString('en-IN')}</span>
                    <button
                      onClick={() => {
                        if (setCurrentSection) {
                          window.location.hash = prod.slug
                          setCurrentSection('shop')
                        }
                      }}
                      className="text-xs text-[#616F3E] font-bold hover:underline cursor-pointer"
                    >
                      View Details →
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

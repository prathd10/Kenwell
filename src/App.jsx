import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from './context/ProductsContext'
import { useCart } from './context/CartContext'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductCatalog from './components/ProductCatalog'
import StackBuilder from './components/StackBuilder'
import LabScanner from './components/LabScanner'
import WellnessQuiz from './components/WellnessQuiz'
import ScienceLibrary from './components/ScienceLibrary'
import ProductModal from './components/ProductModal'
import Footer from './components/Footer'
import AboutUs from './components/AboutUs'
import TrackOrder from './components/TrackOrder'
import StoreLocator from './components/StoreLocator'
import PartnerWithUs from './components/PartnerWithUs'
import AnalyticsTracker from './components/AnalyticsTracker'
import VerifyProduct from './components/VerifyProduct'


export default function App() {
  const navigate = useNavigate()
  const { loading: productsLoading } = useProducts()
  const {
    cartItems, wishlistItems, addToCart, removeFromCart,
    updateCartQuantity, clearCart, toggleWishlist,
  } = useCart()
  // Read initial section from URL hash so direct links work
  const [currentSection, _setSection] = useState(() => {
    const rawHash = window.location.hash.slice(1)
    const baseSection = rawHash.split('?')[0]
    return baseSection || 'home'
  })

  // Wrapped setter that also pushes a browser history entry so back/forward work
  const setCurrentSection = useCallback((section) => {
    _setSection(section)
    const hash = section === 'home' ? '' : `#${section}`
    window.history.pushState({ kw_section: section }, '', hash || window.location.pathname)
  }, [])

  // Handle browser back / forward
  useEffect(() => {
    const rawHash = window.location.hash.slice(1)
    const baseSection = rawHash.split('?')[0]
    if (baseSection && baseSection !== currentSection) {
      _setSection(baseSection)
    }

    // Replace the initial history state so we have something to pop back to
    window.history.replaceState(
      { kw_section: currentSection },
      '',
      currentSection === 'home' ? window.location.pathname : `#${currentSection}`
    )
    const onPop = (e) => {
      const section = e.state?.kw_section ||
        (window.location.hash ? window.location.hash.slice(1).split('?')[0] : 'home')
      _setSection(section || 'home')
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const [selectedProduct, setSelectedProduct] = useState(null)
  const [stackItems, setStackItems] = useState([])
  const [quizAnswers, setQuizAnswers] = useState({})

  // Lifted Catalog Filters
  const [selectedSeries, setSelectedSeries] = useState('All')
  const [selectedGoal, setSelectedGoal] = useState('All')

  // Custom scrolling behaviour when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentSection])

  // Deep-link support: a scanned authenticity QR lands on /?code=XXXX
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')
    if (code) setCurrentSection('verify')
  }, [])

  // Listen for goal/series filter events dispatched by Hero tiles
  useEffect(() => {
    const handleGoalFilter = (e) => {
      setSelectedGoal(e.detail)
      setSelectedSeries('All')
      setCurrentSection('shop')
    }
    const handleSeriesFilter = (e) => {
      setSelectedSeries(e.detail)
      setSelectedGoal('All')
      setCurrentSection('shop')
    }
    window.addEventListener('kenwell:filterGoal', handleGoalFilter)
    window.addEventListener('kenwell:filterSeries', handleSeriesFilter)
    return () => {
      window.removeEventListener('kenwell:filterGoal', handleGoalFilter)
      window.removeEventListener('kenwell:filterSeries', handleSeriesFilter)
    }
  }, [])

  const addToStack = (product) => {
    if (!stackItems.some(item => item.id === product.id)) {
      setStackItems([...stackItems, product])
    }
  }

  const removeFromStack = (productId) => {
    setStackItems(stackItems.filter(item => item.id !== productId))
  }

  const clearStack = () => {
    setStackItems([])
  }

  const handleQuickView = (product) => {
    navigate(`/products/${product.slug}`)
  }

  const handleSelectFilter = (type, value) => {
    if (type === 'series') {
      setSelectedSeries(value)
      setSelectedGoal('All')
      setCurrentSection('shop')
    } else if (type === 'goal') {
      setSelectedGoal(value)
      setSelectedSeries('All')
      setCurrentSection('shop')
    } else if (type === 'collection') {
      setCurrentSection(value) // 'bestsellers', 'men', 'women'
      setSelectedSeries('All')
      setSelectedGoal('All')
    } else if (type === 'all') {
      setCurrentSection('shop')
      setSelectedSeries('All')
      setSelectedGoal('All')
    }
  }

  if (productsLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F4F1EA' }}>
        <div style={{ width: 32, height: 32, border: '2.5px solid #2E402B', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div className="bg-bg-primary text-charcoal font-body antialiased min-h-screen flex flex-col selection:bg-sage selection:text-white">
      {/* Real Analytics Tracking */}
      <AnalyticsTracker currentSection={currentSection} />

      {/* Premium background grid */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10 bg-[linear-gradient(to_right,#E6E3D5_1px,transparent_1px),linear-gradient(to_bottom,#E6E3D5_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      <Navbar 
        currentSection={currentSection} 
        setCurrentSection={setCurrentSection} 
        stackCount={stackItems.length}
        wishlistItems={wishlistItems}
        toggleWishlist={toggleWishlist}
        cartItems={cartItems}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        updateCartQuantity={updateCartQuantity}
        onSelectFilter={handleSelectFilter}
        onQuickView={handleQuickView}
        clearCart={clearCart}
      />
      
      <main className="flex-grow z-10">
        {currentSection === 'home' && (
          <Hero 
            setCurrentSection={setCurrentSection} 
            onQuickView={handleQuickView}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlistItems={wishlistItems}
            onAddToStack={addToStack}
            stackItems={stackItems}
          />
        )}
        
        {currentSection === 'shop' && (
          <ProductCatalog 
            onQuickView={handleQuickView} 
            onAddToStack={addToStack}
            stackItems={stackItems}
            collection="all"
            selectedSeries={selectedSeries}
            setSelectedSeries={setSelectedSeries}
            selectedGoal={selectedGoal}
            setSelectedGoal={setSelectedGoal}
            onToggleWishlist={toggleWishlist}
            wishlistItems={wishlistItems}
            onAddToCart={addToCart}
          />
        )}
        
        {currentSection === 'bestsellers' && (
          <ProductCatalog 
            onQuickView={handleQuickView} 
            onAddToStack={addToStack}
            stackItems={stackItems}
            collection="bestsellers"
            selectedSeries={selectedSeries}
            setSelectedSeries={setSelectedSeries}
            selectedGoal={selectedGoal}
            setSelectedGoal={setSelectedGoal}
            onToggleWishlist={toggleWishlist}
            wishlistItems={wishlistItems}
            onAddToCart={addToCart}
          />
        )}
        
        {currentSection === 'men' && (
          <ProductCatalog 
            onQuickView={handleQuickView} 
            onAddToStack={addToStack}
            stackItems={stackItems}
            collection="men"
            selectedSeries={selectedSeries}
            setSelectedSeries={setSelectedSeries}
            selectedGoal={selectedGoal}
            setSelectedGoal={setSelectedGoal}
            onToggleWishlist={toggleWishlist}
            wishlistItems={wishlistItems}
            onAddToCart={addToCart}
          />
        )}
        
        {currentSection === 'women' && (
          <ProductCatalog 
            onQuickView={handleQuickView} 
            onAddToStack={addToStack}
            stackItems={stackItems}
            collection="women"
            selectedSeries={selectedSeries}
            setSelectedSeries={setSelectedSeries}
            selectedGoal={selectedGoal}
            setSelectedGoal={setSelectedGoal}
            onToggleWishlist={toggleWishlist}
            wishlistItems={wishlistItems}
            onAddToCart={addToCart}
          />
        )}
        
        {currentSection === 'builder' && (
          <StackBuilder 
            stackItems={stackItems}
            onRemoveFromStack={removeFromStack}
            onClearStack={clearStack}
            onQuickView={handleQuickView}
            setCurrentSection={setCurrentSection}
            onAddToStack={addToStack}
            onAddToCart={addToCart}
          />
        )}
        
        {currentSection === 'scanner' && (
          <LabScanner />
        )}
        
        {currentSection === 'quiz' && (
          <WellnessQuiz 
            onAddStackToBuilder={(products) => {
              products.forEach(p => addToStack(p))
              setCurrentSection('builder')
            }}
            setCurrentSection={setCurrentSection}
          />
        )}
        
        {currentSection === 'library' && (
          <ScienceLibrary />
        )}
        
        {currentSection === 'track' && (
          <TrackOrder />
        )}

        {currentSection === 'verify' && (
          <VerifyProduct />
        )}
        
        {currentSection === 'about' && (
          <AboutUs />
        )}

        {currentSection === 'stores' && (
          <StoreLocator setCurrentSection={setCurrentSection} />
        )}

        {currentSection === 'partner' && (
          <PartnerWithUs setCurrentSection={setCurrentSection} />
        )}
      </main>
      
      <Footer setCurrentSection={setCurrentSection} />
      
      {/* Global Product Quick-View Modal */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToStack={addToStack}
          isInStack={stackItems.some(item => item.id === selectedProduct.id)}
          onToggleWishlist={toggleWishlist}
          isInWishlist={wishlistItems.some(item => item.id === selectedProduct.id)}
          onAddToCart={addToCart}
        />
      )}
    </div>
  )
}

import React, { useState, useEffect } from 'react'
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

export default function App() {
  const [currentSection, setCurrentSection] = useState('home')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [stackItems, setStackItems] = useState([])
  const [quizAnswers, setQuizAnswers] = useState({})
  
  // Lifted Catalog Filters & Cart/Wishlist States
  const [selectedSeries, setSelectedSeries] = useState('All')
  const [selectedGoal, setSelectedGoal] = useState('All')
  const [wishlistItems, setWishlistItems] = useState([])
  const [cartItems, setCartItems] = useState([])

  // Custom scrolling behaviour when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentSection])

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
    setSelectedProduct(product)
  }

  const toggleWishlist = (product) => {
    if (wishlistItems.some(item => item.id === product.id)) {
      setWishlistItems(wishlistItems.filter(item => item.id !== product.id))
    } else {
      setWishlistItems([...wishlistItems, product])
    }
  }

  const addToCart = (product) => {
    const existing = cartItems.find(item => item.id === product.id)
    if (existing) {
      setCartItems(cartItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId))
  }

  const updateCartQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems(cartItems.map(item => item.id === productId ? { ...item, quantity: qty } : item))
    }
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

  return (
    <div className="bg-bg-primary text-charcoal font-body antialiased min-h-screen flex flex-col selection:bg-sage selection:text-white">
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
      />
      
      <main className="flex-grow z-10">
        {currentSection === 'home' && (
          <>
            <Hero 
              setCurrentSection={setCurrentSection} 
              onQuickView={handleQuickView}
            />
            {/* Direct preview of our series */}
            <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <span className="text-sage font-mono uppercase tracking-wider text-sm">Product Range</span>
                <h2 className="text-4xl md:text-5xl font-serif mt-2 mb-4">Meticulously Engineered Formulations</h2>
                <div className="gold-divider max-w-sm mx-auto mb-6"></div>
                <p className="text-charcoal/70 max-w-2xl mx-auto">
                  Every product is standard-controlled for maximum clinical bioavailability. 
                  Select a category to discover targeted cellular nutrition.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Core Series */}
                <div 
                  onClick={() => handleSelectFilter('series', 'Core Series')}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl glass-panel p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-l-4 border-sage"
                >
                  <span className="text-xs font-mono bg-sage/10 text-sage px-3 py-1 rounded-full uppercase tracking-wider">Daily Baseline</span>
                  <h3 className="text-2xl font-serif mt-4 mb-2 group-hover:text-sage transition-colors">Core Series</h3>
                  <p className="text-charcoal/70 text-sm leading-relaxed mb-6">
                    A collection of foundation nutrients designed for daily health. Includes high-potency multivitamins, probiotics, and fully chelated magnesium.
                  </p>
                  <span className="inline-flex items-center text-xs font-semibold text-sage group-hover:translate-x-2 transition-transform">
                    Explore Core Series <span className="ml-1">→</span>
                  </span>
                </div>
                
                {/* Wellness Series */}
                <div 
                  onClick={() => handleSelectFilter('series', 'Wellness Series')}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl glass-panel p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-l-4 border-champagne"
                >
                  <span className="text-xs font-mono bg-champagne/20 text-charcoal px-3 py-1 rounded-full uppercase tracking-wider">Targeted Protocols</span>
                  <h3 className="text-2xl font-serif mt-4 mb-2 group-hover:text-gold-accent transition-colors">Wellness Series</h3>
                  <p className="text-charcoal/70 text-sm leading-relaxed mb-6">
                    Targeted formulations including highly bioavailable mineral balances, joint repair matrices, and natural hepatoprotectives.
                  </p>
                  <span className="inline-flex items-center text-xs font-semibold text-gold-accent group-hover:translate-x-2 transition-transform">
                    Explore Wellness Series <span className="ml-1">→</span>
                  </span>
                </div>
                
                {/* Liposomal Series */}
                <div 
                  onClick={() => handleSelectFilter('series', 'Liposomal Series')}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl glass-panel p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-l-4 border-slate-teal"
                >
                  <span className="text-xs font-mono bg-slate-teal/10 text-slate-teal px-3 py-1 rounded-full uppercase tracking-wider">Advanced Longevity</span>
                  <h3 className="text-2xl font-serif mt-4 mb-2 group-hover:text-slate-teal transition-colors">Liposomal Series</h3>
                  <p className="text-charcoal/70 text-sm leading-relaxed mb-6">
                    Advanced clinical-grade cellular rejuvenators utilizing lipid encapsulation to bypass stomach acid and enter the bloodstream.
                  </p>
                  <span className="inline-flex items-center text-xs font-semibold text-slate-teal group-hover:translate-x-2 transition-transform">
                    Explore Liposomal Series <span className="ml-1">→</span>
                  </span>
                </div>
              </div>
            </section>
          </>
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
        
        {currentSection === 'about' && (
          <AboutUs />
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

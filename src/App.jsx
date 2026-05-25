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
          <Hero 
            setCurrentSection={setCurrentSection} 
            onQuickView={handleQuickView}
            onAddToCart={addToCart}
            onToggleWishlist={toggleWishlist}
            wishlistItems={wishlistItems}
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

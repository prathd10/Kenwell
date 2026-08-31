import React, { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useProducts } from '../context/ProductsContext'
import ProductCard from './ProductCard'
import BackButton from './BackButton'

export default function ProductCatalog({ 
  onQuickView, 
  onAddToStack, 
  stackItems, 
  collection = 'all',
  selectedSeries,
  setSelectedSeries,
  selectedGoal,
  setSelectedGoal,
  onToggleWishlist,
  wishlistItems = [],
  onAddToCart
}) {
  const { products } = useProducts()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)

  // Disable page body scrolling when filter panel drawer is open to prevent layout shifts
  useEffect(() => {
    if (showFiltersPanel) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showFiltersPanel])

  // Curated lists based on competitor benchmarks
  const collectionIds = useMemo(() => {
    return {
      bestsellers: ['multivitamin-with-probiotics', 'chelated-magnesium-glycinate', 'triple-strength-fish-oil', 'nad', 'ksm-66-ashwagandha', 'prebiotics-probiotics'],
      men: ['chelated-magnesium-glycinate', 'zinc-picolonate-magnesium', 'triple-strength-fish-oil', 'nad', 'ksm-66-ashwagandha', 'dht-blocker', 'berberine-hcl'],
      women: ['multivitamin-with-probiotics', 'chelated-magnesium-glycinate', 'vitamin-d3-k2-calcium', 'joint-support', 'vitamin-c', 'glutathione-reduced', 'vitamin-b12']
    }
  }, [])

  // Filter products based on collection, search, series, and health goals
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Collection check
      if (collection !== 'all' && collectionIds[collection]) {
        if (!collectionIds[collection].includes(product.slug)) {
          return false
        }
      }

      // 2. Search check
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      // 3. Series check
      const matchesSeries = 
        selectedSeries === 'All' || 
        product.series === selectedSeries

      // 4. Goal check
      const matchesGoal = 
        selectedGoal === 'All' || 
        (product.healthGoals && product.healthGoals.includes(selectedGoal))

      return matchesSearch && matchesSeries && matchesGoal
    })
  }, [products, collection, collectionIds, searchQuery, selectedSeries, selectedGoal])

  // Dynamically extract all unique health goals from active products list
  const allGoals = useMemo(() => {
    const goalsSet = new Set()

    // Filter base products by collection first to only show goals relevant to Men/Women/Bestsellers
    const baseProducts = collection !== 'all' && collectionIds[collection]
      ? products.filter(p => collectionIds[collection].includes(p.slug))
      : products

    baseProducts.forEach((product) => {
      if (product.healthGoals) {
        product.healthGoals.forEach(g => goalsSet.add(g))
      }
    })
    return ['All', ...Array.from(goalsSet).sort()]
  }, [products, collection, collectionIds])

  // Get custom title/subtitle based on the active collection
  const headerContent = useMemo(() => {
    switch (collection) {
      case 'bestsellers':
        return {
          badge: 'Customer Favorites',
          title: 'Bestselling Formulations',
          desc: 'Our most trusted, clinical-grade supplements chosen by thousands of active athletes and wellness professionals.'
        }
      case 'men':
        return {
          badge: 'For Active Men',
          title: 'Optimized For Men',
          desc: 'Targeted support designed to balance male hormones, build muscle recovery stamina, and maintain cellular energy.'
        }
      case 'women':
        return {
          badge: 'For Active Women',
          title: 'Optimized For Women',
          desc: 'Science-backed formulations focused on bone mineral density, daily nutrient absorption, and skin cell health.'
        }
      default:
        return {
          badge: 'Scientific Apothecary',
          title: 'The Kenwell Formulations',
          desc: 'Clean active ingredients, organic chelations, and liposomal encapsulations. Complete open label disclosures.'
        }
    }
  }, [collection])

  // Sort filtered products
  const sortedProducts = useMemo(() => {
    const productsCopy = [...filteredProducts]
    if (sortBy === 'price-asc') {
      return productsCopy.sort((a, b) => a.price - b.price)
    }
    if (sortBy === 'price-desc') {
      return productsCopy.sort((a, b) => b.price - a.price)
    }
    if (sortBy === 'servings-desc') {
      return productsCopy.sort((a, b) => b.servings - a.servings)
    }
    return productsCopy // Default featured
  }, [filteredProducts, sortBy])

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedSeries('All')
    setSelectedGoal('All')
    setSortBy('featured')
  }

  return (
    <div className="bg-white min-h-screen w-full">
      <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-[#616F3E] font-mono uppercase tracking-wider text-xs font-semibold">
          {headerContent.badge}
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#203348]">
          {headerContent.title}
        </h1>
        <div className="gold-divider max-w-xs mx-auto"></div>
        <p className="text-[#203348]/70 text-sm leading-relaxed">
          {headerContent.desc}
        </p>
      </div>

      {/* Back Button */}
      <BackButton />

      {/* Catalog Control Bar */}
      <div className="space-y-4">
        {/* Counter */}
        <div className="text-left">
          <span className="font-mono text-xs text-[#203348]/50 uppercase tracking-widest">
            {sortedProducts.length} formulations
          </span>
        </div>
        
        <div className="border-t border-[#E4DFD3] my-4"></div>

        {/* Filters Toggle & Sort Row */}
        <div className="flex justify-between items-center py-2">
          {/* Left: Show Filters Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFiltersPanel(true)}
              className="font-mono text-xs uppercase tracking-widest text-[#203348]/80 flex items-center gap-2.5 hover:text-[#616F3E] transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-[#203348]/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span>Filters</span>
            </button>
            {(selectedSeries !== 'All' || selectedGoal !== 'All' || searchQuery) && (
              <button 
                onClick={handleClearFilters}
                className="text-[10px] uppercase font-mono tracking-widest text-[#A5492B] hover:underline cursor-pointer font-bold"
              >
                Reset
              </button>
            )}
          </div>

          {/* Right: Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border border-[#E4DFD3] text-[#203348] rounded-full px-5 py-2 text-xs font-mono tracking-wider focus:outline-none focus:border-[#616F3E] cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="servings-desc">Servings: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* FILTER DRAWER OVERLAY — portal to document.body to avoid containment issues */}
      {showFiltersPanel && createPortal(
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: -20, // Stretched past screen bottom by 20px to prevent sub-pixel unblurred gaps
            zIndex: 99999,
            display: 'flex',
            justifyContent: 'flex-start',
            background: 'rgba(32, 51, 72, 0.45)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {/* Clickable Backdrop Area */}
          <div
            onClick={() => setShowFiltersPanel(false)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1, cursor: 'pointer' }}
          />

          {/* Drawer Sidebar Panel */}
          <div
            style={{
              width: '100%',
              maxWidth: 320,
              background: '#FAF8F5',
              height: '100%', // Stretches perfectly to fill the stretched wrapper container
              boxShadow: '8px 0 40px rgba(32,51,72,0.18)',
              display: 'flex',
              flexDirection: 'column',
              borderRight: '1px solid #E4DFD3',
              animation: 'slideInLeft 0.3s cubic-bezier(0.4,0,0.2,1)',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid #E4DFD3',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#fff',
              position: 'sticky', top: 0, zIndex: 10,
            }}>
              <h2 style={{ fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '1.2rem', fontWeight: 600, color: '#203348', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Filters
              </h2>
              <button
                onClick={() => setShowFiltersPanel(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  width: 28, height: 28, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyRight: 'center', justifyContent: 'center',
                  fontSize: '0.85rem', color: 'rgba(32,51,72,0.4)',
                  backgroundColor: 'rgba(32,51,72,0.04)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(32,51,72,0.08)'; e.currentTarget.style.color = '#203348' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(32,51,72,0.04)'; e.currentTarget.style.color = 'rgba(32,51,72,0.4)' }}
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div style={{ padding: '1.5rem 1.5rem 3.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              
              {/* Search input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '0.65rem', color: 'rgba(32,51,72,0.5)', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Search
                </span>
                <div style={{ position: 'relative' }}>
                  <svg 
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(32,51,72,0.4)' }} 
                    fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Find formulations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 2.2rem 0.6rem 2.2rem',
                      background: '#fff',
                      border: '1.5px solid #E4DFD3',
                      borderRadius: 12,
                      fontSize: '0.75rem',
                      fontFamily: 'inherit',
                      color: '#203348',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'rgba(32,51,72,0.4)' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Categories Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '0.65rem', color: 'rgba(32,51,72,0.5)', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Categories
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {['All', 'Core Series', 'Wellness Series', 'Liposomal Series'].map((series) => {
                    const isActive = selectedSeries === series
                    return (
                      <button
                        key={series}
                        onClick={() => {
                          setSelectedSeries(series)
                          if (window.innerWidth < 768) {
                            setShowFiltersPanel(false)
                          }
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.65rem 1rem',
                          borderRadius: 9,
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: '0.7rem',
                          fontWeight: isActive ? 700 : 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          background: isActive ? '#203348' : 'transparent',
                          color: isActive ? '#FAF8F5' : 'rgba(32,51,72,0.7)',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) {
                            e.currentTarget.style.color = '#203348'
                            e.currentTarget.style.background = 'rgba(32,51,72,0.05)'
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            e.currentTarget.style.color = 'rgba(32,51,72,0.7)'
                            e.currentTarget.style.background = 'transparent'
                          }
                        }}
                      >
                        {series === 'All' ? 'All Formulations' : series}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Health Goals Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: '0.65rem', color: 'rgba(32,51,72,0.5)', fontFamily: 'system-ui, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Health Goals
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 260, overflowY: 'auto', paddingRight: 4 }}>
                  {allGoals.map((goal) => {
                    const isActive = selectedGoal === goal
                    return (
                      <button
                        key={goal}
                        onClick={() => {
                          setSelectedGoal(goal)
                          if (window.innerWidth < 768) {
                            setShowFiltersPanel(false)
                          }
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.55rem 1rem',
                          borderRadius: 9,
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          fontSize: '0.7rem',
                          fontWeight: isActive ? 700 : 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          background: isActive ? '#616F3E' : 'transparent',
                          color: isActive ? '#FAF8F5' : 'rgba(32,51,72,0.7)',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) {
                            e.currentTarget.style.color = '#616F3E'
                            e.currentTarget.style.background = 'rgba(97,111,62,0.05)'
                          }
                        }}
                        onMouseLeave={e => {
                          if (!isActive) {
                            e.currentTarget.style.color = 'rgba(32,51,72,0.7)'
                            e.currentTarget.style.background = 'transparent'
                          }
                        }}
                      >
                        {goal === 'All' ? 'All Goals' : goal}
                      </button>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Products Grid */}
      <div className="w-full">
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={onQuickView}
                onAddToStack={onAddToStack}
                isInStack={stackItems.some(item => item.id === product.id)}
                onToggleWishlist={onToggleWishlist}
                isInWishlist={wishlistItems.some(item => item.id === product.id)}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#FAF8F5] p-16 rounded-2xl border border-[#E4DFD3] text-center space-y-4 max-w-md mx-auto flex flex-col items-center">
            <svg className="w-12 h-12 text-[#616F3E]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="font-serif text-2xl font-semibold text-[#203348]">No Formulations Found</h3>
            <p className="text-sm text-[#203348]/70">
              No products match your active search terms or filters. Try adjusting your goal selection or search keyword.
            </p>
            <button
              onClick={handleClearFilters}
              className="bg-[#A5492B] text-white px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-[#203348] transition-all cursor-pointer inline-block"
            >
              Reset Catalog Filters
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

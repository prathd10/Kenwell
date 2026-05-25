import React, { useState, useMemo } from 'react'
import { PRODUCTS } from '../data'
import ProductCard from './ProductCard'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('featured')
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)

  // Curated lists based on competitor benchmarks
  const collectionIds = useMemo(() => {
    return {
      bestsellers: [1, 2, 6, 12, 19, 21],
      men: [2, 4, 6, 12, 19, 20, 23],
      women: [1, 2, 3, 8, 14, 15, 16]
    }
  }, [])

  // Filter products based on collection, search, series, and health goals
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      // 1. Collection check
      if (collection !== 'all' && collectionIds[collection]) {
        if (!collectionIds[collection].includes(product.id)) {
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
  }, [collection, collectionIds, searchQuery, selectedSeries, selectedGoal])

  // Dynamically extract all unique health goals from active products list
  const allGoals = useMemo(() => {
    const goalsSet = new Set()
    
    // Filter base products by collection first to only show goals relevant to Men/Women/Bestsellers
    const baseProducts = collection !== 'all' && collectionIds[collection]
      ? PRODUCTS.filter(p => collectionIds[collection].includes(p.id))
      : PRODUCTS

    baseProducts.forEach((product) => {
      if (product.healthGoals) {
        product.healthGoals.forEach(g => goalsSet.add(g))
      }
    })
    return ['All', ...Array.from(goalsSet).sort()]
  }, [collection, collectionIds])

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
    <div className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-sage font-mono uppercase tracking-wider text-xs font-semibold">
          {headerContent.badge}
        </span>
        <h1 className="text-4xl md:text-5xl font-serif text-primary-green">
          {headerContent.title}
        </h1>
        <div className="gold-divider max-w-xs mx-auto"></div>
        <p className="text-charcoal/70 text-sm leading-relaxed">
          {headerContent.desc}
        </p>
      </div>

      {/* Catalog Control Bar */}
      <div className="space-y-4">
        {/* Counter */}
        <div className="text-left">
          <span className="font-mono text-xs text-charcoal/50 uppercase tracking-widest">
            {sortedProducts.length} formulations
          </span>
        </div>
        
        <div className="border-t border-cream-dark/40 my-4"></div>

        {/* Filters Toggle & Sort Row */}
        <div className="flex justify-between items-center py-2">
          {/* Left: Show Filters Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className="font-mono text-xs uppercase tracking-widest text-charcoal/80 flex items-center gap-2.5 hover:text-primary-green transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-charcoal/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showFiltersPanel ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                )}
              </svg>
              <span>{showFiltersPanel ? 'Hide Filters' : 'Show Filters'}</span>
            </button>
            {(selectedSeries !== 'All' || selectedGoal !== 'All' || searchQuery) && (
              <button 
                onClick={handleClearFilters}
                className="text-[10px] uppercase font-mono tracking-widest text-sage hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Right: Sort Dropdown styled to match screenshot */}
          <div className="flex items-center space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border border-cream-dark/80 text-charcoal rounded-full px-5 py-2 text-xs font-mono tracking-wider focus:outline-none focus:border-sage cursor-pointer"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="servings-desc">Servings: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Collapsible Filters Panel */}
      {showFiltersPanel && (
        <div className="glass-panel p-6 rounded-2xl border border-white/50 space-y-6 animate-in slide-in-from-top-4 duration-300 text-left">
          
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by product, active ingredient, benefit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-primary border border-cream-dark px-10 py-3 rounded-full text-sm focus:outline-none focus:border-sage placeholder-charcoal/40"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-4 flex items-center text-charcoal/40 text-xs hover:text-charcoal"
              >
                ✕
              </button>
            )}
          </div>

          {/* Series Filter Tabs */}
          <div className="space-y-2 text-left">
            <span className="text-[10px] uppercase font-mono text-charcoal/40 block tracking-wider">Product Series</span>
            <div className="flex flex-wrap gap-2">
              {['All', 'Core Series', 'Wellness Series', 'Liposomal Series'].map((series) => (
                <button
                  key={series}
                  onClick={() => setSelectedSeries(series)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedSeries === series
                      ? 'bg-primary-green text-bg-primary shadow-sm'
                      : 'bg-bg-primary hover:bg-cream-dark/30 text-charcoal/80 border border-cream-dark/50'
                  }`}
                >
                  {series === 'All' ? 'All Formulations' : series}
                </button>
              ))}
            </div>
          </div>

          {/* Health Goals Filter Chips */}
          <div className="space-y-2 text-left pt-2 border-t border-cream-dark/30">
            <span className="text-[10px] uppercase font-mono text-charcoal/40 block tracking-wider">Filter By Health Goal</span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-2">
              {allGoals.map((goal) => (
                <button
                  key={goal}
                  onClick={() => setSelectedGoal(goal)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedGoal === goal
                      ? 'bg-sage text-white font-semibold'
                      : 'bg-bg-primary hover:bg-cream-dark/30 text-charcoal/70 border border-cream-dark/30'
                  }`}
                >
                  {goal === 'All' ? 'All Goals' : goal}
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
        <div className="glass-panel p-16 rounded-2xl border border-cream-dark text-center space-y-4 max-w-md mx-auto flex flex-col items-center">
          <svg className="w-12 h-12 text-sage/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="font-serif text-2xl font-semibold text-primary-green">No Formulations Found</h3>
          <p className="text-sm text-charcoal/70">
            No products match your active search terms or filters. Try adjusting your goal selection or search keyword.
          </p>
          <button
            onClick={handleClearFilters}
            className="bg-primary-green text-bg-primary px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-semibold hover:bg-sage transition-all cursor-pointer inline-block"
          >
            Reset Catalog Filters
          </button>
        </div>
      )}

    </div>
  )
}

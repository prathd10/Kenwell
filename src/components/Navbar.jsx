import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../context/ProductsContext'

export default function Navbar({ 
  currentSection, 
  setCurrentSection, 
  stackCount,
  wishlistItems = [],
  toggleWishlist,
  cartItems = [],
  addToCart,
  removeFromCart,
  updateCartQuantity,
  onSelectFilter,
  onQuickView,
  clearCart
}) {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [shopExpanded, setShopExpanded] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef(null)

  // Products for search
  const { products } = useProducts()

  // Live search results
  const searchResults = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q || q.length < 2) return []
    return (products || [])
      .filter(p => p.is_active && (
        p.name?.toLowerCase().includes(q) ||
        p.categories?.name?.toLowerCase().includes(q) ||
        p.series?.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q)) ||
        (p.health_goals || []).some(g => g.toLowerCase().includes(q))
      ))
      .slice(0, 6)
  }, [searchQuery, products])

  const openSearch = () => {
    setSearchOpen(true)
    setTimeout(() => searchInputRef.current?.focus(), 80)
  }
  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
  }

  // Decoupled cart opener event listener
  React.useEffect(() => {
    const handleOpenCart = () => setCartOpen(true)
    window.addEventListener('kenwell:openCart', handleOpenCart)
    return () => window.removeEventListener('kenwell:openCart', handleOpenCart)
  }, [])

  const navItems = [
    { id: 'shop', name: 'Shop' },
    { id: 'builder', name: 'Stacks', badge: 'Save' },
    { id: 'scanner', name: 'Lab Scanner' },
    { id: 'library', name: 'Science Library' },
    { id: 'stores', name: 'Store Locator' },
    { id: 'about', name: 'About Us' }
  ]

  const handleNavClick = (sectionId) => {
    if (sectionId === 'shop') {
      onSelectFilter('all', 'all')
    } else {
      setCurrentSection(sectionId)
    }
    setMobileMenuOpen(false)
  }

  return (
    <>
    <nav className="sticky top-0 z-50 glass-panel backdrop-blur-md border-b border-cream-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[68px] items-center">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-2 cursor-pointer group flex-1"
          >
            <img src="/kenwell-mark.png" alt="" className="h-7 w-auto" />
            <span style={{ fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.05em', color: '#203348', textTransform: 'uppercase', lineHeight: 1 }}>
              Kenwell
            </span>
          </div>

          {/* Desktop Nav - 5 Exact Links with Shop Dropdown */}
          <div className="hidden md:flex space-x-6 items-center">
            {navItems.map((item) => {
              if (item.id === 'shop') {
                return (
                  <div key={item.id} className="relative group py-2">
                    <button
                      onClick={() => handleNavClick('shop')}
                      className={`transition-all duration-300 hover:text-[#616F3E] cursor-pointer flex items-center gap-1.5`}
                      style={{
                        fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif',
                        fontSize: '0.84rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        color: (currentSection === 'shop' || currentSection === 'bestsellers' || currentSection === 'men' || currentSection === 'women') ? '#203348' : 'rgba(32,51,72,0.8)'
                      }}
                    >
                      <span>Shop</span>
                      <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Hover Dropdown Menu - Glassmorphic and elegant */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-white/95 backdrop-blur-md border border-[#E4DFD3] rounded-2xl shadow-xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex gap-8">
                      {/* Column 1: By Goal */}
                      <div className="w-1/2 flex flex-col text-left">
                        <span 
                          style={{ fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em' }}
                          className="text-[#616F3E] border-b border-[#E4DFD3] pb-2 mb-3 block uppercase"
                        >
                          By Goal
                        </span>
                        <div className="space-y-2">
                          {[
                            'Immunity',
                            'Energy',
                            'Sleep',
                            'Stress',
                            'Longevity',
                            'Gut Health',
                            'Heart',
                            'Joints'
                          ].map((goal) => (
                            <button
                              key={goal}
                              onClick={() => {
                                onSelectFilter('goal', goal)
                              }}
                              className="block text-[11px] font-semibold text-[#203348]/75 hover:text-[#616F3E] tracking-wider uppercase transition-all duration-200 text-left w-full cursor-pointer hover:translate-x-0.5 transform"
                            >
                              {goal}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Column Divider */}
                      <div className="w-[1px] bg-[#E4DFD3] self-stretch"></div>
                      
                      {/* Column 2: By Category */}
                      <div className="w-1/2 flex flex-col text-left">
                        <span 
                          style={{ fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em' }}
                          className="text-[#616F3E] border-b border-[#E4DFD3] pb-2 mb-3 block uppercase"
                        >
                          Shop By Category
                        </span>
                        <div className="space-y-2">
                          {[
                            { name: 'Core Series', type: 'series', val: 'Core Series' },
                            { name: 'Wellness Series', type: 'series', val: 'Wellness Series' },
                            { name: 'Liposomal Series', type: 'series', val: 'Liposomal Series' },
                            { name: 'Bestsellers', type: 'collection', val: 'bestsellers' },
                            { name: 'For Men', type: 'collection', val: 'men' },
                            { name: 'For Women', type: 'collection', val: 'women' },
                            { name: 'See All Products →', type: 'all', val: 'all' }
                          ].map((cat) => (
                            <button
                              key={cat.name}
                              onClick={() => {
                                onSelectFilter(cat.type, cat.val)
                              }}
                              className={`block text-[11px] font-semibold tracking-wider uppercase transition-all duration-200 text-left w-full cursor-pointer hover:translate-x-0.5 transform ${
                                cat.name.includes('→') ? 'text-[#A5492B] hover:text-[#616F3E] mt-1 font-bold' : 'text-[#203348]/75 hover:text-[#616F3E]'
                              }`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }
              
              // Standard nav items
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative transition-all duration-300 py-2 hover:text-[#616F3E] cursor-pointer`}
                  style={{
                    fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: currentSection === item.id ? '#203348' : 'rgba(32,51,72,0.8)'
                  }}
                >
                  {item.name}
                  {item.badge && (
                    <span className="absolute -top-1.5 -right-6 bg-[#A5492B] text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full animate-bounce shadow-md uppercase tracking-wider font-bold">
                      {item.badge}
                    </span>
                  )}
                  {currentSection === item.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#A5492B] rounded-full"></span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Header Action Icons: Search, Wishlist & Cart */}
          <div className="hidden md:flex items-center justify-end space-x-2 flex-1">

            {/* Search Button */}
            <button
              onClick={openSearch}
              className="relative p-2 transition-colors cursor-pointer text-[#203348]/80 hover:text-[#616F3E]"
              title="Search products"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative p-2 transition-colors cursor-pointer"
              style={{color:'rgba(58,32,16,0.65)'}}
              title="Open Wishlist"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-sage text-white text-[9px] font-mono w-4 h-4 rounded-full flex items-center justify-center -mt-0.5 -mr-0.5 shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </button>
            
            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 transition-colors cursor-pointer"
              style={{color:'rgba(58,32,16,0.65)'}}
              title="Open Cart"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary-green text-bg-primary text-[9px] font-mono w-4 h-4 rounded-full flex items-center justify-center -mt-0.5 -mr-0.5 shadow-sm">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Actions & Menu Trigger */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Search Button */}
            <button
              onClick={openSearch}
              className="relative p-2 transition-colors"
              style={{color:'rgba(58,32,16,0.65)'}}
              title="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative p-2 transition-colors"
              style={{color:'rgba(58,32,16,0.65)'}}
              title="Open Wishlist"
            >
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlistItems.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-sage text-white text-[8px] font-mono w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistItems.length}
                </span>
              )}
            </button>
            
            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 transition-colors"
              style={{color:'rgba(58,32,16,0.65)'}}
              title="Open Cart"
            >
              <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-primary-green text-bg-primary text-[8px] font-mono w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-sm">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 focus:outline-none"
              style={{color:'#3A2010'}}
              aria-label="Toggle menu"
            >
              <svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

      {/* SEARCH OVERLAY — full-width panel that slides down from below the navbar */}
      {searchOpen && (
        <div
          style={{
            position: 'fixed', top: 68, left: 0, right: 0, zIndex: 9998,
            background: 'rgba(28,45,26,0.35)',
            backdropFilter: 'blur(3px)',
            height: 'calc(100vh - 68px)',
            animation: 'fadeIn 0.15s ease',
          }}
          onClick={closeSearch}
        >
          {/* Search panel */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white',
              borderBottom: '1px solid #E8E3D9',
              boxShadow: '0 8px 40px rgba(28,45,26,0.15)',
              animation: 'slideDown 0.2s cubic-bezier(0.4,0,0.2,1)',
            }}
          >
            {/* Search input row */}
            <div style={{ maxWidth: 760, margin: '0 auto', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
              <svg style={{ width: 20, height: 20, color: '#7A8C5A', flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Escape' && closeSearch()}
                placeholder="Search products, ingredients, health goals…"
                style={{
                  flex: 1, border: 'none', outline: 'none', background: 'transparent',
                  fontSize: '1rem', color: '#1C2D1A', fontFamily: '"Jost", sans-serif',
                }}
              />
              <button
                onClick={closeSearch}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(28,45,26,0.4)', fontSize: '1.25rem', padding: 4, lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Results */}
            {searchQuery.length >= 2 && (
              <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 1.5rem 1.25rem', borderTop: '1px solid #F4F1EA' }}>
                {searchResults.length === 0 ? (
                  <p style={{ padding: '1.25rem 0', color: '#C9B99A', fontSize: '0.875rem', fontFamily: '"Jost", sans-serif', textAlign: 'center' }}>
                    No products found for <strong style={{ color: '#7A8C5A' }}>"{searchQuery}"</strong>
                  </p>
                ) : (
                  <div style={{ paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: '0.65rem', color: '#C9B99A', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Jost", sans-serif', marginBottom: 6 }}>
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                    </div>
                    {searchResults.map(product => (
                      <button
                        key={product.id}
                        onClick={() => { closeSearch(); onQuickView(product) }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '0.6rem 0.75rem', borderRadius: 10,
                          background: 'none', border: 'none', cursor: 'pointer',
                          width: '100%', textAlign: 'left',
                          transition: 'background 0.12s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F4F1EA'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                      >
                        {/* Thumbnail */}
                        <div style={{ width: 44, height: 44, borderRadius: 8, overflow: 'hidden', border: '1px solid #E8E3D9', flexShrink: 0, background: '#F4F1EA' }}>
                          {product.images?.[0] && (
                            <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                        </div>
                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: '"Fredoka", sans-serif', fontSize: '0.975rem', fontWeight: 500, color: '#1C2D1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#7A8C5A', fontFamily: '"Jost", sans-serif', marginTop: 2 }}>
                            {product.categories?.name ?? ''}{product.series ? ` · ${product.series}` : ''}
                          </div>
                        </div>
                        {/* Price */}
                        <div style={{ fontFamily: '"Fredoka", sans-serif', fontSize: '0.975rem', fontWeight: 500, color: '#2E402B', flexShrink: 0 }}>
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CART DRAWER OVERLAY — outside <nav> to avoid backdrop-filter stacking context trapping fixed children */}

      {cartOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', justifyContent: 'flex-end',
            background: 'rgba(32,51,72,0.55)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={() => setCartOpen(false)}
            style={{ flexGrow: 1, cursor: 'pointer' }}
          />

          <div style={{
            width: '100%', maxWidth: 440,
            background: '#FAF8F5',
            height: '100%',
            boxShadow: '-8px 0 40px rgba(32,51,72,0.18)',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between',
            textAlign: 'left',
            borderLeft: '1px solid #E4DFD3',
            animation: 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)',
            overflowY: 'auto',
          }}>
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(228,223,211,0.6)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#fff',
              position: 'sticky', top: 0, zIndex: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg style={{ width: 20, height: 20, color: '#203348' }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 style={{ fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '1.25rem', fontWeight: 600, color: '#203348', margin: 0 }}>
                  Shopping Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
                </h3>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'rgba(32,51,72,0.4)', padding: 4, lineHeight: 1, display: 'flex', alignItems: 'center' }}
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex', gap: '1rem', padding: '1rem',
                    background: '#fff', border: '1px solid rgba(228,223,211,0.6)',
                    borderRadius: 12,
                  }}>
                    {/* Product Image */}
                    <div style={{ width: 48, height: 64, borderRadius: 8, border: '1px solid #E4DFD3', overflow: 'hidden', flexShrink: 0, background: '#fff' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <h4
                        onClick={() => { setCartOpen(false); onQuickView(item) }}
                        style={{ fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#203348', cursor: 'pointer', margin: '0 0 0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {item.name}
                      </h4>
                      <p style={{ fontSize: '0.65rem', color: 'rgba(32,51,72,0.6)', fontFamily: 'Jost", sans-serif', margin: '0 0 0.5rem' }}>{item.form} • {item.servings} Servs</p>

                      {/* Quantity & Price */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(228,223,211,0.8)', borderRadius: 99, overflow: 'hidden', background: '#FAF8F5' }}>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            style={{ padding: '2px 10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'rgba(32,51,72,0.6)', fontFamily: 'monospace' }}
                          >-</button>
                          <span style={{ padding: '0 8px', fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#203348' }}>{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            style={{ padding: '2px 10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'rgba(32,51,72,0.6)', fontFamily: 'monospace' }}
                          >+</button>
                        </div>
                        <span style={{ fontFamily: 'Jost", sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#203348' }}>₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                  <svg style={{ width: 48, height: 48, color: '#E4DFD3', margin: '0 auto 1rem' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(32,51,72,0.6)', marginBottom: '1rem' }}>Your cart is currently empty.</p>
                  <button
                    onClick={() => { setCartOpen(false); handleNavClick('shop') }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A5492B', textDecoration: 'underline' }}
                  >
                    Start Shopping →
                  </button>
                </div>
              )}
            </div>

            {/* Footer / Summary */}
            {cartItems.length > 0 && (
              <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(228,223,211,0.6)', background: '#fff' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(32,51,72,0.65)', marginBottom: '0.5rem' }}>
                    <span>Subtotal</span>
                    <span>₹{cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(32,51,72,0.65)', marginBottom: '0.5rem' }}>
                    <span>Shipping</span>
                    <span style={{ color: '#616F3E', fontWeight: 700, textTransform: 'uppercase' }}>Free</span>
                  </div>
                  <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, #E4DFD3, transparent)', margin: '0.75rem 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', fontWeight: 600, color: '#203348', fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif' }}>
                    <span>Total Investment</span>
                    <span>₹{cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCartOpen(false)
                    navigate('/checkout')
                  }}
                  style={{
                    display: 'block', width: '100%',
                    background: '#A5492B', color: '#FFFFFF',
                    border: 'none', borderRadius: 99,
                    padding: '0.875rem 0',
                    fontSize: '0.7rem', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.15em',
                    cursor: 'pointer',
                    transition: 'background 0.25s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#203348'}
                  onMouseLeave={e => e.currentTarget.style.background = '#A5492B'}
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WISHLIST DRAWER OVERLAY — outside <nav> to avoid backdrop-filter stacking context */}
      {wishlistOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', justifyContent: 'flex-end',
            background: 'rgba(28,45,26,0.5)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            onClick={() => setWishlistOpen(false)}
            style={{ flexGrow: 1, cursor: 'pointer' }}
          />

          <div style={{
            width: '100%', maxWidth: 440,
            background: '#F4F1EA',
            height: '100%',
            boxShadow: '-8px 0 40px rgba(28,45,26,0.18)',
            display: 'flex', flexDirection: 'column',
            borderLeft: '1px solid #DDD8CA',
            animation: 'slideInRight 0.3s cubic-bezier(0.4,0,0.2,1)',
            overflowY: 'auto',
          }}>
            {/* Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(228,223,211,0.6)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#fff',
              position: 'sticky', top: 0, zIndex: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg style={{ width: 20, height: 20, color: '#616F3E' }} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 style={{ fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '1.25rem', fontWeight: 600, color: '#203348', margin: 0 }}>
                  Your Wishlist ({wishlistItems.length})
                </h3>
              </div>
              <button
                onClick={() => setWishlistOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: 'rgba(32,51,72,0.4)', padding: 4, lineHeight: 1 }}
              >
                ✕
              </button>
            </div>

            {/* Wishlist Items */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex', gap: '1rem', padding: '1rem',
                    background: '#fff', border: '1px solid rgba(228,223,211,0.6)',
                    borderRadius: 12, alignItems: 'center',
                  }}>
                    <div style={{ width: 48, height: 64, borderRadius: 8, border: '1px solid #E4DFD3', overflow: 'hidden', flexShrink: 0, background: '#fff' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" decoding="async" />
                    </div>

                    <div style={{ flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                        <h4
                          onClick={() => { setWishlistOpen(false); onQuickView(item) }}
                          style={{ fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '0.9rem', fontWeight: 600, color: '#203348', cursor: 'pointer', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}
                        >
                          {item.name}
                        </h4>
                        <button
                          onClick={() => toggleWishlist(item)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(32,51,72,0.35)', fontSize: '0.75rem', fontWeight: 700, padding: '0 0 0 8px' }}
                          title="Remove from Wishlist"
                        >
                          ✕
                        </button>
                      </div>
                      <p style={{ fontSize: '0.65rem', color: 'rgba(32,51,72,0.6)', fontFamily: 'Jost", sans-serif', margin: '0 0 0.5rem' }}>{item.form} • ₹{item.price}</p>

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => { addToCart(item); toggleWishlist(item) }}
                          style={{
                            padding: '4px 12px', background: '#A5492B', color: '#FFFFFF',
                            border: 'none', borderRadius: 99, cursor: 'pointer',
                            fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                          }}
                        >
                          + Cart
                        </button>
                        <button
                          onClick={() => { setWishlistOpen(false); onQuickView(item) }}
                          style={{
                            padding: '4px 12px', background: '#FAF8F5', color: '#203348',
                            border: '1px solid rgba(228,223,211,0.8)', borderRadius: 99, cursor: 'pointer',
                            fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em',
                          }}
                        >
                          Info
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                  <svg style={{ width: 48, height: 48, color: '#E4DFD3', margin: '0 auto 1rem' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p style={{ fontSize: '0.875rem', color: 'rgba(32,51,72,0.6)', marginBottom: '1rem' }}>Your wishlist is currently empty.</p>
                  <button
                    onClick={() => { setWishlistOpen(false); handleNavClick('shop') }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#A5492B', textDecoration: 'underline' }}
                  >
                    Browse Formulations →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    {/* Mobile Menu — outside nav to avoid backdrop-filter containing block constraint */}
    <div className="md:hidden">
      {/* Backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 40,
          background: 'rgba(32,51,72,0.5)',
          backdropFilter: 'blur(2px)',
          opacity: mobileMenuOpen ? 1 : 0,
          pointerEvents: mobileMenuOpen ? 'auto' : 'none',
          transition: 'opacity 0.28s ease',
        }}
      />

      {/* Drawer panel */}
      <div style={{
        position: 'fixed', top: 0, right: 0,
        width: '75%', maxWidth: 320, height: '100vh',
        zIndex: 50,
        background: '#FAF8F5',
        boxShadow: '-8px 0 32px rgba(32,51,72,0.2)',
        transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 1.25rem 1rem', borderBottom: '1px solid #E4DFD3' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/kenwell-mark.png" alt="" style={{ height: 22, width: 'auto' }} />
            <span style={{ fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '1.3rem', fontWeight: 600, letterSpacing: '0.05em', color: '#203348', textTransform: 'uppercase' }}>
              Kenwell
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A5492B', padding: 4, display: 'flex', alignItems: 'center' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, padding: '0.75rem 0' }}>
          {/* Shop with collapsible sub-items */}
          <div>
            <button
              onClick={() => setShopExpanded(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '0.875rem 1.5rem',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '1.25rem', fontWeight: 600,
                color: (currentSection === 'shop' || currentSection === 'bestsellers' || currentSection === 'men' || currentSection === 'women') ? '#203348' : 'rgba(32,51,72,0.75)',
                borderLeft: (currentSection === 'shop' || currentSection === 'bestsellers' || currentSection === 'men' || currentSection === 'women') ? '3px solid #A5492B' : '3px solid transparent',
                textAlign: 'left', letterSpacing: '0.01em',
              }}
            >
              Shop
              <svg
                style={{ transform: shopExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', flexShrink: 0 }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <div style={{ maxHeight: shopExpanded ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.3s ease' }}>
              {[
                { label: 'All Products', action: () => { onSelectFilter('all', 'all'); setMobileMenuOpen(false) } },
                { label: 'Bestsellers', action: () => { onSelectFilter('collection', 'bestsellers'); setMobileMenuOpen(false) } },
                { label: 'For Men', action: () => { onSelectFilter('collection', 'men'); setMobileMenuOpen(false) } },
                { label: 'For Women', action: () => { onSelectFilter('collection', 'women'); setMobileMenuOpen(false) } },
                { label: 'Core Series', action: () => { onSelectFilter('series', 'Core Series'); setMobileMenuOpen(false) } },
                { label: 'Wellness Series', action: () => { onSelectFilter('series', 'Wellness Series'); setMobileMenuOpen(false) } },
                { label: 'Liposomal Series', action: () => { onSelectFilter('series', 'Liposomal Series'); setMobileMenuOpen(false) } },
              ].map(sub => (
                <button
                  key={sub.label}
                  onClick={sub.action}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '0.45rem 1.5rem 0.45rem 2.25rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: '"Jost", sans-serif', fontSize: '0.8rem',
                    color: '#6B7280', letterSpacing: '0.07em', textTransform: 'uppercase',
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>

          {/* Other nav items */}
          {[
            { id: 'builder', label: 'Curated Stacks', badge: 'Save' },
            { id: 'scanner', label: 'Lab Scanner' },
            { id: 'library', label: 'Science Library' },
            { id: 'stores', label: 'Store Locator' },
            { id: 'track', label: 'Track Order' },
            { id: 'partner', label: 'Become a Partner' },
            { id: 'about', label: 'About Us' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                width: '100%', padding: '0.875rem 1.5rem',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '1.25rem', fontWeight: 600,
                color: currentSection === item.id ? '#203348' : 'rgba(32,51,72,0.75)',
                borderLeft: currentSection === item.id ? '3px solid #A5492B' : '3px solid transparent',
                textAlign: 'left', letterSpacing: '0.01em',
              }}
            >
              {item.label}
              {item.badge && (
                <span style={{ background: '#A5492B', color: 'white', fontSize: '0.55rem', fontFamily: 'monospace', padding: '2px 7px', borderRadius: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Drawer Footer */}
        <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #E4DFD3' }}>
          <p style={{ fontSize: '0.65rem', color: '#A5492B', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: '"Jost", sans-serif' }}>
            Kenwell · Wellness &amp; Nutrition
          </p>
        </div>
      </div>
    </div>
    </>
  )
}

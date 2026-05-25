import React, { useState } from 'react'

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
  onQuickView
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishlistOpen, setWishlistOpen] = useState(false)

  const navItems = [
    { id: 'shop', name: 'Shop' },
    { id: 'builder', name: 'Stack', badge: stackCount },
    { id: 'scanner', name: 'Lab Scanner' },
    { id: 'library', name: 'Science Library' },
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
    <nav className="sticky top-0 z-50 glass-panel backdrop-blur-md border-b border-cream-dark shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo without Emoji */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <span className="font-serif text-2xl font-bold tracking-widest text-primary-green uppercase">
              Kenwell
            </span>
          </div>

          {/* Desktop Nav - 5 Exact Links with Shop Dropdown */}
          <div className="hidden md:flex space-x-8 items-center">
            {navItems.map((item) => {
              if (item.id === 'shop') {
                return (
                  <div key={item.id} className="relative group py-2">
                    <button
                      onClick={() => handleNavClick('shop')}
                      className={`font-medium text-sm tracking-wider uppercase transition-all duration-300 hover:text-sage cursor-pointer flex items-center gap-1 ${
                        currentSection === 'shop' || currentSection === 'bestsellers' || currentSection === 'men' || currentSection === 'women'
                          ? 'text-primary-green font-semibold' 
                          : 'text-charcoal/70'
                      }`}
                    >
                      <span>Shop</span>
                      <svg className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {/* Hover Dropdown Menu - Glassmorphic and elegant */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[480px] bg-white/95 backdrop-blur-md border border-cream-dark/60 rounded-2xl shadow-xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 flex gap-8">
                      {/* Column 1: By Goal */}
                      <div className="w-1/2 flex flex-col text-left">
                        <span className="font-mono text-[9px] font-bold tracking-widest text-primary-green border-b border-cream-dark/40 pb-2 mb-3 block uppercase">
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
                              className="block text-[11px] font-semibold text-charcoal/70 hover:text-primary-green tracking-wider uppercase transition-all duration-200 text-left w-full cursor-pointer hover:translate-x-0.5 transform"
                            >
                              {goal}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Column Divider */}
                      <div className="w-[1px] bg-cream-dark/40 self-stretch"></div>
                      
                      {/* Column 2: By Category */}
                      <div className="w-1/2 flex flex-col text-left">
                        <span className="font-mono text-[9px] font-bold tracking-widest text-primary-green border-b border-cream-dark/40 pb-2 mb-3 block uppercase">
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
                                cat.name.includes('→') ? 'text-sage hover:text-primary-green mt-1 font-bold' : 'text-charcoal/70 hover:text-primary-green'
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
                  className={`relative font-medium text-sm tracking-wider uppercase transition-all duration-300 py-2 hover:text-sage cursor-pointer ${
                    currentSection === item.id 
                      ? 'text-primary-green font-semibold' 
                      : 'text-charcoal/70'
                  }`}
                >
                  {item.name}
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-5 bg-sage text-white text-[10px] font-mono px-1.5 py-0.5 rounded-full animate-bounce shadow-md">
                      {item.badge}
                    </span>
                  )}
                  {currentSection === item.id && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-sage rounded-full"></span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Header Action Icons: Wishlist & Cart */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wishlist Button */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative p-2 text-charcoal/70 hover:text-primary-green transition-colors cursor-pointer"
              title="Open Wishlist"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
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
              className="relative p-2 text-charcoal/70 hover:text-primary-green transition-colors cursor-pointer"
              title="Open Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
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
          <div className="flex md:hidden items-center space-x-3">
            {/* Wishlist Button */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative p-2 text-charcoal/70 hover:text-primary-green transition-colors"
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
              className="relative p-2 text-charcoal/70 hover:text-primary-green transition-colors"
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
              className="text-charcoal p-2 focus:outline-none"
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-cream-dark transition-all duration-300">
          <div className="px-2 pt-4 pb-6 space-y-2 sm:px-3">
            {navItems.map((item) => {
              if (item.id === 'shop') {
                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => handleNavClick('shop')}
                      className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-xl text-base font-medium tracking-wide uppercase transition-all ${
                        currentSection === 'shop' || currentSection === 'bestsellers' || currentSection === 'men' || currentSection === 'women'
                          ? 'bg-sage/10 text-primary-green font-bold' 
                          : 'text-charcoal/70'
                      }`}
                    >
                      Shop
                    </button>
                    {/* Mobile submenus */}
                    <div className="pl-4 pr-2 pb-2 grid grid-cols-2 gap-4 text-left border-l-2 border-cream-dark/50 ml-4 my-2">
                      <div className="space-y-1.5">
                        <span className="block text-[8px] font-mono uppercase tracking-widest text-primary-green font-bold">Goals</span>
                        {['Immunity', 'Energy', 'Sleep', 'Stress', 'Longevity', 'Gut Health'].map(goal => (
                          <button
                            key={goal}
                            onClick={() => {
                              onSelectFilter('goal', goal)
                              setMobileMenuOpen(false)
                            }}
                            className="block text-[10px] font-semibold text-charcoal/60 uppercase hover:text-primary-green py-0.5 text-left w-full cursor-pointer"
                          >
                            {goal}
                          </button>
                        ))}
                      </div>
                      <div className="space-y-1.5">
                        <span className="block text-[8px] font-mono uppercase tracking-widest text-primary-green font-bold">Categories</span>
                        {[
                          { name: 'Core Series', type: 'series', val: 'Core Series' },
                          { name: 'Wellness Series', type: 'series', val: 'Wellness Series' },
                          { name: 'Liposomal Series', type: 'series', val: 'Liposomal Series' },
                          { name: 'Bestsellers', type: 'collection', val: 'bestsellers' },
                          { name: 'For Men', type: 'collection', val: 'men' },
                          { name: 'For Women', type: 'collection', val: 'women' }
                        ].map(cat => (
                          <button
                            key={cat.name}
                            onClick={() => {
                              onSelectFilter(cat.type, cat.val)
                              setMobileMenuOpen(false)
                            }}
                            className="block text-[10px] font-semibold text-charcoal/60 uppercase hover:text-primary-green py-0.5 text-left w-full cursor-pointer"
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between w-full text-left px-4 py-3 rounded-xl text-base font-medium tracking-wide uppercase transition-all ${
                    currentSection === item.id 
                      ? 'bg-sage/10 text-primary-green font-bold' 
                      : 'text-charcoal/70 hover:bg-cream-dark/20'
                  }`}
                >
                  <span>{item.name}</span>
                  {item.badge > 0 && (
                    <span className="bg-sage text-white text-[10px] font-mono px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* CART DRAWER OVERLAY */}
      {cartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-charcoal/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            onClick={() => setCartOpen(false)}
            className="flex-grow cursor-pointer"
          ></div>
          
          <div className="w-full max-w-md bg-bg-primary h-full shadow-2xl flex flex-col justify-between text-left animate-in slide-in-from-right duration-300 border-l border-cream-dark">
            {/* Header */}
            <div className="p-6 border-b border-cream-dark/50 flex justify-between items-center bg-white">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-primary-green" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="font-serif text-xl font-bold text-primary-green">Shopping Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h3>
              </div>
              <button 
                onClick={() => setCartOpen(false)}
                className="text-charcoal/40 hover:text-charcoal text-xl p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white border border-cream-dark/40 rounded-xl">
                    {/* Tiny Bottle Image */}
                    <div className="w-12 h-16 rounded-lg border border-cream-dark overflow-hidden shrink-0 bg-white">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-grow space-y-1">
                      <h4 
                        onClick={() => {
                          setCartOpen(false)
                          onQuickView(item)
                        }}
                        className="font-serif text-sm font-bold text-primary-green hover:underline cursor-pointer line-clamp-1"
                      >
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-charcoal/50 font-mono">{item.form} • {item.servings} Servs</p>
                      
                      {/* Quantity Selector & Price */}
                      <div className="flex justify-between items-center pt-1.5">
                        <div className="flex items-center border border-cream-dark/60 rounded-full bg-bg-primary overflow-hidden">
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs text-charcoal/60 hover:bg-cream-dark/40 transition-colors font-mono cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2.5 text-xs font-mono font-bold text-charcoal">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-charcoal/60 hover:bg-cream-dark/40 transition-colors font-mono cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-mono text-xs font-bold text-primary-green">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 space-y-4">
                  <svg className="w-12 h-12 text-cream-dark mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <p className="text-sm text-charcoal/50">Your cart is currently empty.</p>
                  <button 
                    onClick={() => {
                      setCartOpen(false)
                      handleNavClick('shop')
                    }}
                    className="text-xs font-semibold uppercase tracking-wider text-sage hover:underline cursor-pointer"
                  >
                    Start Shopping →
                  </button>
                </div>
              )}
            </div>

            {/* Footer / Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-cream-dark/50 bg-white space-y-4">
                <div className="space-y-2 text-xs font-mono text-charcoal/60">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-sage font-bold uppercase">Free</span>
                  </div>
                  <div className="gold-divider my-2"></div>
                  <div className="flex justify-between text-sm font-bold text-primary-green font-serif">
                    <span>Total Investment</span>
                    <span>₹{cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}</span>
                  </div>
                </div>

                <button
                  onClick={() => alert(`Secure check-out initiated for ₹${cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}!`)}
                  className="w-full bg-primary-green text-bg-primary hover:bg-sage hover:text-white py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer text-center block"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* WISHLIST DRAWER OVERLAY */}
      {wishlistOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-charcoal/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            onClick={() => setWishlistOpen(false)}
            className="flex-grow cursor-pointer"
          ></div>
          
          <div className="w-full max-w-md bg-bg-primary h-full shadow-2xl flex flex-col justify-between text-left animate-in slide-in-from-right duration-300 border-l border-cream-dark">
            {/* Header */}
            <div className="p-6 border-b border-cream-dark/50 flex justify-between items-center bg-white">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <h3 className="font-serif text-xl font-bold text-primary-green">Your Wishlist ({wishlistItems.length})</h3>
              </div>
              <button 
                onClick={() => setWishlistOpen(false)}
                className="text-charcoal/40 hover:text-charcoal text-xl p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Wishlist Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {wishlistItems.length > 0 ? (
                wishlistItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white border border-cream-dark/40 rounded-xl items-center">
                    {/* Tiny Bottle Image */}
                    <div className="w-12 h-16 rounded-lg border border-cream-dark overflow-hidden shrink-0 bg-white">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-grow space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 
                          onClick={() => {
                            setWishlistOpen(false)
                            onQuickView(item)
                          }}
                          className="font-serif text-sm font-bold text-primary-green hover:underline cursor-pointer line-clamp-1"
                        >
                          {item.name}
                        </h4>
                        <button 
                          onClick={() => toggleWishlist(item)}
                          className="text-charcoal/30 hover:text-red-700 text-xs pl-2 cursor-pointer font-bold"
                          title="Remove from Wishlist"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-[10px] text-charcoal/50 font-mono">{item.form} • ₹{item.price}</p>
                      
                      {/* Action buttons inside Wishlist item */}
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => {
                            addToCart(item)
                            toggleWishlist(item) // remove from wishlist once added to cart to keep it clean
                          }}
                          className="px-3 py-1 bg-primary-green text-bg-primary hover:bg-sage text-[10px] font-semibold uppercase tracking-wider rounded-full transition-colors cursor-pointer shadow-sm"
                        >
                          + Cart
                        </button>
                        <button
                          onClick={() => {
                            setWishlistOpen(false)
                            onQuickView(item)
                          }}
                          className="px-3 py-1 bg-bg-primary text-charcoal/60 hover:text-primary-green border border-cream-dark/50 text-[10px] font-semibold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                        >
                          Info
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 space-y-4">
                  <svg className="w-12 h-12 text-cream-dark mx-auto" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="text-sm text-charcoal/50">Your wishlist is currently empty.</p>
                  <button 
                    onClick={() => {
                      setWishlistOpen(false)
                      handleNavClick('shop')
                    }}
                    className="text-xs font-semibold uppercase tracking-wider text-sage hover:underline cursor-pointer"
                  >
                    Browse Formulations →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

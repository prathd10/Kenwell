import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function StoreLocator({ setCurrentSection }) {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedStore, setSelectedStore] = useState(null)
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All') // 'All', 'Official Store', 'Store Partner'

  useEffect(() => {
    async function fetchStores() {
      setLoading(true)
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (!error && data) {
        setStores(data)
        if (data.length > 0) {
          setSelectedStore(data[0])
        }
      }
      setLoading(false)
    }

    fetchStores()
  }, [])

  // Filtered stores list
  const filteredStores = stores.filter(store => {
    const query = searchQuery.toLowerCase().trim()
    const matchesSearch = 
      store.name.toLowerCase().includes(query) ||
      store.address.toLowerCase().includes(query) ||
      store.city.toLowerCase().includes(query) ||
      store.state.toLowerCase().includes(query) ||
      store.postal_code.toLowerCase().includes(query)

    const matchesType = selectedType === 'All' ? true : store.type === selectedType

    return matchesSearch && matchesType
  })

  // Google Maps embed URL generator
  const getEmbedUrl = (store) => {
    if (!store) return ''
    const query = `${store.name}, ${store.address}, ${store.city}, ${store.state} ${store.postal_code}`
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
  }

  return (
    <div className="bg-bg-primary min-h-screen pb-16">
      {/* Premium Dark Green Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-green to-[#1b2b19] text-white py-16 px-4 text-center">
        {/* Animated backdrop grids */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#DDD8CA_1px,transparent_1px),linear-gradient(to_bottom,#DDD8CA_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-sage/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-champagne/10 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <span className="font-mono text-xs font-bold tracking-widest text-champagne uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full inline-block">
            Verified Authenticity
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            Kenwell Store Locator
          </h1>
          <p className="text-bg-primary/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-body">
            Find official Kenwell flagship experience stores or certified retail partner outlets near you to purchase verified, authentic formulations.
          </p>
        </div>
      </div>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="glass-panel rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
          
          {/* Sidebar Area: List and Filters (5 cols on lg) */}
          <div className="lg:col-span-5 bg-white/50 border-r border-cream-dark/50 flex flex-col h-[700px] lg:h-[750px]">
            
            {/* Filter Headers */}
            <div className="p-6 border-b border-cream-dark/50 bg-white/80 space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Enter city, state, or pincode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-bg-primary/50 text-charcoal placeholder-charcoal/40 pl-11 pr-4 py-3 rounded-2xl border border-cream-dark focus:border-sage focus:outline-none transition-all duration-300 font-body text-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal text-xs font-bold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Store Type Filters */}
              <div className="flex gap-2 p-1 bg-bg-primary/60 rounded-xl border border-cream-dark/40">
                {['All', 'Official Store', 'Store Partner'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`flex-1 text-[11px] font-bold tracking-wider uppercase py-2 px-3 rounded-lg transition-all duration-300 cursor-pointer ${
                      selectedType === type
                        ? 'bg-primary-green text-white shadow-md'
                        : 'text-charcoal/60 hover:text-charcoal hover:bg-white/50'
                    }`}
                  >
                    {type === 'All' ? 'All' : type.replace('Store ', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Store Listings */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF9F5]/40">
              {loading ? (
                // Shimmer Loader List
                [1, 2, 3].map((n) => (
                  <div key={n} className="p-5 rounded-2xl border border-cream-dark/30 bg-white/40 space-y-3 animate-pulse">
                    <div className="h-4 w-1/3 bg-cream-dark/80 rounded-md" />
                    <div className="h-5 w-2/3 bg-cream-dark/80 rounded-md" />
                    <div className="h-3 w-5/6 bg-cream-dark/50 rounded-md" />
                    <div className="h-8 w-1/2 bg-cream-dark/30 rounded-full mt-2" />
                  </div>
                ))
              ) : filteredStores.length === 0 ? (
                <div className="text-center py-16 px-4">
                  <svg className="w-12 h-12 text-sage/40 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="font-serif text-lg font-bold text-charcoal">No Stores Found</h3>
                  <p className="text-charcoal/50 text-xs mt-1 max-w-xs mx-auto">
                    We couldn't find any Kenwell stores or partner locations matching "{searchQuery}" under this category.
                  </p>
                </div>
              ) : (
                filteredStores.map((store) => {
                  const isSelected = selectedStore?.id === store.id
                  return (
                    <div
                      key={store.id}
                      onClick={() => setSelectedStore(store)}
                      className={`p-5 rounded-2xl border transition-all duration-300 text-left cursor-pointer relative group ${
                        isSelected
                          ? 'border-primary-green bg-white shadow-md scale-[1.01]'
                          : 'border-cream-dark/30 bg-white/60 hover:bg-white hover:border-cream-dark/80'
                      }`}
                    >
                      {/* Store Card Header */}
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${
                          store.type === 'Official Store'
                            ? 'bg-primary-green/10 text-primary-green'
                            : 'bg-gold-accent/15 text-gold-accent'
                        }`}>
                          {store.type}
                        </span>
                        
                        {store.phone && (
                          <a
                            href={`tel:${store.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] text-charcoal/50 hover:text-primary-green flex items-center gap-1 font-mono transition-colors"
                            title="Call Store"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.502-5.183-3.862-6.686-6.686l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                            </svg>
                            {store.phone}
                          </a>
                        )}
                      </div>

                      <h3 className="font-serif text-lg font-bold text-charcoal leading-snug group-hover:text-primary-green transition-colors">
                        {store.name}
                      </h3>

                      <p className="text-charcoal/70 text-xs mt-2 font-body leading-relaxed">
                        {store.address}, {store.city}, {store.state} - {store.postal_code}
                      </p>

                      {/* Store Card Actions */}
                      <div className="mt-4 pt-3 border-t border-cream-dark/20 flex items-center justify-between">
                        <span className="text-[11px] text-sage font-medium group-hover:translate-x-1 transform transition-transform duration-300 flex items-center gap-1">
                          View details on map <span className="text-sm">→</span>
                        </span>

                        <a
                          href={store.map_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="bg-bg-primary text-primary-green hover:bg-primary-green hover:text-white text-[10px] font-bold tracking-wider uppercase py-1.5 px-3.5 rounded-full border border-cream-dark/60 transition-all duration-300 flex items-center gap-1"
                        >
                          Directions
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  )
                })
              )}

              {/* Partnership CTA Card */}
              <div className="p-5 rounded-2xl border border-gold-accent/30 bg-gold-accent/5 mt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold tracking-widest text-gold-accent bg-gold-accent/15 px-2.5 py-1 rounded-full uppercase font-mono">Partnership</span>
                </div>
                <h4 className="font-serif text-base font-bold text-charcoal">Sell Kenwell Products</h4>
                <p className="text-charcoal/60 text-xs font-body leading-relaxed">
                  Own a retail store or fitness outlet? Apply to carry our premium formulations and get listed on our map.
                </p>
                <button
                  onClick={() => setCurrentSection('partner')}
                  className="w-full bg-primary-green hover:bg-sage text-white text-[10px] font-bold tracking-wider uppercase py-2 px-4 rounded-xl transition-all duration-300 shadow-sm cursor-pointer text-center block border-none"
                >
                  Apply for Partnership
                </button>
              </div>
            </div>
          </div>

          {/* Map Display Area (7 cols on lg) */}
          <div className="lg:col-span-7 bg-[#EAE5D9]/20 flex flex-col h-[400px] lg:h-[750px] relative overflow-hidden">
            {selectedStore ? (
              <>
                {/* Embed Map Frame */}
                <div className="w-full h-full relative">
                  <iframe
                    title={`Google Map for ${selectedStore.name}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'grayscale(0.1) contrast(1.02)' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={getEmbedUrl(selectedStore)}
                  />
                </div>

                {/* Overlaid Selected Store Detail Badge */}
                <div className="absolute bottom-6 left-6 right-6 glass-panel rounded-2xl shadow-xl p-5 border border-white/60 space-y-3 z-30 animate-fadeIn pointer-events-auto max-w-lg">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full ${
                      selectedStore.type === 'Official Store'
                        ? 'bg-primary-green text-white'
                        : 'bg-gold-accent text-white'
                    }`}>
                      {selectedStore.type}
                    </span>
                    <span className="text-[10px] text-charcoal/60 font-mono">Verified Outpost</span>
                  </div>

                  <div>
                    <h4 className="font-serif text-xl font-bold text-charcoal">
                      {selectedStore.name}
                    </h4>
                    <p className="text-charcoal/70 text-xs mt-1 leading-relaxed">
                      {selectedStore.address}, {selectedStore.city}, {selectedStore.state} - {selectedStore.postal_code}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-cream-dark/40">
                    {selectedStore.phone && (
                      <div className="text-xs text-charcoal/80 flex items-center gap-2">
                        <span className="text-sage">Phone:</span>
                        <a href={`tel:${selectedStore.phone}`} className="font-bold hover:underline">{selectedStore.phone}</a>
                      </div>
                    )}
                    
                    <a
                      href={selectedStore.map_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-primary-green text-white hover:bg-sage text-xs font-bold tracking-widest uppercase py-2.5 px-6 rounded-xl transition-all duration-300 shadow-md flex items-center gap-2"
                    >
                      <span>Navigate via Google Maps</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white/20">
                <svg className="w-16 h-16 text-sage/40 animate-bounce mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <h3 className="font-serif text-xl font-bold text-charcoal">Select a Location</h3>
                <p className="text-charcoal/50 text-xs mt-1 max-w-sm">
                  Click on any store listing on the left to show its exact position on the interactive map.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

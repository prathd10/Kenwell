import React, { useState } from 'react'

export default function Footer({ setCurrentSection }) {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <footer className="relative bg-[#203348] text-[#FAF8F5] mt-20 border-t border-[#203348] overflow-hidden">
      {/* Background Botanical Pattern Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15 bg-repeat"
        style={{ backgroundImage: "url('/patterns/pattern-blue.jpg')", backgroundSize: '360px auto' }}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#203348]/30 via-transparent to-[#203348]/70" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src="/kenwell-mark-light.png" alt="" className="h-8 w-auto" />
              <span style={{ fontFamily: '"Marker Felt", "Patrick Hand", "Fredoka", cursive, sans-serif', fontSize: '1.45rem', fontWeight: 600, letterSpacing: '0.05em', color: '#FAF8F5', textTransform: 'uppercase', lineHeight: 1 }}>
                Kenwell
              </span>
            </div>
            <p className="text-[#FAF8F5]/75 text-sm leading-relaxed">
              Premium Indian nutraceutical wellness. Clean ingredients, science-backed formulas, full label disclosure, and made in India.
            </p>
            <div className="pt-2 flex space-x-4 text-[#FAF8F5]/50 text-xs">
              <span>GMP Certified</span>
              <span>-</span>
              <span>ISO 9001</span>
              <span>-</span>
              <span>Non-GMO</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold tracking-wide text-[#FAF8F5] mb-6">Discovery</h3>
            <ul className="space-y-3 text-sm text-[#FAF8F5]/75">
              <li>
                <button onClick={() => setCurrentSection('shop')} className="hover:text-[#A5492B] transition-colors cursor-pointer">
                  Product Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('builder')} className="hover:text-[#A5492B] transition-colors cursor-pointer">
                  Stack Builder
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('scanner')} className="hover:text-[#A5492B] transition-colors cursor-pointer">
                  Lab Transparency Scanner
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('library')} className="hover:text-[#A5492B] transition-colors cursor-pointer">
                  Science & Research Library
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('about')} className="hover:text-[#A5492B] transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('stores')} className="hover:text-[#A5492B] transition-colors cursor-pointer">
                  Store Locator
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('partner')} className="hover:text-[#A5492B] transition-colors cursor-pointer">
                  Become a Partner
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('track')} className="hover:text-[#A5492B] transition-colors cursor-pointer">
                  Track Order
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('verify')} className="hover:text-[#A5492B] transition-colors cursor-pointer">
                  Verify Product
                </button>
              </li>
            </ul>
          </div>

          {/* Quality Standards */}
          <div>
            <h3 className="font-serif text-lg font-semibold tracking-wide text-[#FAF8F5] mb-6">Our Standard</h3>
            <div className="space-y-4 text-sm text-[#FAF8F5]/75">
              <div className="flex items-start space-x-3">
                <svg className="w-4 h-4 text-[#A5492B] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <p><strong>100% Open Label:</strong> Absolute disclosure of every single filler, excipient, and active ingredient.</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-4 h-4 text-[#A5492B] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <p><strong>Organic Chelations:</strong> We only utilize organic mineral salts (glycinate, picolinate) for gentle gut absorption.</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-4 h-4 text-[#A5492B] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <p><strong>Third-Party Assay:</strong> Every batch is tested for heavy metals and purity levels.</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-semibold tracking-wide text-[#FAF8F5] mb-6">Science Updates</h3>
            <p className="text-[#FAF8F5]/75 text-sm mb-4 leading-relaxed">
              Subscribe to get notified about new clinical trials, ingredient sourcing journals, and product stacks.
            </p>
            {subscribed ? (
              <div className="bg-[#616F3E]/20 border border-[#616F3E]/40 rounded-xl p-4 text-sm text-center text-[#FAF8F5] flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 text-[#616F3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span>Thank you! You are subscribed.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 px-4 py-3 rounded-full text-sm focus:outline-none focus:border-[#A5492B]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bg-[#A5492B] text-white hover:bg-[#616F3E] font-semibold px-4 py-2 rounded-full text-xs transition-colors cursor-pointer"
                  >
                    Join
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-[#FAF8F5]/50">
          <p>© {new Date().getFullYear()} Kenwell Nutraceuticals Pvt. Ltd. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button onClick={() => setCurrentSection('privacy')} className="hover:text-[#A5492B] transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => setCurrentSection('terms')} className="hover:text-[#A5492B] transition-colors cursor-pointer">
              Terms of Service
            </button>
            <button onClick={() => setCurrentSection('shipping')} className="hover:text-[#A5492B] transition-colors cursor-pointer">
              Shipping & Returns
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

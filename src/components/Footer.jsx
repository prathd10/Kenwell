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
    <footer className="bg-primary-green text-bg-primary mt-20 border-t border-primary-green">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="font-serif text-2xl font-bold tracking-widest text-bg-primary uppercase">
                Kenwell
              </span>
            </div>
            <p className="text-bg-primary/70 text-sm leading-relaxed">
              Premium Indian nutraceutical wellness. Clean ingredients, science-backed formulas, full label disclosure, and made in India.
            </p>
            <div className="pt-2 flex space-x-4 text-bg-primary/50 text-xs">
              <span>GMP Certified</span>
              <span>-</span>
              <span>ISO 9001</span>
              <span>-</span>
              <span>Non-GMO</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif text-lg font-semibold tracking-wide text-bg-primary mb-6">Discovery</h3>
            <ul className="space-y-3 text-sm text-bg-primary/70">
              <li>
                <button onClick={() => setCurrentSection('shop')} className="hover:text-champagne transition-colors cursor-pointer">
                  Product Catalog
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('builder')} className="hover:text-champagne transition-colors cursor-pointer">
                  Stack Builder
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('scanner')} className="hover:text-champagne transition-colors cursor-pointer">
                  Lab Transparency Scanner
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('library')} className="hover:text-champagne transition-colors cursor-pointer">
                  Science & Research Library
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('about')} className="hover:text-champagne transition-colors cursor-pointer">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('stores')} className="hover:text-champagne transition-colors cursor-pointer">
                  Store Locator
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('partner')} className="hover:text-champagne transition-colors cursor-pointer">
                  Become a Partner
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentSection('track')} className="hover:text-champagne transition-colors cursor-pointer">
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Quality Standards */}
          <div>
            <h3 className="font-serif text-lg font-semibold tracking-wide text-bg-primary mb-6">Our Standard</h3>
            <div className="space-y-4 text-sm text-bg-primary/70">
              <div className="flex items-start space-x-3">
                <svg className="w-4 h-4 text-champagne shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <p><strong>100% Open Label:</strong> Absolute disclosure of every single filler, excipient, and active ingredient.</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-4 h-4 text-champagne shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <p><strong>Organic Chelations:</strong> We only utilize organic mineral salts (glycinate, picolinate) for gentle gut absorption.</p>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-4 h-4 text-champagne shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <p><strong>Third-Party Assay:</strong> Every batch is tested for heavy metals and purity levels.</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-serif text-lg font-semibold tracking-wide text-bg-primary mb-6">Science Updates</h3>
            <p className="text-bg-primary/70 text-sm mb-4 leading-relaxed">
              Subscribe to get notified about new clinical trials, ingredient sourcing journals, and product stacks.
            </p>
            {subscribed ? (
              <div className="bg-sage/20 border border-sage/40 rounded-xl p-4 text-sm text-center text-champagne flex items-center justify-center space-x-2">
                <svg className="w-4 h-4 text-champagne" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    className="w-full bg-white/10 text-white placeholder-white/40 border border-white/20 px-4 py-3 rounded-full text-sm focus:outline-none focus:border-champagne"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bg-champagne text-primary-green hover:bg-white font-semibold px-4 py-2 rounded-full text-xs transition-colors cursor-pointer"
                  >
                    Join
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

        <div className="gold-divider my-10 opacity-30"></div>

        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-bg-primary/50 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} Kenwell Nutraceuticals. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-champagne">Privacy Policy</a>
            <a href="#" className="hover:text-champagne">Terms of Service</a>
            <a href="#" className="hover:text-champagne">Sourcing Map</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

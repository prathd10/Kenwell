import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function PartnerWithUs({ setCurrentSection }) {
  const [form, setForm] = useState({
    storeName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.storeName.trim() || !form.contactName.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim() || !form.city.trim() || !form.state.trim() || !form.postalCode.trim()) {
      return setError('Please fill in all required fields.')
    }

    setSubmitting(true)
    setError('')

    const payload = {
      store_name: form.storeName.trim(),
      contact_name: form.contactName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postal_code: form.postalCode.trim(),
      message: form.message.trim() || null,
      status: 'New'
    }

    const { error: dbErr } = await supabase
      .from('partner_inquiries')
      .insert(payload)

    setSubmitting(false)

    if (dbErr) {
      setError(dbErr.message)
    } else {
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="bg-bg-primary min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-md border border-cream-dark/60 rounded-3xl p-8 shadow-xl text-center space-y-6 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center mx-auto shadow-inner border border-primary-green/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal">
              Application Submitted!
            </h2>
            <p className="text-charcoal/60 text-sm leading-relaxed font-body">
              Thank you for your interest in partnering with Kenwell. Your store details have been registered successfully.
            </p>
          </div>

          <div className="bg-bg-primary/50 rounded-2xl p-4 border border-cream-dark/40 text-xs text-left text-charcoal/70 leading-relaxed font-body">
            <span className="font-bold text-primary-green block mb-1">What happens next?</span>
            Our wholesale partnerships team will review your application profile and reach out to you via the provided email or phone number to discuss catalog distribution, pricing tiers, and next steps.
          </div>

          <button
            onClick={() => setCurrentSection('home')}
            className="w-full bg-primary-green hover:bg-sage text-white font-bold tracking-widest text-xs uppercase py-3 rounded-xl transition-all duration-300 shadow-md cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-bg-primary min-h-screen pb-16">
      {/* Visual Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-green to-[#1b2b19] text-white py-16 px-4 text-center">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#DDD8CA_1px,transparent_1px),linear-gradient(to_bottom,#DDD8CA_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-sage/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-champagne/10 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10 space-y-4">
          <span className="font-mono text-xs font-bold tracking-widest text-champagne uppercase bg-white/5 border border-white/10 px-4 py-1.5 rounded-full inline-block">
            Growth & Distribution
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
            Partner with Kenwell
          </h1>
          <p className="text-bg-primary/80 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-body">
            Become an authorized Kenwell wellness retail partner. Join our network of premium stores offering clean, clinical-grade formulations.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="glass-panel rounded-3xl shadow-xl p-6 md:p-10 bg-white/95">
          <h2 className="font-serif text-2xl font-bold text-charcoal mb-6 border-b border-cream-dark/45 pb-4">
            Retail Partnership Inquiry
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Store & Contact Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider">
                  Store / Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="storeName"
                  required
                  placeholder="e.g. Apex Health & Fit"
                  value={form.storeName}
                  onChange={handleChange}
                  className="w-full bg-bg-primary/30 border border-cream-dark/80 rounded-xl px-4 py-3 text-sm focus:border-sage focus:outline-none focus:bg-white transition-all font-body text-charcoal"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider">
                  Contact Person Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="contactName"
                  required
                  placeholder="e.g. Rohan Sharma"
                  value={form.contactName}
                  onChange={handleChange}
                  className="w-full bg-bg-primary/30 border border-cream-dark/80 rounded-xl px-4 py-3 text-sm focus:border-sage focus:outline-none focus:bg-white transition-all font-body text-charcoal"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider">
                  Business Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="e.g. partner@apexfit.com"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-bg-primary/30 border border-cream-dark/80 rounded-xl px-4 py-3 text-sm focus:border-sage focus:outline-none focus:bg-white transition-all font-body text-charcoal"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider">
                  Contact Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-bg-primary/30 border border-cream-dark/80 rounded-xl px-4 py-3 text-sm focus:border-sage focus:outline-none focus:bg-white transition-all font-body text-charcoal"
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider">
                Store Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                required
                placeholder="e.g. Shop 4, Galleria Mall, Sector 15"
                value={form.address}
                onChange={handleChange}
                className="w-full bg-bg-primary/30 border border-cream-dark/80 rounded-xl px-4 py-3 text-sm focus:border-sage focus:outline-none focus:bg-white transition-all font-body text-charcoal"
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="Gurugram"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full bg-bg-primary/30 border border-cream-dark/80 rounded-xl px-4 py-3 text-sm focus:border-sage focus:outline-none focus:bg-white transition-all font-body text-charcoal"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider">
                  State / Region <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  placeholder="Haryana"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full bg-bg-primary/30 border border-cream-dark/80 rounded-xl px-4 py-3 text-sm focus:border-sage focus:outline-none focus:bg-white transition-all font-body text-charcoal"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider">
                  Pincode / Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  placeholder="122002"
                  value={form.postalCode}
                  onChange={handleChange}
                  className="w-full bg-bg-primary/30 border border-cream-dark/80 rounded-xl px-4 py-3 text-sm focus:border-sage focus:outline-none focus:bg-white transition-all font-body text-charcoal"
                />
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-charcoal/70 uppercase tracking-wider">
                Comments / Business Description
              </label>
              <textarea
                name="message"
                rows={4}
                placeholder="Tell us more about your business (e.g. gym, pharmacy, dietary store, monthly sales footprint)..."
                value={form.message}
                onChange={handleChange}
                className="w-full bg-bg-primary/30 border border-cream-dark/80 rounded-xl px-4 py-3 text-sm focus:border-sage focus:outline-none focus:bg-white transition-all font-body text-charcoal resize-none"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-xs border border-red-200 rounded-xl p-4 font-body">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary-green hover:bg-sage text-white font-bold tracking-widest text-xs uppercase py-3.5 rounded-xl transition-all duration-300 shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting Application...' : 'Submit Partnership Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

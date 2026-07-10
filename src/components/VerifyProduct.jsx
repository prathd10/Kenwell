import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function VerifyProduct() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState('form') // 'form' | 'result'
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const triggerVerify = async (codeVal) => {
    setLoading(true)
    setError('')
    setResult(null)

    const { data, error: rpcError } = await supabase.rpc('verify_product_code', {
      p_code: codeVal.trim(),
    })

    if (rpcError) {
      setError('Something went wrong while checking this code. Please try again.')
    } else {
      setResult(data)
    }

    setLoading(false)
    setStage('result')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (code.trim()) triggerVerify(code)
  }

  const handleCheckAnother = () => {
    setCode('')
    setResult(null)
    setError('')
    setStage('form')
  }

  // A scanned QR pre-fills the code so the user can see and confirm it, but
  // verification only runs once they actively click "Verify Product" —
  // it doesn't auto-submit on landing.
  useEffect(() => {
    const urlCode = new URLSearchParams(window.location.search).get('code')
    if (urlCode) setCode(urlCode)
  }, [])

  const formattedDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : ''

  const canRetry = error || result?.status === 'invalid' || result?.status === 'already_verified'

  return (
    <div className="py-16 px-4 max-w-3xl mx-auto space-y-10 min-h-[60vh] text-left">
      {/* Header */}
      <div className="text-center max-w-md mx-auto space-y-3">
        <span className="text-sage font-mono uppercase tracking-wider text-xs font-semibold">
          Authenticity Check
        </span>
        <h1 className="text-4xl font-serif text-primary-green">
          Verify Your Product
        </h1>
        <div className="gold-divider max-w-xs mx-auto"></div>
        {stage === 'form' && (
          <p className="text-charcoal/70 text-sm leading-relaxed">
            Enter the unique code printed on your product's authenticity sticker to confirm it's genuine.
          </p>
        )}
      </div>

      {/* VERIFY FORM — hidden once a result is showing */}
      {stage === 'form' && (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/60 shadow-lg bg-white/40">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-charcoal/50 mb-1.5">
                Authenticity Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. 7K4M-9XQP-R2"
                className="w-full bg-white border border-cream-dark/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-sage transition-colors placeholder-charcoal/30 font-mono uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary-green hover:bg-sage text-white rounded-full text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-lg text-center flex justify-center items-center gap-2"
            >
              {loading ? 'Checking...' : 'Verify Product'}
            </button>
          </form>
        </div>
      )}

      {/* RESULT — the only thing shown once verification has run */}
      {stage === 'result' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/25 text-red-800 text-sm p-4 rounded-2xl max-w-xl mx-auto text-center font-mono">
              {error}
            </div>
          )}

          {result?.status === 'invalid' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-md bg-amber-500/5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <span className="font-bold text-lg text-amber-700">?</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-amber-800">Code Not Recognized</h3>
                <p className="text-sm text-amber-800/80 mt-1 leading-relaxed">
                  We couldn't find this code. Please double-check you've entered it correctly, or
                  contact us if you believe this is an error.
                </p>
              </div>
            </div>
          )}

          {result?.status === 'first_verification' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-sage/40 shadow-md bg-sage/5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
                <span className="font-bold text-lg text-sage">✓</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-primary-green">Genuine Kenwell Product</h3>
                {result.product_name && (
                  <p className="text-sm text-charcoal/80 mt-1 font-semibold">{result.product_name}</p>
                )}
                <p className="text-sm text-charcoal/70 mt-1 leading-relaxed">
                  Verified today, {formattedDate(result.verified_at)}. This is the first time this
                  code has been checked.
                </p>
              </div>
            </div>
          )}

          {result?.status === 'already_verified' && (
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-red-500/25 shadow-md bg-red-500/5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
                <span className="font-bold text-lg text-red-700">!</span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-red-800">Already Verified</h3>
                {result.product_name && (
                  <p className="text-sm text-charcoal/80 mt-1 font-semibold">{result.product_name}</p>
                )}
                <p className="text-sm text-charcoal/70 mt-1 leading-relaxed">
                  This code was first verified on {formattedDate(result.verified_at)}. If you just
                  purchased this product and are seeing this message, please{' '}
                  <a href="mailto:help@kenwell.in" className="text-primary-green underline">
                    contact us
                  </a>{' '}
                  — it may indicate the product wasn't sourced from an authorized seller.
                </p>
              </div>
            </div>
          )}

          {canRetry && (
            <div className="text-center">
              <button
                onClick={handleCheckAnother}
                className="px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider text-primary-green border border-primary-green/30 hover:bg-primary-green hover:text-white transition-all cursor-pointer"
              >
                Check Another Code
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

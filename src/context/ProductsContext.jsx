import { createContext, useContext, useEffect, useState } from 'react'
import { fetchProducts, fetchStacks } from '../lib/products'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [state, setState] = useState({ products: [], stacks: [], loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const products = await fetchProducts()
        const stacks = await fetchStacks(products)
        if (!cancelled) setState({ products, stacks, loading: false, error: null })
      } catch (error) {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error }))
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return <ProductsContext.Provider value={state}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}

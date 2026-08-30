import React, { Suspense, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import App from './App.jsx'
import ProductPage from './components/ProductPage.jsx'
import CheckoutPage from './components/CheckoutPage.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'

const AdminApp = React.lazy(() => import('./admin/AdminApp.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    document.body.style.overflow = ''
    document.body.style.overflowY = 'auto'
    document.documentElement.style.overflow = ''
    document.documentElement.style.overflowY = 'auto'
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
              <AdminApp />
            </Suspense>
          }
        />
        <Route
          path="/*"
          element={
            <ProductsProvider>
              <CartProvider>
                <Routes>
                  <Route path="/products/:slug" element={<ProductPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="*" element={<App />} />
                </Routes>
              </CartProvider>
            </ProductsProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)

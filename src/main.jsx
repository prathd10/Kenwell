import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import ProductPage from './components/ProductPage.jsx'
import { ProductsProvider } from './context/ProductsContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import './index.css'

const AdminApp = React.lazy(() => import('./admin/AdminApp.jsx'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
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

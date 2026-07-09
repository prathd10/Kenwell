import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])
  const [wishlistItems, setWishlistItems] = useState([])

  const addToCart = (product) => {
    const existing = cartItems.find(item => item.id === product.id)
    if (existing) {
      setCartItems(cartItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId))
  }

  const updateCartQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId)
    } else {
      setCartItems(cartItems.map(item => item.id === productId ? { ...item, quantity: qty } : item))
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const toggleWishlist = (product) => {
    if (wishlistItems.some(item => item.id === product.id)) {
      setWishlistItems(wishlistItems.filter(item => item.id !== product.id))
    } else {
      setWishlistItems([...wishlistItems, product])
    }
  }

  const value = {
    cartItems,
    wishlistItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

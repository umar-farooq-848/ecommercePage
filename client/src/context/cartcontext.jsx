// ========================================
// CLIENT/SRC/CONTEXT/CARTCONTEXT.JSX
// ========================================
import React, { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../utils/api'
import { useAuth } from './authcontext.jsx'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], subtotal: 0 })
  const [loading, setLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    }
  }, [isAuthenticated])

  const fetchCart = async () => {
    setLoading(true)
    try {
      const response = await api.getCart()
      setCart(response.data)
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCart({ items: [], subtotal: 0 })
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (itemId, quantity = 1) => {
    try {
      const response = await api.addToCart({ itemId, quantity })
      setCart(response.data.cart)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to add to cart' 
      }
    }
  }

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await api.updateCartItem({ itemId, quantity })
      setCart(response.data.cart)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update cart' 
      }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      await api.removeFromCart(itemId)
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item.itemId !== itemId)
      }))
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to remove from cart' 
      }
    }
  }

  const clearCart = () => {
    setCart({ items: [], subtotal: 0 })
  }

  const getCartCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cart,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount,
    fetchCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
// ========================================
// CLIENT/SRC/PAGES/CART.JSX
// ========================================
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/button.jsx'
import { useCart } from '../context/cartcontext.jsx'
import { useAuth } from '../context/authcontext.jsx'

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, loading } = useCart()
  const { isAuthenticated } = useAuth()
  const [updatingItems, setUpdatingItems] = useState({})

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity === 0) {
      await removeFromCart(itemId)
      return
    }

    setUpdatingItems(prev => ({ ...prev, [itemId]: true }))
    await updateCartItem(itemId, newQuantity)
    setUpdatingItems(prev => ({ ...prev, [itemId]: false }))
  }

  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-6">Add some awesome products to get started!</p>
        <Link to="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.itemId}
              className="bg-[var(--card-bg)] rounded-2xl p-6 border border-electric-indigo/10"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={item.image || '/placeholder-product.jpg'}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--fg)]">{item.name}</h3>
                  <p className="text-electric-indigo font-bold">${item.price}</p>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(item.itemId, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                      disabled={updatingItems[item.itemId]}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x">
                      {updatingItems[item.itemId] ? '...' : item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.itemId, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100"
                      disabled={updatingItems[item.itemId]}
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    onClick={() => handleRemoveItem(item.itemId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-electric-indigo/10 sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${cart.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(cart.subtotal * 0.08)?.toFixed(2)}</span>
              </div>
              <hr className="border-gray-300" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${(cart.subtotal * 1.08)?.toFixed(2)}</span>
              </div>
            </div>

            {isAuthenticated ? (
              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>
            ) : (
              <div className="space-y-3">
                <Link to="/auth/login" className="block">
                  <Button className="w-full" size="lg">
                    Login to Checkout
                  </Button>
                </Link>
                <p className="text-sm text-center text-gray-600">
                  Don't have an account?{' '}
                  <Link to="/auth/signup" className="text-electric-indigo hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            )}

            <Link to="/" className="block mt-4">
              <Button variant="outline" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
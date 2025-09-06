
// ========================================
// SERVER/SRC/ROUTES/CART.JS - Cart Routes
// ========================================
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const router = express.Router()

const { supabase } = require('../config/database')
const { optionalAuth, auth } = require('../middleware/auth')
const { cartItemValidation } = require('../middleware/validation')

// Helper function to get or create cart
const getOrCreateCart = async (userId, guestId, req, res) => {
  let cartQuery = supabase
    .from('carts')
    .select('*')

  if (userId) {
    cartQuery = cartQuery.eq('user_id', userId)
  } else {
    if (!guestId) {
      guestId = uuidv4()
      res.cookie('guest_id', guestId, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      })
    }
    cartQuery = cartQuery.eq('guest_id', guestId)
  }

  const { data: existingCart } = await cartQuery.single()

  if (existingCart) {
    return { cart: existingCart, guestId }
  }

  // Create new cart
  const { data: newCart, error } = await supabase
    .from('carts')
    .insert({
      id: uuidv4(),
      user_id: userId,
      guest_id: userId ? null : guestId,
      items: []
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return { cart: newCart, guestId }
}

// Helper function to calculate cart totals
const calculateCartTotals = async (cartItems) => {
  if (!cartItems || cartItems.length === 0) {
    return { items: [], subtotal: 0 }
  }

  const itemIds = cartItems.map(item => item.itemId)
  const { data: products } = await supabase
    .from('items')
    .select('id, title, price, images')
    .in('id', itemIds)

  const enrichedItems = cartItems.map(cartItem => {
    const product = products?.find(p => p.id === cartItem.itemId)
    return {
      ...cartItem,
      name: product?.title || 'Unknown Product',
      price: product?.price || 0,
      image: product?.images?.[0] || null
    }
  })

  const subtotal = enrichedItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  )

  return {
    items: enrichedItems,
    subtotal: parseFloat(subtotal.toFixed(2))
  }
}

// GET /api/cart - Get current cart
router.get('/', optionalAuth, async (req, res) => {
  try {
    const userId = req.user?.id
    const guestId = req.cookies.guest_id

    if (!userId && !guestId) {
      return res.json({ items: [], subtotal: 0 })
    }

    const { cart } = await getOrCreateCart(userId, guestId, req, res)
    const cartData = await calculateCartTotals(cart.items)

    res.json({
      cartId: cart.id,
      userId: cart.user_id,
      ...cartData
    })
  } catch (error) {
    console.error('Get cart error:', error)
    res.status(500).json({ error: 'Failed to get cart' })
  }
})

// POST /api/cart - Add item to cart
router.post('/', optionalAuth, cartItemValidation, async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body
    const userId = req.user?.id
    const guestId = req.cookies.guest_id

    // Verify item exists
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('id, title, price, stock')
      .eq('id', itemId)
      .single()

    if (itemError || !item) {
      return res.status(404).json({ error: 'Item not found' })
    }

    if (item.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' })
    }

    const { cart, guestId: finalGuestId } = await getOrCreateCart(userId, guestId, req, res)

    // Update cart items
    const existingItems = cart.items || []
    const existingItemIndex = existingItems.findIndex(i => i.itemId === itemId)

    let updatedItems
    if (existingItemIndex >= 0) {
      // Update existing item
      updatedItems = [...existingItems]
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity
      
      if (newQuantity > item.stock) {
        return res.status(400).json({ error: 'Insufficient stock' })
      }
      
      updatedItems[existingItemIndex].quantity = newQuantity
    } else {
      // Add new item
      updatedItems = [
        ...existingItems,
        {
          itemId,
          quantity,
          addedAt: new Date().toISOString()
        }
      ]
    }

    // Update cart in database
    const { error: updateError } = await supabase
      .from('carts')
      .update({ 
        items: updatedItems,
        updated_at: new Date().toISOString()
      })
      .eq('id', cart.id)

    if (updateError) {
      throw updateError
    }

    const cartData = await calculateCartTotals(updatedItems)

    res.json({
      success: true,
      cart: {
        cartId: cart.id,
        userId: cart.user_id,
        ...cartData
      }
    })
  } catch (error) {
    console.error('Add to cart error:', error)
    res.status(500).json({ error: 'Failed to add item to cart' })
  }
})

// PUT /api/cart - Update cart item quantity
router.put('/', optionalAuth, cartItemValidation, async (req, res) => {
  try {
    const { itemId, quantity } = req.body
    const userId = req.user?.id
    const guestId = req.cookies.guest_id

    if (quantity === 0) {
      // Use DELETE endpoint for removing items
      return res.status(400).json({ error: 'Use DELETE endpoint to remove items' })
    }

    const { cart } = await getOrCreateCart(userId, guestId, req, res)
    
    const existingItems = cart.items || []
    const itemIndex = existingItems.findIndex(i => i.itemId === itemId)

    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not in cart' })
    }

    // Verify stock
    const { data: item } = await supabase
      .from('items')
      .select('stock')
      .eq('id', itemId)
      .single()

    if (item && quantity > item.stock) {
      return res.status(400).json({ error: 'Insufficient stock' })
    }

    // Update quantity
    const updatedItems = [...existingItems]
    updatedItems[itemIndex].quantity = quantity

    const { error } = await supabase
      .from('carts')
      .update({ 
        items: updatedItems,
        updated_at: new Date().toISOString()
      })
      .eq('id', cart.id)

    if (error) {
      throw error
    }

    const cartData = await calculateCartTotals(updatedItems)

    res.json({
      success: true,
      cart: {
        cartId: cart.id,
        userId: cart.user_id,
        ...cartData
      }
    })
  } catch (error) {
    console.error('Update cart error:', error)
    res.status(500).json({ error: 'Failed to update cart' })
  }
})

// DELETE /api/cart/:itemId - Remove item from cart
router.delete('/:itemId', optionalAuth, async (req, res) => {
  try {
    const { itemId } = req.params
    const userId = req.user?.id
    const guestId = req.cookies.guest_id

    const { cart } = await getOrCreateCart(userId, guestId, req, res)
    
    const existingItems = cart.items || []
    const updatedItems = existingItems.filter(item => item.itemId !== itemId)

    const { error } = await supabase
      .from('carts')
      .update({ 
        items: updatedItems,
        updated_at: new Date().toISOString()
      })
      .eq('id', cart.id)

    if (error) {
      throw error
    }

    res.json({ success: true })
  } catch (error) {
    console.error('Remove from cart error:', error)
    res.status(500).json({ error: 'Failed to remove item from cart' })
  }
})

// POST /api/cart/merge - Merge guest cart with user cart on login
router.post('/merge', auth, async (req, res) => {
  try {
    const userId = req.user.id
    const guestId = req.cookies.guest_id

    if (!guestId) {
      return res.json({ success: true, message: 'No guest cart to merge' })
    }

    // Get guest cart
    const { data: guestCart } = await supabase
      .from('carts')
      .select('*')
      .eq('guest_id', guestId)
      .single()

    if (!guestCart || !guestCart.items?.length) {
      return res.json({ success: true, message: 'No guest cart items to merge' })
    }

    // Get or create user cart
    const { cart: userCart } = await getOrCreateCart(userId, null, req, res)

    // Merge items
    const existingUserItems = userCart.items || []
    const guestItems = guestCart.items || []

    const mergedItems = [...existingUserItems]

    guestItems.forEach(guestItem => {
      const existingIndex = mergedItems.findIndex(item => item.itemId === guestItem.itemId)
      
      if (existingIndex >= 0) {
        // Add quantities together
        mergedItems[existingIndex].quantity += guestItem.quantity
      } else {
        // Add new item
        mergedItems.push(guestItem)
      }
    })

    // Update user cart
    await supabase
      .from('carts')
      .update({ 
        items: mergedItems,
        updated_at: new Date().toISOString()
      })
      .eq('id', userCart.id)

    // Delete guest cart
    await supabase
      .from('carts')
      .delete()
      .eq('id', guestCart.id)

    // Clear guest ID cookie
    res.clearCookie('guest_id')

    res.json({ success: true, message: 'Cart merged successfully' })
  } catch (error) {
    console.error('Cart merge error:', error)
    res.status(500).json({ error: 'Failed to merge cart' })
  }
})

module.exports = router
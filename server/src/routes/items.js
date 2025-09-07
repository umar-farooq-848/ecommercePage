
// ========================================
// SERVER/SRC/ROUTES/ITEMS.JS - Items Routes
// ========================================
const express = require('express')
const router = express.Router()

const { supabase } = require('../config/database')
const { itemQueryValidation } = require('../middleware/validation')
const { sampleProducts } = require('../../scripts/seed')

// GET /api/items - List items with filters
router.get('/', itemQueryValidation, async (req, res) => {
  try {
    if (process.env.MOCK_DATA === 'true') {
      const page = parseInt(req.query.page || 1)
      const limit = parseInt(req.query.limit || 24)
      const offset = (page - 1) * limit

      const total = sampleProducts.length
      const items = sampleProducts.slice(offset, offset + limit)

      return res.json({
        items,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(total / limit))
        }
      })
    }
    const {
      q = '',
      category = '',
      minPrice,
      maxPrice,
      sort = 'newest',
      page = 1,
      limit = 24
    } = req.query

    let query = supabase
      .from('items')
      .select('*', { count: 'exact' })

    // Search filter
    if (q) {
      query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
    }

    // Category filter
    if (category) {
      const categories = category.split(',').filter(c => c.trim())
      if (categories.length > 0) {
        query = query.in('category', categories)
      }
    }

    // Price filters
    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice))
    }
    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice))
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'popularity':
        query = query.order('rating', { ascending: false })
        break
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: items, error, count } = await query

    if (error) {
      throw error
    }

    res.json({
      items: items || [],
      meta: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    })
  } catch (error) {
    console.error('Items list error:', error)
    res.status(500).json({ error: 'Failed to fetch items' })
  }
})

// GET /api/items/:id - Get single item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data: item, error } = await supabase
      .from('items')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !item) {
      return res.status(404).json({ error: 'Item not found' })
    }

    res.json(item)
  } catch (error) {
    console.error('Item fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch item' })
  }
})

module.exports = router
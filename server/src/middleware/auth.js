
// ========================================
// SERVER/SRC/MIDDLEWARE/AUTH.JS - Authentication Middleware
// ========================================
const jwt = require('jsonwebtoken')
const { supabase } = require('../config/database')

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid token format' })
    }

    const token = authHeader.split(' ')[1]
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      // Verify user still exists
      const { data: user, error } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('id', decoded.userId)
        .single()

      if (error || !user) {
        return res.status(401).json({ error: 'User not found' })
      }

      req.user = user
      next()
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' })
      }
      return res.status(401).json({ error: 'Invalid token' })
    }
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ error: 'Authentication error' })
  }
}

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next()
    }

    const token = authHeader.split(' ')[1]
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      const { data: user } = await supabase
        .from('users')
        .select('id, email, name')
        .eq('id', decoded.userId)
        .single()

      if (user) {
        req.user = user
      }
    } catch (jwtError) {
      // Ignore JWT errors for optional auth
    }
    
    next()
  } catch (error) {
    next()
  }
}

module.exports = { auth, optionalAuth }
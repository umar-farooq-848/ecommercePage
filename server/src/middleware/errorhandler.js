// ========================================
// SERVER/SRC/MIDDLEWARE/ERRORHANDLER.JS - Error Handling
// ========================================
const errorHandler = (err, req, res, next) => {
    console.error('Error:', {
      message: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      timestamp: new Date().toISOString()
    })
  
    // Supabase errors
    if (err.code && err.code.startsWith('23')) {
      if (err.code === '23505') {
        return res.status(409).json({ error: 'Resource already exists' })
      }
      return res.status(400).json({ error: 'Database constraint violation' })
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }
  
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
  
    // Default error response
    const statusCode = err.statusCode || 500
    const message = process.env.NODE_ENV === 'production' && statusCode === 500 
      ? 'Internal server error' 
      : err.message
  
    res.status(statusCode).json({ 
      error: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
  }
  
  module.exports = { errorHandler }
  
  
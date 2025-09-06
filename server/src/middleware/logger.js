// ========================================
  // SERVER/SRC/MIDDLEWARE/LOGGER.JS - Request Logging
  // ========================================
  const requestLogger = (req, res, next) => {
    const start = Date.now()
    
    res.on('finish', () => {
      const duration = Date.now() - start
      const logData = {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
      }
      
      // Log to console (replace with proper logging service in production)
      console.log(`${logData.method} ${logData.url} ${logData.status} ${logData.duration}`)
    })
    
    next()
  }
  
  module.exports = { requestLogger }
  
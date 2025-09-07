// ========================================
// SERVER/SRC/MIDDLEWARE/VALIDATION.JS - Input Validation
// ========================================
const { body, query, param, validationResult } = require('express-validator')

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    })
  }
  next()
}

// Auth validation rules
const signupValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
]

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email format'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
]

// Item validation rules
const itemQueryValidation = [
  query('page')
    .optional({ checkFalsy: true, nullable: true })
    .isInt({ min: 1 }).withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional({ checkFalsy: true, nullable: true })
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100')
    .toInt(),
  query('minPrice')
    .optional({ checkFalsy: true, nullable: true })
    .isFloat({ min: 0 }).withMessage('Min price must be non-negative')
    .toFloat(),
  query('maxPrice')
    .optional({ checkFalsy: true, nullable: true })
    .isFloat({ min: 0 }).withMessage('Max price must be non-negative')
    .toFloat(),
  query('sort')
    .optional({ checkFalsy: true, nullable: true })
    .isIn(['newest', 'price_asc', 'price_desc', 'popularity']).withMessage('Invalid sort option'),
  handleValidationErrors
]

// Cart validation rules
const cartItemValidation = [
  body('itemId').notEmpty().withMessage('Item ID is required'),
  body('quantity').isInt({ min: 1, max: 99 }).withMessage('Quantity must be 1-99'),
  handleValidationErrors
]

module.exports = {
  signupValidation,
  loginValidation,
  itemQueryValidation,
  cartItemValidation,
  handleValidationErrors
}
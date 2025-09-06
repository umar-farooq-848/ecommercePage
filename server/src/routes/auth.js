// ========================================
// SERVER/SRC/ROUTES/AUTH.JS - Authentication Routes
// ========================================
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const router = express.Router()

const { supabase } = require('../config/database')
const { auth } = require('../middleware/auth')
const { signupValidation, loginValidation } = require('../middleware/validation')

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
  
  return { accessToken, refreshToken }
}

// POST /api/auth/signup
router.post('/signup', signupValidation, async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' })
    }

    // Hash password
    const saltRounds = 12
    const passwordHash = await bcrypt.hash(password, saltRounds)

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        id: uuidv4(),
        name,
        email,
        password_hash: passwordHash,
        is_verified: false
      })
      .select('id, name, email, created_at')
      .single()

    if (error) {
      throw error
    }

    res.status(201).json({
      message: 'User created successfully',
      user
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// POST /api/auth/login
router.post('/login', loginValidation, async (req, res) => {
  try {
    const { email, password } = req.body

    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, password_hash, created_at')
      .eq('email', email)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash)
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id)

    // Store refresh token (hash it first)
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10)
    await supabase
      .from('refresh_tokens')
      .insert({
        id: uuidv4(),
        user_id: user.id,
        token_hash: refreshTokenHash,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })

    // Set refresh token as HTTPOnly cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    // Remove password hash from response
    const { password_hash, ...userResponse } = user

    res.json({
      accessToken,
      user: userResponse
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token not provided' })
    }

    // Verify refresh token
    let decoded
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    // Check if refresh token exists in database
    const { data: storedTokens } = await supabase
      .from('refresh_tokens')
      .select('token_hash, expires_at')
      .eq('user_id', decoded.userId)
      .eq('revoked', false)

    if (!storedTokens || storedTokens.length === 0) {
      return res.status(401).json({ error: 'Refresh token not found' })
    }

    // Verify token hash
    let validToken = false
    for (const token of storedTokens) {
      if (await bcrypt.compare(refreshToken, token.token_hash)) {
        validToken = true
        break
      }
    }

    if (!validToken) {
      return res.status(401).json({ error: 'Invalid refresh token' })
    }

    // Generate new access token
    const { accessToken } = generateTokens(decoded.userId)

    res.json({ accessToken })
  } catch (error) {
    console.error('Refresh token error:', error)
    res.status(500).json({ error: 'Token refresh failed' })
  }
})

// POST /api/auth/logout
router.post('/logout', auth, async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken

    if (refreshToken) {
      // Revoke refresh tokens
      await supabase
        .from('refresh_tokens')
        .update({ revoked: true })
        .eq('user_id', req.user.id)
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken')

    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({ error: 'Logout failed' })
  }
})

// GET /api/auth/profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({ user: req.user })
  } catch (error) {
    console.error('Profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

module.exports = router
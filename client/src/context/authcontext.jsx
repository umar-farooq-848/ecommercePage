// ========================================
// CLIENT/SRC/CONTEXT/AUTHCONTEXT.JSX
// ========================================
import React, { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../utils/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      setAccessToken(token)
      // Verify token and get user info
      api.getProfile()
        .then(response => {
          setUser(response.data.user)
        })
        .catch(() => {
          localStorage.removeItem('accessToken')
          setAccessToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.login({ email, password })
      const { accessToken: token, user: userData } = response.data
      
      setAccessToken(token)
      setUser(userData)
      localStorage.setItem('accessToken', token)
      
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }

  const signup = async (userData) => {
    try {
      const response = await api.signup(userData)
      return { success: true, data: response.data }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Signup failed' 
      }
    }
  }

  const logout = async () => {
    try {
      await api.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setAccessToken(null)
      setUser(null)
      localStorage.removeItem('accessToken')
    }
  }

  const value = {
    user,
    accessToken,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
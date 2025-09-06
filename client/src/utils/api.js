// ========================================
// CLIENT/SRC/UTILS/API.JS - API Functions
// ========================================
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshResponse = await axios.post(
          `${API_BASE}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        
        const { accessToken } = refreshResponse.data
        localStorage.setItem('accessToken', accessToken)
        
        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        window.location.href = '/auth/login'
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const signup = (userData) => api.post('/auth/signup', userData)
export const login = (credentials) => api.post('/auth/login', credentials)
export const logout = () => api.post('/auth/logout')
export const refreshToken = () => api.post('/auth/refresh')
export const getProfile = () => api.get('/auth/profile')

// Products API
export const getItems = (params = {}) => api.get('/items', { params })
export const getItem = (id) => api.get(`/items/${id}`)

// Cart API
export const getCart = () => api.get('/cart')
export const addToCart = (data) => api.post('/cart', data)
export const updateCartItem = (data) => api.put('/cart', data)
export const removeFromCart = (itemId) => api.delete(`/cart/${itemId}`)
export const mergeCart = () => api.post('/cart/merge')

export default api
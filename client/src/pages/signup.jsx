// ========================================
// CLIENT/SRC/PAGES/SIGNUP.JSX
// ========================================
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'

const Signup = () => {
  const navigate = useNavigate()
  const { signup } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })
    
    if (result.success) {
      navigate('/auth/login', { 
        state: { message: 'Account created successfully! Please log in.' }
      })
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md" glow>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient-neon mb-2">Join GenShop</h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--fg)] mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-electric-indigo/20 focus:border-electric-indigo focus:outline-none text-[var(--fg)]"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--fg)] mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-electric-indigo/20 focus:border-electric-indigo focus:outline-none text-[var(--fg)]"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--fg)] mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-electric-indigo/20 focus:border-electric-indigo focus:outline-none text-[var(--fg)]"
              placeholder="Create a password"
              required
              minLength="6"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--fg)] mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-electric-indigo/20 focus:border-electric-indigo focus:outline-none text-[var(--fg)]"
              placeholder="Confirm your password"
              required
              minLength="6"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-electric-indigo hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Signup
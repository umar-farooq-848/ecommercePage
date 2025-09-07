// ========================================
// CLIENT/SRC/COMPONENTS/NAVBAR.JSX
// ========================================
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authcontext.jsx'
import { useCart } from '../context/cartcontext.jsx'
import { useTheme } from '../context/themecontext.jsx'
import Button from './button.jsx'
import Badge from './badge.jsx'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { getCartCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleLogout = async () => {
    await logout()
    setShowUserMenu(false)
    navigate('/')
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--card-bg)] backdrop-blur-md border-b border-glass">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-gradient-neon">GenShop</span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-glass border border-electric-indigo/20 focus:border-electric-indigo focus:outline-none text-[var(--fg)]"
              />
              <Button
                type="submit"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
              >
                🔍
              </Button>
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="p-2"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" className="p-2">
                🛒
              </Button>
              {getCartCount() > 0 && (
                <Badge className="absolute -top-2 -right-2">
                  {getCartCount()}
                </Badge>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-2"
                >
                  👤
                </Button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-[var(--card-bg)] rounded-xl shadow-glow-indigo border border-electric-indigo/20 py-2">
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm hover:bg-electric-indigo/10"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Account
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-electric-indigo/10"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/auth/signup">
                  <Button variant="primary">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
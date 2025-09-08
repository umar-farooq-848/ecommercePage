// ========================================
// CLIENT/SRC/COMPONENTS/NAVBAR.JSX
// ========================================
import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/authcontext.jsx'
import { useCart } from '../context/cartcontext.jsx'
import { useTheme } from '../context/themecontext.jsx'
import Button from './button.jsx'
import Badge from './badge.jsx'

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const { getCartCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setShowUserMenu(false)
  }, [location.pathname])

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

  const renderAuthButtons = (isMobile) => (
    isAuthenticated ? (
      <div className={isMobile ? "relative mt-4" : "relative"}>
        <Button
          variant="ghost"
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="p-2 flex items-center"
        >
          <span className="mr-2">👤</span>
          {isMobile && 'Account'}
        </Button>
        {showUserMenu && (
          <div className={`${isMobile ? 'relative' : 'absolute'} right-0 mt-2 w-48 bg-[var(--card-bg)] rounded-xl shadow-glow-indigo border border-electric-indigo/20 py-2`}>
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
      <div className={`flex ${isMobile ? 'flex-col space-y-2' : 'space-x-2'}`}>
        <Link to="/auth/login">
          <Button variant={isMobile ? 'outline' : 'ghost'} className="w-full">Login</Button>
        </Link>
        <Link to="/auth/signup">
          <Button variant="primary" className="w-full">Sign Up</Button>
        </Link>
      </div>
    )
  )

  return (
    <nav className="fixed top-0 w-full z-50 bg-[var(--card-bg)] backdrop-blur-md border-b border-glass">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            <span className="text-gradient-neon">BuyBuddy</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="flex-1 max-w-sm">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
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

            <Button
              variant="ghost"
              onClick={toggleTheme}
              className="p-2"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>

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

            {renderAuthButtons(false)}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-2xl"
              aria-label="Open menu"
            >
              {isMobileMenuOpen ? '✕' : '☰'}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="mb-4">
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

            <div className="flex flex-col space-y-4">
              <Link to="/cart" className="relative flex items-center p-2 hover:bg-electric-indigo/10 rounded-lg">
                <span className="mr-2">🛒</span>
                Cart
                {getCartCount() > 0 && (
                  <Badge className="ml-auto">{getCartCount()}</Badge>
                )}
              </Link>

              <button 
                onClick={toggleTheme} 
                className="flex items-center p-2 hover:bg-electric-indigo/10 rounded-lg"
                aria-label="Toggle theme"
              >
                <span className="mr-2">{theme === 'light' ? '🌙' : '☀️'}</span>
                Toggle Theme
              </button>

              {renderAuthButtons(true)}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
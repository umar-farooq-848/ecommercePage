// ========================================
// CLIENT/SRC/APP.JSX - Main App Component
// ========================================
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Toast from './components/Toast'
import Landing from './pages/Landing'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import NotFound from './pages/NotFound'
import { useTheme } from './context/ThemeContext'

function App() {
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen ${theme}`} data-theme={theme}>
      <div className="bg-[var(--bg)] text-[var(--fg)] transition-colors duration-300">
        <Navbar />
        <main className="min-h-screen pt-16">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/signup" element={<Signup />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toast />
      </div>
    </div>
  )
}

export default App
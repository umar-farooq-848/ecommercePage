// ========================================
// CLIENT/SRC/APP.JSX - Main App Component
// ========================================
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar.jsx'
import Footer from './components/footer.jsx'
import Toast from './components/toast.jsx'
import Landing from './pages/landing.jsx'
import ProductDetail from './pages/productdetail.jsx'
import Cart from './pages/cart.jsx'
import Login from './pages/login.jsx'
import Signup from './pages/signup.jsx'
import Account from './pages/account.jsx'
import NotFound from './pages/notfound.jsx'
import { useTheme } from './context/themecontext.jsx'

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
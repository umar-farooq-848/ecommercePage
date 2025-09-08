// ========================================
// CLIENT/SRC/MAIN.JSX - Application Entry Point
// ========================================
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app.jsx'
import './styles/global.css'
import { AuthProvider } from './context/authcontext.jsx'
import { CartProvider } from './context/cartcontext.jsx'
import { ThemeProvider } from './context/themecontext.jsx'
import ScrollToTop from './components/scrolltotop.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <ScrollToTop />
            <App />
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
)
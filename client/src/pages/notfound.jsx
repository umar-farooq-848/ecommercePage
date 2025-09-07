// ========================================
// CLIENT/SRC/PAGES/NOTFOUND.JSX
// ========================================
import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/button.jsx'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-gradient-neon mb-4">404</div>
        <h1 className="text-3xl font-bold text-[var(--fg)] mb-4">Page Not Found</h1>
        <p className="text-gray-600 mb-8 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
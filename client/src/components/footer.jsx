// CLIENT/SRC/COMPONENTS/FOOTER.JSX
// ========================================
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[var(--card-bg)] border-t border-electric-indigo/10 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-gradient-neon mb-4">GenShop</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Discover amazing products with our curated collection. 
              Modern shopping experience for the next generation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[var(--fg)] mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block text-gray-600 hover:text-electric-indigo">
                Home
              </Link>
              <Link to="/cart" className="block text-gray-600 hover:text-electric-indigo">
                Cart
              </Link>
              <Link to="/account" className="block text-gray-600 hover:text-electric-indigo">
                Account
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-[var(--fg)] mb-4">Customer Service</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="block text-gray-600 hover:text-electric-indigo">
                Contact Us
              </a>
              <a href="#" className="block text-gray-600 hover:text-electric-indigo">
                FAQ
              </a>
              <a href="#" className="block text-gray-600 hover:text-electric-indigo">
                Shipping Info
              </a>
              <a href="#" className="block text-gray-600 hover:text-electric-indigo">
                Returns
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-[var(--fg)] mb-4">Stay Updated</h4>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe for exclusive deals and updates
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-l-lg bg-[var(--bg)] border border-gray-300 text-[var(--fg)]"
              />
              <button className="px-4 py-2 bg-electric-indigo text-white rounded-r-lg hover:bg-electric-indigo/90">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 GenShop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
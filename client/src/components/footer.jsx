// CLIENT/SRC/COMPONENTS/FOOTER.JSX
// ========================================
import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-[var(--card-bg)] border-t border-electric-indigo/10 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2 lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-gradient-neon">BuyBuddy</span>
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              The ultimate online shopping experience for the modern, tech-savvy generation. 
              Discover curated products and exclusive deals.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-[var(--fg)] mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/cart" className="footer-link">Cart</Link></li>
              <li><Link to="/account" className="footer-link">Account</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-[var(--fg)] mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="footer-link">Contact Us</a></li>
              <li><a href="#" className="footer-link">FAQ</a></li>
              <li><a href="#" className="footer-link">Shipping Info</a></li>
              <li><a href="#" className="footer-link">Returns</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-[var(--fg)] mb-4">Stay Connected</h4>
            <p className="text-gray-500 text-sm mb-4">
              Subscribe for the latest drops and exclusive deals.
            </p>
            <form>
              <div className="relative">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="input-field w-full pr-24"
                  aria-label="Email address"
                />
                <button 
                  type="submit"
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 rounded-xl px-5 py-2 font-semibold text-white transition-all duration-200 bg-neon-gradient hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-electric-indigo"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-electric-indigo/10 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} BuyBuddy. All rights reserved. Built with 🚀 in the IDX.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
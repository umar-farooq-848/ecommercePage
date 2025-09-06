// ========================================
// CLIENT/SRC/PAGES/ACCOUNT.JSX
// ========================================
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import Card from '../components/Card'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const Account = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { clearCart } = useCart()
  const [activeTab, setActiveTab] = useState('profile')

  if (!user) {
    navigate('/auth/login')
    return null
  }

  const handleLogout = async () => {
    await logout()
    clearCart()
    navigate('/')
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'orders', label: 'Orders' },
    { id: 'addresses', label: 'Addresses' }
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-1/4">
          <Card>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-electric-indigo rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-semibold">{user.name}</h2>
              <p className="text-gray-600 text-sm">{user.email}</p>
            </div>

            <nav className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-electric-indigo text-white'
                      : 'hover:bg-electric-indigo/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                Logout
              </button>
            </nav>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {activeTab === 'profile' && (
            <Card>
              <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user.name || ''}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-electric-indigo/20 text-[var(--fg)]"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email || ''}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-electric-indigo/20 text-[var(--fg)]"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--fg)] mb-2">
                    Member Since
                  </label>
                  <input
                    type="text"
                    value={new Date(user.created_at).toLocaleDateString()}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--card-bg)] border border-electric-indigo/20 text-[var(--fg)]"
                    disabled
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline">Edit Profile</Button>
              </div>
            </Card>
          )}

          {activeTab === 'orders' && (
            <Card>
              <h2 className="text-2xl font-bold mb-6">Order History</h2>
              
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-gray-600 mb-4">Start shopping to see your orders here</p>
                <Button onClick={() => navigate('/')}>
                  Start Shopping
                </Button>
              </div>
            </Card>
          )}

          {activeTab === 'addresses' && (
            <Card>
              <h2 className="text-2xl font-bold mb-6">Saved Addresses</h2>
              
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-xl font-semibold mb-2">No addresses saved</h3>
                <p className="text-gray-600 mb-4">Add addresses for faster checkout</p>
                <Button variant="outline">
                  Add Address
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Account

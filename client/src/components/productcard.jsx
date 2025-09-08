
// ========================================
// CLIENT/SRC/COMPONENTS/PRODUCTCARD.JSX
// ========================================
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from './button.jsx'
import Badge from './badge.jsx'
import { useCart } from '../context/cartcontext.jsx'
import { useAuth } from '../context/authcontext.jsx'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate('/auth/login')
      return
    }

    setLoading(true)
    
    const result = await addToCart(product.id, 1)
    if (result.success) {
      // Show success feedback
    }
    setLoading(false)
  }

  return (
    <Link to={`/product/${product.id}`} className="group h-full">
      <div className="bg-[var(--card-bg)] rounded-2xl p-4 hover:shadow-glow-indigo transition-all duration-300 border border-electric-indigo/10 group-hover:border-electric-indigo/30 flex flex-col h-full">
        {/* Image */}
        <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.isNew && (
            <Badge className="absolute top-2 left-2 bg-neon-green text-soft-black">
              New
            </Badge>
          )}
          {product.salePrice && (
            <Badge className="absolute top-2 right-2 bg-neon-pink text-white">
              Sale
            </Badge>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2 flex flex-col flex-grow">
          <h3 className="font-semibold text-[var(--fg)] group-hover:text-electric-indigo transition-colors truncate">
            {product.title}
          </h3>
          
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-electric-indigo">
              ₹{product.price}
            </span>
            {product.salePrice && (
              <span className="text-sm line-through text-gray-500">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {product.rating && (
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <span>⭐</span>
              <span>{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
          )}

          <Button
            onClick={handleAddToCart}
            className="w-full mt-auto pt-3"
            disabled={loading}
          >
            {loading ? '...' : 'Add to Cart'}
          </Button>
        </div>
      </div>
    </Link>
  )
}

export default ProductCard

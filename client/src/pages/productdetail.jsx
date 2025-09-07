// ========================================
// CLIENT/SRC/PAGES/PRODUCTDETAIL.JSX
// ========================================
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Button from '../components/button.jsx'
import Badge from '../components/badge.jsx'
import ProductCard from '../components/productcard.jsx'
import { useCart } from '../context/cartcontext.jsx'
import * as api from '../utils/api'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    setLoading(true)
    try {
      const response = await api.getItem(id)
      const productData = response.data
      setProduct(productData)
      
      if (productData.images?.length > 0) {
        setSelectedImage(0)
      }

      // Fetch related products
      const relatedResponse = await api.getItems({ 
        category: productData.category, 
        limit: 4 
      })
      setRelatedProducts(relatedResponse.data.items.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error fetching product:', error)
      navigate('/404')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async () => {
    setAddingToCart(true)
    const result = await addToCart(product.id, quantity)
    if (result.success) {
      // Show success message
    }
    setAddingToCart(false)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square bg-gray-200 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => navigate('/')}>Back to Shop</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative">
            <img
              src={product.images?.[selectedImage] || '/placeholder-product.jpg'}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {product.isNew && (
              <Badge className="absolute top-4 left-4 bg-neon-green text-soft-black">
                New
              </Badge>
            )}
          </div>
          
          {product.images?.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-electric-indigo' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-[var(--fg)] mb-2">
              {product.title}
            </h1>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-electric-indigo">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg line-through text-gray-500">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              
              {product.rating && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span>{product.rating}</span>
                  <span className="text-gray-500">({product.reviewCount} reviews)</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <span className="text-sm text-gray-600">Stock:</span>
              <Badge variant={product.stock > 10 ? 'success' : 'warning'}>
                {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
              </Badge>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {product.specs && (
            <div>
              <h3 className="font-semibold mb-2">Specifications</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                {Object.entries(product.specs).map(([key, value]) => (
                  <li key={key} className="flex">
                    <span className="font-medium w-24 capitalize">{key}:</span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart */}
          <div className="border-t pt-6">
            <div className="flex items-center space-x-4 mb-4">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-1 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1 hover:bg-gray-100"
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="w-full"
              size="lg"
            >
              {addingToCart ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail

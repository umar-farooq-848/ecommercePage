// ========================================
// CLIENT/SRC/PAGES/LANDING.JSX - Main Product Listing
// ========================================
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import FilterPanel from '../components/FilterPanel'
import Button from '../components/Button'
import * as api from '../utils/api'

const Landing = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    q: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    sort: 'newest'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 24,
    total: 0
  })
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    // Initialize filters from URL params
    const urlParams = Object.fromEntries(searchParams)
    setFilters(prev => ({ ...prev, ...urlParams }))
    fetchProducts({ ...filters, ...urlParams })
  }, [searchParams])

  const fetchProducts = async (currentFilters = filters, currentPage = 1) => {
    setLoading(true)
    try {
      const params = {
        ...currentFilters,
        page: currentPage,
        limit: pagination.limit
      }
      
      const response = await api.getItems(params)
      const { items, meta } = response.data
      
      setProducts(items)
      setPagination(prev => ({ ...prev, ...meta }))
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    
    // Update URL
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params)
    
    fetchProducts(updatedFilters)
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }))
    fetchProducts(filters, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-gradient-neon">Discover</span>{' '}
          <span className="text-[var(--fg)]">Amazing Products</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Shop the latest trends with our curated collection of premium products
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-1/4">
          <FilterPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-[var(--fg)]">
              {loading ? 'Loading...' : `${pagination.total} products found`}
            </p>
            
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange({ sort: e.target.value })}
              className="px-3 py-2 rounded-lg bg-[var(--card-bg)] border border-electric-indigo/20 text-[var(--fg)]"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center space-x-4">
                <Button
                  variant="outline"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                
                <span className="text-[var(--fg)]">
                  Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                </span>
                
                <Button
                  variant="outline"
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Landing
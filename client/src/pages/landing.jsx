// ========================================
// CLIENT/SRC/PAGES/LANDING.JSX - Main Product Listing
// ========================================
import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/productcard.jsx'
import FilterPanel from '../components/filterpanel.jsx'
import Button from '../components/button.jsx'
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
    const updatedFilters = { ...filters, ...newFilters, page: 1 }
    setFilters(updatedFilters)
    
    // Update URL
    const params = new URLSearchParams()
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params)
    
    fetchProducts(updatedFilters, 1)
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }))
    fetchProducts(filters, page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-gradient-neon">Discover</span>{' '}
          <span className="text-[var(--fg)]">Amazing Products</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Shop the latest trends with our curated collection of premium products.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-1/4">
          <FilterPanel 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        {/* Main Content */}
        <main className="lg:w-3/4">
          {/* Results Header */}
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <p className="text-sm text-gray-500">
              {loading ? 'Loading...' : `${pagination.total} products found`}
            </p>
            
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange({ sort: e.target.value })}
              className="px-3 py-2 text-sm rounded-lg bg-[var(--card-bg)] border border-electric-indigo/20 text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-electric-indigo"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="product-grid">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-gray-300 dark:bg-gray-700 aspect-square rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="product-grid mb-8">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {Math.ceil(pagination.total / pagination.limit) > 1 && (
                <div className="flex justify-center items-center space-x-2 sm:space-x-4">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => handlePageChange(pagination.page - 1)}
                  >
                    Previous
                  </Button>
                  
                  <span className="text-sm text-[var(--fg)]">
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
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🤷</div>
              <h3 className="text-2xl font-semibold mb-2">No Products Found</h3>
              <p className="text-gray-500">
                Your search for "{filters.q}" didn't return any results. Try a different search or clear your filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Landing
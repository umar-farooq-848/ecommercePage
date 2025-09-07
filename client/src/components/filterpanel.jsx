// ========================================
// CLIENT/SRC/COMPONENTS/FILTERPANEL.JSX
// ========================================
import React, { useState } from 'react'
import Button from './button.jsx'

const FilterPanel = ({ filters, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Garden',
    'Sports',
    'Books',
    'Beauty',
    'Automotive'
  ]

  const handleCategoryChange = (category) => {
    const currentCategories = filters.category ? filters.category.split(',') : []
    let newCategories

    if (currentCategories.includes(category)) {
      newCategories = currentCategories.filter(c => c !== category)
    } else {
      newCategories = [...currentCategories, category]
    }

    onFilterChange({ category: newCategories.join(',') })
  }

  const handlePriceChange = (field, value) => {
    onFilterChange({ [field]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      category: '',
      minPrice: '',
      maxPrice: '',
      q: filters.q // Keep search query
    })
  }

  return (
    <div className="space-y-6">
      {/* Mobile Toggle */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full"
        >
          {isOpen ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <div className={`space-y-6 ${isOpen ? 'block' : 'hidden lg:block'}`}>
        {/* Categories */}
        <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-electric-indigo/10">
          <h3 className="font-semibold text-[var(--fg)] mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map(category => {
              const isSelected = filters.category?.split(',').includes(category)
              return (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCategoryChange(category)}
                    className="mr-2 text-electric-indigo"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Price Range */}
        <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-electric-indigo/10">
          <h3 className="font-semibold text-[var(--fg)] mb-4">Price Range</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-gray-300 text-[var(--fg)]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Max Price</label>
              <input
                type="number"
                placeholder="1000"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg)] border border-gray-300 text-[var(--fg)]"
              />
            </div>
          </div>
        </div>

        {/* Clear Filters */}
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  )
}

export default FilterPanel
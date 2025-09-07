// ========================================
// SERVER/SCRIPTS/SEED.JS - Database Seeding Script
// ========================================
const { createClient } = require('@supabase/supabase-js')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

const sampleProducts = [
  {
    id: uuidv4(),
    title: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-canceling wireless headphones with 30-hour battery life and crystal-clear audio quality.',
    price: 199.99,
    category: 'Electronics',
    tags: ['wireless', 'bluetooth', 'headphones', 'audio'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    stock: 25,
    rating: 4.8,
    review_count: 156,
    specs: {
      'Battery Life': '30 hours',
      'Connectivity': 'Bluetooth 5.0',
      'Weight': '250g',
      'Warranty': '2 years'
    }
  },
  {
    id: uuidv4(),
    title: 'Smart Fitness Tracker',
    description: 'Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life.',
    price: 149.99,
    original_price: 199.99,
    category: 'Electronics',
    tags: ['fitness', 'tracker', 'smartwatch', 'health'],
    images: [
      'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=500',
      'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=500'
    ],
    stock: 18,
    rating: 4.6,
    review_count: 89,
    specs: {
      'Battery Life': '7 days',
      'Water Resistance': 'IP68',
      'Display': '1.4" AMOLED',
      'Sensors': 'Heart rate, GPS, Accelerometer'
    }
  },
  {
    id: uuidv4(),
    title: 'Minimalist Backpack',
    description: 'Sleek and functional backpack perfect for daily commute, travel, and outdoor adventures.',
    price: 89.99,
    category: 'Clothing',
    tags: ['backpack', 'travel', 'minimalist', 'outdoor'],
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=500'
    ],
    stock: 42,
    rating: 4.7,
    review_count: 203,
    specs: {
      'Capacity': '25L',
      'Material': 'Water-resistant nylon',
      'Dimensions': '45x30x15cm',
      'Weight': '0.8kg'
    }
  },
  {
    id: uuidv4(),
    title: 'Premium Coffee Maker',
    description: 'Programmable coffee maker with built-in grinder and thermal carafe for the perfect cup every time.',
    price: 299.99,
    category: 'Home & Garden',
    tags: ['coffee', 'kitchen', 'appliance', 'premium'],
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500'
    ],
    stock: 12,
    rating: 4.9,
    review_count: 67,
    specs: {
      'Capacity': '12 cups',
      'Grinder': 'Built-in burr grinder',
      'Carafe': 'Thermal stainless steel',
      'Programming': '24-hour programmable'
    }
  },
  {
    id: uuidv4(),
    title: 'Ergonomic Office Chair',
    description: 'High-back ergonomic office chair with lumbar support and adjustable armrests for all-day comfort.',
    price: 399.99,
    original_price: 499.99,
    category: 'Home & Garden',
    tags: ['office', 'chair', 'ergonomic', 'furniture'],
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
      'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=500'
    ],
    stock: 8,
    rating: 4.5,
    review_count: 124,
    specs: {
      'Height Adjustment': '43-53cm',
      'Weight Capacity': '150kg',
      'Material': 'Breathable mesh',
      'Warranty': '5 years'
    }
  },
  {
    id: uuidv4(),
    title: 'Vintage Leather Journal',
    description: 'Handcrafted leather journal with blank pages, perfect for writing, sketching, or planning.',
    price: 39.99,
    category: 'Books',
    tags: ['journal', 'leather', 'vintage', 'writing'],
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=500',
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'
    ],
    stock: 35,
    rating: 4.8,
    review_count: 91,
    specs: {
      'Pages': '200 blank pages',
      'Size': '21x14cm',
      'Material': 'Genuine leather',
      'Closure': 'Elastic band'
    }
  }
]

module.exports.sampleProducts = sampleProducts

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...')

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const adminUser = {
      id: uuidv4(),
      name: 'Admin User',
      email: 'admin@buybuddy.com',
      password_hash: adminPassword,
      is_verified: true,
      created_at: new Date().toISOString()
    }

    console.log('👤 Creating admin user...')
    const { error: userError } = await supabase
      .from('users')
      .upsert(adminUser, { onConflict: 'email' })

    if (userError && userError.code !== '23505') { // Ignore duplicate key error
      console.error('Error creating admin user:', userError)
    } else {
      console.log('✅ Admin user created successfully')
    }

    // Seed products
    console.log('📦 Creating sample products...')
    const productsWithTimestamp = sampleProducts.map(product => ({
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { error: itemsError } = await supabase
      .from('items')
      .upsert(productsWithTimestamp, { onConflict: 'id' })

    if (itemsError) {
      console.error('Error creating products:', itemsError)
    } else {
      console.log(`✅ ${sampleProducts.length} products created successfully`)
    }

    console.log('🎉 Database seeding completed!')
    console.log('\nTest Credentials:')
    console.log('Email: admin@buybuddy.com')
    console.log('Password: admin123')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
}

module.exports = { seedDatabase, sampleProducts }

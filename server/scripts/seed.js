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
    title: 'T-shirt',
    description: 'A comfortable and stylish t-shirt for everyday wear.',
    price: 250,
    category: 'Clothing',
    tags: ['clothing', 't-shirt', 'fashion'],
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
    stock: 200,
    rating: 4.2,
    review_count: 80,
    specs: {
      Material: '100% Cotton',
      Fit: 'Regular Fit'
    }
  },
  {
    id: uuidv4(),
    title: 'The Hobbit',
    description: 'A classic fantasy novel by J.R.R. Tolkien.',
    price: 150,
    category: 'Books',
    tags: ['books', 'fantasy', 'classic'],
    images: ['https://rukminim2.flixcart.com/image/612/612/l1mh7rk0/book/y/8/6/the-hobbit-original-imagd5phsmwyvbek.jpeg?q=70'],
    stock: 150,
    rating: 4.8,
    review_count: 400,
    specs: {
      Author: 'J.R.R. Tolkien',
      Genre: 'Fantasy'
    }
  },
 
  {
    id: uuidv4(),
    title: 'Engine Oil',
    description: 'A high-performance engine oil that protects your engine and improves its performance.',
    price: 400,
    category: 'Automotive',
    tags: ['automotive', 'engine oil', 'car care'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/vehicle-lubricant/a/4/6/-original-imahbxmfg2bfmc5t.jpeg?q=70'],
    stock: 100,
    rating: 4.8,
    review_count: 200,
    specs: {
      Viscosity: '5W-30',
      Type: 'Synthetic'
    }
  },
  {
    id: uuidv4(),
    title: '1984',
    description: 'A dystopian novel by George Orwell.',
    price: 120,
    category: 'Books',
    tags: ['books', 'dystopian', 'classic'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/book/e/i/u/1984-original-imahe9w9rkb6fzcm.jpeg?q=70'],
    stock: 180,
    rating: 4.9,
    review_count: 600,
    specs: {
      Author: 'George Orwell',
      Genre: 'Dystopian'
    }
  },
  
  {
    id: uuidv4(),
    title: 'The Lord of the Rings',
    description: 'A classic epic fantasy novel by J.R.R. Tolkien.',
    price: 200,
    category: 'Books',
    tags: ['books', 'fantasy', 'classic'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/book/7/c/a/the-lord-of-the-rings-original-imagjxptrqzshc4z.jpeg?q=70'],
    stock: 120,
    rating: 4.9,
    review_count: 500,
    specs: {
      Author: 'J.R.R. Tolkien',
      Genre: 'Fantasy'
    }
  },
  {
    id: uuidv4(),
    title: 'Car Battery',
    description: 'A reliable car battery that provides long-lasting power.',
    price: 1500,
    category: 'Automotive',
    tags: ['automotive', 'car battery', 'car parts'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/vehicle-battery/l/6/5/12-aam-fl-580112073-80-amaron-original-imagz96wjmreeq5q.jpeg?q=70'],
    stock: 50,
    rating: 4.7,
    review_count: 150,
    specs: {
      Voltage: '12V',
      Capacity: '60Ah'
    }
  }, 
  {
    id: uuidv4(),
    title: 'Sapiens: A Brief History of Humankind',
    description: 'A thought-provoking book about the history of our species.',
    price: 180,
    category: 'Books',
    tags: ['books', 'history', 'non-fiction'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/book/e/d/g/sapiens-paperback-11-june-2015-original-imah4g3y2pzghxhy.jpeg?q=70'],
    stock: 90,
    rating: 4.8,
    review_count: 400,
    specs: {
      Author: 'Yuval Noah Harari',
      Genre: 'Non-fiction'
    }
  },
  {
    id: uuidv4(),
    title: 'Face Cream',
    description: 'A nourishing face cream that hydrates and protects your skin.',
    price: 350,
    category: 'Beauty',
    tags: ['beauty', 'skincare', 'face cream'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/moisturizer-cream/o/m/h/-original-imagzzm598qvyybx.jpeg?q=70'],
    stock: 150,
    rating: 4.5,
    review_count: 180,
    specs: {
      Skin_Type: 'All Skin Types',
      Benefit: 'Hydrating'
    }
  },
  {
    id: uuidv4(),
    title: 'Laptop',
    description: 'A high-performance laptop for all your needs.',
    price: 12000,
    category: 'Electronics',
    tags: ['electronics', 'laptop', 'computer'],
    images: ['https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'],
    stock: 50,
    rating: 4.5,
    review_count: 150,
    specs: {
      RAM: '16GB',
      Storage: '512GB SSD',
      Processor: 'Intel Core i7'
    }
  },
  {
    id: uuidv4(),
    title: 'Smartphone',
    description: 'A smartphone with a stunning display and a powerful camera.',
    price: 8000,
    category: 'Electronics',
    tags: ['electronics', 'smartphone', 'mobile'],
    images: ['https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500'],
    stock: 100,
    rating: 4.7,
    review_count: 200,
    specs: {
      Display: '6.5-inch OLED',
      Camera: '48MP Triple Camera',
      Battery: '4000mAh'
    }
  },
  {
    id: uuidv4(),
    title: 'Jeans',
    description: 'A classic pair of jeans that never goes out of style.',
    price: 600,
    category: 'Clothing',
    tags: ['clothing', 'jeans', 'denim'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/jean/d/p/7/32-grey-wisker-2-brexx-original-imah3wjmgbk3mgh7.jpeg?q=70'],
    stock: 150,
    rating: 4.4,
    review_count: 120,
    specs: {
      Material: 'Denim',
      Fit: 'Slim Fit'
    }
  },
  {
    id: uuidv4(),
    title: 'Sofa',
    description: 'A comfortable and elegant sofa for your living room.',
    price: 15000,
    category: 'Home & Garden',
    tags: ['home', 'sofa', 'furniture'],
    images: ['https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=500'],
    stock: 20,
    rating: 4.8,
    review_count: 180,
    specs: {
      Material: 'Leather',
      Seating: '3-seater'
    }
  },
  
 
  {
    id: uuidv4(),
    title: 'Shampoo',
    description: 'A nourishing shampoo that cleanses and revitalizes your hair.',
    price: 150,
    category: 'Beauty',
    tags: ['beauty', 'haircare', 'shampoo'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/shampoo/0/t/6/-original-imaha5fzjetam45y.jpeg?q=70'],
    stock: 180,
    rating: 4.4,
    review_count: 150,
    specs: {
      Hair_Type: 'All Hair Types',
      Benefit: 'Cleansing'
    }
  },
  {
    id: uuidv4(),
    title: 'Lipstick',
    description: 'A long-lasting lipstick with a vibrant and creamy finish.',
    price: 200,
    category: 'Beauty',
    tags: ['beauty', 'makeup', 'lipstick'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/lipstick/q/v/4/30-elegant-12-pcs-matte-lipstick-intense-pigment-smooth-finish-original-imah7utkmeh2vd7s.jpeg?q=70'],
    stock: 200,
    rating: 4.3,
    review_count: 120,
    specs: {
      Finish: 'Creamy',
      Color: 'Red'
    }
  },
  {
    id: uuidv4(),
    title: 'Car Wax',
    description: 'A high-quality car wax that provides a brilliant shine and long-lasting protection.',
    price: 250,
    category: 'Automotive',
    tags: ['automotive', 'car care', 'wax'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/vehicle-washing-liquid/k/f/m/500-wash-wax-auto-wash-shampoo-wash-wax-auto-wash-shampoo-original-imaghfw2peyh2vnn.jpeg?q=70'],
    stock: 80,
    rating: 4.7,
    review_count: 150,
    specs: {
      Type: 'Synthetic Wax',
      Application: 'Hand or Machine'
    }
  },
  {
    id: uuidv4(),
    title: 'Tire Shine',
    description: 'A tire shine that gives your tires a deep, black, and wet look.',
    price: 150,
    category: 'Automotive',
    tags: ['automotive', 'car care', 'tire shine'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/wheel-tire-cleaner/a/y/4/400-1-tyre-polish-black-shine-finish-the-black-beast-original-imahfgfuhmgnpsxu.jpeg?q=70'],
    stock: 100,
    rating: 4.5,
    review_count: 100,
    specs: {
      Finish: 'Wet Look',
      Application: 'Spray'
    }
  },
    
  {
    id: uuidv4(),
    title: 'Keyboard',
    description: 'A mechanical keyboard with customizable RGB lighting.',
    price: 1500,
    category: 'Electronics',
    tags: ['electronics', 'keyboard', 'gaming'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/keyboard/multi-device-keyboard/u/m/a/k500-usb-keyboard-zebion-original-imah4ym7mhjaeagz.jpeg?q=70'],
    stock: 60,
    rating: 4.6,
    review_count: 180,
    specs: {
      Switch_Type: 'Cherry MX Brown',
      Layout: 'Full-size'
    }
  }, 
  {
    id: uuidv4(),
    title: 'Basketball',
    description: 'A high-quality basketball for indoor and outdoor use.',
    price: 300,
    category: 'Sports',
    tags: ['sports', 'basketball', 'ball'],
    images: ['https://rukminim2.flixcart.com/image/612/612/kkimfm80/ball/4/r/2/100-7-engraver-nv-201-basketball-nivia-original-imafzungs7v2zkny.jpeg?q=70'],
    stock: 100,
    rating: 4.9,
    review_count: 250,
    specs: {
      Size: '7',
      Material: 'Composite Leather'
    }
  },
  {
    id: uuidv4(),
    title: 'Mouse',
    description: 'A high-precision gaming mouse with adjustable DPI.',
    price: 800,
    category: 'Electronics',
    tags: ['electronics', 'mouse', 'gaming'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/mouse/g/v/s/zeb-phero-with-dpi-switch-high-precision-plug-play-4-buttons-original-imahbk9fw8yps5hz.jpeg?q=70'],
    stock: 90,
    rating: 4.8,
    review_count: 220,
    specs: {
      DPI: '16000',
      Buttons: '6 programmable buttons'
    }
  },
  {
    id: uuidv4(),
    title: 'Watch',
    description: 'A classic and elegant watch for a sophisticated look.',
    price: 2500,
    category: 'Clothing',
    tags: ['clothing', 'watch', 'accessory'],
    images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500'],
    stock: 100,
    rating: 4.7,
    review_count: 200,
    specs: {
      Movement: 'Automatic',
      Case_Material: 'Stainless Steel'
    }
  },
  {
    id: uuidv4(),
    title: 'Bed',
    description: "A comfortable and supportive bed for a good night's sleep.",
    price: 10000,
    category: 'Home & Garden',
    tags: ['home', 'bed', 'furniture'],
    images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500'],
    stock: 30,
    rating: 4.9,
    review_count: 250,
    specs: {
      Size: 'Queen',
      Material: 'Memory Foam'
    }
  },
  
  {
    id: uuidv4(),
    title: 'Desk',
    description: 'A modern and spacious desk for your home office.',
    price: 4000,
    category: 'Home & Garden',
    tags: ['home', 'desk', 'furniture'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/computer-table/z/4/f/60-136-particle-board-31-9-9409221-madesa-75-black-blue-original-imahdz6murb3ctdc.jpeg?q=70'],
    stock: 40,
    rating: 4.7,
    review_count: 120,
    specs: {
      Material: 'Wood',
      Size: '120cm x 60cm'
    }
  },
  
  {
    id: uuidv4(),
    title: 'Treadmill',
    description: 'A high-performance treadmill for a great cardio workout.',
    price: 12000,
    category: 'Sports',
    tags: ['sports', 'fitness', 'treadmill'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/treadmill/e/p/6/tdm-96-4hp-peak-motorized-foldable-running-machine-for-home-original-imahegmtkzz8svth.jpeg?q=70'],
    stock: 15,
    rating: 4.9,
    review_count: 300,
    specs: {
      Speed: 'Up to 20km/h',
      Incline: 'Up to 15%'
    }
  },
  {
    id: uuidv4(),
    title: 'Bicycle',
    description: 'A lightweight and durable bicycle for a smooth ride.',
    price: 6000,
    category: 'Sports',
    tags: ['sports', 'bicycle', 'cycling'],
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500'],
    stock: 35,
    rating: 4.7,
    review_count: 180,
    specs: {
      Frame: 'Aluminum',
      Gears: '21-speed'
    }
  },
 
  {
    id: uuidv4(),
    title: 'To Kill a Mockingbird',
    description: 'A classic novel by Harper Lee.',
    price: 100,
    category: 'Books',
    tags: ['books', 'classic', 'fiction'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/regionalbooks/g/e/c/to-kill-a-mockingbird-harper-lee-original-imaheya2dhgjbfd4.jpeg?q=70'],
    stock: 200,
    rating: 4.9,
    review_count: 700,
    specs: {
      Author: 'Harper Lee',
      Genre: 'Fiction'
    }
  },
 
  {
    id: uuidv4(),
    title: 'Conditioner',
    description: 'A moisturizing conditioner that leaves your hair soft and smooth.',
    price: 150,
    category: 'Beauty',
    tags: ['beauty', 'haircare', 'conditioner'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/conditioner/e/t/n/-original-imah32qefya4gkxr.jpeg?q=70'],
    stock: 180,
    rating: 4.5,
    review_count: 160,
    specs: {
      Hair_Type: 'All Hair Types',
      Benefit: 'Moisturizing'
    }
  },
  {
    id: uuidv4(),
    title: 'Dumbbells',
    description: 'A set of adjustable dumbbells for a versatile workout.',
    price: 2000,
    category: 'Sports',
    tags: ['sports', 'fitness', 'dumbbells'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/dumbbell/p/i/x/pvc-1-pair-hex-home-gym-5kgs-x-2pcs-5-fastero-fitness-original-imahcw4vakh2bzwj.jpeg?q=70'],
    stock: 60,
    rating: 4.8,
    review_count: 200,
    specs: {
      Weight: 'Up to 24kg',
      Material: 'Cast Iron'
    }
  },
  {
    id: uuidv4(),
    title: 'Coffee Table',
    description: 'A stylish and functional coffee table for your living room.',
    price: 2500,
    category: 'Home & Garden',
    tags: ['home', 'coffee table', 'furniture'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/coffee-table/h/j/x/55-mdf-55-7-bult-tbl-w-online-decor-shoppee-45-white-original-imahd684zuahhugw.jpeg?q=70'],
    stock: 50,
    rating: 4.6,
    review_count: 90,
    specs: {
      Material: 'Wood',
      Shape: 'Rectangular'
    }
  },
 {
    id: uuidv4(),
    title: 'Yoga Mat',
    description: 'A comfortable and non-slip yoga mat for your practice.',
    price: 400,
    category: 'Sports',
    tags: ['sports', 'yoga', 'fitness'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/shopsy-sport-mat/x/i/r/eva-tpe-anti-slip-home-gym-exercise-workout-fitness-for-men-original-imah35zzcfr6ycqv.jpeg?q=70'],
    stock: 80,
    rating: 4.7,
    review_count: 150,
    specs: {
      Thickness: '6mm',
      Material: 'TPE'
    }
  },

  {
    id: uuidv4(),
    title: 'Hoodie',
    description: 'A warm and comfortable hoodie for a casual look.',
    price: 500,
    category: 'Clothing',
    tags: ['clothing', 'hoodie', 'fashion'],
    images: ['https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?w=500&h=500&fit=crop&crop=center'],
    stock: 180,
    rating: 4.3,
    review_count: 100,
    specs: {
      Material: 'Fleece',
      Fit: 'Regular Fit'
    }
  },
 
  {
    id: uuidv4(),
    title: 'Sunscreen',
    description: 'A broad-spectrum sunscreen that protects your skin from harmful UV rays.',
    price: 200,
    category: 'Beauty',
    tags: ['beauty', 'skincare', 'sunscreen'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/sunscreen/v/n/a/80-lightweight-gel-sunscreen-no-white-cast-for-men-women-55-original-imaheb5n9qqgfhz2.jpeg?q=70'],
    stock: 200,
    rating: 4.6,
    review_count: 180,
    specs: {
      SPF: '50+',
      Skin_Type: 'All Skin Types'
    }
  },
  {
    id: uuidv4(),
    title: 'Headphones',
    description: 'Noise-cancelling headphones for an immersive audio experience.',
    price: 3000,
    category: 'Electronics',
    tags: ['electronics', 'headphones', 'audio'],
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    stock: 75,
    rating: 4.9,
    review_count: 300,
    specs: {
      Type: 'Over-ear',
      Connectivity: 'Bluetooth'
    }
  },
  {
    id: uuidv4(),
    title: 'Dining Table',
    description: 'A spacious and elegant dining table for your family meals.',
    price: 8000,
    category: 'Home & Garden',
    tags: ['home', 'dining table', 'furniture'],
    images: ['https://rukminim2.flixcart.com/image/612/612/xif0q/dining-set/w/u/z/-original-imah3crexbbkvbw4.jpeg?q=70'],
    stock: 25,
    rating: 4.8,
    review_count: 180,
    specs: {
      Material: 'Wood',
      Seating: '6-seater'
    }
  },
  {
    id: uuidv4(),
    title: 'Sneakers',
    description: 'A stylish and comfortable pair of sneakers for everyday wear.',
    price: 900,
    category: 'Clothing',
    tags: ['clothing', 'sneakers', 'footwear'],
    images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop&crop=center'],
    stock: 120,
    rating: 4.5,
    review_count: 150,
    specs: {
      Material: 'Canvas',
      Sole: 'Rubber'
    }
  }
]

module.exports.sampleProducts = sampleProducts

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...')

    console.log('🗑️ Deleting all existing products...');
    const { error: deleteError } = await supabase.from('items').delete().gt('stock', -1); // Condition to delete all
    if (deleteError) {
      console.error('Error deleting products:', deleteError);
      return; // Stop seeding if deletion fails
    } else {
      console.log('✅ All existing products deleted successfully');
    }

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

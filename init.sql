-- ========================================
-- DATABASE RESET
-- Drop all existing objects to ensure a clean slate.
-- ========================================

-- Drop views
DROP VIEW IF EXISTS item_stats;
DROP VIEW IF EXISTS order_summaries;
DROP VIEW IF EXISTS table_stats;

-- Drop tables with CASCADE to remove dependent objects like policies, triggers, etc.
-- The order is from most dependent to least dependent.
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS refresh_tokens CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop standalone functions and sequences that might not be dropped with tables
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS generate_order_number();
DROP FUNCTION IF EXISTS update_item_rating();
DROP FUNCTION IF EXISTS cleanup_expired_tokens();
DROP FUNCTION IF EXISTS merge_guest_cart_to_user(UUID, VARCHAR);
DROP FUNCTION IF EXISTS cleanup_old_guest_carts();
DROP FUNCTION IF EXISTS cleanup_expired_refresh_tokens();
DROP SEQUENCE IF EXISTS order_number_seq;


-- ========================================
-- SUPABASE DATABASE SCHEMA SETUP
-- ========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ========================================
-- USERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ========================================
-- ITEMS (PRODUCTS) TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10,2) CHECK (original_price >= price),
    category VARCHAR(100) NOT NULL,
    tags JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
    specs JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_price ON items(price);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);
CREATE INDEX IF NOT EXISTS idx_items_rating ON items(rating);
CREATE INDEX IF NOT EXISTS idx_items_stock ON items(stock);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_items_search ON items USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- GIN index for JSONB columns
CREATE INDEX IF NOT EXISTS idx_items_tags ON items USING gin(tags);

-- ========================================
-- CARTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    guest_id VARCHAR(255),
    items JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_user_or_guest CHECK (
        (user_id IS NOT NULL AND guest_id IS NULL) OR 
        (user_id IS NULL AND guest_id IS NOT NULL)
    )
);

-- Create indexes for cart lookups
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_guest_id ON carts(guest_id);
CREATE INDEX IF NOT EXISTS idx_carts_updated_at ON carts(updated_at);

-- ========================================
-- ORDERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    items JSONB NOT NULL DEFAULT '[]',
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    tax DECIMAL(10,2) DEFAULT 0 CHECK (tax >= 0),
    shipping DECIMAL(10,2) DEFAULT 0 CHECK (shipping >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method VARCHAR(50),
    shipping_address JSONB,
    billing_address JSONB,
    tracking_number VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for order management
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- ========================================
-- REFRESH TOKENS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for token management
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ========================================
-- ADDRESSES TABLE (for user shipping addresses)
-- ========================================
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) DEFAULT 'shipping' CHECK (type IN ('shipping', 'billing')),
    is_default BOOLEAN DEFAULT FALSE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company VARCHAR(255),
    address_line_1 VARCHAR(255) NOT NULL,
    address_line_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'US',
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- ========================================
-- WISHLISTS TABLE (optional future feature)
-- ========================================
CREATE TABLE IF NOT EXISTS wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_item_id ON wishlists(item_id);

-- ========================================
-- REVIEWS TABLE (optional future feature)
-- ========================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES items(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reviews_item_id ON reviews(item_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- ========================================
-- FUNCTIONS AND TRIGGERS
-- ========================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_items_updated_at 
    BEFORE UPDATE ON items 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at 
    BEFORE UPDATE ON carts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at 
    BEFORE UPDATE ON addresses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.order_number IS NULL THEN
        NEW.order_number := 'GS' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(NEXTVAL('order_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for order numbers
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;

-- Trigger to generate order numbers
CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Function to update item ratings (called when reviews are added/updated/deleted)
CREATE OR REPLACE FUNCTION update_item_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE items SET 
        rating = (
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM reviews 
            WHERE item_id = COALESCE(NEW.item_id, OLD.item_id) 
            AND is_approved = TRUE
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews 
            WHERE item_id = COALESCE(NEW.item_id, OLD.item_id) 
            AND is_approved = TRUE
        )
    WHERE id = COALESCE(NEW.item_id, OLD.item_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers to update item ratings
CREATE TRIGGER update_item_rating_on_review_change
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_item_rating();

-- ========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Users can only see/modify their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Cart policies
CREATE POLICY "Users can manage own carts" ON carts
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Order policies  
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Address policies
CREATE POLICY "Users can manage own addresses" ON addresses
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Wishlist policies
CREATE POLICY "Users can manage own wishlist" ON wishlists
    FOR ALL USING (auth.uid()::text = user_id::text);

-- Review policies
CREATE POLICY "Users can manage own reviews" ON reviews
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY "Anyone can view approved reviews" ON reviews
    FOR SELECT USING (is_approved = TRUE);

-- Items are publicly readable
CREATE POLICY "Anyone can view active items" ON items
    FOR SELECT USING (is_active = TRUE);

-- ========================================
-- SAMPLE DATA INSERTION (Optional)
-- ========================================

-- This will be handled by the seed script, but you can also insert sample data here if needed

-- Clean up old refresh tokens (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM refresh_tokens 
    WHERE expires_at < NOW() OR revoked = TRUE;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- ADDITIONAL INDEXES FOR PERFORMANCE
-- ========================================

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_items_category_price ON items(category, price) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_items_category_rating ON items(category, rating DESC) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_orders_user_status ON orders(user_id, status);

-- Partial indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_active ON items(created_at) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_active ON refresh_tokens(user_id, expires_at) WHERE revoked = FALSE;

-- ========================================
-- STORED PROCEDURES FOR COMMON OPERATIONS
-- ========================================

-- Procedure to merge guest cart into user cart
CREATE OR REPLACE FUNCTION merge_guest_cart_to_user(
    p_user_id UUID,
    p_guest_id VARCHAR
)
RETURNS void AS $$
DECLARE
    guest_cart_record RECORD;
    user_cart_record RECORD;
    merged_items JSONB;
BEGIN
    -- Get guest cart
    SELECT * INTO guest_cart_record FROM carts WHERE guest_id = p_guest_id;
    
    IF NOT FOUND THEN
        RETURN;
    END IF;
    
    -- Get or create user cart
    SELECT * INTO user_cart_record FROM carts WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        -- Create user cart with guest items
        INSERT INTO carts (user_id, items) VALUES (p_user_id, guest_cart_record.items);
    ELSE
        -- Merge items (this is simplified - actual merging logic would be more complex)
        UPDATE carts 
        SET items = user_cart_record.items || guest_cart_record.items
        WHERE user_id = p_user_id;
    END IF;
    
    -- Delete guest cart
    DELETE FROM carts WHERE guest_id = p_guest_id;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- View for item statistics
CREATE OR REPLACE VIEW item_stats AS
SELECT 
    i.id,
    i.title,
    i.price,
    i.stock,
    i.category,
    COALESCE(i.rating, 0) as rating,
    COALESCE(i.review_count, 0) as review_count,
    CASE WHEN i.original_price > i.price THEN true ELSE false END as on_sale,
    CASE WHEN i.created_at > NOW() - INTERVAL '30 days' THEN true ELSE false END as is_new,
    i.created_at,
    i.updated_at
FROM items i
WHERE i.is_active = true;

-- View for order summaries
CREATE OR REPLACE VIEW order_summaries AS
SELECT 
    o.id,
    o.order_number,
    o.user_id,
    u.name as user_name,
    u.email as user_email,
    o.total,
    o.status,
    o.payment_status,
    jsonb_array_length(o.items) as item_count,
    o.created_at,
    o.updated_at
FROM orders o
LEFT JOIN users u ON o.user_id = u.id;

-- ========================================
-- CLEANUP AND MAINTENANCE
-- ========================================

-- Function to clean up old guest carts (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_guest_carts()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM carts 
    WHERE guest_id IS NOT NULL 
    AND updated_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired refresh tokens
CREATE OR REPLACE FUNCTION cleanup_expired_refresh_tokens()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM refresh_tokens 
    WHERE expires_at < NOW() OR revoked = TRUE;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- GRANTS AND PERMISSIONS
-- ========================================

-- Grant necessary permissions to authenticated users
-- (Adjust based on your Supabase setup)

-- Note: In Supabase, you typically use the service role key for server-side operations
-- and RLS policies handle user permissions for client-side access

-- ========================================
-- PERFORMANCE MONITORING VIEWS
-- ========================================

-- View to monitor slow queries and table sizes
CREATE OR REPLACE VIEW table_stats AS
SELECT 
    schemaname,
    tablename,
    attname as column_name,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public'
ORDER BY tablename, attname;

-- ========================================
-- BACKUP RECOMMENDATIONS
-- ========================================

/*
For production deployment:

1. Enable Point-in-Time Recovery (PITR) in Supabase
2. Set up regular automated backups
3. Monitor database performance and optimize queries
4. Implement proper logging and monitoring
5. Set up alerts for critical metrics

Key metrics to monitor:
- Database size growth
- Query performance 
- Connection count
- Cache hit ratio
- Index usage
*/

-- ========================================
-- FINAL VERIFICATION QUERIES
-- ========================================

-- Verify all tables were created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Verify all indexes were created
SELECT indexname, tablename, indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Verify all triggers were created  
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

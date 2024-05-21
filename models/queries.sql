-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stock INTEGER,
    category_id INTEGER NOT NULL,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- Categories Table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wishlist Table
CREATE TABLE wishlist (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart Items Table
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carts Table
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    total_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order Items Table
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    product_id INTEGER REFERENCES products(id),
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipping Table
CREATE TABLE shipping (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    address TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    tracking_number VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_products_price ON products (price);
CREATE INDEX idx_products_category_id ON products (category_id);
CREATE INDEX idx_wishlist_user_id ON wishlist (user_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items (cart_id);
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_reviews_user_id ON reviews (user_id);
CREATE INDEX idx_reviews_product_id ON reviews (product_id);
CREATE INDEX idx_shipping_order_id ON shipping (order_id);

-- Insert Queries

-- Add User
INSERT INTO users (username, email, password, role) -- password is hashed in register & login
VALUES ($1, $2, $3, $4)
RETURNING id;

-- Add Product
INSERT INTO products (name, description, price, category_id, image_url, search_vector)
VALUES ($1, $2, $3, $4, $5, to_tsvector($6))
RETURNING id;

-- Add Category
INSERT INTO categories (name)
VALUES ($1)
RETURNING id;

-- Add to Wishlist
INSERT INTO wishlist (user_id, product_id)
VALUES ($1, $2)
RETURNING id;

-- Add to Cart
INSERT INTO cart_items (cart_id, product_id, quantity)
VALUES ($1, $2, $3)
ON CONFLICT (cart_id, product_id)
DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
RETURNING *;

-- Create Cart
INSERT INTO carts (user_id)
VALUES ($1)
RETURNING id;

-- Create Order
INSERT INTO orders (user_id, total_amount)
VALUES ($1, $2)
RETURNING id;

-- Add Order Item
INSERT INTO order_items (order_id, product_id, quantity, price)
VALUES ($1, $2, $3, $4);

-- Add Review
INSERT INTO reviews (user_id, product_id, rating, comment)
VALUES ($1, $2, $3, $4)
RETURNING id;

-- Add Shipping
INSERT INTO shipping (order_id, address, tracking_number)
VALUES ($1, $2, $3)
RETURNING id;

-- Select Queries

-- Get Products with Filters and Pagination
SELECT p.*, c.name AS category_name
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE 1=1
AND c.name = $1 AND p.price >= $2 AND p.price <= $3
ORDER BY p.$4
LIMIT $5 OFFSET $5

-- Count for Pagination
SELECT COUNT(*) AS total
FROM products p
JOIN categories c ON p.category_id = c.id
WHERE 1=1
AND c.name = $1 AND p.price >= $2 AND p.price <= $3
ORDER BY p.$4
LIMIT $5 OFFSET $5



-- Get Wishlist
SELECT p.*
FROM wishlist w
JOIN products p ON w.product_id = p.id
WHERE w.user_id = $1
ORDER BY w.created_at DESC;

-- Get Cart
SELECT ci.*, p.name, p.price, p.image_url
FROM cart_items ci
JOIN products p ON ci.product_id = p.id
WHERE ci.cart_id = $1;

-- Get Orders
SELECT o.*, oi.product_id, oi.quantity, oi.price, p.name, p.image_url
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.id = $1 AND o.user_id = $2;

-- Get Reviews
SELECT r.*, u.username
FROM reviews r
JOIN users u ON r.user_id = u.id
WHERE r.product_id = $1
ORDER BY r.created_at DESC;

-- Get Shipping Status
SELECT s.*
FROM shipping s
WHERE s.order_id = $1;

-- Update Queries
-- Update Product
UPDATE products
SET name = $1, description = $2, price = $3, category_id = $4, image_url = $5, search_vector = to_tsvector($6), updated_at = CURRENT_TIMESTAMP
WHERE id = $7
RETURNING *;

-- Update User Profile
UPDATE users
SET username = $1, email = $2, updated_at = CURRENT_TIMESTAMP
WHERE id = $3
RETURNING *;

-- Update Order Status
UPDATE orders
SET status = $1, updated_at = CURRENT_TIMESTAMP
WHERE id = $2
RETURNING *;

-- Delete Queries
-- Delete Wishlist Item
DELETE FROM wishlist
WHERE id = $1 AND user_id = $2
RETURNING *;

-- Delete Cart Item
DELETE FROM cart_items
WHERE id = $1 AND cart_id = $2
RETURNING *;

-- Delete Product
DELETE FROM products
WHERE id = $1
RETURNING *;

-- Delete User
DELETE FROM users
WHERE id = $1
RETURNING *;

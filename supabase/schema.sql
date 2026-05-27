-- ============================================================
-- Kenwell Admin Panel — Supabase Schema
-- Run this in your Supabase SQL Editor (supabase.com → SQL Editor)
-- ============================================================

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL,
  slug         TEXT UNIQUE NOT NULL,
  description  TEXT,
  image_url    TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name              TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  category_id       UUID REFERENCES categories(id) ON DELETE SET NULL,
  short_description TEXT,
  description       TEXT,
  price             DECIMAL(10,2) NOT NULL DEFAULT 0,
  compare_price     DECIMAL(10,2),
  images            TEXT[]  DEFAULT '{}',
  stock_quantity    INTEGER DEFAULT 0,
  is_active         BOOLEAN DEFAULT TRUE,
  tags              TEXT[]  DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;

-- Public can read categories
CREATE POLICY "public_read_categories"
  ON categories FOR SELECT USING (true);

-- Public can read active products
CREATE POLICY "public_read_active_products"
  ON products FOR SELECT USING (is_active = true);

-- Authenticated users (admin) get full access
CREATE POLICY "admin_all_categories"
  ON categories FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "admin_all_products"
  ON products FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- IMPORTANT: After running this SQL, go to:
--   Authentication → Users → Invite user
-- and create your admin account with an email + password.
-- That is the account you will use to log in at /admin/login
-- ============================================================

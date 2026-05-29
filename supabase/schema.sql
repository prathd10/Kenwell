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
-- UGC Journey Review Videos
-- ============================================================

CREATE TABLE IF NOT EXISTS ugc_videos (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL DEFAULT '',
  handle        TEXT NOT NULL DEFAULT '',        -- e.g. @rahulk_fit
  role          TEXT NOT NULL DEFAULT '',        -- e.g. CrossFit Athlete
  product       TEXT NOT NULL DEFAULT '',        -- product name tag
  video_url     TEXT NOT NULL DEFAULT '',        -- direct MP4/WebM URL
  thumbnail_url TEXT,                            -- optional poster image
  caption       TEXT,                            -- short quote shown on card
  active        BOOLEAN NOT NULL DEFAULT TRUE,   -- show on homepage
  sort_order    INTEGER NOT NULL DEFAULT 0,      -- lower = shown first
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_ugc_videos_updated_at
  BEFORE UPDATE ON ugc_videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE ugc_videos ENABLE ROW LEVEL SECURITY;

-- Public storefront can read active videos
CREATE POLICY "public_read_active_ugc_videos"
  ON ugc_videos FOR SELECT USING (active = true);

-- Admin gets full access
CREATE POLICY "admin_all_ugc_videos"
  ON ugc_videos FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Seed: 3 placeholder UGC videos (replace URLs with real reels)
-- ============================================================

INSERT INTO ugc_videos (title, handle, role, product, video_url, caption, active, sort_order)
VALUES
  (
    'Week 1 vs Week 4',
    '@rahulk_fit',
    'CrossFit Athlete',
    'KSM-66 Ashwagandha',
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'Cortisol levels dropped noticeably. Sleep quality is incredible now.',
    true, 1
  ),
  (
    '30-Day Glow Up',
    '@ananya_wellness',
    'Nutritionist',
    'Liposomal Glutathione',
    'https://www.w3schools.com/html/movie.mp4',
    'Skin clarity and energy — results visible from week 2 onwards.',
    true, 2
  ),
  (
    'My Recovery Stack',
    '@vikram_bio',
    'Biohacker',
    'Triple Strength Fish Oil',
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'Joint inflammation dropped and focus improved significantly.',
    true, 3
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- IMPORTANT: After running this SQL, go to:
--   Authentication → Users → Invite user
-- and create your admin account with an email + password.
-- That is the account you will use to log in at /admin/login
-- ============================================================

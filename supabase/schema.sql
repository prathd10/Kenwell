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

-- ============================================================
-- Orders Table
-- ============================================================

CREATE TABLE IF NOT EXISTS orders (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  friendly_id         TEXT NOT NULL UNIQUE,          -- e.g. #ba8d93aa
  customer_name       TEXT NOT NULL,
  customer_email      TEXT NOT NULL,
  customer_phone      TEXT NOT NULL,
  shipping_address    TEXT NOT NULL,
  city                TEXT NOT NULL,
  postal_code         TEXT NOT NULL,
  amount              DECIMAL(10,2) NOT NULL DEFAULT 0,
  status              TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Failed', 'Paid', 'Delivered'
  items               JSONB NOT NULL DEFAULT '[]',   -- JSON list of order items
  emails_sent         BOOLEAN[] DEFAULT '{false, false, false}', -- 3 email dots
  razorpay_payment_id TEXT,                          -- Razorpay payment ID returned on success
  razorpay_order_id   TEXT,                          -- Razorpay order ID
  razorpay_signature  TEXT,                          -- Razorpay signature
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public storefront can place orders
CREATE POLICY "public_insert_orders"
  ON orders FOR INSERT WITH CHECK (true);

-- Public storefront can query their order status by matching details
CREATE POLICY "public_select_orders"
  ON orders FOR SELECT USING (true);

-- Admin gets full access to read/write/update orders
CREATE POLICY "admin_all_orders"
  ON orders FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Analytics Tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS analytics (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type  TEXT NOT NULL, -- 'page_view' or 'click'
  path        TEXT NOT NULL, -- e.g., '/shop', '/checkout', or button text/ID
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Public storefront can insert analytics events
CREATE POLICY "public_insert_analytics"
  ON analytics FOR INSERT WITH CHECK (true);

-- Admin gets full access to read analytics
CREATE POLICY "admin_all_analytics"
  ON analytics FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Store Locator
-- ============================================================

CREATE TABLE IF NOT EXISTS stores (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  type            TEXT NOT NULL DEFAULT 'Official Store', -- 'Official Store' or 'Store Partner'
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  postal_code     TEXT NOT NULL,
  phone           TEXT,
  map_link        TEXT NOT NULL, -- Direct Google Maps share link
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_stores_updated_at
  BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Public storefront can read active stores
CREATE POLICY "public_read_active_stores"
  ON stores FOR SELECT USING (is_active = true);

-- Admin gets full access to read/write/update/delete stores
CREATE POLICY "admin_all_stores"
  ON stores FOR ALL USING (auth.role() = 'authenticated');

-- Seed: Sample stores
INSERT INTO stores (name, type, address, city, state, postal_code, phone, map_link, is_active)
VALUES
  (
    'Kenwell Flagship Store - Bandra',
    'Official Store',
    'Ground Floor, Hill Road, Bandra West, Mumbai',
    'Mumbai',
    'Maharashtra',
    '400050',
    '+91 98765 43210',
    'https://maps.google.com/?q=Hill+Road+Bandra+West+Mumbai',
    true
  ),
  (
    'Guardian Health & Nutrition - Connaught Place',
    'Store Partner',
    'Shop No. 12, Block E, Connaught Place, New Delhi',
    'New Delhi',
    'Delhi',
    '110001',
    '+91 11 2345 6789',
    'https://maps.google.com/?q=Connaught+Place+New+Delhi',
    true
  )
ON CONFLICT DO NOTHING;

-- ============================================================
-- Partner Inquiries
-- ============================================================

CREATE TABLE IF NOT EXISTS partner_inquiries (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name      TEXT NOT NULL,
  contact_name    TEXT NOT NULL,
  email           TEXT NOT NULL,
  phone           TEXT NOT NULL,
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  state           TEXT NOT NULL,
  postal_code     TEXT NOT NULL,
  message         TEXT,
  status          TEXT NOT NULL DEFAULT 'New', -- 'New', 'Contacted', 'Archived'
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_partner_inquiries_updated_at
  BEFORE UPDATE ON partner_inquiries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE partner_inquiries ENABLE ROW LEVEL SECURITY;

-- Public storefront can insert partner inquiries
CREATE POLICY "public_insert_partner_inquiries"
  ON partner_inquiries FOR INSERT WITH CHECK (true);

-- Admin gets full access to read/write/update/delete inquiries
CREATE POLICY "admin_all_partner_inquiries"
  ON partner_inquiries FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Products: rich content columns (migration from src/data.js)
-- ============================================================

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS series               TEXT,   -- "Core Series" | "Wellness Series" | "Liposomal Series" | "Performance Series"
  ADD COLUMN IF NOT EXISTS form                  TEXT,   -- "Tablets" | "Softgels" | "Capsules"
  ADD COLUMN IF NOT EXISTS servings              INTEGER,
  ADD COLUMN IF NOT EXISTS tagline               TEXT,
  ADD COLUMN IF NOT EXISTS health_goals          TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS benefits              TEXT[]  DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS accent_color          TEXT,
  ADD COLUMN IF NOT EXISTS how_to_use            JSONB   DEFAULT '{}'::jsonb,  -- { dosage, timing, stacking, warnings }
  ADD COLUMN IF NOT EXISTS nutritional_facts     JSONB   DEFAULT '{}'::jsonb,  -- { servingSize, servingsPerContainer, headers:[a,b], ingredients:[{name,amount,dv}] }
  ADD COLUMN IF NOT EXISTS science_text          TEXT;

-- ============================================================
-- Stacks (product bundles/combos)
-- ============================================================

CREATE TABLE IF NOT EXISTS stacks (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name            TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT,
  tagline         TEXT,
  badge           TEXT,
  focus           TEXT[]  DEFAULT '{}',
  synergy         TEXT,
  schedule        JSONB   DEFAULT '{}'::jsonb,  -- { morning, afternoon, evening }
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Which products belong to a stack, in what order, and at what
-- discounted per-unit price when bought as part of the combo.
CREATE TABLE IF NOT EXISTS stack_products (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stack_id          UUID NOT NULL REFERENCES stacks(id) ON DELETE CASCADE,
  product_id        UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  discounted_price  DECIMAL(10,2),  -- NULL => no override, use product.price
  sort_order        INTEGER NOT NULL DEFAULT 0,
  UNIQUE (stack_id, product_id)
);

CREATE OR REPLACE TRIGGER trg_stacks_updated_at
  BEFORE UPDATE ON stacks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE stacks          ENABLE ROW LEVEL SECURITY;
ALTER TABLE stack_products  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_active_stacks" ON stacks FOR SELECT USING (is_active = true);
CREATE POLICY "admin_all_stacks" ON stacks FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "public_read_stack_products" ON stack_products FOR SELECT USING (true);
CREATE POLICY "admin_all_stack_products" ON stack_products FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Product Authenticity Verification
-- ============================================================

CREATE TABLE IF NOT EXISTS auth_code_batches (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label         TEXT NOT NULL,                    -- e.g. "First Batch — July 2026"
  sku_plan      JSONB NOT NULL DEFAULT '[]'::jsonb, -- [{ product_id, quantity }, ...] requested
  status        TEXT NOT NULL DEFAULT 'in_progress', -- 'in_progress' | 'completed'
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_auth_codes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code          TEXT UNIQUE NOT NULL,              -- e.g. "7K4M-9XQP-R2"
  product_id    UUID REFERENCES products(id) ON DELETE SET NULL,
  batch_id      UUID REFERENCES auth_code_batches(id) ON DELETE SET NULL,
  verified_at   TIMESTAMPTZ,                       -- NULL = not yet verified
  verify_count  INTEGER NOT NULL DEFAULT 0,         -- total scans, for future fraud-signal review
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_auth_codes_batch_product
  ON product_auth_codes(batch_id, product_id);

CREATE OR REPLACE TRIGGER trg_auth_code_batches_updated_at
  BEFORE UPDATE ON auth_code_batches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE auth_code_batches   ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_auth_codes  ENABLE ROW LEVEL SECURITY;

-- Admin only — no public policy on either table. Public interacts
-- exclusively through verify_product_code() below.
CREATE POLICY "admin_all_auth_code_batches" ON auth_code_batches
  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_product_auth_codes" ON product_auth_codes
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Verification RPC — the only public entry point.
-- SECURITY DEFINER lets it bypass RLS internally; the function
-- itself only ever returns a status + product name/image, never
-- raw rows, and only mutates the single matched row.
-- ============================================================

CREATE OR REPLACE FUNCTION verify_product_code(p_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row product_auth_codes%ROWTYPE;
  v_product products%ROWTYPE;
BEGIN
  SELECT * INTO v_row FROM product_auth_codes WHERE code = upper(trim(p_code));

  IF NOT FOUND THEN
    RETURN jsonb_build_object('status', 'invalid');
  END IF;

  SELECT * INTO v_product FROM products WHERE id = v_row.product_id;

  IF v_row.verified_at IS NULL THEN
    UPDATE product_auth_codes
      SET verified_at = NOW(), verify_count = verify_count + 1
      WHERE id = v_row.id
      RETURNING * INTO v_row;

    RETURN jsonb_build_object(
      'status', 'first_verification',
      'verified_at', v_row.verified_at,
      'product_name', v_product.name,
      'product_image', v_product.images[1]
    );
  ELSE
    UPDATE product_auth_codes
      SET verify_count = verify_count + 1
      WHERE id = v_row.id;

    RETURN jsonb_build_object(
      'status', 'already_verified',
      'verified_at', v_row.verified_at,
      'product_name', v_product.name,
      'product_image', v_product.images[1]
    );
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION verify_product_code(TEXT) TO anon, authenticated;

-- ============================================================
-- Per-product generated vs. verified rollup, for the admin
-- dashboard. Admin-only — same lockdown philosophy as the
-- underlying tables (invoker-rights view, so RLS on
-- product_auth_codes still applies per-caller; explicitly
-- revoked from anon as a second layer of defense).
-- ============================================================

CREATE OR REPLACE VIEW product_auth_code_stats AS
SELECT
  p.id                AS product_id,
  p.name              AS product_name,
  p.slug              AS product_slug,
  COUNT(pac.id)                                              AS total_codes,
  COUNT(pac.id) FILTER (WHERE pac.verified_at IS NOT NULL)   AS verified_codes
FROM products p
LEFT JOIN product_auth_codes pac ON pac.product_id = p.id
GROUP BY p.id, p.name, p.slug;

REVOKE ALL ON product_auth_code_stats FROM anon;
GRANT SELECT ON product_auth_code_stats TO authenticated;

-- ============================================================
-- UGC Videos: link testimonials to a real product (for product
-- page video sections), alongside the existing free-text tag.
-- ============================================================

ALTER TABLE ugc_videos
  ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES products(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_ugc_videos_product ON ugc_videos(product_id);
-- ============================================================
-- Rich Product Content (series, tagline, benefits, how_to_use,
-- nutritional_facts, science_text, health_goals, accent_color)
--
-- The ALTER TABLE columns above create the structure.
-- To populate data for all 17 products, run the separate file:
--   supabase/migration_product_rich_content.sql
-- ============================================================

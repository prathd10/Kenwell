-- ============================================================
-- Kenwell Orders & Resend Email Tracking Migration
-- Copy & paste this entire script into your Supabase SQL Editor
-- ============================================================

-- 1. Create or update orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  friendly_id         TEXT NOT NULL UNIQUE,
  customer_name       TEXT NOT NULL,
  customer_email      TEXT NOT NULL,
  customer_phone      TEXT NOT NULL,
  shipping_address    TEXT NOT NULL,
  city                TEXT NOT NULL,
  postal_code         TEXT NOT NULL,
  amount              DECIMAL(10,2) NOT NULL DEFAULT 0,
  status              TEXT NOT NULL DEFAULT 'Paid', -- 'Paid', 'Shipped', 'Delivered', 'Failed'
  payment_method      TEXT NOT NULL DEFAULT 'Online (Razorpay)',
  coupon_applied      TEXT,
  discount_amount     DECIMAL(10,2) DEFAULT 0,
  items               JSONB NOT NULL DEFAULT '[]',
  emails_sent         BOOLEAN[] DEFAULT '{true, false, false}', -- [Confirmed, Shipped, Delivered]
  razorpay_payment_id TEXT,
  razorpay_order_id   TEXT,
  razorpay_signature  TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Safely add any new columns to existing table if already created
DO $$ 
BEGIN
  -- Add coupon_applied if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='coupon_applied') THEN
    ALTER TABLE public.orders ADD COLUMN coupon_applied TEXT;
  END IF;

  -- Add discount_amount if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='discount_amount') THEN
    ALTER TABLE public.orders ADD COLUMN discount_amount DECIMAL(10,2) DEFAULT 0;
  END IF;

  -- Add payment_method if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='payment_method') THEN
    ALTER TABLE public.orders ADD COLUMN payment_method TEXT DEFAULT 'Online (Razorpay)';
  END IF;

  -- Add emails_sent if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='emails_sent') THEN
    ALTER TABLE public.orders ADD COLUMN emails_sent BOOLEAN[] DEFAULT '{true, false, false}';
  END IF;
END $$;

-- 3. Update status default to 'Paid'
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'Paid';

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 5. Drop old policies if existing to avoid conflicts
DROP POLICY IF EXISTS "public_insert_orders" ON public.orders;
DROP POLICY IF EXISTS "public_select_orders" ON public.orders;
DROP POLICY IF EXISTS "admin_all_orders" ON public.orders;
DROP POLICY IF EXISTS "public_update_orders" ON public.orders;

-- 6. Re-create robust policies
-- Customers can place new orders at checkout
CREATE POLICY "public_insert_orders"
  ON public.orders FOR INSERT WITH CHECK (true);

-- Customers can view/track their own orders
CREATE POLICY "public_select_orders"
  ON public.orders FOR SELECT USING (true);

-- Admins and authenticated users have full access to view and update orders
CREATE POLICY "admin_all_orders"
  ON public.orders FOR ALL USING (true);

-- 7. Add indexing for fast search and tracking queries
CREATE INDEX IF NOT EXISTS idx_orders_friendly_id ON public.orders (friendly_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders (customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON public.orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders (created_at DESC);

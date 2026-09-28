-- ============================================================
--  BOOK HAVEN - Supabase Database Setup
--  Run this SQL in your Supabase SQL Editor
--  URL: https://supabase.com/dashboard/project/oufwwythfrmpyudqbcdt/sql
-- ============================================================

-- 1. BOOKS TABLE
CREATE TABLE IF NOT EXISTS books (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  author          TEXT,
  category        TEXT DEFAULT 'General',
  price           NUMERIC(10,2) NOT NULL DEFAULT 0,
  stock           INTEGER NOT NULL DEFAULT 0,
  isbn            TEXT,
  publisher       TEXT,
  pages           INTEGER,
  cover_image     TEXT,
  description     TEXT,
  is_featured     BOOLEAN DEFAULT false,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name     TEXT NOT NULL,
  customer_email    TEXT,
  customer_phone    TEXT,
  customer_address  TEXT,
  customer_city     TEXT,
  payment_method    TEXT DEFAULT 'cod',
  notes             TEXT,
  subtotal          NUMERIC(10,2) DEFAULT 0,
  shipping_fee      NUMERIC(10,2) DEFAULT 0,
  total_amount      NUMERIC(10,2) NOT NULL DEFAULT 0,
  status            TEXT DEFAULT 'pending',
  items_count       INTEGER DEFAULT 0,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

-- 3. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID REFERENCES orders(id) ON DELETE CASCADE,
  book_id     UUID REFERENCES books(id) ON DELETE SET NULL,
  book_title  TEXT,
  book_author TEXT,
  quantity    INTEGER NOT NULL DEFAULT 1,
  unit_price  NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 4. AUTO UPDATE updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. DECREMENT STOCK FUNCTION (called after order)
CREATE OR REPLACE FUNCTION decrement_stock(book_id UUID, qty INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE books
  SET stock = GREATEST(0, stock - qty)
  WHERE id = book_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. ROW LEVEL SECURITY (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Public can read active books
CREATE POLICY "Public can read active books"
  ON books FOR SELECT
  USING (is_active = true);

-- Authenticated admin can do everything with books
CREATE POLICY "Admin full access to books"
  ON books FOR ALL
  USING (auth.role() = 'authenticated');

-- Anyone can insert orders (customers placing orders)
CREATE POLICY "Anyone can place orders"
  ON orders FOR INSERT
  WITH CHECK (true);

-- Anyone can insert order items
CREATE POLICY "Anyone can insert order items"
  ON order_items FOR INSERT
  WITH CHECK (true);

-- Only authenticated can read/update orders
CREATE POLICY "Admin can read orders"
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can update orders"
  ON orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Admin can read order items
CREATE POLICY "Admin can read order items"
  ON order_items FOR SELECT
  USING (auth.role() = 'authenticated');

-- 7. SAMPLE BOOKS DATA (optional - for testing)
INSERT INTO books (title, author, category, price, stock, description, is_featured, is_active) VALUES
  ('Alchemist', 'Paulo Coelho', 'Fiction', 850, 50, 'A magical story of a young shepherd who travels from his homeland in Spain to the Egyptian desert in search of a treasure buried in the Pyramids.', true, true),
  ('Sapiens', 'Yuval Noah Harari', 'Non-Fiction', 1200, 30, 'A brief history of humankind from the Stone Age to the twenty-first century.', true, true),
  ('Quran Majeed Tarjuma', 'Allah Ta''ala', 'Religion', 600, 100, 'Holy Quran with Urdu translation - Pakistan Edition.', true, true),
  ('Atomic Habits', 'James Clear', 'Self-Help', 1100, 40, 'An easy and proven way to build good habits and break bad ones.', true, true),
  ('Rich Dad Poor Dad', 'Robert Kiyosaki', 'Business', 750, 60, 'What the rich teach their kids about money that the poor and middle class do not!', true, true),
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 550, 35, 'A story of wealth, love, and the American Dream set in the 1920s.', false, true),
  ('A Brief History of Time', 'Stephen Hawking', 'Science', 900, 25, 'A landmark volume in science writing by one of the great minds of our time.', false, true),
  ('Harry Potter - Philosopher Stone', 'J.K. Rowling', 'Fiction', 800, 45, 'The first book in the magical Harry Potter series.', true, true)
ON CONFLICT DO NOTHING;

-- ============================================================
-- DONE! Your database is ready.
-- Now create an admin account at:
-- https://supabase.com/dashboard/project/oufwwythfrmpyudqbcdt/auth/users
-- Click "Invite User" and enter your admin email
-- ============================================================

-- =============================================================================
-- Confido Design Challenge — Supabase Schema + Seed Data
-- Run this in the Supabase SQL Editor for your project.
-- Table names and column names mirror the Confido production schema.
-- =============================================================================

-- ── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id              BIGSERIAL PRIMARY KEY,
  name            TEXT NOT NULL,
  sku             TEXT UNIQUE NOT NULL,       -- maps to internal_item_number in production
  product_family  TEXT,                       -- denormalized for simplicity; production uses product_family_id FK
  is_sellable     BOOLEAN NOT NULL DEFAULT true,
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mirrors production table name: product_prices
CREATE TABLE IF NOT EXISTS product_prices (
  id              BIGSERIAL PRIMARY KEY,
  product_id      BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  amount          NUMERIC(10, 2) NOT NULL,
  effective_at    DATE NOT NULL,              -- matches production column name
  notes           TEXT,
  is_deleted      BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Mirrors production index: product + effective_at lookup
CREATE INDEX IF NOT EXISTS idx_product_prices_lookup
  ON product_prices (product_id, effective_at)
  WHERE is_deleted = false;

-- ── Row Level Security ────────────────────────────────────────────────────────
-- Disabled for the challenge so the anon key can read/write freely.

ALTER TABLE products       DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices DISABLE ROW LEVEL SECURITY;

-- ── Helper: updated_at trigger ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_product_prices_updated_at ON product_prices;
CREATE TRIGGER set_product_prices_updated_at
  BEFORE UPDATE ON product_prices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Seed: Products ────────────────────────────────────────────────────────────

INSERT INTO products (id, name, sku, product_family, is_sellable) VALUES
  -- Beverages
  (1,  'Sparkling Water 12-pack',     'BEV-001', 'Beverages',   true),
  (2,  'Cola Classic 12-pack',        'BEV-002', 'Beverages',   true),
  (3,  'Diet Cola 12-pack',           'BEV-003', 'Beverages',   true),
  (4,  'Lemon Sparkling Water 6-pack','BEV-004', 'Beverages',   true),
  (5,  'Green Tea RTD 4-pack',        'BEV-005', 'Beverages',   true),
  (6,  'Energy Boost 4-pack',         'BEV-006', 'Beverages',   true),
  -- Snacks
  (7,  'Granola Bar 6-count',         'SNK-001', 'Snacks',      true),
  (8,  'Trail Mix 6oz',               'SNK-002', 'Snacks',      true),
  (9,  'Salted Pretzels 10oz',        'SNK-003', 'Snacks',      true),
  (10, 'Cheddar Crackers 8oz',        'SNK-004', 'Snacks',      true),
  (11, 'Sea Salt Popcorn 4oz',        'SNK-005', 'Snacks',      false),  -- discontinued
  -- Frozen
  (12, 'Margherita Pizza 12"',        'FRZ-001', 'Frozen',      true),
  (13, 'Burrito Pack 6-count',        'FRZ-002', 'Frozen',      true),
  (14, 'Vanilla Ice Cream 1.5qt',     'FRZ-003', 'Frozen',      true),
  (15, 'Buttermilk Waffles 8-count',  'FRZ-004', 'Frozen',      true),
  -- Condiments
  (16, 'Classic Ketchup 32oz',        'CON-001', 'Condiments',  true),
  (17, 'Yellow Mustard 12oz',         'CON-002', 'Condiments',  true),
  (18, 'BBQ Sauce Original 18oz',     'CON-003', 'Condiments',  true),
  (19, 'Hot Sauce 5oz',               'CON-004', 'Condiments',  true),
  (20, 'Ranch Dressing 16oz',         'CON-005', 'Condiments',  true),
  -- Dairy
  (21, 'Whole Milk 1 Gallon',         'DAI-001', 'Dairy',       true),
  (22, 'Sharp Cheddar 8oz',           'DAI-002', 'Dairy',       true),
  (23, 'Greek Yogurt 32oz',           'DAI-003', 'Dairy',       true),
  (24, 'Unsalted Butter 1lb',         'DAI-004', 'Dairy',       true),
  (25, 'Cream Cheese 8oz',            'DAI-005', 'Dairy',       true)
ON CONFLICT (id) DO NOTHING;

-- Keep the sequence in sync after explicit ID inserts
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- ── Seed: Product Prices ──────────────────────────────────────────────────────
-- effective_at mirrors the production column name.
-- Dates span 2025–2026; several products have a future-dated scheduled change.

INSERT INTO product_prices (product_id, amount, effective_at, notes) VALUES
  -- BEV-001 Sparkling Water
  (1,  8.99,  '2025-01-01', 'Initial price'),
  (1,  9.49,  '2025-07-01', 'Mid-year adjustment'),
  (1,  9.99,  '2026-01-01', 'Annual price review'),
  (1,  10.49, '2026-07-01', 'Scheduled increase'),
  -- BEV-002 Cola Classic
  (2,  7.99,  '2025-01-01', 'Initial price'),
  (2,  8.49,  '2026-01-01', 'Annual review'),
  -- BEV-003 Diet Cola
  (3,  7.99,  '2025-01-01', 'Initial price'),
  (3,  8.49,  '2026-01-01', 'Annual review'),
  (3,  8.99,  '2026-10-01', 'Q4 adjustment'),
  -- BEV-004 Lemon Sparkling
  (4,  6.49,  '2025-03-01', 'Launch price'),
  (4,  6.99,  '2026-01-01', 'Annual review'),
  -- BEV-005 Green Tea RTD
  (5,  9.99,  '2025-01-01', 'Initial price'),
  (5,  10.49, '2026-04-01', 'Cost pass-through'),
  -- BEV-006 Energy Boost
  (6,  12.99, '2025-01-01', 'Initial price'),
  (6,  13.49, '2025-10-01', 'Q4 adjustment'),
  (6,  13.99, '2026-01-01', 'Annual review'),
  (6,  14.99, '2026-07-01', 'Scheduled increase'),
  -- SNK-001 Granola Bar
  (7,  5.49,  '2025-01-01', 'Initial price'),
  (7,  5.99,  '2026-01-01', 'Annual review'),
  -- SNK-002 Trail Mix
  (8,  6.99,  '2025-01-01', 'Initial price'),
  (8,  7.29,  '2025-09-01', 'Nut cost increase'),
  (8,  7.49,  '2026-01-01', 'Annual review'),
  -- SNK-003 Pretzels
  (9,  3.99,  '2025-01-01', 'Initial price'),
  (9,  4.29,  '2026-01-01', 'Annual review'),
  (9,  4.49,  '2026-09-01', 'Scheduled increase'),
  -- SNK-004 Cheddar Crackers
  (10, 4.49,  '2025-01-01', 'Initial price'),
  (10, 4.79,  '2026-01-01', 'Annual review'),
  -- SNK-005 Popcorn (not sellable — still has price history)
  (11, 3.49,  '2025-01-01', 'Initial price'),
  (11, 3.79,  '2026-01-01', 'Final price before discontinue'),
  -- FRZ-001 Margherita Pizza
  (12, 8.99,  '2025-01-01', 'Initial price'),
  (12, 9.49,  '2025-06-01', 'Ingredient adjustment'),
  (12, 9.99,  '2026-01-01', 'Annual review'),
  -- FRZ-002 Burrito Pack
  (13, 11.99, '2025-01-01', 'Initial price'),
  (13, 12.49, '2026-01-01', 'Annual review'),
  (13, 12.99, '2026-08-01', 'Scheduled increase'),
  -- FRZ-003 Ice Cream
  (14, 6.99,  '2025-01-01', 'Initial price'),
  (14, 7.49,  '2025-05-01', 'Summer adjustment'),
  (14, 7.99,  '2026-01-01', 'Annual review'),
  -- FRZ-004 Waffles
  (15, 4.99,  '2025-01-01', 'Initial price'),
  (15, 5.29,  '2026-01-01', 'Annual review'),
  -- CON-001 Ketchup
  (16, 4.29,  '2025-01-01', 'Initial price'),
  (16, 4.49,  '2026-01-01', 'Annual review'),
  -- CON-002 Mustard
  (17, 2.99,  '2025-01-01', 'Initial price'),
  (17, 3.19,  '2026-01-01', 'Annual review'),
  (17, 3.39,  '2026-07-01', 'Scheduled increase'),
  -- CON-003 BBQ Sauce
  (18, 4.99,  '2025-01-01', 'Initial price'),
  (18, 5.29,  '2025-08-01', 'Tomato cost increase'),
  (18, 5.49,  '2026-01-01', 'Annual review'),
  -- CON-004 Hot Sauce
  (19, 3.49,  '2025-01-01', 'Initial price'),
  (19, 3.69,  '2026-01-01', 'Annual review'),
  -- CON-005 Ranch Dressing
  (20, 4.79,  '2025-01-01', 'Initial price'),
  (20, 4.99,  '2026-01-01', 'Annual review'),
  (20, 5.49,  '2026-10-01', 'Scheduled increase'),
  -- DAI-001 Whole Milk
  (21, 5.49,  '2025-01-01', 'Initial price'),
  (21, 5.29,  '2025-04-01', 'Seasonal decrease'),
  (21, 5.99,  '2025-10-01', 'Fall adjustment'),
  (21, 6.19,  '2026-01-01', 'Annual review'),
  -- DAI-002 Cheddar Cheese
  (22, 6.99,  '2025-01-01', 'Initial price'),
  (22, 7.49,  '2026-01-01', 'Annual review'),
  -- DAI-003 Greek Yogurt
  (23, 8.49,  '2025-01-01', 'Initial price'),
  (23, 8.99,  '2026-01-01', 'Annual review'),
  (23, 9.49,  '2026-09-01', 'Scheduled increase'),
  -- DAI-004 Butter
  (24, 7.99,  '2025-01-01', 'Initial price'),
  (24, 6.99,  '2025-05-01', 'Price decrease'),
  (24, 7.49,  '2026-01-01', 'Annual review'),
  -- DAI-005 Cream Cheese
  (25, 4.49,  '2025-01-01', 'Initial price'),
  (25, 4.79,  '2026-01-01', 'Annual review')
ON CONFLICT DO NOTHING;

SELECT setval('product_prices_id_seq', (SELECT MAX(id) FROM product_prices));

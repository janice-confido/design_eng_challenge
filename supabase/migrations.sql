-- =============================================================================
-- Design Challenge — migrations
-- Run this in the Supabase SQL Editor AFTER the base schema + seed has been applied.
-- Compatible with the existing products / product_prices setup.
-- =============================================================================

-- ── Lookup tables: customers, distribution_centers, planning_groups ───────────
-- Mirrors production global_customers, distribution_centers, planning_groups.
-- Dropdowns fetch from these via useFetchCustomers / useFetchDistributionCenters
-- / useFetchPlanningGroups hooks, replacing the static seed arrays.

CREATE TABLE IF NOT EXISTS customers (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT    NOT NULL,
  is_direct   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS distribution_centers (
  id          BIGSERIAL PRIMARY KEY,
  customer_id BIGINT  NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name        TEXT    NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE distribution_centers DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS planning_groups (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT    NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE planning_groups DISABLE ROW LEVEL SECURITY;

-- ── Seed: customers ───────────────────────────────────────────────────────────
INSERT INTO customers (id, name, is_direct) VALUES
  (1, 'UNFI',                        false),
  (2, 'KeHE',                        false),
  (3, 'C&S Wholesale',               false),
  (4, 'Dot Foods',                   false),
  (5, 'McLane',                      false),
  (6, 'Associated Wholesale Grocers', false),
  (7, 'Direct',                      true)
ON CONFLICT (id) DO NOTHING;
SELECT setval('customers_id_seq', (SELECT MAX(id) FROM customers));

-- ── Seed: distribution_centers ───────────────────────────────────────────────
-- Unique index (IF NOT EXISTS supported) so ON CONFLICT is idempotent
CREATE UNIQUE INDEX IF NOT EXISTS idx_distribution_centers_unique
  ON distribution_centers (customer_id, name);

INSERT INTO distribution_centers (customer_id, name) VALUES
  (1, 'UNFI - East (Chesterfield, NH)'),
  (1, 'UNFI - Southeast (Sarasota, FL)'),
  (1, 'UNFI - Midwest (Iowa City, IA)'),
  (1, 'UNFI - West (Auburn, WA)'),
  (2, 'KeHE - Romeoville, IL'),
  (2, 'KeHE - Douglasville, GA'),
  (2, 'KeHE - Brighton, CO'),
  (2, 'KeHE - Stockton, CA'),
  (3, 'C&S - Keene, NH'),
  (3, 'C&S - York, PA'),
  (4, 'Dot Foods - Mt. Sterling, IL'),
  (4, 'Dot Foods - Modesto, CA'),
  (5, 'McLane - Temple, TX'),
  (5, 'McLane - Northfield, MN')
ON CONFLICT (customer_id, name) DO NOTHING;

-- ── Seed: planning_groups ─────────────────────────────────────────────────────
INSERT INTO planning_groups (id, name) VALUES
  (1,  'Whole Foods Market'),
  (2,  'Sprouts Farmers Market'),
  (3,  'Harris Teeter'),
  (4,  'Kroger'),
  (5,  'Safeway / Albertsons'),
  (6,  'Wegmans'),
  (7,  'Target'),
  (8,  'Walmart'),
  (9,  'Costco'),
  (10, 'AHOLD Giant Carlisle')
ON CONFLICT (id) DO NOTHING;
SELECT setval('planning_groups_id_seq', (SELECT MAX(id) FROM planning_groups));

-- ── Add customer + distribution_center to product_prices ─────────────────────
-- Mirrors production: product_prices.globalCustomer + distributionCenter
ALTER TABLE product_prices ADD COLUMN IF NOT EXISTS customer              TEXT;
ALTER TABLE product_prices ADD COLUMN IF NOT EXISTS distribution_center   TEXT;

-- ── Add UPC column to products ───────────────────────────────────────────────
-- Mirrors production: products.UPC (12-digit barcode string, optional)
ALTER TABLE products ADD COLUMN IF NOT EXISTS upc TEXT;

-- ── Add is_pack + lifecycle_stage to products ─────────────────────────────────
-- Mirrors production: products.isPack + products.lifecycleStage
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_pack          BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS lifecycle_stage  TEXT    NOT NULL DEFAULT 'Active';

-- Seed lifecycle_stage for existing rows (all default to Active)
UPDATE products SET lifecycle_stage = 'Active' WHERE lifecycle_stage IS NULL;

-- ── retailer_prices ──────────────────────────────────────────────────────────
-- Mirrors production retailer/customer pricing (simplified for challenge scope).
--   planning_group → retailer / chain (e.g. "Harris Teeter")
--   customer       → distributor      (e.g. "UNFI", "KeHE")
--   case_name      → product / case description
--   price          → dollar amount

CREATE TABLE IF NOT EXISTS retailer_prices (
  id              BIGSERIAL PRIMARY KEY,
  planning_group  TEXT           NOT NULL,
  customer        TEXT           NOT NULL,
  case_name       TEXT           NOT NULL,
  price           NUMERIC(10, 2) NOT NULL,
  is_deleted      BOOLEAN        NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- RLS off — matches the existing products / product_prices policy
ALTER TABLE retailer_prices DISABLE ROW LEVEL SECURITY;

-- Reuse the existing set_updated_at trigger function (already defined in base schema)
DROP TRIGGER IF EXISTS set_retailer_prices_updated_at ON retailer_prices;
CREATE TRIGGER set_retailer_prices_updated_at
  BEFORE UPDATE ON retailer_prices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Seed ─────────────────────────────────────────────────────────────────────
-- Unique index so re-runs are idempotent
CREATE UNIQUE INDEX IF NOT EXISTS idx_retailer_prices_unique
  ON retailer_prices (planning_group, customer, case_name);

INSERT INTO retailer_prices (planning_group, customer, case_name, price) VALUES
  ('Harris Teeter',         'UNFI',  'Sparkling Water 12-pack (case)',     38.00),
  ('Harris Teeter',         'UNFI',  'Cola Classic 12-pack (case)',         36.00),
  ('Sprouts Farmers Market','KeHE',  'Granola Bar 6-count (case)',          29.00),
  ('Sprouts Farmers Market','KeHE',  'Greek Yogurt 32oz (case)',            29.00),
  ('Sprouts Farmers Market','KeHE',  'Cheddar Crackers 8oz (case)',         29.00),
  ('Sprouts Farmers Market','KeHE',  'Salted Pretzels 10oz (case)',         29.00),
  ('Whole Foods Market',    'UNFI',  'Energy Boost 4-pack (case)',          52.00),
  ('Whole Foods Market',    'UNFI',  'Green Tea RTD 4-pack (case)',         42.00),
  ('Kroger',                'KeHE',  'BBQ Sauce Original 18oz (case)',      19.99),
  ('Kroger',                'KeHE',  'Ranch Dressing 16oz (case)',          22.50)
ON CONFLICT (planning_group, customer, case_name) DO NOTHING;

-- ── Backfill: UPC values for seeded products ─────────────────────────────────
-- Products were seeded before the upc column existed; update them now.
UPDATE products SET upc = CASE sku
  WHEN 'BEV-001' THEN '012000001765'
  WHEN 'BEV-002' THEN '049000042511'
  WHEN 'BEV-003' THEN '049000028904'
  WHEN 'BEV-004' THEN '012000006791'
  WHEN 'BEV-005' THEN '085200300346'
  WHEN 'BEV-006' THEN '611269990057'
  WHEN 'SNK-001' THEN '016000275287'
  WHEN 'SNK-002' THEN '021130501144'
  WHEN 'SNK-003' THEN '028400090315'
  WHEN 'SNK-004' THEN '044000031435'
  WHEN 'SNK-005' THEN '028400589192'
  WHEN 'FRZ-001' THEN '071921501272'
  WHEN 'FRZ-002' THEN '031000660055'
  WHEN 'FRZ-003' THEN '070640010258'
  WHEN 'FRZ-004' THEN '043000209752'
  WHEN 'CON-001' THEN '013000006002'
  WHEN 'CON-002' THEN '013000007191'
  WHEN 'CON-003' THEN '054100042011'
  WHEN 'CON-004' THEN '017500003131'
  WHEN 'CON-005' THEN '077661050502'
  WHEN 'DAI-001' THEN '041130302795'
  WHEN 'DAI-002' THEN '021000011353'
  WHEN 'DAI-003' THEN '036632025784'
  WHEN 'DAI-004' THEN '070882401001'
  WHEN 'DAI-005' THEN '021000056980'
END
WHERE upc IS NULL;

-- ── Backfill: customer + DC on product_prices ─────────────────────────────────
-- Assign distributor relationships to a representative subset of price records.
-- Uses UPDATE so re-runs are idempotent (only sets NULL rows).
UPDATE product_prices SET
  customer            = 'UNFI',
  distribution_center = 'UNFI - East (Chesterfield, NH)'
WHERE customer IS NULL
  AND product_id IN (
    SELECT id FROM products WHERE sku IN ('BEV-001','BEV-002','CON-001','CON-003','DAI-002','DAI-003')
  );

UPDATE product_prices SET
  customer            = 'KeHE',
  distribution_center = 'KeHE - Romeoville, IL'
WHERE customer IS NULL
  AND product_id IN (
    SELECT id FROM products WHERE sku IN ('SNK-001','SNK-003','SNK-004','FRZ-001','FRZ-002','CON-005')
  );

UPDATE product_prices SET
  customer            = 'UNFI',
  distribution_center = 'UNFI - West (Auburn, WA)'
WHERE customer IS NULL
  AND product_id IN (
    SELECT id FROM products WHERE sku IN ('BEV-005','BEV-006','DAI-004','DAI-005')
  );

UPDATE product_prices SET
  customer            = 'KeHE',
  distribution_center = 'KeHE - Douglasville, GA'
WHERE customer IS NULL
  AND product_id IN (
    SELECT id FROM products WHERE sku IN ('BEV-003','BEV-004','SNK-002','SNK-005','FRZ-003','FRZ-004','DAI-001')
  );

UPDATE product_prices SET
  customer            = 'UNFI',
  distribution_center = 'UNFI - Midwest (Iowa City, IA)'
WHERE customer IS NULL
  AND product_id IN (
    SELECT id FROM products WHERE sku IN ('CON-002','CON-004')
  );

-- Catch-all: any remaining NULL rows get assigned to UNFI East
UPDATE product_prices SET
  customer            = 'UNFI',
  distribution_center = 'UNFI - East (Chesterfield, NH)'
WHERE customer IS NULL;

// ── Core domain types ─────────────────────────────────────────────────────────
// Column names mirror the Confido production schema where possible.

export interface Product {
  id: number
  name: string
  sku: string                   // maps to internal_item_number in production
  product_family: string | null
  is_sellable: boolean
  is_deleted: boolean
  created_at: string
  updated_at: string
}

// Mirrors production table: product_prices
export interface ProductPrice {
  id: number
  product_id: number
  amount: number
  effective_at: string          // ISO date string "YYYY-MM-DD" — matches production column name
  notes: string | null
  is_deleted: boolean
  created_at: string
  updated_at: string
}

// ── Derived / view types ──────────────────────────────────────────────────────

/** Product enriched with its current and next scheduled price — used in the list view. */
export interface ProductWithPricing extends Product {
  current_price: number | null
  next_price: number | null
  next_price_date: string | null
}

// ── Form types ────────────────────────────────────────────────────────────────

export interface ProductFormValues {
  name: string
  sku: string
  product_family: string
  is_sellable: boolean
}

export interface ProductPriceFormValues {
  amount: string        // string so <input type="number"> is easy to control
  effective_at: string
  notes: string
}

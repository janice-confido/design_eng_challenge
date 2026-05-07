// ── Shared dropdown type ────────────────
export interface AutocompleteItem {
  id: string | number
  display: string
}

// ── Core domain types ─────────────────────────────────────────────────────────

export type LifecycleStage = 'Active' | 'Inactive' | 'Pending Launch' | 'Phase Out' | 'Active Seasonal LTO'
export const LIFECYCLE_STAGES: LifecycleStage[] = ['Active', 'Pending Launch', 'Active Seasonal LTO', 'Phase Out', 'Inactive']

export interface Product {
  id: number
  name: string
  sku: string                       // maps to internal_item_number 
  upc: string | null                // Universal Product Code
  product_family: string | null
  is_sellable: boolean
  is_pack: boolean                  
  lifecycle_stage: LifecycleStage  
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export interface ProductPrice {
  id: number
  product_id: number
  amount: number
  effective_at: string          // ISO date string "YYYY-MM-DD" 
  customer: string | null      
  distribution_center: string | null  
  notes: string | null
  is_deleted: boolean
  created_at: string
  updated_at: string
}

/** ProductPrice joined with product name — used in the flat Pricing tab. */
export interface ProductPriceWithProduct extends ProductPrice {
  product_name: string
  product_sku: string
}

export interface RetailerPrice {
  id: number
  planning_group: string
  customer: string
  case_name: string
  price: number
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
  upc: string
  product_family: string
  is_sellable: boolean
  is_pack: boolean
  lifecycle_stage: LifecycleStage
}

export interface ProductPriceFormValues {
  amount: string                          // string so <input type="number"> is easy to control
  effective_at: string
  customer:            AutocompleteItem | null  
  distribution_center: AutocompleteItem | null  
  notes: string
}

export interface PricingFormValues {
  product_id: string                      // string for select control
  amount: string
  effective_at: string
  customer:            AutocompleteItem | null
  distribution_center: AutocompleteItem | null
  notes: string
}

export interface RetailerPriceFormValues {
  planning_group: AutocompleteItem | null  
  customer:       AutocompleteItem | null  
  case_name: string
  price: string
}

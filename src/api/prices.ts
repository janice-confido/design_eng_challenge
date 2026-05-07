/**
 * api/prices.ts
 *
 * Mirrors the apiService pattern used in Confido's production frontend
 * (see web/src/components/Products/Pricing/api.ts).
 * Table name (product_prices) and column names (effective_at) match production.
 */
import { supabase } from '../supabase'
import { ProductPrice, ProductPriceFormValues } from '../types'

/** Fetch all active prices for a product, sorted oldest → newest. */
const getProductPrices = async (productId: number): Promise<ProductPrice[]> => {
  const { data, error } = await supabase
    .from('product_prices')
    .select('*')
    .eq('product_id', productId)
    .eq('is_deleted', false)
    .order('effective_at', { ascending: true })

  if (error) throw error
  return (data ?? []) as ProductPrice[]
}

/** Create a new product price record. */
const createProductPrice = async (
  productId: number,
  values: ProductPriceFormValues
): Promise<ProductPrice> => {
  const { data, error } = await supabase
    .from('product_prices')
    .insert({
      product_id:   productId,
      amount:       parseFloat(values.amount),
      effective_at: values.effective_at,
      notes:        values.notes.trim() || null,
    })
    .select()
    .single()

  if (error) throw error
  return data as ProductPrice
}

/** Update an existing product price record. */
const updateProductPrice = async (
  id: number,
  values: ProductPriceFormValues
): Promise<ProductPrice> => {
  const { data, error } = await supabase
    .from('product_prices')
    .update({
      amount:       parseFloat(values.amount),
      effective_at: values.effective_at,
      notes:        values.notes.trim() || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as ProductPrice
}

/**
 * Soft-delete a product price (sets is_deleted = true).
 * Mirrors production — allows recovery and maintains audit trail.
 */
const deleteProductPrice = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('product_prices')
    .update({ is_deleted: true })
    .eq('id', id)

  if (error) throw error
}

export const apiService = {
  getProductPrices,
  createProductPrice,
  updateProductPrice,
  deleteProductPrice,
}

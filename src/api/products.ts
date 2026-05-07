/**
 * api/products.ts
 *
 * Follows the same apiService export pattern as Confido's production frontend
 * (see web/src/components/Products/api.ts in the main repo).
 *
 * Table name: products

 */
import { supabase } from '../supabase'
import type { Product, ProductFormValues, ProductWithPricing } from '../types'

const TODAY = new Date().toISOString().split('T')[0]

/** Fetch all active products, enriched with current and next scheduled price. */
const getProducts = async (): Promise<ProductWithPricing[]> => {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      product_prices (
        id,
        amount,
        effective_at,
        is_deleted
      )
    `)
    .eq('is_deleted', false)
    .order('name')

  if (error) throw error

  return (data ?? []).map((row) => {
    const allPrices = (
      (row.product_prices ?? []) as { amount: number; effective_at: string; is_deleted: boolean }[]
    )
      .filter((p) => !p.is_deleted)
      .sort((a, b) => a.effective_at.localeCompare(b.effective_at))

    const past   = allPrices.filter((p) => p.effective_at <= TODAY)
    const future = allPrices.filter((p) => p.effective_at >  TODAY)

    const { product_prices: _pp, ...product } = row

    return {
      ...product,
      current_price:   past.length   > 0 ? past[past.length - 1].amount : null,
      next_price:      future.length  > 0 ? future[0].amount             : null,
      next_price_date: future.length  > 0 ? future[0].effective_at       : null,
    } as ProductWithPricing
  })
}

/** Fetch a single active product by ID. */
const getProduct = async (id: number): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_deleted', false)
    .single()

  if (error) throw error
  return data as Product
}

/** Create a new product. */
const createProduct = async (values: ProductFormValues): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .insert({
      name:            values.name.trim(),
      sku:             values.sku.trim().toUpperCase(),
      upc:             values.upc.trim() || null,
      product_family:  values.product_family.trim() || null,
      is_sellable:     values.is_sellable,
      is_pack:         values.is_pack,
      lifecycle_stage: values.lifecycle_stage,
    })
    .select()
    .single()

  if (error) throw error
  return data as Product
}

/** Update an existing product. */
const updateProduct = async (id: number, values: ProductFormValues): Promise<Product> => {
  const { data, error } = await supabase
    .from('products')
    .update({
      name:            values.name.trim(),
      sku:             values.sku.trim().toUpperCase(),
      upc:             values.upc.trim() || null,
      product_family:  values.product_family.trim() || null,
      is_sellable:     values.is_sellable,
      is_pack:         values.is_pack,
      lifecycle_stage: values.lifecycle_stage,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

/**
 * Soft-delete a product (sets is_deleted = true).
 * Mirrors the production pattern — hard deletes are avoided in Confido.
 */
const deleteProduct = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({ is_deleted: true })
    .eq('id', id)

  if (error) throw error
}

const archiveProduct = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({ lifecycle_stage: 'Inactive' })
    .eq('id', id)
  if (error) throw error
}

/** Unarchive a product (restores lifecycle_stage to Active). */
const unarchiveProduct = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('products')
    .update({ lifecycle_stage: 'Active' })
    .eq('id', id)
  if (error) throw error
}

export const apiService = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  archiveProduct,
  unarchiveProduct,
}

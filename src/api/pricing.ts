/**
 * api/pricing.ts — flat cross-product pricing list (Pricing tab).
 */
import { supabase } from '../supabase'
import { ProductPriceWithProduct, PricingFormValues } from '../types'

const getAllPrices = async (): Promise<ProductPriceWithProduct[]> => {
  const { data, error } = await supabase
    .from('product_prices')
    .select(`
      id, product_id, amount, effective_at, customer, distribution_center,
      notes, is_deleted, created_at, updated_at,
      products ( name, sku )
    `)
    .eq('is_deleted', false)
    .order('effective_at', { ascending: true })

  if (error) throw error

  return ((data ?? []) as any[]).map((row) => ({
    id:                  row.id,
    product_id:          row.product_id,
    amount:              row.amount,
    effective_at:        row.effective_at,
    customer:            row.customer,
    distribution_center: row.distribution_center,
    notes:               row.notes,
    is_deleted:          row.is_deleted,
    created_at:          row.created_at,
    updated_at:          row.updated_at,
    product_name:        row.products?.name ?? '—',
    product_sku:         row.products?.sku  ?? '—',
  })) as ProductPriceWithProduct[]
}

const createPrice = async (values: PricingFormValues): Promise<void> => {
  const { error } = await supabase
    .from('product_prices')
    .insert({
      product_id:          parseInt(values.product_id),
      amount:              parseFloat(values.amount),
      effective_at:        values.effective_at,
      customer:            values.customer?.display ?? null,
      distribution_center: values.distribution_center?.display ?? null,
      notes:               values.notes.trim() || null,
    })
  if (error) throw error
}

const updatePrice = async (id: number, values: PricingFormValues): Promise<void> => {
  const { error } = await supabase
    .from('product_prices')
    .update({
      product_id:          parseInt(values.product_id),
      amount:              parseFloat(values.amount),
      effective_at:        values.effective_at,
      customer:            values.customer?.display ?? null,
      distribution_center: values.distribution_center?.display ?? null,
      notes:               values.notes.trim() || null,
    })
    .eq('id', id)
  if (error) throw error
}

const deletePrice = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('product_prices')
    .update({ is_deleted: true })
    .eq('id', id)
  if (error) throw error
}

export const pricingApiService = { getAllPrices, createPrice, updatePrice, deletePrice }

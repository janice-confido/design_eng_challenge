/**
 * api/retailerPrices.ts — retailer/customer pricing (Retailer Pricing tab).
 */
import { supabase } from '../supabase'
import { RetailerPrice, RetailerPriceFormValues } from '../types'

const getAll = async (): Promise<RetailerPrice[]> => {
  const { data, error } = await supabase
    .from('retailer_prices')
    .select('*')
    .eq('is_deleted', false)
    .order('planning_group', { ascending: true })
  if (error) throw error
  return (data ?? []) as RetailerPrice[]
}

const create = async (values: RetailerPriceFormValues): Promise<void> => {
  const { error } = await supabase
    .from('retailer_prices')
    .insert({
      planning_group: values.planning_group?.display ?? '',
      customer:       values.customer?.display ?? '',
      case_name:      values.case_name.trim(),
      price:          parseFloat(values.price),
    })
  if (error) throw error
}

const update = async (id: number, values: RetailerPriceFormValues): Promise<void> => {
  const { error } = await supabase
    .from('retailer_prices')
    .update({
      planning_group: values.planning_group?.display ?? '',
      customer:       values.customer?.display ?? '',
      case_name:      values.case_name.trim(),
      price:          parseFloat(values.price),
    })
    .eq('id', id)
  if (error) throw error
}

const remove = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('retailer_prices')
    .update({ is_deleted: true })
    .eq('id', id)
  if (error) throw error
}

export const retailerPricesApiService = { getAll, create, update, remove }

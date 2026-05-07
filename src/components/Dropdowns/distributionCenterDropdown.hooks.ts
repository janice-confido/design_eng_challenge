import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { AutocompleteItem } from '../../types'

export const useFetchDistributionCenters = (customerId: string | number | null) => {
  const [distributionCenters, setDistributionCenters] = useState<AutocompleteItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!customerId) { setDistributionCenters([]); return }
    setIsLoading(true)
    supabase
      .from('distribution_centers')
      .select('id, name')
      .eq('customer_id', customerId)
      .order('name')
      .then(({ data, error }) => {
        if (!error) setDistributionCenters((data ?? []).map((r) => ({ id: r.id, display: r.name })))
        setIsLoading(false)
      })
  }, [customerId])

  return { distributionCenters, isLoading }
}

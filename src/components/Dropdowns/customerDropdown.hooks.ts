import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { AutocompleteItem } from '../../types'

export const useFetchCustomers = (includeDirect = true) => {
  const [customers, setCustomers] = useState<AutocompleteItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    supabase
      .from('customers')
      .select('id, name, is_direct')
      .order('name')
      .then(({ data, error }) => {
        if (!error) {
          const items: AutocompleteItem[] = (data ?? [])
            .filter((r) => includeDirect || !r.is_direct)
            .map((r) => ({ id: r.id, display: r.name }))
          const directIdx = items.findIndex((c) => c.display === 'Direct')
          if (includeDirect && directIdx > 0) {
            items.unshift(...items.splice(directIdx, 1))
          }
          setCustomers(items)
        }
        setIsLoading(false)
      })
  }, [includeDirect])

  return { customers, isLoading }
}

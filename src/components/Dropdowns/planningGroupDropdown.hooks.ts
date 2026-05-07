import { useEffect, useState } from 'react'
import { supabase } from '../../supabase'
import { AutocompleteItem } from '../../types'

export const useFetchPlanningGroups = () => {
  const [planningGroups, setPlanningGroups] = useState<AutocompleteItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    supabase
      .from('planning_groups')
      .select('id, name')
      .order('name')
      .then(({ data, error }) => {
        if (!error) setPlanningGroups((data ?? []).map((r) => ({ id: r.id, display: r.name })))
        setIsLoading(false)
      })
  }, [])

  return { planningGroups, isLoading }
}

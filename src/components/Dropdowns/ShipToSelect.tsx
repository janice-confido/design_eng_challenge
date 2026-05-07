/**
 * ShipToSelect — distributor dropdown filtered by planning group.
 *
 *
 * Production key behaviour:
 *  - When planningGroup is null: shows all distributors
 *  - When planningGroup is set: filters to only distributors that service
 *    that retailer (via planningGroupApportionedCustomers), and auto-selects
 *    the first one. Dropdown is disabled if only one option.
 *
 * Challenge equivalent: uses a static apportionment map seeded with realistic
 * retailer→distributor relationships. Candidates are expected to replace this
 * with an API call backed by a planning_group_customers join table.
 */
import React, { useEffect, useMemo } from 'react'
import { AutocompleteDropdown } from './AutocompleteDropdown'
import { useFetchCustomers } from './customerDropdown.hooks'
import { AutocompleteItem } from '../../types'

// ── Apportionment map ─────────────────────────────────────────────────────────
// Maps planning group display name → distributor display names that service it.
const PG_DISTRIBUTORS: Record<string, string[]> = {
  'Whole Foods Market':       ['UNFI', 'Direct'],
  'Sprouts Farmers Market':   ['UNFI', 'KeHE', 'Direct'],
  'Harris Teeter':            ['UNFI', 'Direct'],
  'Kroger':                   ['C&S Wholesale', 'McLane', 'Direct'],
  'Safeway / Albertsons':     ['C&S Wholesale', 'UNFI', 'Direct'],
  'Wegmans':                  ['C&S Wholesale', 'Direct'],
  'Target':                   ['C&S Wholesale', 'McLane', 'Direct'],
  'Walmart':                  ['McLane', 'C&S Wholesale', 'Direct'],
  'Costco':                   ['Direct'],
  'AHOLD Giant Carlisle':     ['C&S Wholesale', 'UNFI', 'Direct'],
}

interface ShipToSelectProps {
  planningGroup: AutocompleteItem | null
  value: AutocompleteItem | null
  onChange: (value: AutocompleteItem | null) => void
  disabled?: boolean
}

export const ShipToSelect: React.FC<ShipToSelectProps> = ({
  planningGroup,
  value,
  onChange,
  disabled,
}) => {
  const { customers: allCustomers } = useFetchCustomers(true)   // includeDirect = true

  // When planningGroup changes, filter to apportioned distributors and auto-select first
  const apportionedOptions = useMemo(() => {
    if (!planningGroup) return allCustomers
    const allowed = PG_DISTRIBUTORS[planningGroup.display] ?? []
    return allCustomers.filter((c) => allowed.includes(c.display))
  }, [planningGroup, allCustomers])

  // Auto-select first apportioned distributor when planning group changes
  useEffect(() => {
    if (!planningGroup) return
    const first = apportionedOptions[0] ?? { id: -1, display: 'Direct' } as AutocompleteItem
    onChange(first)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [planningGroup?.id])

  return (
    <AutocompleteDropdown
      label="Ship To"
      options={apportionedOptions}
      value={value}
      onChange={(_, val) => onChange(val)}
      disabled={disabled || apportionedOptions.length <= 1}
      variant="outlined"
    />
  )
}

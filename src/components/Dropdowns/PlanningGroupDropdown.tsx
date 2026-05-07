/**
 * PlanningGroupDropdown — Autocomplete fetching from the `planning_groups` table.
 *
 *   - Challenge equivalent: useFetchPlanningGroups → Supabase query
 */
import React from 'react'
import { Autocomplete, TextField, TextFieldProps } from '@mui/material'
import { useFetchPlanningGroups } from './planningGroupDropdown.hooks'
import { AutocompleteItem } from '../../types'

interface PlanningGroupDropdownProps {
  label?: string
  value: AutocompleteItem | null
  onChange: (event: React.SyntheticEvent, value: AutocompleteItem | null) => void
  required?: boolean
  disabled?: boolean
  variant?: TextFieldProps['variant']
  size?: TextFieldProps['size']
  error?: boolean
  helperText?: string
}

export const PlanningGroupDropdown: React.FC<PlanningGroupDropdownProps> = ({
  label = 'Planning Group',
  value,
  onChange,
  required,
  disabled,
  variant = 'outlined',
  size,
  error,
  helperText,
}) => {
  const { planningGroups, isLoading } = useFetchPlanningGroups()

  return (
    <Autocomplete
      options={planningGroups}
      value={value}
      onChange={onChange}
      disabled={disabled}
      loading={isLoading}
      loadingText="Loading planning groups..."
      getOptionLabel={(option) => option?.display || ''}
      isOptionEqualToValue={(option, val) => option?.id === val?.id}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>{option.display}</li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          required={required}
          variant={variant}
          size={size}
          error={error}
          helperText={helperText}
        />
      )}
    />
  )
}

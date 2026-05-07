/**
 * DistributionCenterDropdown — Autocomplete fetching DCs filtered by customer.
 *
 *   - Re-fetches when customerId changes (production uses key prop + hook)
 *   - Disabled when no customer is selected
 */
import React from 'react'
import { Autocomplete, TextField, TextFieldProps } from '@mui/material'
import { useFetchDistributionCenters } from './distributionCenterDropdown.hooks'
import { AutocompleteItem } from '../../types'

interface DistributionCenterDropdownProps {
  customerId: string | number | null
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

export const DistributionCenterDropdown: React.FC<DistributionCenterDropdownProps> = ({
  customerId,
  label = 'Distribution Center',
  value,
  onChange,
  required,
  disabled,
  variant = 'outlined',
  size,
  error,
  helperText,
}) => {
  const { distributionCenters, isLoading } = useFetchDistributionCenters(customerId)

  return (
    <Autocomplete
      // Key on customerId — resets selection when customer changes
      // mirrors: key={`pricing-detail-distribution-center-dropdown-${priceFields?.globalCustomer?.id}`}
      key={`dc-${customerId}`}
      options={distributionCenters}
      value={value}
      onChange={onChange}
      disabled={disabled || !customerId}
      loading={isLoading}
      loadingText="Loading distribution centers..."
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

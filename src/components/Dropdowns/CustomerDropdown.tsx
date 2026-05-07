/**
 * CustomerDropdown — Autocomplete fetching from the `customers` table.
 *
 */
import React from 'react'
import { Autocomplete, TextField, TextFieldProps } from '@mui/material'
import { useFetchCustomers } from './customerDropdown.hooks'
import { AutocompleteItem } from '../../types'

interface CustomerDropdownProps {
  label?: string
  value: AutocompleteItem | null
  onChange: (event: React.SyntheticEvent, value: AutocompleteItem | null) => void
  includeDirect?: boolean
  required?: boolean
  disabled?: boolean
  variant?: TextFieldProps['variant']
  size?: TextFieldProps['size']
  error?: boolean
  helperText?: string
}

export const CustomerDropdown: React.FC<CustomerDropdownProps> = ({
  label = 'Customer',
  value,
  onChange,
  includeDirect = true,
  required,
  disabled,
  variant = 'outlined',
  size,
  error,
  helperText,
}) => {
  const { customers, isLoading } = useFetchCustomers(includeDirect)

  return (
    <Autocomplete
      options={customers}
      value={value}
      onChange={onChange}
      disabled={disabled}
      loading={isLoading}
      loadingText="Loading customers..."
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

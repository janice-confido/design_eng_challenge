/**
 * AutocompleteDropdown — core autocomplete component.
 *
 * Key production patterns:
 *  - getOptionLabel={(option) => option?.display || ''}
 *  - isOptionEqualToValue={(option, value) => option?.id === value?.id}
 *  - renderOption uses option.id as key
 */
import React from 'react'
import { Autocomplete, TextField, TextFieldProps } from '@mui/material'
import { AutocompleteItem } from '../../types'

interface AutocompleteDropdownProps {
  label?: string
  options: AutocompleteItem[]
  value: AutocompleteItem | null
  onChange: (event: React.SyntheticEvent, value: AutocompleteItem | null) => void
  required?: boolean
  disabled?: boolean
  loading?: boolean
  placeholder?: string
  error?: boolean
  helperText?: string
  variant?: TextFieldProps['variant']
  size?: TextFieldProps['size']
}

export const AutocompleteDropdown: React.FC<AutocompleteDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  required,
  disabled,
  loading,
  placeholder,
  error,
  helperText,
  variant = 'outlined',
  size,
}) => (
  <Autocomplete
    options={options}
    value={value}
    onChange={onChange}
    disabled={disabled}
    loading={loading}
    loadingText="Loading..."
    getOptionLabel={(option) => option?.display || ''}
    isOptionEqualToValue={(option, val) => option?.id === val?.id}
    renderOption={(props, option) => (
      <li {...props} key={option.id}>
        {option.display}
      </li>
    )}
    renderInput={(params) => (
      <TextField
        {...params}
        label={label}
        required={required}
        variant={variant}
        size={size}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
      />
    )}
  />
)

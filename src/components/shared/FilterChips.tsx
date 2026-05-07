/**
 * FilterChips — renders active filter values as deletable Chip components.
 *
 *  - Default MUI Chip (no size prop → medium)
 *  - maxWidth: 200px with text overflow ellipsis
 *  - Box wrapper with mr: 1, mb: 1 per chip
 */
import React from 'react'
import { Box, Chip } from '@mui/material'

export interface FilterChipDef {
  key: string
  label: string
}

interface FilterChipsProps {
  chips: FilterChipDef[]
  onDelete: (key: string) => void
}

export const FilterChips: React.FC<FilterChipsProps> = ({ chips, onDelete }) => {
  if (chips.length === 0) return null

  return (
    <Box>
      {chips.map((chip) => (
        <Box key={chip.key} sx={{ display: 'inline-block', mr: 1, mb: 1, maxWidth: '1000px' }}>
          <Chip
            label={chip.label}
            onDelete={() => onDelete(chip.key)}
            sx={{
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          />
        </Box>
      ))}
    </Box>
  )
}

import React from 'react'
import { Box, SxProps, Theme } from '@mui/material'
import { colors } from './tokens'

interface PageToolbarProps {
  children: React.ReactNode
  sx?: SxProps<Theme>
}

/**
 * Standard single-row toolbar used below the PageHeader on list/table pages.
 * Provides the beige background, bottom border, horizontal padding, and
 */
export const PageToolbar: React.FC<PageToolbarProps> = ({ children, sx }) => (
  <Box
    sx={{
      px: 3,
      py: 1.25,
      borderBottom: `1px solid #E8E2D9`,
      bgcolor: colors.bgBeige,
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      flexShrink: 0,
      minHeight: 56,
      ...sx,
    }}
  >
    {children}
  </Box>
)

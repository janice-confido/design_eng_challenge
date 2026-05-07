import React from 'react'
import { Box, Typography, SxProps, Theme } from '@mui/material'
import { colors } from './tokens'

export interface PageHeaderProps {
  /** Section label rendered above the title (e.g. "Trade", "Sales") */
  section?: React.ReactNode
  /** Breadcrumb node rendered above the title — mutually exclusive with `section` */
  breadcrumb?: React.ReactNode
  title?: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
  children?: React.ReactNode
  sx?: SxProps<Theme>
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  section,
  breadcrumb,
  title,
  subtitle,
  actions,
  children,
  sx,
}) => {
  return (
    <Box
      sx={{
        bgcolor: colors.white,
        px: 3,
        py: 2,
        borderBottom: `1px solid ${colors.charcoal200}`,
        flexShrink: 0,
        ...sx,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          {breadcrumb && <Box sx={{ mb: 0.25 }}>{breadcrumb}</Box>}
          {section && !breadcrumb && (
            <Typography sx={{ fontSize: 14, color: colors.charcoal700, mb: 0.25 }}>
              {section}
            </Typography>
          )}
          {title && (
            <Typography
              sx={{ fontSize: 22, fontWeight: 500, color: colors.charcoal900, lineHeight: '32px' }}
            >
              {title}
            </Typography>
          )}
          {subtitle}
        </Box>
        {actions && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
            {actions}
          </Box>
        )}
      </Box>
      {children}
    </Box>
  )
}

import { styled, Tabs, Tab, TabsProps, TabProps } from '@mui/material'
import { colorScale, semanticColors } from './tokens'

export type TabVariant = 'underline' | 'filled' | 'pill'

interface StyledTabsProps extends TabsProps {
  tabVariant?: TabVariant
}

interface StyledTabProps extends TabProps {
  tabVariant?: TabVariant
}

/**
 * StyledTabs — tab container with variant support.
 * - 'underline': default MUI style with underline indicator
 * - 'filled': no indicator, used with filled background tabs (e.g. Actuals page)
 * - 'pill': rounded pill-shaped tabs with filled background when selected
 */
export const StyledTabs = styled(Tabs, {
  shouldForwardProp: (prop) => prop !== 'tabVariant',
})<StyledTabsProps>(({ tabVariant = 'underline' }) => ({
  minHeight: tabVariant === 'filled' ? 36 : 40,
  ...((tabVariant === 'filled' || tabVariant === 'pill') && {
    '& .MuiTabs-indicator': { display: 'none' },
    '& .MuiTabs-flexContainer': {
      gap: tabVariant === 'pill' ? 4 : 0,
      height: tabVariant === 'filled' ? 36 : undefined,
    },
  }),
}))

/**
 * StyledTab — individual tab with variant support.
 */
export const StyledTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'tabVariant',
})<StyledTabProps>(({ theme, tabVariant = 'underline' }) => ({
  minHeight: 40,
  padding: theme.spacing(1, 2),
  textTransform: 'uppercase',
  fontWeight: 500,
  fontSize: '0.8125rem',
  ...(tabVariant === 'filled' && {
    borderRadius: 0,
    borderRight: `1px solid ${colorScale.charcoal[200]}`,
    color: colorScale.charcoal[700],
    fontWeight: 400,
    minHeight: 36,
    padding: '0 24px',
    '&.Mui-selected': {
      backgroundColor: semanticColors.bg.beige,
      color: colorScale.charcoal[900],
      fontWeight: 500,
    },
    '&:hover:not(.Mui-selected)': {
      backgroundColor: 'rgba(0,0,0,0.04)',
    },
  }),
  ...(tabVariant === 'pill' && {
    borderRadius: theme.shape.borderRadius,
    textTransform: 'none',
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    minHeight: 32,
    color: theme.palette.text.secondary,
    '&.Mui-selected': {
      backgroundColor: theme.palette.grey[600],
      color: theme.palette.common.white,
    },
    '&:hover:not(.Mui-selected)': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
}))

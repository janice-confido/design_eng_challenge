import React from 'react'
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  styled,
  Tooltip,
} from '@mui/material'
import { ChevronDown, ChevronRight } from '@carbon/icons-react'
import { NavSectionHeader } from './types'


export const NavStyledMenuItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 8,
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    '&:hover': { backgroundColor: theme.palette.primary.dark },
  },
})) as typeof ListItemButton

export const navItemButtonSx   = { paddingX: 1, paddingY: '4px' } as const
export const navIconSx         = { minWidth: 24, color: 'white' } as const
export const navCollapsedIconSx = { ...navIconSx, marginY: '4px', minHeight: 21 } as const
export const navCarbonIconSx   = { fontSize: 16 } as const

// ─── NavItem ─────────────────────────────────────────────────────────────────

interface NavItemProps {
  item: NavSectionHeader['items'][number]
  selected?: boolean
}

const NavItem: React.FC<NavItemProps> = ({ item, selected = false }) => (
  <NavStyledMenuItemButton
    sx={{ paddingY: 0.5, paddingX: 2 }}
    selected={selected}
    disabled={item.disabled}
  >
    <ListItemText
      primary={item.label}
      primaryTypographyProps={{ fontSize: 14, color: 'white' }}
    />
  </NavStyledMenuItemButton>
)

// ─── NavSection ───────────────────────────────────────────────────────────────

interface NavSectionProps {
  section: NavSectionHeader
  isOpen: boolean
  onToggle: () => void
  isCollapsed: boolean
}

export const NavSection: React.FC<NavSectionProps> = ({
  section,
  isOpen,
  onToggle,
  isCollapsed,
}) => {
  const Icon = section.icon

  if (isCollapsed) {
    return (
      <Tooltip title={section.label} placement="right">
        <NavStyledMenuItemButton onClick={onToggle} sx={navItemButtonSx}>
          <ListItemIcon sx={navCollapsedIconSx}>
            <Icon size={16} />
          </ListItemIcon>
        </NavStyledMenuItemButton>
      </Tooltip>
    )
  }

  return (
    <>
      <NavStyledMenuItemButton onClick={onToggle} sx={navItemButtonSx}>
        <ListItemIcon sx={navIconSx}>
          <Icon size={16} />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography sx={{ fontWeight: 400, fontSize: 14, color: 'white' }}>
              {section.label}
            </Typography>
          }
        />
        {isOpen
          ? <ChevronDown size={16} style={{ color: 'white' }} />
          : <ChevronRight size={16} style={{ color: 'white' }} />
        }
      </NavStyledMenuItemButton>

      <Collapse in={isOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {section.items.map((item) => (
            <NavItem key={item.key} item={item} />
          ))}
        </List>
      </Collapse>
    </>
  )
}

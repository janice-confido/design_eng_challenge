import React, { useState } from 'react'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material'
import {
  OpenPanelLeft,
  OpenPanelFilledLeft,
  Help,
  Notification,
  UserAvatar,
} from '@carbon/icons-react'
import { NavSection, NavStyledMenuItemButton, navItemButtonSx, navIconSx, navCollapsedIconSx } from './NavSection'
import { navigationConfig } from './constants'
import { NavHeader } from './types'

// ─── Constants ────────────────────────────────────────────────────────────────

const SIDENAV_EXPANDED_WIDTH  = 220
const SIDENAV_COLLAPSED_WIDTH = 56
const TRANSITION = '200ms ease-in-out'

// ─── SideNav ──────────────────────────────────────────────────────────────────

export const SideNav: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [sectionsOpen, setSectionsOpen] = useState<Record<NavHeader, boolean>>({
    [NavHeader.ACCOUNTING]:       false,
    [NavHeader.TRADE]:            false,
    [NavHeader.SALES]:            false,
    [NavHeader.DEMAND_PLANNING]:  false,
    [NavHeader.SUPPLY_PLANNING]:  false,
    [NavHeader.AUTOMATION_TOOLS]: false,
  })

  const width = isCollapsed ? SIDENAV_COLLAPSED_WIDTH : SIDENAV_EXPANDED_WIDTH

  const toggleSection = (key: NavHeader) => {
    setSectionsOpen((prev) => {
      const allClosed = Object.keys(prev).reduce(
        (acc, k) => ({ ...acc, [k]: false }),
        {} as Record<NavHeader, boolean>
      )
      return { ...allClosed, [key]: !prev[key] }
    })
  }

  const footerItems = [
    { key: 'help',    label: 'Help',   icon: <Help size={16} /> },
    { key: 'inbox',   label: 'Inbox',  icon: <Notification size={16} /> },
    { key: 'account', label: 'Janice', icon: <UserAvatar size={16} /> },
  ]

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        transition: `width ${TRANSITION}`,
        '& .MuiDrawer-paper': {
          width,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: `width ${TRANSITION}`,
          bgcolor: 'rgb(49, 49, 49)',
          color: 'white',
          borderRight: 'none',
        },
      }}
    >
      {/* Logo + collapse toggle */}
      <Box
        sx={{
          px: isCollapsed ? 0.5 : 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          transition: `padding ${TRANSITION}`,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          minHeight: 56,
        }}
      >
        {!isCollapsed && (
          <Box component="a" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <img src="/assets/logo_white.svg" alt="Confido" style={{ width: 60 }} />
          </Box>
        )}
        <IconButton
          onClick={() => setIsCollapsed((v) => !v)}
          size="small"
          sx={{ color: 'white', flexShrink: 0 }}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed
            ? <OpenPanelLeft size={16} />
            : <OpenPanelFilledLeft size={16} />
          }
        </IconButton>
      </Box>

      {/* Nav sections */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', px: 1, py: 1 }}>
        <List dense disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {navigationConfig.map((section) => (
            <NavSection
              key={section.key}
              section={section}
              isOpen={sectionsOpen[section.key]}
              onToggle={() => toggleSection(section.key)}
              isCollapsed={isCollapsed}
            />
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ px: 1, py: 1, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <List dense disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {footerItems.map(({ key, label, icon }) =>
            isCollapsed ? (
              <Tooltip key={key} title={label} placement="right">
                <NavStyledMenuItemButton sx={navItemButtonSx}>
                  <ListItemIcon sx={navCollapsedIconSx}>{icon}</ListItemIcon>
                </NavStyledMenuItemButton>
              </Tooltip>
            ) : (
              <NavStyledMenuItemButton key={key} sx={navItemButtonSx}>
                <ListItemIcon sx={navIconSx}>{icon}</ListItemIcon>
                <ListItemText primary={label} primaryTypographyProps={{ fontSize: 14, color: 'white' }} />
              </NavStyledMenuItemButton>
            )
          )}
        </List>
      </Box>
    </Drawer>
  )
}

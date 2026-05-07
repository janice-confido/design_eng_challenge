import {
  Calculator,
  Tag,
  ShoppingBag,
  Dashboard,
  Cube,
  SettingsAdjust,
} from '@carbon/icons-react'
import { NavHeader, NavSectionHeader, NavSectionItem } from './types'

export const navigationConfig: NavSectionHeader[] = [
  {
    key: NavHeader.ACCOUNTING,
    label: NavHeader.ACCOUNTING,
    icon: Calculator,
    items: [
      { key: 'cash-application',   label: 'Cash Application' },
      { key: 'deductions',         label: 'Deductions' },
      { key: 'clearing',           label: 'Clearing' },
      { key: 'disputes',           label: 'Disputes' },
      { key: 'deductions-reports', label: 'Deductions Reports' },
      { key: 'audit-logs',         label: 'Audit Logs' },
    ],
  },
  {
    key: NavHeader.TRADE,
    label: NavHeader.TRADE,
    icon: Tag,
    items: [
      { key: 'summary',           label: 'Summary' },
      { key: 'trade-calendar',    label: 'Trade Calendar' },
      { key: 'shopper-marketing', label: 'Shopper Marketing' },
      { key: 'accruals',          label: 'Accruals' },
      { key: 'promo-inbox',       label: 'Promo Inbox' },
      { key: 'promo-performance', label: 'Promo Performance' },
    ],
  },
  {
    key: NavHeader.SALES,
    label: NavHeader.SALES,
    icon: ShoppingBag,
    items: [
      { key: 'forecast',      label: 'Forecast' },
      { key: 'actuals',       label: 'Actuals' },
      { key: 'analytics',     label: 'Analytics' },
      { key: 'opportunities', label: 'Opportunities' },
    ],
  },
  {
    key: NavHeader.DEMAND_PLANNING,
    label: NavHeader.DEMAND_PLANNING,
    icon: Dashboard,
    items: [
      { key: 'workspace',  label: 'Workspace' },
      { key: 'reporting',  label: 'Reporting' },
    ],
  },
  {
    key: NavHeader.SUPPLY_PLANNING,
    label: NavHeader.SUPPLY_PLANNING,
    icon: Cube,
    items: [
      { key: 'planning', label: 'Workspace' },
      { key: 'report',   label: 'Report' },
    ],
  },
  {
    key: NavHeader.AUTOMATION_TOOLS,
    label: NavHeader.AUTOMATION_TOOLS,
    icon: SettingsAdjust,
    items: [
      { key: 'approvals',       label: 'Approvals' },
      { key: 'workflows',       label: 'Workflows' },
      { key: 'reasons',         label: 'Reasons' },
      { key: 'deduction-rules', label: 'Deduction Rules' },
    ],
  },
]

export const bottomNavigationItems: NavSectionItem[] = [
  { key: 'settings',     label: 'Settings' },
  { key: 'integrations', label: 'Integrations' },
  { key: 'products',     label: 'Products' },
]

import type { CarbonIconType } from '@carbon/icons-react'

export enum NavHeader {
  ACCOUNTING       = 'Accounting',
  TRADE            = 'Trade',
  SALES            = 'Sales',
  DEMAND_PLANNING  = 'Demand Planning',
  SUPPLY_PLANNING  = 'Supply Planning',
  AUTOMATION_TOOLS = 'Automation Tools',
}

export interface NavSectionItem {
  key: string
  label: string
  path?: string
  disabled?: boolean
}

export interface NavSectionHeader {
  key: NavHeader
  label: string
  icon: CarbonIconType
  items: NavSectionItem[]
}

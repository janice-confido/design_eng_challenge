/**
 * MetricBar — completion metric cards above the products table.
 *
 * Shows three metrics computed from the current product list:
 *  1. Products without a scheduled price (active only)
 *  2. Products that are not sellable (active only)
 *  3. Products without a next price (active only)
 *
 * Each card is clickable and highlights an active filter state.
 */
import React from 'react'
import { Box, Paper, Tooltip, Typography } from '@mui/material'
import { CheckCircle, Warning } from '@mui/icons-material'
import { ProductWithPricing } from '../types'

// ── BaseMetricItem ─────────────────────────────────────────────────────────────

interface BaseMetricItemProps {
  isActive?: boolean
  onClick?: () => void
  children: React.ReactNode
}

const BaseMetricItem: React.FC<BaseMetricItemProps> = ({ isActive = false, onClick, children }) => (
  <Box
    onClick={onClick}
    sx={{
      flex: 1,
      p: '12px 20px',
      borderBottom: '3px solid',
      borderBottomColor: isActive ? 'warning.light' : 'transparent',
      cursor: onClick ? 'pointer' : 'default',
      '&:hover': { backgroundColor: onClick ? 'grey.100' : 'transparent' },
    }}
  >
    {children}
  </Box>
)

// ── CompletionMetric ──────────────────────────────────────────────────────────

interface CompletionMetricProps {
  label: string
  noLabel: string
  value: number
  total: number
  isActive?: boolean
  onClick?: () => void
  tooltip?: string
}

const CompletionMetric: React.FC<CompletionMetricProps> = ({
  label, noLabel, value, total, isActive, onClick, tooltip,
}) => {
  const isComplete = value === 0
  const percentage = total ? Math.round((value / total) * 100) : 0

  const content = isComplete ? (
    <BaseMetricItem>
      <Box display="flex" alignItems="center" gap={1.5}>
        <CheckCircle sx={{ fontSize: 24, color: 'success.main' }} />
        <Box flex={1}>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 500, color: 'success.main', mb: 0.25 }}>
            All Complete
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>No {noLabel}</Typography>
        </Box>
      </Box>
    </BaseMetricItem>
  ) : (
    <BaseMetricItem onClick={onClick} isActive={isActive}>
      <Box display="flex" alignItems="center" gap={1.5}>
        <Warning sx={{ fontSize: 20, color: 'warning.light' }} />
        <Box flex={1}>
          <Box display="flex" alignItems="baseline" gap={0.75} mb={0.25}>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 600, color: 'warning.light', lineHeight: 1 }}>
              {value}
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: '#666' }}>/ {total}</Typography>
            <Typography sx={{ fontSize: '0.75rem', color: '#999', ml: 0.5 }}>({percentage}%)</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.8rem', color: '#666' }}>{label}</Typography>
        </Box>
      </Box>
    </BaseMetricItem>
  )

  return tooltip ? (
    <Tooltip title={tooltip} arrow componentsProps={{ tooltip: { sx: { fontSize: 14 } } }}>
      <Box component="div" sx={{ flex: 1 }}>{content}</Box>
    </Tooltip>
  ) : (
    <Box sx={{ flex: 1 }}>{content}</Box>
  )
}

// ── MetricBar ─────────────────────────────────────────────────────────────────

interface MetricBarProps {
  products: ProductWithPricing[]
  /** Which metric filter is currently active (key: metric name) */
  activeMetric: string | null
  onMetricClick: (metric: string) => void
}

export const MetricBar: React.FC<MetricBarProps> = ({ products, activeMetric, onMetricClick }) => {
  const active = products.filter(p => p.lifecycle_stage !== 'Inactive')
  const total  = active.length

  const withoutPrice    = active.filter(p => p.current_price == null).length
  const notSellable     = active.filter(p => !p.is_sellable).length
  const withoutNextPrice = active.filter(p => p.next_price == null).length

  const metrics = [
    {
      key:      'withoutPrice',
      label:    'Active Units Without Price',
      noLabel:  'Active Units Without Price',
      value:    withoutPrice,
      tooltip:  'Active products that have no current default price set',
    },
    {
      key:      'notSellable',
      label:    'Active Non-Sellable Units',
      noLabel:  'Active Non-Sellable Units',
      value:    notSellable,
      tooltip:  'Active products marked as not purchasable by consumers',
    },
    {
      key:      'withoutNextPrice',
      label:    'Active Units Without Scheduled Price',
      noLabel:  'Active Units Without Scheduled Price',
      value:    withoutNextPrice,
      tooltip:  'Active products that have no future price scheduled',
    },
  ]

  return (
    <Paper elevation={1} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
      <Box display="flex">
        {metrics.map((m, i) => (
          <React.Fragment key={m.key}>
            {i > 0 && <Box sx={{ width: '1px', bgcolor: '#e0e0e0', flexShrink: 0 }} />}
            <CompletionMetric
              label={m.label}
              noLabel={m.noLabel}
              value={m.value}
              total={total}
              isActive={activeMetric === m.key}
              onClick={m.value > 0 ? () => onMetricClick(m.key) : undefined}
              tooltip={m.tooltip}
            />
          </React.Fragment>
        ))}
      </Box>
    </Paper>
  )
}

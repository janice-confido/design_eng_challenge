import { ValidRowModel } from '../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ConfidoTableColumn<R extends ValidRowModel, V = any, FV = V> {
  field: string
  headerName?: string
  renderHeader?: (props: { field: string }) => React.ReactNode
  valueGetter?: (props: { row: R; field: string }) => V
  valueFormatter?: (value: V) => FV
  renderCell?: (props: {
    value: V
    formattedValue: FV
    row: R
    field: string
    toggleRowExpansion?: () => void
  }) => React.ReactNode
  hide?: boolean
  style?: TableColumnStyle
}

export interface TableColumnStyle {
  width?: string | number
  align?: 'left' | 'center' | 'right'
  backgroundColor?: string
}

export interface InnerTableColumn<R extends ValidRowModel> extends ConfidoTableColumn<R> {
  pinned: ColumnPinnedState
}

export enum ColumnPinnedState {
  LEFT     = 'left',
  RIGHT    = 'right',
  UNPINNED = 'unpinned',
}

export type ColumnVisibilityModel = Record<string, boolean>
export type ColumnPinningModel    = { left?: string; right?: string }

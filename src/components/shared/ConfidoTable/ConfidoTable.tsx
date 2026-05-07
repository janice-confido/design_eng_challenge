/**
 * ConfidoTable — column-based MUI Table with pagination, row selection, and skeleton loading.
 */
import React from 'react'
import { TableContainer } from '@mui/material'
import { ColumnPinningModel, ColumnVisibilityModel, ConfidoTableColumn, useTableColumns } from './TableColumns'
import { ConfidoTablePagination, usePagination, PaginationProps } from './Pagination'
import { useRowSelection, RowSelectionProps } from './RowSelection'
import { TableContent } from './TableContent'
import { ValidRowModel } from './types'

export interface ConfidoTableProps<R extends ValidRowModel> {
  rows: R[]
  columns: ConfidoTableColumn<R>[]
  isLoading?: boolean
  noRowsOverlay?: React.ReactNode
  columnVisibilityModel?: ColumnVisibilityModel
  columnPinningModel?: ColumnPinningModel
  rowSelectionProps?: RowSelectionProps
  hasPagination?: boolean
  paginationProps?: PaginationProps
  getDetailPanelContent?: (row: R) => React.ReactNode
  height?: number | string
  maxHeight?: number | string
  size?: 'small' | 'medium'
}

export const ConfidoTable = <R extends ValidRowModel>(props: ConfidoTableProps<R>) => {
  const {
    rows, columns, columnVisibilityModel, columnPinningModel,
    rowSelectionProps, hasPagination, paginationProps,
    height, maxHeight, getDetailPanelContent, ...tableContentProps
  } = props

  const { innerColumns } = useTableColumns(
    columns, columnVisibilityModel, columnPinningModel,
    !!rowSelectionProps, !!getDetailPanelContent
  )
  const { paginatedRows, paginationComponentProps } = usePagination(rows, hasPagination, paginationProps)
  const { rowSelectionModel, onRowSelectionChange } = useRowSelection(paginatedRows, rowSelectionProps)

  return (
    <>
      <TableContainer sx={{ height, maxHeight }}>
        <TableContent
          rows={paginatedRows}
          columns={innerColumns}
          rowSelectionModel={rowSelectionModel}
          onRowSelectionChange={onRowSelectionChange}
          getDetailPanelContent={getDetailPanelContent}
          {...tableContentProps}
        />
      </TableContainer>
      {paginationComponentProps && <ConfidoTablePagination {...paginationComponentProps} />}
    </>
  )
}

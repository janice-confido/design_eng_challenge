import React from 'react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material'
import { ConfidoTableHeader } from './ConfidoTableHeader'
import { ConfidoTableRow } from './ConfidoTableRow'
import { TableSkeleton } from '../TableSkeleton/TableSkeleton'
import { RowSelectionModel } from '../RowSelection'
import { InnerTableColumn } from '../TableColumns'
import { RowId, ValidRowModel } from '../types'

interface TableContentProps<R extends ValidRowModel> {
  rows: R[]
  columns: InnerTableColumn<R>[]
  isLoading?: boolean
  noRowsOverlay?: React.ReactNode
  rowSelectionModel: RowSelectionModel
  onRowSelectionChange: (rowIds: RowId[], selected: boolean) => void
  getDetailPanelContent?: (row: R) => React.ReactNode
  size?: 'small' | 'medium'
}

export const TableContent = <R extends ValidRowModel>({
  rows, columns, isLoading = false, noRowsOverlay = 'No data available.',
  rowSelectionModel, size, onRowSelectionChange, getDetailPanelContent,
}: TableContentProps<R>) => (
  <Table size={size}>
    <ConfidoTableHeader
      columns={columns}
      rowSelectionModel={rowSelectionModel}
      setAllRowsSelected={(selected) => onRowSelectionChange(rows.map(({ id }) => id), selected)}
    />
    <TableBody>
      {isLoading ? (
        <TableSkeleton tableWidth={columns.length} rowCount={10} />
      ) : rows.length === 0 ? (
        <TableRow>
          <TableCell colSpan={columns.length} sx={{ textAlign: 'center' }}>
            {noRowsOverlay}
          </TableCell>
        </TableRow>
      ) : (
        rows.map((row) => (
          <ConfidoTableRow
            key={row.id}
            row={row}
            columns={columns}
            isRowSelected={rowSelectionModel.selectedRowIdSet.has(row.id)}
            setRowSelected={(selected) => onRowSelectionChange([row.id], selected)}
            getDetailPanelContent={getDetailPanelContent}
          />
        ))
      )}
    </TableBody>
  </Table>
)

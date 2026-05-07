import React from 'react'
import { TableCell } from '@mui/material'
import { constructColumnStyle } from '../utils'
import { InnerTableColumn } from '../../TableColumns'
import { ValidRowModel } from '../../types'

interface ConfidoTableCellProps<R extends ValidRowModel> {
  column: InnerTableColumn<R>
  row: R
  toggleRowExpansion?: () => void
}

export const ConfidoTableCell = <R extends ValidRowModel>({
  column: { field, style, pinned, valueGetter, valueFormatter, renderCell },
  row,
  toggleRowExpansion,
}: ConfidoTableCellProps<R>) => {
  const sx = constructColumnStyle(style, pinned)
  let value = row[field] as unknown
  if (valueGetter) value = valueGetter({ row, field })
  let formattedValue = value
  if (valueFormatter) formattedValue = valueFormatter(value as never)

  return (
    <TableCell sx={sx}>
      {renderCell?.({ value, formattedValue, row, field, toggleRowExpansion }) ?? (formattedValue as React.ReactNode)}
    </TableCell>
  )
}

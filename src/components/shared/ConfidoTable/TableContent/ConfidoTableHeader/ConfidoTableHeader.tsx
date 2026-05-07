import React from 'react'
import { Checkbox, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import { constructColumnStyle } from '../utils'
import { RowSelectionModel } from '../../RowSelection'
import { InnerTableColumn } from '../../TableColumns'
import { ValidRowModel } from '../../types'
import { TABLE_CHECKBOX_FIELD } from '../../TableColumns/constants'

interface ConfidoTableHeaderProps<R extends ValidRowModel> {
  columns: InnerTableColumn<R>[]
  setAllRowsSelected?: (selected: boolean) => void
  rowSelectionModel?: RowSelectionModel
}

export const ConfidoTableHeader = <R extends ValidRowModel>({
  columns, setAllRowsSelected, rowSelectionModel,
}: ConfidoTableHeaderProps<R>) => (
  <TableHead>
    <TableRow>
      {columns.map((col) =>
        col.field === TABLE_CHECKBOX_FIELD ? (
          <TableCell key={col.field} sx={constructColumnStyle(col.style, col.pinned, true)}>
            <Checkbox
              color="primary"
              checked={rowSelectionModel?.areAllRowsSelected}
              indeterminate={rowSelectionModel?.areSomeRowsSelected}
              onChange={(e) => setAllRowsSelected?.(e.target.checked)}
            />
          </TableCell>
        ) : (
          <TableCell key={col.field} sx={constructColumnStyle(col.style, col.pinned, true)}>
            {col.renderHeader?.({ field: col.field }) ?? (
              /* tableHeaderStyle = { fontWeight: 500 } — matches production Products.tsx */
              <Typography sx={{ fontWeight: 500 }} component="span">
                {col.headerName}
              </Typography>
            )}
          </TableCell>
        )
      )}
    </TableRow>
  </TableHead>
)

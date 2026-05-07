import React, { useState } from 'react'
import { Checkbox, IconButton, TableCell, TableRow } from '@mui/material'
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { ConfidoTableCell } from './ConfidoTableCell'
import { TABLE_CHECKBOX_FIELD, TABLE_DETAIL_TOGGLE_FIELD } from '../../TableColumns/constants'
import { InnerTableColumn } from '../../TableColumns'
import { ValidRowModel } from '../../types'
import { constructColumnStyle } from '../utils'

interface ConfidoTableRowProps<R extends ValidRowModel> {
  row: R
  columns: InnerTableColumn<R>[]
  isRowSelected: boolean
  setRowSelected: (selected: boolean) => void
  getDetailPanelContent?: (row: R) => React.ReactNode
}

export const ConfidoTableRow = <R extends ValidRowModel>({
  row, columns, isRowSelected, setRowSelected, getDetailPanelContent,
}: ConfidoTableRowProps<R>) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <>
      <TableRow>
        {columns.map((col) => {
          if (col.field === TABLE_CHECKBOX_FIELD) return (
            <TableCell key={col.field} sx={constructColumnStyle(col.style, col.pinned)}>
              <Checkbox color="primary" checked={isRowSelected}
                onChange={(e) => setRowSelected(e.target.checked)} />
            </TableCell>
          )
          if (col.field === TABLE_DETAIL_TOGGLE_FIELD) {
            if (col.renderCell) return <ConfidoTableCell key={col.field} column={col} row={row} toggleRowExpansion={() => setExpanded(!expanded)} />
            return (
              <TableCell key={col.field} sx={constructColumnStyle(col.style, col.pinned)}>
                <IconButton onClick={() => setExpanded(!expanded)}>
                  {expanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                </IconButton>
              </TableCell>
            )
          }
          return <ConfidoTableCell key={col.field} column={col} row={row} />
        })}
      </TableRow>
      {expanded && getDetailPanelContent && (
        <TableRow>
          <TableCell colSpan={columns.length} sx={{ padding: 0 }}>
            {getDetailPanelContent(row)}
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

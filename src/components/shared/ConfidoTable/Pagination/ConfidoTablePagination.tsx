import React from 'react'
import { TablePagination } from '@mui/material'
import { PageSizeOptions, PaginationModel } from './types'

export interface ConfidoTablePaginationProps {
  paginationModel: PaginationModel
  setPaginationModel: (m: PaginationModel) => void
  pageSizeOptions: PageSizeOptions
  rowCount: number
}

export const ConfidoTablePagination: React.FC<ConfidoTablePaginationProps> = ({
  paginationModel, setPaginationModel, pageSizeOptions, rowCount,
}) => (
  <TablePagination
    component="div"
    count={rowCount}
    page={paginationModel.page}
    rowsPerPage={paginationModel.pageSize}
    rowsPerPageOptions={pageSizeOptions as number[]}
    onPageChange={(_, p) => setPaginationModel({ ...paginationModel, page: p })}
    onRowsPerPageChange={(e) => setPaginationModel({ pageSize: parseInt(e.target.value), page: 0 })}
  />
)

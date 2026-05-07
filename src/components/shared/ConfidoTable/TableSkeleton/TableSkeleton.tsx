import React from 'react'
import { Skeleton, TableCell, TableRow } from '@mui/material'

interface TableSkeletonProps { tableWidth: number; rowCount: number }

export const TableSkeleton: React.FC<TableSkeletonProps> = ({ tableWidth, rowCount }) => (
  <>
    {[...Array(rowCount)].map((_, ri) => (
      <TableRow key={ri}>
        {[...Array(tableWidth)].map((_, ci) => (
          <TableCell key={ci}><Skeleton animation="wave" variant="text" /></TableCell>
        ))}
      </TableRow>
    ))}
  </>
)

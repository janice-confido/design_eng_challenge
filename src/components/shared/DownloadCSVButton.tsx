/**
 * DownloadCSVButton — client-side CSV export.
 *
 * Instead of a server endpoint, builds the CSV from the provided rows/columns
 * directly in the browser.
 */
import React from 'react'
import { Button } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

interface Column {
  header: string
  getValue: (row: any) => string | number | null | undefined
}

interface DownloadCSVButtonProps {
  fileName: string
  rows: any[]
  columns: Column[]
  variant?: 'outlined' | 'contained' | 'text'
  disabled?: boolean
}

export const DownloadCSVButton: React.FC<DownloadCSVButtonProps> = ({
  fileName,
  rows,
  columns,
  variant = 'outlined',
  disabled = false,
}) => {
  const handleDownload = () => {
    const escape = (v: string | number | null | undefined): string => {
      const s = v == null ? '' : String(v)
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"`
        : s
    }

    const header = columns.map((c) => escape(c.header)).join(',')
    const body   = rows.map((row) =>
      columns.map((c) => escape(c.getValue(row))).join(',')
    )
    const csv  = [header, ...body].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })

    const link = document.createElement('a')
    link.href     = URL.createObjectURL(blob)
    link.download = fileName
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <Button
      variant={variant}
      startIcon={<FileDownloadIcon />}
      onClick={handleDownload}
      disabled={disabled || rows.length === 0}
    >
      Download CSV
    </Button>
  )
}

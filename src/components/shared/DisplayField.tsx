/**
 * DisplayField — read-only label + value pair.
 */
import React from 'react'
import { Typography } from '@mui/material'

interface DisplayFieldProps {
  title: string
  value: string | number | null | undefined
  render?: React.ReactNode
}

export const DisplayField: React.FC<DisplayFieldProps> = ({ title, value, render }) => {
  const rendered = render ?? (value != null && value !== '' ? String(value) : '—')

  return (
    <>
      <Typography gutterBottom sx={{ fontSize: 14, opacity: 0.6 }}>
        {title}
      </Typography>
      <Typography component="div" gutterBottom sx={{ fontSize: 16, opacity: 0.87 }}>
        {rendered}
      </Typography>
    </>
  )
}

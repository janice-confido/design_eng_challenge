import React from 'react'
import { Box } from '@mui/material'
import { SideNav } from './components/Navigation/SideNav'
import ProductsPage from './components/ProductsPage'

export default function App() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <SideNav />
      <Box sx={{ flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <ProductsPage />
      </Box>
    </Box>
  )
}

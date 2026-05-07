import React, { useState } from 'react'
import { Box, AppBar, Toolbar, Typography } from '@mui/material'
import { colorScale } from './theme'
import ProductsPage from './components/ProductsPage'
import ProductDetailPage from './components/ProductDetailPage'
import { Product } from './types'

// Simple view state — no router needed for the challenge scope
type View = { name: 'list' } | { name: 'detail'; product: Product }

export default function App() {
  const [view, setView] = useState<View>({ name: 'list' })

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: `1px solid ${colorScale.charcoal[200]}`,
        }}
      >
        <Toolbar variant="dense">
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: colorScale.charcoal[900],
              letterSpacing: '-0.2px',
            }}
          >
            Confido
          </Typography>
          <Typography
            sx={{
              ml: 1,
              fontSize: 13,
              color: colorScale.charcoal[500],
              fontWeight: 400,
            }}
          >
            — Design Challenge
          </Typography>
        </Toolbar>
      </AppBar>

      {view.name === 'list' && (
        <ProductsPage
          onSelectProduct={(product) => setView({ name: 'detail', product })}
        />
      )}

      {view.name === 'detail' && (
        <ProductDetailPage
          product={view.product}
          onBack={() => setView({ name: 'list' })}
        />
      )}
    </Box>
  )
}

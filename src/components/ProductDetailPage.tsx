/**
 * ProductDetailPage
 *
 * Shows a product's metadata and its full price history.
 * Candidates are expected to improve: the price timeline UX,
 * at-a-glance current/next price indicators, and layout.
 */
import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { colorScale } from '../theme'
import { ProductPrice, Product } from '../types'
import { apiService } from '../api/prices'
import PriceFormDialog from './PriceFormDialog'

interface ProductDetailPageProps {
  product: Product
  onBack: () => void
}

const TODAY = new Date().toISOString().split('T')[0]

export default function ProductDetailPage({ product, onBack }: ProductDetailPageProps) {
  const [prices, setPrices] = useState<ProductPrice[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingPrice, setEditingPrice] = useState<ProductPrice | null>(null)

  const fetchPrices = async () => {
    setLoading(true)
    const data = await apiService.getProductPrices(product.id)
    setPrices(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPrices()
  }, [product.id])

  const handleDeletePrice = async (id: number) => {
    await apiService.deleteProductPrice(id)
    fetchPrices()
  }

  const handleEditPrice = (price: ProductPrice) => {
    setEditingPrice(price)
    setDialogOpen(true)
  }

  const handleAddPrice = () => {
    setEditingPrice(null)
    setDialogOpen(true)
  }

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      {/* Back nav */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 2, color: colorScale.charcoal[700] }}
      >
        All Products
      </Button>

      {/* Product info card */}
      <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {product.name}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {[
            { label: 'SKU',            value: product.sku },
            { label: 'Product Family', value: product.product_family ?? '—' },
            { label: 'Sellable',       value: product.is_sellable ? 'Yes' : 'No' },
            { label: 'Created',        value: new Date(product.created_at).toLocaleDateString() },
          ].map(({ label, value }) => (
            <Box key={label}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: colorScale.charcoal[500], textTransform: 'uppercase', letterSpacing: '0.4px', mb: 0.5 }}>
                {label}
              </Typography>
              <Typography sx={{ fontSize: 13 }}>{value}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Price history */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="h6">Price History</Typography>
        <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={handleAddPrice}>
          Schedule Price
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Effective Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Notes</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {prices.map((price) => {
                const isFuture = price.effective_at > TODAY
                return (
                  <TableRow
                    key={price.id}
                    sx={{ '&:hover': { bgcolor: colorScale.charcoal[50] } }}
                  >
                    <TableCell>{price.effective_at}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      ${price.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Typography
                        sx={{
                          fontSize: 11, fontWeight: 600, display: 'inline-block',
                          px: 1, py: '2px', borderRadius: '100px',
                          bgcolor: isFuture ? colorScale.blue[50] : colorScale.green[100],
                          color:   isFuture ? colorScale.blue[500] : colorScale.green[600],
                        }}
                      >
                        {isFuture ? 'Scheduled' : 'Active'}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: colorScale.charcoal[600] }}>
                      {price.notes ?? '—'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEditPrice(price)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeletePrice(price.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              })}
              {prices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: colorScale.charcoal[400] }}>
                    No prices yet. Schedule one above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <PriceFormDialog
        open={dialogOpen}
        price={editingPrice}
        productId={product.id}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          setDialogOpen(false)
          fetchPrices()
        }}
      />
    </Box>
  )
}

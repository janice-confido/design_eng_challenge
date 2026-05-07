/**
 * ProductsPage
 *
 * NOTE FOR CANDIDATES: This component is intentionally written as a single
 * monolith. One of the goals of the challenge is to identify opportunities
 * to decompose it into well-structured, reusable pieces.
 */
import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
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
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material'
import { colorScale } from '../theme'
import { ProductWithPricing, Product } from '../types'
import { apiService } from '../api/products'
import ProductFormDialog from './ProductFormDialog'

interface ProductsPageProps {
  onSelectProduct: (product: Product) => void
}

export default function ProductsPage({ onSelectProduct }: ProductsPageProps) {
  const [products, setProducts] = useState<ProductWithPricing[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const fetchProducts = async () => {
    setLoading(true)
    const data = await apiService.getProducts()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: number) => {
    await apiService.deleteProduct(id)
    fetchProducts()
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setDialogOpen(true)
  }

  const handleAddNew = () => {
    setEditingProduct(null)
    setDialogOpen(true)
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Products</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddNew}>
          Add Product
        </Button>
      </Box>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Family</TableCell>
                <TableCell>Sellable</TableCell>
                <TableCell>Current Price</TableCell>
                <TableCell>Next Price</TableCell>
                <TableCell>Next Effective Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product.id}
                  sx={{ '&:hover': { bgcolor: colorScale.charcoal[50] } }}
                >
                  <TableCell>
                    <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                      {product.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: colorScale.charcoal[700] }}>
                    {product.sku}
                  </TableCell>
                  <TableCell sx={{ color: colorScale.charcoal[600] }}>
                    {product.product_family ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        fontSize: 11, fontWeight: 600, display: 'inline-block',
                        px: 0.75, py: '2px', borderRadius: '3px',
                        bgcolor: product.is_sellable ? `${colorScale.green[500]}20` : colorScale.charcoal[100],
                        color: product.is_sellable ? colorScale.green[600] : colorScale.charcoal[500],
                      }}
                    >
                      {product.is_sellable ? 'Yes' : 'No'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {product.current_price != null
                      ? `$${product.current_price.toFixed(2)}`
                      : <span style={{ color: colorScale.charcoal[400] }}>—</span>}
                  </TableCell>
                  <TableCell>
                    {product.next_price != null
                      ? `$${product.next_price.toFixed(2)}`
                      : <span style={{ color: colorScale.charcoal[400] }}>—</span>}
                  </TableCell>
                  <TableCell sx={{ color: colorScale.charcoal[600] }}>
                    {product.next_price_date ?? <span style={{ color: colorScale.charcoal[400] }}>—</span>}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" title="View details" onClick={() => onSelectProduct(product)}>
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" title="Edit product" onClick={() => handleEdit(product)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      title="Delete product"
                      onClick={() => handleDelete(product.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ProductFormDialog
        open={dialogOpen}
        product={editingProduct}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => {
          setDialogOpen(false)
          fetchProducts()
        }}
      />
    </Box>
  )
}

/**
 * ProductDetailDialog
 *
 *
 *
 * Uses EditableDetailDialog shell (view/edit/delete modes + confirmations).
 */
import React, { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  AddCircleOutline as AddCircleOutlineIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { EditableDetailDialog } from './shared/EditableDetailDialog'
import { DisplayField } from './shared/DisplayField'
import PriceFormDialog from './PriceFormDialog'
import { Product, ProductFormValues, ProductPrice, ProductWithPricing } from '../types'
import { apiService as productApiService } from '../api/products'
import { apiService as priceApiService } from '../api/prices'
import { isObjectEqual } from '../utils/common'

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProductDetailDialogProps {
  open: boolean
  onClose: () => void
  product: ProductWithPricing | null   // null = create mode
  onSave: (updated: Product) => void
  onDelete: (id: number) => void
}

const TODAY = new Date().toISOString().split('T')[0]

const defaultFields: ProductFormValues = {
  name: '',
  sku: '',
  upc: '',
  product_family: '',
  is_sellable:    true,
  is_pack:        false,
  lifecycle_stage: 'Active',
}

// ── Component ─────────────────────────────────────────────────────────────────

export const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  open,
  onClose,
  product,
  onSave,
  onDelete,
}) => {
  const isNewItem = !product?.id

  // ── Basic info state ──────────────────────────────────────────────────────
  const [editMode, setEditMode] = useState(isNewItem)
  const [fields, setFields] = useState<ProductFormValues>(defaultFields)
  const [errors, setErrors] = useState<Partial<ProductFormValues>>({})

  // ── Price history state ───────────────────────────────────────────────────
  const [prices, setPrices]           = useState<ProductPrice[]>([])
  const [pricesLoading, setPricesLoading] = useState(false)
  const [pricePage, setPricePage]     = useState(0)
  const [priceRowsPerPage]            = useState(5)
  const [priceDialogOpen, setPriceDialogOpen] = useState(false)
  const [editingPrice, setEditingPrice] = useState<ProductPrice | null>(null)

  // ── Derived ───────────────────────────────────────────────────────────────
  const hasUnsavedChanges = useMemo(() => {
    if (isNewItem || !product) return false
    return !isObjectEqual(fields, {
      name:            product.name,
      sku:             product.sku,
      upc:             product.upc ?? '',
      product_family:  product.product_family ?? '',
      is_sellable:     product.is_sellable,
      is_pack:         product.is_pack,
      lifecycle_stage: product.lifecycle_stage,
    })
  }, [fields, product, isNewItem])

  const isReadyForSave = !!fields.name.trim() && !!fields.sku.trim()

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    setFields(
      product
        ? { name: product.name, sku: product.sku, upc: product.upc ?? '', product_family: product.product_family ?? '', is_sellable: product.is_sellable, is_pack: product.is_pack, lifecycle_stage: product.lifecycle_stage }
        : defaultFields
    )
    setErrors({})
    setEditMode(isNewItem)
  }, [open, product])

  useEffect(() => {
    if (!open || isNewItem || !product?.id) return
    fetchPrices()
  }, [open, product?.id])

  const fetchPrices = async () => {
    if (!product?.id) return
    setPricesLoading(true)
    const data = await priceApiService.getProductPrices(product.id)
    setPrices(data)
    setPricesLoading(false)
  }

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCreate = async (): Promise<boolean> => {
    if (!isReadyForSave) return false
    try {
      const created = await productApiService.createProduct(fields)
      onSave(created)
      return true
    } catch { return false }
  }

  const handleUpdate = async (): Promise<boolean> => {
    if (!product || !isReadyForSave) return false
    try {
      const updated = await productApiService.updateProduct(product.id, fields)
      onSave(updated)
      return true
    } catch { return false }
  }

  const handleDelete = async (): Promise<boolean> => {
    if (!product) return false
    try {
      await productApiService.deleteProduct(product.id)
      onDelete(product.id)
      return true
    } catch { return false }
  }

  const handleDeletePrice = async (id: number) => {
    await priceApiService.deleteProductPrice(id)
    fetchPrices()
  }

  const set = (field: keyof ProductFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((prev) => ({ ...prev, [field]: e.target.value }))

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <EditableDetailDialog
        open={open}
        onClose={onClose}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onDiscard={() => setFields(
          product
            ? { name: product.name, sku: product.sku, upc: product.upc ?? '', product_family: product.product_family ?? '', is_sellable: product.is_sellable, is_pack: product.is_pack, lifecycle_stage: product.lifecycle_stage }
            : defaultFields
        )}
        editMode={editMode}
        setEditMode={setEditMode}
        isNewItem={isNewItem}
        itemLabel="Sellable Unit"
        hasUnsavedChanges={hasUnsavedChanges}
        isReadyForSave={isReadyForSave}
        enableDelete={!isNewItem}
      >
        <Grid container spacing={4}>

          {/* ── Left: Basic Information ───────────────────────────────────── */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Basic Information</Typography>

            <Box sx={{ mb: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={fields.is_sellable}
                    onChange={(_, v) => setFields((p) => ({ ...p, is_sellable: v }))}
                    disabled={!editMode}
                  />
                }
                label="Purchasable by Consumer?"
              />
            </Box>

            {editMode ? (
              <>
                <TextField
                  label="Name"
                  value={fields.name}
                  onChange={set('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                  required fullWidth size="small" variant="outlined" margin="normal"
                />
                <TextField
                  label="SKU"
                  value={fields.sku}
                  onChange={set('sku')}
                  error={!!errors.sku}
                  helperText={errors.sku ?? 'Must be unique. Will be uppercased automatically.'}
                  required fullWidth size="small" variant="outlined" margin="normal"
                />
                <TextField
                  label="UPC"
                  value={fields.upc}
                  onChange={set('upc')}
                  placeholder="e.g. 856088003750"
                  helperText="12-digit Universal Product Code (optional)"
                  fullWidth size="small" variant="outlined" margin="normal"
                />
                <TextField
                  label="Product Family"
                  value={fields.product_family}
                  onChange={set('product_family')}
                  placeholder="e.g. Beverages, Snacks"
                  fullWidth size="small" variant="outlined" margin="normal"
                />
              </>
            ) : (
              <>
                <DisplayField title="Name"           value={fields.name} />
                <DisplayField title="SKU"            value={fields.sku} />
                <DisplayField title="UPC"            value={fields.upc || null} />
                <DisplayField title="Product Family" value={fields.product_family || null} />
                {product && (
                  <Box sx={{ mt: 2 }}>
                    <Typography sx={{ fontSize: 14, opacity: 0.6, mb: 0.5 }}>Created</Typography>
                    <Typography sx={{ fontSize: 16, opacity: 0.87 }}>
                      {new Date(product.created_at).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </>
            )}
          </Grid>

          {!isNewItem && (
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>Price History</Typography>

              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={() => { setEditingPrice(null); setPriceDialogOpen(true) }}
                >
                  Schedule Price
                </Button>
              </Stack>

              {/* Price table */}
              <TableContainer>
                <Table size="small" aria-label="price history">
                  <TableHead>
                    <TableRow>
                      <TableCell><Typography sx={{ fontWeight: 500 }} component="span">Effective Date</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: 500 }} component="span">Amount</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: 500 }} component="span">Status</Typography></TableCell>
                      <TableCell><Typography sx={{ fontWeight: 500 }} component="span">Notes</Typography></TableCell>
                      <TableCell align="right"><Typography sx={{ fontWeight: 500 }} component="span">Actions</Typography></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pricesLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>Loading…</TableCell>
                      </TableRow>
                    ) : prices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                          No prices yet. Schedule one above.
                        </TableCell>
                      </TableRow>
                    ) : (
                      prices
                        .slice(pricePage * priceRowsPerPage, pricePage * priceRowsPerPage + priceRowsPerPage)
                        .map((price) => {
                          const isFuture = price.effective_at > TODAY
                          return (
                            <TableRow key={price.id} sx={{ '&:last-child td': { border: 0 } }}>
                              <TableCell>{price.effective_at}</TableCell>
                              <TableCell sx={{ fontWeight: 500 }}>${price.amount.toFixed(2)}</TableCell>
                              <TableCell>
                                <Chip
                                  label={isFuture ? 'Scheduled' : 'Active'}
                                  color={isFuture ? 'info' : 'success'}
                                  size="small"
                                />
                              </TableCell>
                              <TableCell sx={{ color: 'text.secondary' }}>{price.notes ?? '—'}</TableCell>
                              <TableCell align="right">
                                <Tooltip title="Edit price">
                                  <IconButton size="small" onClick={() => { setEditingPrice(price); setPriceDialogOpen(true) }}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete price">
                                  <IconButton size="small" onClick={() => handleDeletePrice(price.id)}>
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          )
                        })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              {prices.length > priceRowsPerPage && (
                <TablePagination
                  rowsPerPageOptions={[5]}
                  component="div"
                  count={prices.length}
                  rowsPerPage={priceRowsPerPage}
                  page={pricePage}
                  onPageChange={(_, p) => setPricePage(p)}
                  onRowsPerPageChange={() => {}}
                />
              )}
            </Grid>
          )}
        </Grid>
      </EditableDetailDialog>

      {/* Price form */}
      {product?.id && (
        <PriceFormDialog
          open={priceDialogOpen}
          price={editingPrice}
          productId={product.id}
          onClose={() => setPriceDialogOpen(false)}
          onSuccess={() => { setPriceDialogOpen(false); fetchPrices() }}
        />
      )}
    </>
  )
}

import React, { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  TextField,
} from '@mui/material'
import { Product, ProductFormValues } from '../types'
import { apiService } from '../api/products'

interface ProductFormDialogProps {
  open: boolean
  product: Product | null  // null = create mode
  onClose: () => void
  onSuccess: () => void
}

const EMPTY: ProductFormValues = { name: '', sku: '', product_family: '', is_sellable: true }

export default function ProductFormDialog({
  open,
  product,
  onClose,
  onSuccess,
}: ProductFormDialogProps) {
  const [values, setValues] = useState<ProductFormValues>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({})

  useEffect(() => {
    if (open) {
      setValues(
        product
          ? {
              name:           product.name,
              sku:            product.sku,
              product_family: product.product_family ?? '',
              is_sellable:    product.is_sellable,
            }
          : EMPTY
      )
      setErrors({})
    }
  }, [open, product])

  const validate = (): boolean => {
    const next: Partial<Record<keyof ProductFormValues, string>> = {}
    if (!values.name.trim()) next.name = 'Name is required'
    if (!values.sku.trim())  next.sku  = 'SKU is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (product) {
        await apiService.updateProduct(product.id, values)
      } else {
        await apiService.createProduct(values)
      }
      onSuccess()
    } catch (err: unknown) {
      // TODO: surface error to user
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const setField = (field: keyof ProductFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{product ? 'Edit Product' : 'Add Product'}</DialogTitle>
      <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Name"
          value={values.name}
          onChange={setField('name')}
          error={!!errors.name}
          helperText={errors.name}
          required
          fullWidth
          autoFocus
        />
        <TextField
          label="SKU"
          value={values.sku}
          onChange={setField('sku')}
          error={!!errors.sku}
          helperText={errors.sku ?? 'Must be unique. Will be uppercased automatically.'}
          required
          fullWidth
        />
        <TextField
          label="Product Family"
          value={values.product_family}
          onChange={setField('product_family')}
          placeholder="e.g. Beverages, Snacks"
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={values.is_sellable}
              onChange={(e) => setValues((prev) => ({ ...prev, is_sellable: e.target.checked }))}
            />
          }
          label="Is Sellable"
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving…' : product ? 'Save Changes' : 'Create Product'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

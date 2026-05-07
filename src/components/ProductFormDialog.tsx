/**
 * ProductFormDialog — create or edit a product.
 */
import React, { useEffect, useState } from 'react'
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Product, ProductFormValues, LIFECYCLE_STAGES } from '../types'
import { apiService } from '../api/products'

interface ProductFormDialogProps {
  open: boolean
  product: Product | null
  onClose: () => void
  onSuccess: () => void
}

const EMPTY: ProductFormValues = {
  name: '', sku: '', upc: '', product_family: '',
  is_sellable: true, is_pack: false, lifecycle_stage: 'Active',
}

export default function ProductFormDialog({ open, product, onClose, onSuccess }: ProductFormDialogProps) {
  const [values, setValues] = useState<ProductFormValues>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormValues, string>>>({})

  useEffect(() => {
    if (open) {
      setValues(product
        ? {
            name: product.name, sku: product.sku, upc: product.upc ?? '',
            product_family: product.product_family ?? '',
            is_sellable: product.is_sellable, is_pack: product.is_pack,
            lifecycle_stage: product.lifecycle_stage,
          }
        : EMPTY)
      setErrors({})
    }
  }, [open, product])

  const validate = () => {
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
      if (product) { await apiService.updateProduct(product.id, values) }
      else         { await apiService.createProduct(values) }
      onSuccess()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const set = (field: keyof ProductFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => setValues(p => ({ ...p, [field]: e.target.value }))

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography component="div" variant="h6" sx={{ fontWeight: 500 }}>
          {product ? 'Edit Product' : 'New Sellable Unit'}
        </Typography>
        <IconButton aria-label="close" onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField label="Name" value={values.name} onChange={set('name')}
              error={!!errors.name} helperText={errors.name} required fullWidth autoFocus />
          </Grid>
          <Grid item xs={12}>
            <TextField label="SKU" value={values.sku} onChange={set('sku')}
              error={!!errors.sku} helperText={errors.sku ?? 'Must be unique. Will be uppercased automatically.'}
              required fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="UPC" value={values.upc} onChange={set('upc')}
              placeholder="e.g. 856088003750"
              helperText="12-digit Universal Product Code (optional)" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Product Family" value={values.product_family} onChange={set('product_family')}
              placeholder="e.g. Beverages, Snacks" fullWidth />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Lifecycle Stage</InputLabel>
              <Select label="Lifecycle Stage" value={values.lifecycle_stage}
                onChange={e => setValues(p => ({ ...p, lifecycle_stage: e.target.value as ProductFormValues['lifecycle_stage'] }))}>
                {LIFECYCLE_STAGES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Checkbox checked={values.is_sellable}
                onChange={e => setValues(p => ({ ...p, is_sellable: e.target.checked }))} />}
              label="Is Sellable" />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={<Checkbox checked={values.is_pack}
                onChange={e => setValues(p => ({ ...p, is_pack: e.target.checked }))} />}
              label="Is Pack" />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving…' : product ? 'Save Changes' : 'Create Product'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

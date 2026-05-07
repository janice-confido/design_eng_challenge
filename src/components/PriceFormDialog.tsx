/**
 * PriceFormDialog — schedule or edit a product price (used inside ProductDetailDialog).
 */
import React, { useEffect, useState } from 'react'
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  Grid, IconButton, TextField, Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { AutocompleteItem, ProductPrice, ProductPriceFormValues } from '../types'
import { apiService } from '../api/prices'
import { CustomerDropdown } from './Dropdowns/CustomerDropdown'
import { DistributionCenterDropdown } from './Dropdowns/DistributionCenterDropdown'

interface PriceFormDialogProps {
  open: boolean
  price: ProductPrice | null
  productId: number
  onClose: () => void
  onSuccess: () => void
}

const EMPTY: ProductPriceFormValues = {
  amount: '', effective_at: '', customer: null, distribution_center: null, notes: '',
}

export default function PriceFormDialog({ open, price, productId, onClose, onSuccess }: PriceFormDialogProps) {
  const [values, setValues] = useState<ProductPriceFormValues>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  useEffect(() => {
    if (open) {
      setValues(price ? {
        amount:              String(price.amount),
        effective_at:        price.effective_at,
        customer:            price.customer ? { id: price.customer, display: price.customer } : null,
        distribution_center: price.distribution_center ? { id: price.distribution_center, display: price.distribution_center } : null,
        notes:               price.notes ?? '',
      } : EMPTY)
      setErrors({})
    }
  }, [open, price])

  const validate = (): boolean => {
    const next: Partial<Record<string, string>> = {}
    if (!values.amount || isNaN(parseFloat(values.amount)) || parseFloat(values.amount) <= 0)
      next.amount = 'Enter a price greater than $0'
    if (!values.effective_at) next.effective_at = 'Effective date is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (price) { await apiService.updateProductPrice(price.id, values) }
      else       { await apiService.createProductPrice(productId, values) }
      onSuccess()
    } catch (err) { console.error(err) }
    finally { setSaving(false) }
  }

  const setCustomer = (_: React.SyntheticEvent, val: AutocompleteItem | null) =>
    setValues((p) => ({ ...p, customer: val, distribution_center: null }))

  const setDC = (_: React.SyntheticEvent, val: AutocompleteItem | null) =>
    setValues((p) => ({ ...p, distribution_center: val }))

  const isFuture = values.effective_at > new Date().toISOString().split('T')[0]

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography component="div" variant="h6" sx={{ fontWeight: 500 }}>
          {price ? 'Edit Price' : 'Schedule Price'}
        </Typography>
        <IconButton aria-label="close" onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12} md={6}>
            <CustomerDropdown
              label="Customer"
              value={values.customer}
              onChange={setCustomer}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <DistributionCenterDropdown
              label="Distribution Center"
              customerId={values.customer?.id ?? null}
              value={values.distribution_center}
              onChange={setDC}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Effective Date"
              type="date"
              value={values.effective_at}
              onChange={(e) => setValues((p) => ({ ...p, effective_at: e.target.value }))}
              error={!!errors.effective_at}
              helperText={errors.effective_at ?? 'The date this price takes effect'}
              required fullWidth InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Amount ($)"
              type="number"
              inputProps={{ min: 0, step: '0.01' }}
              value={values.amount}
              onChange={(e) => setValues((p) => ({ ...p, amount: e.target.value }))}
              error={!!errors.amount}
              helperText={errors.amount}
              required fullWidth autoFocus
            />
          </Grid>
          {isFuture && values.effective_at && (
            <Grid item xs={12}>
              <Typography sx={{ fontSize: 13, color: 'info.main' }}>
                Future-dated — becomes active on {values.effective_at}.
              </Typography>
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              label="Notes"
              value={values.notes}
              onChange={(e) => setValues((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Optional reason or context"
              fullWidth multiline rows={2}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving…' : price ? 'Save Changes' : 'Schedule Price'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/**
 * PricingDialog — create/edit a price from the flat Pricing tab.
 *
 *   Product (select), Customer (AutocompleteDropdown), DC (AutocompleteDropdown),
 *   Effective At, Amount
 *
 *  - AutocompleteItem state: { id, display } objects stored, .display extracted on save
 *  - DistributionCenterDropdown keyed on customer.id so it resets when customer changes
 */
import React, { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { AutocompleteItem, Product, ProductPriceWithProduct, PricingFormValues } from '../types'
import { pricingApiService } from '../api/pricing'
import { CustomerDropdown } from './Dropdowns/CustomerDropdown'
import { DistributionCenterDropdown } from './Dropdowns/DistributionCenterDropdown'

interface PricingDialogProps {
  open: boolean
  price: ProductPriceWithProduct | null
  products: Product[]
  onClose: () => void
  onSuccess: () => void
}

const EMPTY: PricingFormValues = {
  product_id: '', amount: '', effective_at: '',
  customer: null, distribution_center: null, notes: '',
}

export const PricingDialog: React.FC<PricingDialogProps> = ({ open, price, products, onClose, onSuccess }) => {
  const [values, setValues] = useState<PricingFormValues>(EMPTY)
  const [saving, setSaving]  = useState(false)
  const [errors, setErrors]  = useState<Partial<Record<string, string>>>({})

  useEffect(() => {
    if (!open) return
    setValues(price
      ? {
          product_id:          String(price.product_id),
          amount:              String(price.amount),
          effective_at:        price.effective_at,
          // Re-hydrate AutocompleteItem from stored display string
          customer:            price.customer ? { id: price.customer, display: price.customer } : null,
          distribution_center: price.distribution_center ? { id: price.distribution_center, display: price.distribution_center } : null,
          notes:               price.notes ?? '',
        }
      : EMPTY)
    setErrors({})
  }, [open, price])

  const validate = (): boolean => {
    const next: Partial<Record<string, string>> = {}
    if (!values.product_id)                               next.product_id   = 'Required'
    if (!values.amount || parseFloat(values.amount) <= 0) next.amount       = 'Enter a price > $0'
    if (!values.effective_at)                             next.effective_at = 'Required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (price) { await pricingApiService.updatePrice(price.id, values) }
      else       { await pricingApiService.createPrice(values) }
      onSuccess()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const setCustomer = (_: React.SyntheticEvent, val: AutocompleteItem | null) =>
    setValues((p) => ({ ...p, customer: val, distribution_center: null }))

  const setDC = (_: React.SyntheticEvent, val: AutocompleteItem | null) =>
    setValues((p) => ({ ...p, distribution_center: val }))

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography component="div" variant="h6" sx={{ fontWeight: 500 }}>
          {price ? 'Edit Price' : 'New Price'}
        </Typography>
        <IconButton aria-label="close" onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>

          <Grid item xs={12}>
            <FormControl fullWidth required error={!!errors.product_id}>
              <InputLabel>Product</InputLabel>
              <Select
                label="Product"
                value={values.product_id}
                onChange={(e) => setValues((p) => ({ ...p, product_id: e.target.value as string }))}
                disabled={!!price}
              >
                {products.map((p) => (
                  <MenuItem key={p.id} value={String(p.id)}>{p.name}</MenuItem>
                ))}
              </Select>
              {errors.product_id && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                  {errors.product_id}
                </Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <CustomerDropdown
              label="Customer"
              value={values.customer}
              onChange={setCustomer}
              variant="outlined"
            />
          </Grid>

          {/* DC — keyed on customer.id, resets when customer changes */}
          <Grid item xs={12} md={6}>
            <DistributionCenterDropdown
              label="Distribution Center"
              customerId={values.customer?.id ?? null}
              value={values.distribution_center}
              onChange={setDC}
              variant="outlined"
            />
          </Grid>

          {/* Effective At */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Effective Date"
              type="date"
              value={values.effective_at}
              onChange={(e) => setValues((p) => ({ ...p, effective_at: e.target.value }))}
              error={!!errors.effective_at}
              helperText={errors.effective_at ?? 'Date this price takes effect'}
              required fullWidth InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {/* Amount */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Amount ($)"
              type="number"
              inputProps={{ min: 0, step: '0.01' }}
              value={values.amount}
              onChange={(e) => setValues((p) => ({ ...p, amount: e.target.value }))}
              error={!!errors.amount}
              helperText={errors.amount}
              required fullWidth
            />
          </Grid>

          {/* Notes */}
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
          {saving ? 'Saving…' : price ? 'Save Changes' : 'Create Price'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

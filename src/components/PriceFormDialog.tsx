import React, { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import { ProductPrice, ProductPriceFormValues } from '../types'
import { apiService } from '../api/prices'
import { colorScale } from '../theme'

interface PriceFormDialogProps {
  open: boolean
  price: ProductPrice | null   // null = create mode
  productId: number
  onClose: () => void
  onSuccess: () => void
}

const EMPTY: ProductPriceFormValues = { amount: '', effective_at: '', notes: '' }

export default function PriceFormDialog({
  open,
  price,
  productId,
  onClose,
  onSuccess,
}: PriceFormDialogProps) {
  const [values, setValues] = useState<ProductPriceFormValues>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<ProductPriceFormValues>>({})

  useEffect(() => {
    if (open) {
      setValues(
        price
          ? { amount: String(price.amount), effective_at: price.effective_at, notes: price.notes ?? '' }
          : EMPTY
      )
      setErrors({})
    }
  }, [open, price])

  const validate = (): boolean => {
    const next: Partial<ProductPriceFormValues> = {}
    if (!values.amount || isNaN(parseFloat(values.amount)) || parseFloat(values.amount) <= 0)
      next.amount = 'Enter a price greater than $0'
    if (!values.effective_at)
      next.effective_at = 'Effective date is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (price) {
        await apiService.updateProductPrice(price.id, values)
      } else {
        await apiService.createProductPrice(productId, values)
      }
      onSuccess()
    } catch (err: unknown) {
      // TODO: surface error to user
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const set = (field: keyof ProductPriceFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value }))

  const isFuture = values.effective_at > new Date().toISOString().split('T')[0]

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{price ? 'Edit Price' : 'Schedule Price'}</DialogTitle>
      <DialogContent sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Amount ($)"
          type="number"
          inputProps={{ min: 0, step: '0.01' }}
          value={values.amount}
          onChange={set('amount')}
          error={!!errors.amount}
          helperText={errors.amount}
          required
          fullWidth
          autoFocus
        />
        <TextField
          label="Effective Date"
          type="date"
          value={values.effective_at}
          onChange={set('effective_at')}
          error={!!errors.effective_at}
          helperText={errors.effective_at ?? 'The date this price takes effect'}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
        />
        {isFuture && values.effective_at && (
          <Typography sx={{ fontSize: 12, color: colorScale.blue[500] }}>
            This is a future-dated price — it will become active on {values.effective_at}.
          </Typography>
        )}
        <TextField
          label="Notes"
          value={values.notes}
          onChange={set('notes')}
          placeholder="Optional reason or context"
          fullWidth
          multiline
          rows={2}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving…' : price ? 'Save Changes' : 'Schedule Price'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/**
 * RetailerPriceDialog — create/edit a retailer price.
 *
 *   Row 1: PlanningGroupDropdown | ShipToSelect (auto-filters by planning group)
 *   Row 2: Case (text) | Price
 *
 *  - ShipToSelect filters distributors by planning group and auto-selects first
 *  - When planning group changes, Ship To resets automatically
 */
import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { AutocompleteItem, RetailerPrice, RetailerPriceFormValues } from '../types'
import { retailerPricesApiService } from '../api/retailerPrices'
import { PlanningGroupDropdown } from './Dropdowns/PlanningGroupDropdown'
import { ShipToSelect } from './Dropdowns/ShipToSelect'

interface RetailerPriceDialogProps {
  open: boolean
  price: RetailerPrice | null
  onClose: () => void
  onSuccess: () => void
}

const EMPTY: RetailerPriceFormValues = {
  planning_group: null, customer: null, case_name: '', price: '',
}

export const RetailerPriceDialog: React.FC<RetailerPriceDialogProps> = ({ open, price, onClose, onSuccess }) => {
  const [values, setValues] = useState<RetailerPriceFormValues>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  useEffect(() => {
    if (!open) return
    setValues(price
      ? {
          planning_group: price.planning_group ? { id: price.planning_group, display: price.planning_group } : null,
          customer:       price.customer       ? { id: price.customer,       display: price.customer       } : null,
          case_name:      price.case_name,
          price:          String(price.price),
        }
      : EMPTY)
    setErrors({})
  }, [open, price])

  const validate = (): boolean => {
    const next: Partial<Record<string, string>> = {}
    if (!values.planning_group)       next.planning_group = 'Required'
    if (!values.case_name.trim())     next.case_name      = 'Required'
    if (!values.price || parseFloat(values.price) <= 0) next.price = 'Enter a price > $0'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      if (price) { await retailerPricesApiService.update(price.id, values) }
      else       { await retailerPricesApiService.create(values) }
      onSuccess()
    } catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  const setPG = (_: React.SyntheticEvent, val: AutocompleteItem | null) =>
    // Reset Ship To when planning group changes — ShipToSelect will auto-select first
    setValues((p) => ({ ...p, planning_group: val, customer: null }))

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography component="div" variant="h6" sx={{ fontWeight: 500 }}>
          {price ? 'Edit Retailer Pricing' : 'New Retailer Pricing'}
        </Typography>
        <IconButton aria-label="close" onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 1 }}>

          <Box display="flex" gap={2} mb={2}>
            <Box flex={1}>
              <PlanningGroupDropdown
                label="Planning Group"
                value={values.planning_group}
                onChange={setPG}
                required
                error={!!errors.planning_group}
                helperText={errors.planning_group}
                variant="outlined"
              />
            </Box>
            <Box flex={1}>
              <ShipToSelect
                planningGroup={values.planning_group}
                value={values.customer}
                onChange={(val) => setValues((p) => ({ ...p, customer: val }))}
                disabled={!values.planning_group}
              />
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            <Box flex={1}>
              <TextField
                label="Case"
                value={values.case_name}
                onChange={(e) => setValues((p) => ({ ...p, case_name: e.target.value }))}
                error={!!errors.case_name}
                helperText={errors.case_name ?? 'e.g. Blueberry 6PK'}
                required fullWidth
              />
            </Box>
            <Box flex={1}>
              <TextField
                label="Price ($)"
                type="number"
                inputProps={{ min: 0, step: '0.01' }}
                value={values.price}
                onChange={(e) => setValues((p) => ({ ...p, price: e.target.value }))}
                error={!!errors.price}
                helperText={errors.price}
                required fullWidth
              />
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button variant="outlined" onClick={onClose} disabled={saving}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving…' : price ? 'Save Changes' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

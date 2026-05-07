/**
 * FilterModalButton — opens a filter dialog matching the production FilterModal.
 *
 *
 * Key production patterns reproduced:
 *  - Modal title "Filters" (or custom) with absolute X close button
 *  - Each field: Typography label ABOVE the input (not floating label)
 *  - Autocomplete Select with "Select..." placeholder (mirrors SelectField)
 *  - Date input for date-type fields
 *  - "Apply Filters" primary button, "Cancel" secondary button
 *  - Width ≈ 40vw
 */
import React, { useState } from 'react'
import {
  Autocomplete,
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
import { FilterAlt as FilterAltIcon } from '@mui/icons-material'
import CloseIcon from '@mui/icons-material/Close'

export type FieldType = 'text' | 'select' | 'date' | 'boolean'

export interface FilterFieldDef<F> {
  key: keyof F & string
  label: string
  type: FieldType
  options?: { value: string; label: string }[]
}

interface FilterModalButtonProps<F extends Record<string, string | undefined>> {
  title?: string
  fields: FilterFieldDef<F>[]
  filterParams: Partial<F>
  onApply: (params: Partial<F>) => void
  buttonProps?: { variant?: 'outlined' | 'contained'; size?: 'small' | 'medium' }
}

export const FilterModalButton = <F extends Record<string, string | undefined>>({
  title = 'Filters',
  fields,
  filterParams,
  onApply,
  buttonProps,
}: FilterModalButtonProps<F>) => {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<Partial<F>>({})

  const handleOpen = () => {
    setDraft({ ...filterParams })
    setOpen(true)
  }

  const handleApply = () => {
    const cleaned = Object.fromEntries(
      Object.entries(draft).filter(([, v]) => v !== '' && v !== undefined)
    ) as Partial<F>
    onApply(cleaned)
    setOpen(false)
  }

  const handleClose = () => setOpen(false)

  const set = (key: string, value: string | undefined) =>
    setDraft((prev) => ({ ...prev, [key]: value }))

  return (
    <>
      <Button
        variant={buttonProps?.variant ?? 'outlined'}
        size={buttonProps?.size ?? 'medium'}
        startIcon={<FilterAltIcon />}
        onClick={handleOpen}
      >
        Filter
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        PaperProps={{ sx: { width: '40vw', maxWidth: '600px' } }}
      >
        {/* Title — matches production Modal: Typography h6 + absolute close button */}
        <DialogTitle sx={{ pr: 6 }}>
          <Typography component="div" variant="h6" sx={{ fontWeight: 500 }}>
            {title}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {/* Content — label above input, matching production Grid container spacing={2} */}
        <DialogContent>
          <Grid container spacing={0}>
            {fields.map((field) => {
              const rawValue = (draft[field.key] as string) ?? ''

              const opts =
                field.type === 'boolean'
                  ? [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }]
                  : field.options ?? []

              return (
                <Grid item xs={12} sx={{ mb: 3 }} key={field.key}>
                  {/* Label above — matches production Typography sx={{ fontSize: 14 }} color="text.secondary" */}
                  <Typography
                    sx={{ fontSize: 14, mb: 0.75 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    {field.label}
                  </Typography>

                  {field.type === 'date' ? (
                    <TextField
                      type="date"
                      size="small"
                      fullWidth
                      value={rawValue}
                      onChange={(e) => set(field.key, e.target.value || undefined)}
                      InputLabelProps={{ shrink: true }}
                      variant="outlined"
                    />
                  ) : (
                    /* SelectField equivalent — Autocomplete with "Select..." placeholder */
                    <Autocomplete
                      options={opts}
                      getOptionLabel={(o) => o.label}
                      value={opts.find((o) => o.value === rawValue) ?? null}
                      onChange={(_, selected) => set(field.key, selected?.value ?? undefined)}
                      size="small"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Select..."
                          variant="outlined"
                        />
                      )}
                      isOptionEqualToValue={(o, v) => o.value === v.value}
                    />
                  )}
                </Grid>
              )
            })}
          </Grid>
        </DialogContent>

        {/* Actions — matches production: secondary="Cancel" primary="Apply Filters" */}
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

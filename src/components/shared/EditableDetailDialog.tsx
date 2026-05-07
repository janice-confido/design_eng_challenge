/**
 * EditableDetailDialog — view/edit/create/delete dialog shell.
 * - DialogTitle with absolute close button
 * - LinearProgress under title when loading
 * - DialogContent with dividers
 * - DialogActions: Delete (left) | Cancel / Save (right)
 */
import React, { ReactNode, useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ConfirmDialog from './ConfirmDialog'

interface EditableDetailDialogProps {
  open: boolean
  onClose: () => void
  onCreate: () => Promise<boolean>
  onUpdate: () => Promise<boolean>
  onDelete: () => Promise<boolean>
  onDiscard: () => void
  children: ReactNode
  itemLabel?: string
  isNewItem?: boolean
  editMode: boolean
  setEditMode: (v: boolean) => void
  hasUnsavedChanges?: boolean
  isReadyForSave?: boolean
  enableDelete?: boolean
}

export const EditableDetailDialog: React.FC<EditableDetailDialogProps> = ({
  open,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
  onDiscard,
  children,
  itemLabel = 'Item',
  isNewItem = true,
  editMode,
  setEditMode,
  hasUnsavedChanges,
  isReadyForSave = true,
  enableDelete = true,
}) => {
  const [loading, setLoading]           = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [discardConfirm, setDiscardConfirm] = useState(false)

  useEffect(() => { setEditMode(isNewItem) }, [isNewItem])

  const saveDisabled = (!isNewItem && !hasUnsavedChanges) || !isReadyForSave

  const handleClose = () => {
    if (editMode && hasUnsavedChanges) { setDiscardConfirm(true) }
    else { onClose() }
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) { setDiscardConfirm(true) }
    else { setEditMode(false) }
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const ok = isNewItem ? await onCreate() : await onUpdate()
      if (ok) setEditMode(false)
    } finally { setLoading(false) }
  }

  const handleDelete = async () => {
    setLoading(true)
    try {
      const ok = await onDelete()
      if (ok) { setDeleteConfirm(false); onClose() }
    } finally { setLoading(false) }
  }

  const handleDiscard = () => {
    onDiscard(); setEditMode(false); setDiscardConfirm(false)
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>
          <Typography component="div" variant="h6" sx={{ fontWeight: 500 }}>
            {isNewItem ? `New ${itemLabel}` : `${itemLabel} Details`}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: 'grey.500' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        {loading && <LinearProgress />}

        <DialogContent dividers>{children}</DialogContent>

        <DialogActions>
          <Grid container justifyContent="space-between" alignItems="center" sx={{ px: 1 }}>
            {/* Delete — left side */}
            <Grid item>
              {!isNewItem && !editMode && enableDelete && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => setDeleteConfirm(true)}
                  disabled={loading}
                >
                  Delete
                </Button>
              )}
            </Grid>

            {/* Cancel / Save or Edit — right side */}
            <Grid item sx={{ display: 'flex', gap: 1 }}>
              {editMode ? (
                <>
                  {!isNewItem && (
                    <Button variant="outlined" onClick={handleCancel} disabled={loading}>
                      Cancel
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saveDisabled || loading}
                  >
                    Save
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={() => setEditMode(true)} disabled={loading}>
                  Edit
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirm}
        title={`Delete ${itemLabel}?`}
        message="This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />
      <ConfirmDialog
        open={discardConfirm}
        title="Discard unsaved changes?"
        message="You have unsaved changes. Are you sure you want to discard them?"
        confirmLabel="Discard"
        onConfirm={handleDiscard}
        onCancel={() => setDiscardConfirm(false)}
      />
    </>
  )
}

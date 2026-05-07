import { useCallback, useMemo } from 'react'
import { RowId, ValidRowModel } from '../types'
import { RowSelectionModel, RowSelectionProps } from './types'

export const useRowSelection = <R extends ValidRowModel>(
  rows: R[],
  rowSelectionProps: RowSelectionProps | undefined
): { rowSelectionModel: RowSelectionModel; onRowSelectionChange: (rowIds: RowId[], selected: boolean) => void } => {
  const { selectedRowIds, setSelectedRowIds } = rowSelectionProps || {}

  const rowSelectionModel: RowSelectionModel = useMemo(() => {
    if (!selectedRowIds) return { selectedRowIdSet: new Set<RowId>(), areAllRowsSelected: false, areSomeRowsSelected: false }
    const set = new Set(selectedRowIds)
    return {
      selectedRowIdSet: set,
      areAllRowsSelected: selectedRowIds.length > 0 && rows.every(r => set.has(r.id)),
      areSomeRowsSelected: !rows.every(r => set.has(r.id)) && rows.some(r => set.has(r.id)),
    }
  }, [rows, selectedRowIds])

  const onRowSelectionChange = useCallback((rowIds: RowId[], selected: boolean) => {
    if (!setSelectedRowIds) return
    if (selected) setSelectedRowIds(prev => [...(Array.isArray(prev) ? prev : selectedRowIds || []), ...rowIds])
    else setSelectedRowIds((selectedRowIds || []).filter(id => !rowIds.includes(id)))
  }, [selectedRowIds, setSelectedRowIds])

  return { rowSelectionModel, onRowSelectionChange }
}

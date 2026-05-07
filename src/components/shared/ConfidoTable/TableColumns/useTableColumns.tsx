import { useMemo } from 'react'
import { ValidRowModel } from '../types'
import { ColumnPinnedState, ColumnPinningModel, ColumnVisibilityModel, ConfidoTableColumn, InnerTableColumn } from './types'
import { TABLE_CHECKBOX_FIELD, TABLE_DETAIL_TOGGLE_FIELD } from './constants'

export const useTableColumns = <R extends ValidRowModel>(
  columns: ConfidoTableColumn<R>[],
  columnVisibilityModel: ColumnVisibilityModel | undefined,
  columnPinningModel: ColumnPinningModel | undefined,
  hasCheckbox: boolean,
  hasDetailPanel: boolean
): { innerColumns: InnerTableColumn<R>[] } => {
  const innerColumns: InnerTableColumn<R>[] = useMemo(() => {
    let cols = [...columns]
    if (hasCheckbox && !cols.some(c => c.field === TABLE_CHECKBOX_FIELD))
      cols = [{ field: TABLE_CHECKBOX_FIELD, style: { width: 50 } }, ...cols]
    if (hasDetailPanel && !cols.some(c => c.field === TABLE_DETAIL_TOGGLE_FIELD))
      cols = [{ field: TABLE_DETAIL_TOGGLE_FIELD, style: { width: 50 } }, ...cols]

    const left: InnerTableColumn<R>[] = []
    const mid:  InnerTableColumn<R>[] = []
    const right: InnerTableColumn<R>[] = []

    for (const col of cols) {
      if (!(columnVisibilityModel?.[col.field] ?? !col.hide)) continue
      const pinned =
        columnPinningModel?.left  === col.field ? ColumnPinnedState.LEFT  :
        columnPinningModel?.right === col.field ? ColumnPinnedState.RIGHT :
        ColumnPinnedState.UNPINNED

      const c = { ...col, pinned }
      if (pinned === ColumnPinnedState.LEFT)  left.push(c)
      else if (pinned === ColumnPinnedState.RIGHT) right.push(c)
      else mid.push(c)
    }
    return [...left, ...mid, ...right]
  }, [columns, columnVisibilityModel, columnPinningModel, hasCheckbox, hasDetailPanel])

  return { innerColumns }
}

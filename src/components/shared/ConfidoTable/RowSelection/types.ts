import { RowId } from '../types'

export type RowSelectionProps = {
  selectedRowIds: RowId[]
  setSelectedRowIds: (selection: RowId[] | ((prev: RowId[]) => RowId[])) => void
}

export type RowSelectionModel = {
  selectedRowIdSet: Set<RowId>
  areAllRowsSelected: boolean
  areSomeRowsSelected: boolean
}

import { useMemo, useRef, useState } from 'react'
import { PaginationModel, PaginationProps, PageSizeOptions } from './types'
import { ValidRowModel } from '../types'
import { DEFAULT_PAGE_SIZE_OPTIONS, DEFAULT_PAGINATION_MODEL } from './constants'
import { ConfidoTablePaginationProps } from './ConfidoTablePagination'

export const usePagination = <R extends ValidRowModel>(
  filteredRows: R[],
  hasPagination: boolean | undefined,
  paginationProps: PaginationProps | undefined
): { paginatedRows: R[]; paginationComponentProps?: ConfidoTablePaginationProps } => {
  const {
    paginationModel: modelOverride,
    setPaginationModel: setModelOverride,
    pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
    initialPageSize,
    rowCount: rowCountOverride,
  } = paginationProps || {}

  const initialPageSizeVal = (() => {
    if (initialPageSize) return initialPageSize
    const first = pageSizeOptions[0]
    return first == null ? DEFAULT_PAGINATION_MODEL.pageSize : typeof first === 'number' ? first : first.value
  })()

  const [localModel, setLocalModel] = useState<PaginationModel>({ ...DEFAULT_PAGINATION_MODEL, pageSize: initialPageSizeVal })
  const rowCountRef = useRef(rowCountOverride ?? filteredRows.length)

  const rowCount = useMemo(() => {
    if (rowCountOverride !== undefined) rowCountRef.current = rowCountOverride
    else if (filteredRows.length) rowCountRef.current = filteredRows.length
    return rowCountRef.current
  }, [rowCountOverride, filteredRows.length])

  const paginationModel = modelOverride ?? localModel

  const handleChange = (m: PaginationModel) => {
    setModelOverride?.(m); setLocalModel(m)
  }

  const paginatedRows = useMemo(() => {
    if (paginationProps?.paginationMode === 'server') return filteredRows
    return filteredRows.slice(paginationModel.page * paginationModel.pageSize, (paginationModel.page + 1) * paginationModel.pageSize)
  }, [filteredRows, paginationModel, paginationProps?.paginationMode])

  if (!hasPagination) return { paginatedRows: filteredRows }
  return { paginatedRows, paginationComponentProps: { paginationModel, setPaginationModel: handleChange, pageSizeOptions, rowCount } }
}

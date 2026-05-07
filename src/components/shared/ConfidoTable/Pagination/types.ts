import { ConfidoTablePaginationProps } from './ConfidoTablePagination'

export interface PaginationProps extends Partial<ConfidoTablePaginationProps> {
  paginationMode?: 'client' | 'server'
  initialPageSize?: number
}

export interface PaginationModel { page: number; pageSize: number }
export type PageSizeOptions = (number | { value: number; label: string })[]

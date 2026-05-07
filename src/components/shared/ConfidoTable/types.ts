// Constraint is { id: RowId } only — domain types don't need an index signature
// because column definitions use typed valueGetter/renderCell accessors.

type RowId = string | number

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ValidRowModel = { id: RowId; [key: string]: any }

export type { RowId, ValidRowModel }

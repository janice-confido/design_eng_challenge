/**
 * ProductsPage
 *
 * NOTE FOR CANDIDATES: This component is intentionally written as a single
 * monolith. One of the goals of the challenge is to identify opportunities
 * to decompose it into well-structured, reusable pieces.
 *
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  AddCircleOutline as AddCircleOutlineIcon,
  Launch as LaunchIcon,
  Archive as ArchiveIcon,
  Unarchive as UnarchiveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FileUpload as FileUploadIcon,
} from '@mui/icons-material'
import { Chip } from '@mui/material'
import { Product, ProductPriceWithProduct, ProductWithPricing, RetailerPrice } from '../types'
import { apiService as productApiService } from '../api/products'
import { MetricBar } from './MetricBar'
import { highlightText } from '../utils/highlightText'
import { pricingApiService } from '../api/pricing'
import { retailerPricesApiService } from '../api/retailerPrices'
import { ConfidoTable, ConfidoTableColumn } from './shared/ConfidoTable'
import ProductFormDialog from './ProductFormDialog'
import { ProductDetailDialog } from './ProductDetailDialog'
import { PricingDialog } from './PricingDialog'
import { RetailerPriceDialog } from './RetailerPriceDialog'
import { FilterModalButton, FilterFieldDef } from './shared/FilterModalButton'
import { FilterChips, FilterChipDef } from './shared/FilterChips'
import { DownloadCSVButton } from './shared/DownloadCSVButton'

// ── Filter param shapes ────────────────────────────────────────────────────────
interface UnitFilters     { [k: string]: string | undefined; product_family?: string; is_sellable?: string }
interface PricingFilters  { [k: string]: string | undefined; product_id?: string; effective_at_after?: string }
interface RetailerFilters { [k: string]: string | undefined; planning_group?: string; customer?: string }

type TabValue = 'SELLABLE_UNIT' | 'PRICING' | 'RETAILER_PRICING'

// ── Helper ────────────────────────────────────────────────────────────────────
function toChips<F extends Record<string, string | undefined>>(
  params: Partial<F>, labels: Record<string, string>
): FilterChipDef[] {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => ({ key: k, label: `${labels[k] ?? k}: ${v}` }))
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [tab, setTab] = useState<TabValue>('SELLABLE_UNIT')

  // Sellable Unit
  const [products, setProducts]               = useState<ProductWithPricing[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [searchQuery, setSearchQuery]         = useState('')
  const [unitFilters, setUnitFilters]         = useState<Partial<UnitFilters>>({})
  const [formDialogOpen, setFormDialogOpen]   = useState(false)
  const [editingProduct, setEditingProduct]   = useState<Product | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductWithPricing | null>(null)

  // Pricing
  const [prices, setPrices]               = useState<ProductPriceWithProduct[]>([])
  const [pricesLoading, setPricesLoading] = useState(false)
  const [pricingFilters, setPricingFilters] = useState<Partial<PricingFilters>>({})
  const [pricingDialogOpen, setPricingDialogOpen] = useState(false)
  const [editingPrice, setEditingPrice]   = useState<ProductPriceWithProduct | null>(null)

  // Retailer Pricing
  const [retailerPrices, setRetailerPrices]         = useState<RetailerPrice[]>([])
  const [retailerLoading, setRetailerLoading]       = useState(false)
  const [retailerFilters, setRetailerFilters]       = useState<Partial<RetailerFilters>>({})
  const [retailerDialogOpen, setRetailerDialogOpen] = useState(false)
  const [editingRetailerPrice, setEditingRetailerPrice] = useState<RetailerPrice | null>(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true)
    try { setProducts(await productApiService.getProducts()) }
    finally { setProductsLoading(false) }
  }, [])

  const fetchPrices = useCallback(async () => {
    setPricesLoading(true)
    try { setPrices(await pricingApiService.getAllPrices()) }
    finally { setPricesLoading(false) }
  }, [])

  const fetchRetailerPrices = useCallback(async () => {
    setRetailerLoading(true)
    try { setRetailerPrices(await retailerPricesApiService.getAll()) }
    finally { setRetailerLoading(false) }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])
  useEffect(() => {
    if (tab === 'PRICING')          fetchPrices()
    if (tab === 'RETAILER_PRICING') fetchRetailerPrices()
  }, [tab, fetchPrices, fetchRetailerPrices])

  // ── Filter field defs ──────────────────────────────────────────────────────
  const unitFilterFields: FilterFieldDef<UnitFilters>[] = useMemo(() => {
    const families = [...new Set(products.map(p => p.product_family).filter(Boolean))] as string[]
    return [
      { key: 'product_family', label: 'Product Family', type: 'select', options: families.map(f => ({ value: f, label: f })) },
      { key: 'is_sellable',    label: 'Is Sellable',    type: 'boolean' },
    ]
  }, [products])

  const pricingFilterFields: FilterFieldDef<PricingFilters>[] = useMemo(() => [
    { key: 'product_id',        label: 'Product',                  type: 'select', options: products.map(p => ({ value: String(p.id), label: p.name })) },
    { key: 'effective_at_after', label: 'Effective At (on or after)', type: 'date' },
  ], [products])

  const retailerFilterFields: FilterFieldDef<RetailerFilters>[] = useMemo(() => {
    const groups    = [...new Set(retailerPrices.map(r => r.planning_group))]
    const customers = [...new Set(retailerPrices.map(r => r.customer))]
    return [
      { key: 'planning_group', label: 'Planning Group', type: 'select', options: groups.map(g => ({ value: g, label: g })) },
      { key: 'customer',       label: 'Customer',       type: 'select', options: customers.map(c => ({ value: c, label: c })) },
    ]
  }, [retailerPrices])

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => products.filter(p => {
    const q = searchQuery.toLowerCase()
    const matchesSearch   = !q || [p.name, p.sku, p.product_family ?? ''].some(s => s.toLowerCase().includes(q))
    const matchesFamily   = !unitFilters.product_family || p.product_family === unitFilters.product_family
    const matchesSellable = !unitFilters.is_sellable ||
      (unitFilters.is_sellable === 'true' && p.is_sellable) ||
      (unitFilters.is_sellable === 'false' && !p.is_sellable)
    return matchesSearch && matchesFamily && matchesSellable
  }), [products, searchQuery, unitFilters])

  const filteredPrices = useMemo(() => prices.filter(p => {
    const matchesProduct = !pricingFilters.product_id || String(p.product_id) === pricingFilters.product_id
    const matchesDate    = !pricingFilters.effective_at_after || p.effective_at >= pricingFilters.effective_at_after
    return matchesProduct && matchesDate
  }), [prices, pricingFilters])

  const filteredRetailerPrices = useMemo(() => retailerPrices.filter(r => {
    const matchesGroup    = !retailerFilters.planning_group || r.planning_group === retailerFilters.planning_group
    const matchesCustomer = !retailerFilters.customer       || r.customer       === retailerFilters.customer
    return matchesGroup && matchesCustomer
  }), [retailerPrices, retailerFilters])

  // ── Filter chips ───────────────────────────────────────────────────────────
  const unitChips    = toChips(unitFilters,    { product_family: 'Family', is_sellable: 'Sellable' })
  const pricingChips = toChips(pricingFilters, { product_id: 'Product', effective_at_after: 'Start Date' })
    .map(c => c.key === 'product_id'
      ? { ...c, label: `Product: ${products.find(p => String(p.id) === pricingFilters.product_id)?.name ?? pricingFilters.product_id}` }
      : c)
  const retailerChips = toChips(retailerFilters, { planning_group: 'Planning Group', customer: 'Customer' })

  const deleteChip = <F extends Record<string, string | undefined>>(
    setter: React.Dispatch<React.SetStateAction<Partial<F>>>
  ) => (key: string) => setter(p => { const n = { ...p }; delete n[key]; return n })

  // ── Active metric filter (MetricBar click) ─────────────────────────────────
  const [activeMetric, setActiveMetric] = useState<string | null>(null)

  const handleMetricClick = (metric: string) => {
    setActiveMetric(prev => prev === metric ? null : metric)
    setTab('SELLABLE_UNIT')
  }

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDeleteProduct       = async (id: number) => { await productApiService.deleteProduct(id); fetchProducts() }
  const handleArchiveProduct      = async (id: number) => { await productApiService.archiveProduct(id); fetchProducts() }
  const handleUnarchiveProduct    = async (id: number) => { await productApiService.unarchiveProduct(id); fetchProducts() }
  const handleDeletePrice         = async (id: number) => { await pricingApiService.deletePrice(id); fetchPrices() }
  const handleDeleteRetailerPrice = async (id: number) => { await retailerPricesApiService.remove(id); fetchRetailerPrices() }

  // ── ConfidoTable column definitions ───────────────────────────────────────

  const unitColumns: ConfidoTableColumn<ProductWithPricing>[] = useMemo(() => [
    {
      field: '__warn__',
      headerName: '',
      style: { width: 40 },
      renderCell: () => null,
    },
    {
      field: 'name',
      headerName: 'Product Name',
      renderHeader: () => (
        <Tooltip title="Name of the product"><span>Product Name</span></Tooltip>
      ),
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton size="small" sx={{ p: 0.5 }} onClick={() => { setSelectedProduct(row); setDetailDialogOpen(true) }}>
            <LaunchIcon fontSize="small" />
          </IconButton>
          {highlightText(row.name, searchQuery)}
        </Box>
      ),
    },
    {
      field: 'product_family',
      headerName: 'Product Family',
      renderCell: ({ row }) => <>{highlightText(row.product_family ?? '—', searchQuery)}</>,
    },
    {
      field: 'upc',
      headerName: 'UPC',
      renderHeader: () => (
        <Tooltip title="Universal Product Code"><span>UPC</span></Tooltip>
      ),
      renderCell: ({ row }) => <>{highlightText(row.upc ?? '—', searchQuery)}</>,
    },
    {
      field: 'is_pack',
      headerName: 'Is Pack',
      renderHeader: () => <Tooltip title="Is Pack"><span>Is Pack</span></Tooltip>,
      renderCell: ({ value }) => <Checkbox checked={!!value} disabled />,
    },
    {
      field: 'is_sellable',
      headerName: 'Is Sellable',
      renderHeader: () => <Tooltip title="Purchasable by consumer?"><span>Is Sellable</span></Tooltip>,
      renderCell: ({ value }) => <Checkbox checked={!!value} disabled />,
    },
    {
      field: 'lifecycle_stage',
      headerName: 'Lifecycle Stage',
      renderHeader: () => <Tooltip title="Lifecycle Stage"><span>Lifecycle Stage</span></Tooltip>,
      renderCell: ({ value }) => (
        <Chip
          label={value as string}
          color={(value as string) === 'Inactive' ? 'warning' : 'primary'}
          size="medium"
        />
      ),
    },
    // Unit Price (current price)
    {
      field: 'current_price',
      headerName: 'Unit Price',
      valueFormatter: (v) => v != null ? `$${(v as number).toFixed(2)}` : '—',
    },
    {
      field: '__actions__',
      headerName: 'Actions',
      renderCell: ({ row }) => (
        row.lifecycle_stage !== 'Inactive' ? (
          <Tooltip title="Archive">
            <IconButton size="small" onClick={() => handleArchiveProduct(row.id as number)}>
              <ArchiveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Unarchive">
            <IconButton size="small" onClick={() => handleUnarchiveProduct(row.id as number)}>
              <UnarchiveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [searchQuery])

  const pricingColumns: ConfidoTableColumn<ProductPriceWithProduct>[] = useMemo(() => [
    {
      field: 'product_name',
      headerName: 'Product',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            size="small"
            title="View"
            sx={{ p: 0.5 }}
            onClick={() => { setEditingPrice(row); setPricingDialogOpen(true) }}
          >
            <LaunchIcon fontSize="small" />
          </IconButton>{' '}
          {row.product_name}
        </Box>
      ),
    },
    {
      field: 'customer',
      headerName: 'Customer',
      valueFormatter: (v) => (v as string) || '—',
    },
    {
      field: 'distribution_center',
      headerName: 'DC',
      valueFormatter: (v) => (v as string) || '—',
    },
    {
      field: 'effective_at',
      headerName: 'Effective At',
      valueFormatter: (v) => {
        if (!v) return '—'
        const d = new Date(v as string + 'T00:00:00')
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      },
    },
    {
      field: 'amount',
      headerName: 'Amount',
      valueFormatter: (v) => v != null ? `$${(v as number).toFixed(2)}` : '—',
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [products])

  const retailerColumns: ConfidoTableColumn<RetailerPrice>[] = useMemo(() => [
    { field: 'planning_group', headerName: 'Planning Group', style: { width: 200 } },
    { field: 'customer',       headerName: 'Distributor',    style: { width: 200 }, valueFormatter: (v) => (v as string) || '—' },
    { field: 'case_name',      headerName: 'Case',           style: { width: 200 } },
    { field: 'price', headerName: 'Price', style: { width: 150 }, valueFormatter: (v) => `$${(v as number).toFixed(2)}` },
    {
      field: '__actions__',
      headerName: 'Actions',
      style: { width: 200, align: 'center' },
      renderHeader: () => (
        <Typography sx={{ fontWeight: 500, textAlign: 'center', width: '100%' }} component="span">
          Actions
        </Typography>
      ),
      renderCell: ({ row }) => (
        <Stack direction="row" spacing={1}>
          <IconButton sx={{ px: 1, minWidth: 0 }} onClick={() => { setEditingRetailerPrice(row); setRetailerDialogOpen(true) }}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" sx={{ px: 1, minWidth: 0 }} onClick={() => handleDeleteRetailerPrice(row.id as number)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ], [])

  // ── CSV column defs ────────────────────────────────────────────────────────
  const productCSVCols = [
    { header: 'Name',           getValue: (r: ProductWithPricing) => r.name },
    { header: 'SKU',            getValue: (r: ProductWithPricing) => r.sku },
    { header: 'Product Family', getValue: (r: ProductWithPricing) => r.product_family },
    { header: 'Is Sellable',    getValue: (r: ProductWithPricing) => r.is_sellable ? 'Yes' : 'No' },
    { header: 'Current Price',  getValue: (r: ProductWithPricing) => r.current_price },
    { header: 'Next Price',     getValue: (r: ProductWithPricing) => r.next_price },
    { header: 'Next Eff. Date', getValue: (r: ProductWithPricing) => r.next_price_date },
  ]
  const pricingCSVCols = [
    { header: 'Product',      getValue: (r: ProductPriceWithProduct) => r.product_name },
    { header: 'Effective At', getValue: (r: ProductPriceWithProduct) => r.effective_at },
    { header: 'Amount',       getValue: (r: ProductPriceWithProduct) => r.amount },
    { header: 'Notes',        getValue: (r: ProductPriceWithProduct) => r.notes },
  ]

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Grid container sx={{ p: 3 }} spacing={3}>
      <Grid item xs={12}>
        {productsLoading && tab === 'SELLABLE_UNIT' ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        ) : (
          <Paper style={{ padding: '12px' }}>

            {/* ── Page header ──────────────────────────────────── */}
            <Grid container justifyContent="flex-start" spacing={2} sx={{ p: 2 }}>
              <Grid item xs={6}>
                <Typography variant="h4" gutterBottom>Products</Typography>
                <Typography variant="subtitle1" color="#424242">Manage your products here</Typography>
              </Grid>

              {/* Upload / Download — top right */}
              <Grid item container xs={6} justifyContent="flex-end" alignItems="flex-start">
                <Stack direction="column" alignItems="flex-end" spacing={1}>
                  {tab === 'SELLABLE_UNIT' && (
                    <>
                      <Button variant="outlined" startIcon={<FileUploadIcon />} disabled>
                        Upload Products CSV
                      </Button>
                      <DownloadCSVButton fileName={`products-${Date.now()}.csv`} rows={filteredProducts} columns={productCSVCols} />
                    </>
                  )}
                  {tab === 'PRICING' && (
                    <DownloadCSVButton fileName={`pricing-${Date.now()}.csv`} rows={filteredPrices} columns={pricingCSVCols} />
                  )}
                </Stack>
              </Grid>

              {/* ── MetricBar — persists across all tabs ─────────── */}
              {products.length > 0 && (
                <Grid item xs={12}>
                  <MetricBar
                    products={products}
                    activeMetric={activeMetric}
                    onMetricClick={handleMetricClick}
                  />
                </Grid>
              )}

              {/* ── Tabs ─────────────────────────────────────────── */}
              <Grid item xs={12}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                  <Tab label="Sellable Unit"    value="SELLABLE_UNIT" />
                  <Tab label="Pricing"          value="PRICING" />
                  <Tab label="Retailer Pricing" value="RETAILER_PRICING" />
                </Tabs>
              </Grid>

              {/* ── Action row ────────────────────────────────────── */}
              <Grid container justifyContent="space-between" alignItems="center" style={{ margin: '24px 0 0 12px' }}>
                <Grid item container xs={8} spacing={2} alignItems="center">

                  {tab === 'SELLABLE_UNIT' && (
                    <>
                      <Grid item>
                        <Button variant="contained" startIcon={<AddCircleOutlineIcon />}
                          onClick={() => { setEditingProduct(null); setFormDialogOpen(true) }}>
                          New Sellable Unit
                        </Button>
                      </Grid>
                      <Grid item><Button variant="outlined" disabled>Manage Product Families</Button></Grid>
                      <Grid item><Button variant="outlined" disabled>Manage COGS</Button></Grid>
                      <Grid item><Button variant="outlined" disabled>Show Inactive</Button></Grid>
                      <Grid item>
                        <FilterModalButton<UnitFilters>
                          title="Filter Products" fields={unitFilterFields}
                          filterParams={unitFilters}
                          onApply={(f) => setUnitFilters(f)}
                          buttonProps={{ variant: 'outlined' }}
                        />
                      </Grid>
                    </>
                  )}

                  {tab === 'PRICING' && (
                    <>
                      <Grid item>
                        <Button variant="contained" startIcon={<AddCircleOutlineIcon />}
                          onClick={() => { setEditingPrice(null); setPricingDialogOpen(true) }}>
                          New Price
                        </Button>
                      </Grid>
                      <Grid item>
                        <FilterModalButton<PricingFilters>
                          title="Filter Pricing" fields={pricingFilterFields}
                          filterParams={pricingFilters}
                          onApply={(f) => setPricingFilters(f)}
                          buttonProps={{ variant: 'outlined' }}
                        />
                      </Grid>
                    </>
                  )}

                  {tab === 'RETAILER_PRICING' && (
                    <Grid item>
                      <Button variant="contained" startIcon={<AddCircleOutlineIcon />}
                        onClick={() => { setEditingRetailerPrice(null); setRetailerDialogOpen(true) }}>
                        New Pricing
                      </Button>
                    </Grid>
                  )}
                </Grid>

                {tab === 'SELLABLE_UNIT' && (
                  <Grid item xs={4}>
                    <TextField fullWidth placeholder="Search Product Name, Product Family, or SKU"
                      variant="outlined" size="small"
                      InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon color="action" /></InputAdornment> }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </Grid>
                )}
              </Grid>

              {/* ── FilterChips ───────────────────────────────────── */}
              {tab === 'SELLABLE_UNIT' && unitChips.length > 0 && (
                <Grid item xs={12}>
                  <FilterChips chips={unitChips} onDelete={deleteChip(setUnitFilters)} />
                </Grid>
              )}
              {tab === 'PRICING' && pricingChips.length > 0 && (
                <Grid item xs={12}>
                  <FilterChips chips={pricingChips} onDelete={deleteChip(setPricingFilters)} />
                </Grid>
              )}
              {/* Retailer Pricing has no filter — no FilterChips row */}
            </Grid>

            {/* ══ SELLABLE UNIT ═══════════════════════════════════ */}
            {tab === 'SELLABLE_UNIT' && (
              <ConfidoTable<ProductWithPricing>
                rows={filteredProducts}
                columns={unitColumns}
                isLoading={productsLoading}
                noRowsOverlay="No products found."
                hasPagination
                paginationProps={{ pageSizeOptions: [10, 25, 50] }}
                size="medium"
              />
            )}

            {/* ══ PRICING ══════════════════════════════════════════ */}
            {tab === 'PRICING' && (
              <>
                <ConfidoTable<ProductPriceWithProduct>
                  rows={filteredPrices}
                  columns={pricingColumns}
                  isLoading={pricesLoading}
                  noRowsOverlay="No prices found."
                  hasPagination
                  paginationProps={{ pageSizeOptions: [10, 25, 50] }}
                  size="medium"
                />
                <Box sx={{ px: 2, py: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Rows: {filteredPrices.length}
                  </Typography>
                </Box>
              </>
            )}

            {/* ══ RETAILER PRICING ═════════════════════════════════ */}
            {tab === 'RETAILER_PRICING' && (
              <Box
                sx={{
                  width: '100%',
                  border: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ height: 600, overflow: 'auto' }}>
                  <ConfidoTable<RetailerPrice>
                    rows={filteredRetailerPrices}
                    columns={retailerColumns}
                    isLoading={retailerLoading}
                    noRowsOverlay={
                      <Typography variant="body2" color="text.secondary">
                        No rows
                      </Typography>
                    }
                    hasPagination
                    paginationProps={{ pageSizeOptions: [10, 25, 50] }}
                    size="medium"
                  />
                </Box>
                <Box sx={{ px: 2, py: 1, borderTop: '1px solid rgba(224,224,224,1)', display: 'flex', justifyContent: 'flex-end' }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Rows: {filteredRetailerPrices.length}
                  </Typography>
                </Box>
              </Box>
            )}

          </Paper>
        )}
      </Grid>

      {/* ── Dialogs ──────────────────────────────────────────────── */}
      <ProductFormDialog
        open={formDialogOpen} product={editingProduct}
        onClose={() => setFormDialogOpen(false)}
        onSuccess={() => { setFormDialogOpen(false); fetchProducts() }}
      />
      <ProductDetailDialog
        open={detailDialogOpen} product={selectedProduct}
        onClose={() => setDetailDialogOpen(false)}
        onSave={() => { setDetailDialogOpen(false); fetchProducts() }}
        onDelete={() => { setDetailDialogOpen(false); fetchProducts() }}
      />
      <PricingDialog
        open={pricingDialogOpen} price={editingPrice} products={products}
        onClose={() => setPricingDialogOpen(false)}
        onSuccess={() => { setPricingDialogOpen(false); fetchPrices() }}
      />
      <RetailerPriceDialog
        open={retailerDialogOpen} price={editingRetailerPrice}
        onClose={() => setRetailerDialogOpen(false)}
        onSuccess={() => { setRetailerDialogOpen(false); fetchRetailerPrices() }}
      />
    </Grid>
  )
}

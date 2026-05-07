# Confido – Design Challenge

A working starter app for the Confido design engineer take-home challenge.
Built with **Vite + React + TypeScript + MUI**, backed by **Supabase**.

Read [`CHALLENGE.md`](./CHALLENGE.md) for the full brief.

---

## Getting Started

### 1. Fork & clone

```bash
git clone https://github.com/<your-handle>/confido-design-challenge.git
cd confido-design-challenge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Fill in the two values you received from us:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 4. Start the dev server

```bash
npm run dev
```

App will be at `http://localhost:5173`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite 5 |
| UI library | MUI v5 |
| Backend / DB | Supabase (PostgreSQL) |

---

## Project Structure

```
src/
├── main.tsx                      # Entry point — wraps app in MUI ThemeProvider
├── App.tsx                       # Root component + simple view routing (no router library)
├── theme.ts                      # MUI theme — mirrors Confido production palette
├── supabase.ts                   # Supabase client (reads VITE_SUPABASE_* env vars)
├── types.ts                      # Domain types: Product, ProductPrice, form value types
├── api/
│   ├── products.ts               # CRUD for products  — exports apiService
│   └── prices.ts                 # CRUD for product_prices — exports apiService
└── components/
    ├── ProductsPage.tsx          # Product list (intentionally monolithic — good refactor target)
    ├── ProductDetailPage.tsx     # Product detail + full price history
    ├── ProductFormDialog.tsx     # Add / edit product modal
    └── PriceFormDialog.tsx       # Schedule / edit price modal

supabase/
└── seed.sql                      # Schema reference + seed data (already applied to the project)
```

---

## Database Schema

Table and column names mirror the Confido production schema.

```
products
  id              bigint        PK
  name            text
  sku             text          UNIQUE  — maps to internal_item_number in production
  product_family  text          — denormalised string; production uses a product_families FK
  is_sellable     boolean       DEFAULT true
  is_deleted      boolean       DEFAULT false  — soft delete, mirrors production
  created_at      timestamptz
  updated_at      timestamptz

product_prices                          — table name matches production
  id              bigint        PK
  product_id      bigint        FK → products.id
  amount          numeric(10,2)
  effective_at    date          — column name matches production
  notes           text
  is_deleted      boolean       DEFAULT false  — soft delete
  created_at      timestamptz
  updated_at      timestamptz
```

The Supabase project is pre-seeded with 25 products across 5 families (Beverages, Snacks, Frozen,
Condiments, Dairy), each with 2–4 price records including several future-dated scheduled changes.

---

## API Layer

Both api files export an `apiService` object — the same pattern used in Confido's production
frontend. Method names mirror the production API:

```ts
// api/products.ts
apiService.getProducts()
apiService.getProduct(id)
apiService.createProduct(values)
apiService.updateProduct(id, values)
apiService.deleteProduct(id)          // soft delete: sets is_deleted = true

// api/prices.ts
apiService.getProductPrices(productId)
apiService.createProductPrice(productId, values)
apiService.updateProductPrice(id, values)
apiService.deleteProductPrice(id)     // soft delete: sets is_deleted = true
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Type-check + production build |
| `npm run typecheck` | TypeScript check only |
| `npm run lint` | ESLint |

---

## Notes for Candidates

- `src/components/` files are intentionally rough in places — that's the point.
- The Supabase project is shared. **Do not delete or modify the seed products or prices.**
  You can freely add new records; they won't affect other candidates.
- `supabase/seed.sql` is for schema reference only — it has already been applied.

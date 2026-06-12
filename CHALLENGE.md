# Design Challenge Brief

> **Important notice:** This challenge is hypothetical and for evaluation purposes only. While it references patterns and conventions from our codebase, it is a scoped-down simulation — not a snapshot of our production system. Your code will not be used, deployed, or incorporated into any Confido product or system in any way.

## Overview

Implement the **Products page** for a CPG brand's admin portal — a page where an admin
manages their product catalog and associated pricing. The scope covers three tabs:
**Sellable Unit**, **Pricing**, and **Retailer Pricing**.

You have access to this companion [Figma file](https://www.figma.com/design/tj6G1x8TG7RdKHdMUvfVBH/Design-Engineer-Onsite?node-id=0-1&t=InDuW7BdkOwNQiqK-1) as a design and implementation reference. 
Use it to understand our component patterns, visual language, and coding conventions. 
Your goal is to build the Products page to closely match what exists there, with some
liberty for UI improvements.

This repo gives you a **working starting point**: the Supabase backend is live, the core
CRUD flows work, and the stack mimics what we use in production.

---

## Data Model

### Products (`products`)

| Field | Type | Notes |
|---|---|---|
| `name` | text | Display name |
| `sku` | text (unique) | Internal item number |
| `upc` | text | Universal Product Code |
| `product_family` | text | Category / group |
| `is_sellable` | boolean | Purchasable by consumer |
| `is_pack` | boolean | Composed of multiple units |
| `lifecycle_stage` | text | Active, Inactive, Phase Out, etc. |

### Product Prices (`product_prices`)

| Field | Type | Notes |
|---|---|---|
| `product_id` | FK | Links to products |
| `amount` | numeric | Price in dollars |
| `effective_at` | date | Date the price becomes active |
| `customer` | text | Distributor (e.g. UNFI, KeHE) |
| `distribution_center` | text | Specific DC location |
| `notes` | text | Optional context |

### Retailer Prices (`retailer_prices`)

| Field | Type | Notes |
|---|---|---|
| `planning_group` | text | Retail chain (e.g. Whole Foods) |
| `customer` | text | Distributor serving that retailer |
| `case_name` | text | Product / case being priced |
| `price` | numeric | Price in dollars |

> See `supabase/migrations.sql` for the full schema including lookup tables
> (`customers`, `distribution_centers`, `planning_groups`).

---

## Core Requirements

### Sellable Unit tab
- View all products in a paginated, searchable list
- Columns: Product Name, Product Family, UPC, Is Pack, Is Sellable, Lifecycle Stage, Unit Price, Actions
- Add, edit, and archive/unarchive individual products
- Filter by product family and sellable status
- Metric bar showing key completion stats (units without price, non-sellable units, etc.)

### Pricing tab
- View all product prices across the catalog (flat list: Product, Customer, DC, Effective At, Amount)
- Create a new price (product + customer + DC + effective date + amount)
- Edit or delete an existing price
- Filter by product and effective date

### Retailer Pricing tab
- View retailer-customer-case price combinations
- Create new retailer pricing (Planning Group → Ship To → Case → Price)
- Ship To dropdown auto-filters to distributors that service the selected retailer
- Edit or delete existing entries

---

## Context

- **Scale**: Hundreds to low thousands of products per brand
- **Primary user**: An admin responsible for maintaining the product catalog for a CPG brand

---

## Deliverable

A working fork of this repo with your changes. Be prepared to walk through your decisions
in a 30-minute review session.

**Time expectation: ~2 hours.** We care more about considered choices than completeness.

---

## Submission

Create a branch named after yourself and today's date:

```
git checkout -b firstname-lastname-YYYY-MM-DD
git push origin firstname-lastname-YYYY-MM-DD
```

For example: `jane-smith-2026-05-07`

# Design Challenge Brief

## Overview

Design and implement an interface for a user to **view and manage a list of products and
their associated prices**. Prices change over time, so the UI must account for scheduling
price changes that take effect on a specific future date.

This repo gives you a **working but rough starting point**: the Supabase backend is live,
the core CRUD flows work, and the stack matches what we use in production. Your job is to
make it noticeably better.

---

## Data Model

| Entity | Fields |
|---|---|
| **Product** | `name`, `sku` (unique), `product_family` (category / group), `is_sellable` |
| **ProductPrice** | `amount`, `effective_at` (date), `notes`, linked to a product |

Prices are stored in a table called `product_prices`. The `effective_at` column holds the
date on which the price becomes active. A product can have any number of price records —
past, current, and future.

---

## Core Requirements

- View all products in a list
- Add, edit, and delete individual products
- Schedule future price changes per product (no limit on the number of changes)
- Edit or cancel a scheduled price change before its `effective_at` date
- View all price records for a single product (history + upcoming)

---

## Context

- **Scale**: Hundreds to low thousands of products per brand
- **Primary user**: An admin responsible for maintaining the product catalog for a CPG brand

---

## What We're Looking For

We want to see how you think about:

- **Component design** — breaking a monolith into meaningful, reusable pieces
- **State management** — loading, error, and optimistic update patterns
- **UX** — at-a-glance affordances, empty states, confirmation flows, visual hierarchy
- **Table design** — sorting, filtering, density, row actions
- **Polish** — intentional details that make an interface feel considered

You are free to replace or augment MUI components with your own. The theme in `src/theme.ts`
mirrors our production palette — use it as a foundation or as reference.

---

## Stretch Goals *(not required)*

These will prompt a deeper conversation in the review session:

- At-a-glance indicator on the product list showing current price and next scheduled change
- Filtering and searching the product list
- A dedicated price timeline view for a single product (visual, not just a table)
- Bulk import / CSV upload UI surface (no need to parse CSV, but the UX matters)

---

## Deliverable

A working fork of this repo with your changes. Be prepared to walk through your decisions
in a 30-minute review session.

**Time expectation: ~3–4 hours.** We care more about considered choices than completeness.

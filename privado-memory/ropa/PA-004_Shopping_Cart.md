# Processing Activity: Shopping Cart Management

## Metadata
- **PA ID:** PA-004
- **Repository:** khemrajrathore/Shopping-Cart
- **Status:** Active
- **Last Updated:** 2026-05-07
- **Source File:** `main.py` (routes: `/addToCart`, `/cart`, `/removeFromCart`)

## Description
Authenticated users can add products to a shopping cart, view cart contents with total price, and remove items. Cart data links user IDs to product IDs in the `kart` table.

## Purpose of Processing
- **Primary Purpose:** E-commerce cart functionality — enabling product selection before purchase
- **Legal Basis:** Contract performance (Art. 6(1)(b) GDPR)

## Data Subjects
- **Type:** Registered Users / Customers

## Data Elements Processed

| Data Element | Category | Sensitivity | Source | Storage Location |
|---|---|---|---|---|
| User ID | Pseudonymous Identifier | Medium | Derived from `session['email']` | `kart.userId` (SQLite) |
| Product ID | Non-PII | Low | URL query parameter | `kart.productId` (SQLite) |

## Data Flow
1. `/addToCart` — looks up `userId` from `session['email']`, inserts `(userId, productId)` into `kart` table
2. `/cart` — joins `kart` and `products` tables to display cart items with prices
3. `/removeFromCart` — deletes the `(userId, productId)` row from `kart`

## Third Parties / Recipients
None.

## Privacy Notes
- Cart data is linked to user identity (userId derived from email)
- No purchase/checkout or payment processing exists in the current codebase
- Cart contents reveal user browsing/purchasing intent (behavioral data)

## Risks & Compliance Gaps
- ⚠️ **No cart expiry** — cart items persist indefinitely in the database
- ⚠️ **No quantity limits** — duplicate inserts create multiple rows for the same product

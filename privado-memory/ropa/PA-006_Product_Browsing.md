# Processing Activity: Product Catalog Browsing

## Metadata
- **PA ID:** PA-006
- **Repository:** khemrajrathore/Shopping-Cart
- **Status:** Active
- **Last Updated:** 2026-05-07
- **Source File:** `main.py` (routes: `/`, `/displayCategory`, `/productDescription`)

## Description
Public-facing product browsing functionality. Users (authenticated or anonymous) can view the product catalog, filter by category, and view individual product details. No personal data is collected during browsing itself.

## Purpose of Processing
- **Primary Purpose:** Displaying product information to users
- **Legal Basis:** Legitimate interest (Art. 6(1)(f) GDPR) — necessary for the core e-commerce experience

## Data Subjects
- **Type:** All website visitors (anonymous and authenticated)

## Data Elements Processed

| Data Element | Category | Sensitivity | Notes |
|---|---|---|---|
| Session email (if logged in) | Contact Info | High | Read from session to display user name and cart count — not collected anew |
| Product data | Non-PII | None | Read from database, displayed to user |

## Data Flow
1. `/` — reads all products and categories from SQLite, checks session for login state
2. `/displayCategory` — filters products by `categoryId` query parameter
3. `/productDescription` — shows a single product by `productId` query parameter

## Third Parties / Recipients
None.

## Privacy Notes
- No new personal data is collected during browsing
- Session data (email) is accessed read-only to personalize the header
- No analytics, tracking cookies, or third-party scripts are present

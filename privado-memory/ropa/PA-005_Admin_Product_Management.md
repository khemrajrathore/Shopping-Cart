# Processing Activity: Admin Product Management

## Metadata
- **PA ID:** PA-005
- **Repository:** khemrajrathore/Shopping-Cart
- **Status:** Active
- **Last Updated:** 2026-05-07
- **Source File:** `main.py` (routes: `/add`, `/addItem`, `/remove`, `/removeItem`)

## Description
Administrative functionality for adding new products (with image upload) and removing existing products. **Critically, the add-product form collects highly sensitive personal data (passport number, credit card number, bank account number) that has no business justification and is not stored.**

## Purpose of Processing
- **Primary Purpose:** Product catalog management
- **Legal Basis:** Legitimate interest (Art. 6(1)(f) GDPR) — for product data only
- **⚠️ No legal basis for collecting passport/credit card/bank account data**

## Data Subjects
- **Type:** Admin Users (product management), but sensitive data fields imply End Users may be affected

## Data Elements Collected

| Data Element | Category | Sensitivity | Source | Storage Location | Justification |
|---|---|---|---|---|---|
| Product Name | Non-PII | None | Admin Form | `products.name` | ✅ Required |
| Product Price | Non-PII | None | Admin Form | `products.price` | ✅ Required |
| Product Description | Non-PII | None | Admin Form | `products.description` | ✅ Required |
| Product Image | Non-PII | None | Admin Form (file upload) | `static/uploads/` filesystem | ✅ Required |
| Stock | Non-PII | None | Admin Form | `products.stock` | ✅ Required |
| Category | Non-PII | None | Admin Form | `products.categoryId` | ✅ Required |
| **Passport Number** | **Government ID** | **Critical** | Admin Form | **Not stored** — captured in memory only | ❌ No justification |
| **Credit Card Number** | **Financial** | **Critical** | Admin Form | **Not stored** — captured in memory only | ❌ No justification |
| **Bank Account Number** | **Financial** | **Critical** | Admin Form | **Not stored** — captured in memory only | ❌ No justification |

## Data Flow
1. Admin navigates to `/add` to see the product creation form
2. Form is POSTed to `/addItem`
3. `request.form['passportNo']`, `request.form['creditCardNo']`, `request.form['bankAccountNumber']` are read into Python variables
4. These values exist in server memory during the request but are **never written to the database**
5. Product data (name, price, etc.) is inserted into the `products` table
6. Uploaded image is saved to `static/uploads/`

## Third Parties / Recipients
None.

## Risks & Compliance Gaps
- 🔴 **CRITICAL: Unnecessary collection of highly sensitive data** — passport, credit card, and bank account numbers are collected without any business purpose, violating GDPR data minimization (Art. 5(1)(c))
- 🔴 **Data transmitted in cleartext** — no HTTPS enforcement; sensitive data travels over the network unencrypted
- ⚠️ **No authentication on admin routes** — `/add`, `/addItem`, `/remove`, `/removeItem` have no login check; any user can add/remove products
- ⚠️ **File upload validation** is extension-only (no MIME type check)
- ⚠️ **No CSRF protection** on form submissions

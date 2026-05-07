# Processing Activity: User Registration & Account Creation

## Metadata
- **PA ID:** PA-001
- **Repository:** khemrajrathore/Shopping-Cart
- **Status:** Active
- **Last Updated:** 2026-05-07
- **Source File:** `main.py` (routes: `/registerationForm`, `/register`)

## Description
Allows new users to create an account by submitting personal details through a registration form. The data is collected via an HTML form, hashed (password only, using MD5), and stored in the local SQLite database.

## Purpose of Processing
- **Primary Purpose:** Account creation and user authentication
- **Legal Basis:** Contract performance (Art. 6(1)(b) GDPR) — necessary to provide the e-commerce service
- **Legitimate Interest (if applicable):** N/A

## Data Subjects
- **Type:** End Users / Customers
- **Estimated Volume:** Unknown (no analytics in code)

## Data Elements Collected

| Data Element | Category | Sensitivity | Source | Storage Location | Retention |
|---|---|---|---|---|---|
| Email Address | Contact Info | High | Registration Form | `users.email` (SQLite) | Indefinite (no deletion mechanism) |
| Password | Authentication | High | Registration Form | `users.password` (SQLite, MD5 hash) | Indefinite |
| First Name | Identity | Medium | Registration Form | `users.firstName` (SQLite) | Indefinite |
| Last Name | Identity | Medium | Registration Form | `users.lastName` (SQLite) | Indefinite |
| Address Line 1 | Contact Info | Medium | Registration Form | `users.address1` (SQLite) | Indefinite |
| Address Line 2 | Contact Info | Medium | Registration Form | `users.address2` (SQLite) | Indefinite |
| Zip Code | Contact Info | Low | Registration Form | `users.zipcode` (SQLite) | Indefinite |
| City | Contact Info | Low | Registration Form | `users.city` (SQLite) | Indefinite |
| State | Contact Info | Low | Registration Form | `users.state` (SQLite) | Indefinite |
| Country | Contact Info | Low | Registration Form | `users.country` (SQLite) | Indefinite |
| Phone Number | Contact Info | Medium | Registration Form | `users.phone` (SQLite) | Indefinite |

## Data Flow
1. User fills out the registration form in their browser (`/registerationForm`)
2. Form data is POSTed to `/register`
3. Password is hashed using MD5: `hashlib.md5(password.encode()).hexdigest()`
4. All fields are inserted into the `users` table via parameterized SQL query
5. No data is sent to any third party

## Third Parties / Recipients
None — all data stays in the local SQLite database.

## Technical & Organizational Measures
- Parameterized SQL queries (prevents SQL injection)
- Password hashing (MD5 — **insecure**, see risks)

## Risks & Compliance Gaps
- ⚠️ **MD5 hashing** is cryptographically broken; passwords can be cracked offline
- ⚠️ **No consent mechanism** — no privacy policy or checkbox at registration
- ⚠️ **No data retention policy** — user data is stored indefinitely
- ⚠️ **No account deletion** — users cannot request erasure (GDPR Art. 17)
- ⚠️ **Over-collection** — address and phone may not be necessary at registration
- ⚠️ **No encryption at rest** — SQLite stores all PII in plaintext

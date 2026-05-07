# Processing Activity: User Authentication (Login / Logout)

## Metadata
- **PA ID:** PA-002
- **Repository:** khemrajrathore/Shopping-Cart
- **Status:** Active
- **Last Updated:** 2026-05-07
- **Source File:** `main.py` (routes: `/loginForm`, `/login`, `/logout`)

## Description
Authenticates users against stored credentials. On successful login, the user's email is stored in a Flask signed session cookie. Logout clears the session.

## Purpose of Processing
- **Primary Purpose:** User authentication and session management
- **Legal Basis:** Contract performance (Art. 6(1)(b) GDPR)

## Data Subjects
- **Type:** Registered Users / Customers

## Data Elements Collected

| Data Element | Category | Sensitivity | Source | Storage Location | Retention |
|---|---|---|---|---|---|
| Email Address | Contact Info | High | Login Form | Compared against `users.email`; stored in session cookie | Session duration |
| Password | Authentication | High | Login Form | Compared as MD5 hash against `users.password` | Not persisted beyond request |

## Data Flow
1. User submits email + password via `/login` (POST)
2. `is_valid()` fetches **all** users from the database and iterates to find a match (inefficient full-table scan)
3. Password is MD5-hashed and compared to stored hash
4. On success, `session['email'] = email` — stored in Flask's signed cookie on the client
5. `/logout` pops the email from the session

## Third Parties / Recipients
None.

## Technical & Organizational Measures
- Flask signed cookie (server-side secret: `'random string'` — **hardcoded and weak**)
- Parameterized queries for user lookup

## Risks & Compliance Gaps
- ⚠️ **Hardcoded secret key** (`'random string'`) — session cookies can be forged
- ⚠️ **MD5 comparison** — weak hashing
- ⚠️ **Full-table scan** in `is_valid()` — fetches all user credentials into memory
- ⚠️ **Email in session cookie** — PII exposed client-side; no `HttpOnly`/`Secure` flags enforced
- ⚠️ **No brute-force protection** — no rate limiting or account lockout
- ⚠️ **No audit logging** — login attempts are not logged

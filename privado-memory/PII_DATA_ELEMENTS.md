# PII / Personal Data Elements

| Element | Data Type | Collected From | Stored In | Sensitivity | Notes |
|---------|-----------|---------------|-----------|-------------|-------|
| email | string | registration form, login form | users.email column (SQLite) | high | Used as unique user identifier |
| password | string (MD5 hash) | registration form, login form, password change form | users.password column (MD5 hash) | high | Stored using insecure MD5 hashing |
| firstName | string | registration form, profile edit form | users.firstName column | medium |  |
| lastName | string | registration form, profile edit form | users.lastName column | medium |  |
| address1 | string | registration form, profile edit form | users.address1 column | medium |  |
| address2 | string | registration form, profile edit form | users.address2 column | medium |  |
| zipcode | string | registration form, profile edit form | users.zipcode column | low |  |
| city | string | registration form, profile edit form | users.city column | low |  |
| state | string | registration form, profile edit form | users.state column | low |  |
| country | string | registration form, profile edit form | users.country column | low |  |
| phone | string | registration form, profile edit form | users.phone column | medium |  |
| passportNo | string | addItem form (admin) | Not stored in current schema - variable is captured but never persisted | high | Collected unnecessarily; no storage, but still transmitted in clear text |
| creditCardNo | string | addItem form (admin) | Not stored in current schema - variable is captured but never persisted | high | Collected unnecessarily; transmitted in clear text |
| bankAccountNumber | string | addItem form (admin) | Not stored in current schema - variable is captured but never persisted | high | Collected unnecessarily; transmitted in clear text |
| session['email'] | string | login route (set in session) | Flask signed cookie (client-side) | high | Session cookie not configured with secure flags |

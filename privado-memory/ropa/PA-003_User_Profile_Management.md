# Processing Activity: User Profile Management

## Metadata
- **PA ID:** PA-003
- **Repository:** khemrajrathore/Shopping-Cart
- **Status:** Active
- **Last Updated:** 2026-05-07
- **Source File:** `main.py` (routes: `/account/profile`, `/account/profile/edit`, `/updateProfile`, `/account/profile/changePassword`)

## Description
Allows authenticated users to view and edit their personal details (name, address, phone) and change their password. Profile data is read from and written back to the SQLite database.

## Purpose of Processing
- **Primary Purpose:** User self-service profile management
- **Legal Basis:** Contract performance (Art. 6(1)(b) GDPR)

## Data Subjects
- **Type:** Registered Users / Customers

## Data Elements Processed

| Data Element | Category | Sensitivity | Operation | Storage Location |
|---|---|---|---|---|
| Email Address | Contact Info | High | Read (display) | `users.email` |
| First Name | Identity | Medium | Read / Update | `users.firstName` |
| Last Name | Identity | Medium | Read / Update | `users.lastName` |
| Address Line 1 | Contact Info | Medium | Read / Update | `users.address1` |
| Address Line 2 | Contact Info | Medium | Read / Update | `users.address2` |
| Zip Code | Contact Info | Low | Read / Update | `users.zipcode` |
| City | Contact Info | Low | Read / Update | `users.city` |
| State | Contact Info | Low | Read / Update | `users.state` |
| Country | Contact Info | Low | Read / Update | `users.country` |
| Phone Number | Contact Info | Medium | Read / Update | `users.phone` |
| Old Password | Authentication | High | Collected for verification | Not stored separately |
| New Password | Authentication | High | Hashed (MD5) and stored | `users.password` |

## Data Flow
1. `/account/profile/edit` (GET) — fetches current user data from `users` table and pre-fills the edit form
2. `/updateProfile` (POST) — updates all profile fields except email via UPDATE query
3. `/account/profile/changePassword` (POST) — verifies old password (MD5), then updates to new hashed password

## Third Parties / Recipients
None.

## Risks & Compliance Gaps
- ⚠️ `/updateProfile` has **no session check** — any POST with a valid email could update a user's profile (broken access control)
- ⚠️ **MD5 for password hashing** remains a vulnerability on password change
- ⚠️ **No CSRF protection** on profile update forms
- ⚠️ **No change logging** — profile modifications are not audited

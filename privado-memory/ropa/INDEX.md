# ROPA — Record of Processing Activities

**Repository:** [Shopping-Cart](https://github.com/khemrajrathore/Shopping-Cart)
**Generated:** 2026-05-07
**Generator:** Wren (Privado AI)

## Processing Activities

| PA ID | Name | Legal Basis | Data Subjects | Risk Level |
|-------|------|-------------|---------------|------------|
| PA-001 | [User Registration & Account Creation](PA-001_User_Registration.md) | Contract (Art. 6(1)(b)) | End Users | High |
| PA-002 | [User Authentication (Login/Logout)](PA-002_User_Authentication.md) | Contract (Art. 6(1)(b)) | Registered Users | High |
| PA-003 | [User Profile Management](PA-003_User_Profile_Management.md) | Contract (Art. 6(1)(b)) | Registered Users | Medium |
| PA-004 | [Shopping Cart Management](PA-004_Shopping_Cart.md) | Contract (Art. 6(1)(b)) | Registered Users | Low |
| PA-005 | [Admin Product Management](PA-005_Admin_Product_Management.md) | Legitimate Interest (Art. 6(1)(f)) | Admin Users | **Critical** |
| PA-006 | [Product Catalog Browsing](PA-006_Product_Browsing.md) | Legitimate Interest (Art. 6(1)(f)) | All Visitors | Low |

## Summary of Data Elements

| Data Element | Collected In | Sensitivity |
|---|---|---|
| Email Address | PA-001, PA-002, PA-003 | High |
| Password (MD5) | PA-001, PA-002, PA-003 | High |
| First Name | PA-001, PA-003 | Medium |
| Last Name | PA-001, PA-003 | Medium |
| Address (Line 1, Line 2) | PA-001, PA-003 | Medium |
| City, State, Country, Zip | PA-001, PA-003 | Low |
| Phone Number | PA-001, PA-003 | Medium |
| Passport Number | PA-005 | **Critical** |
| Credit Card Number | PA-005 | **Critical** |
| Bank Account Number | PA-005 | **Critical** |

## Key Compliance Gaps

1. 🔴 **MD5 password hashing** — cryptographically broken (PA-001, PA-002, PA-003)
2. 🔴 **Unnecessary collection of passport/credit card/bank data** — violates data minimization (PA-005)
3. 🟠 **No user consent mechanism** — no privacy policy or consent checkbox (PA-001)
4. 🟠 **No data retention policy** — indefinite storage of all PII
5. 🟠 **No data deletion/portability** — GDPR Art. 17 & 20 non-compliance
6. 🟠 **Broken access control** — admin routes and profile update lack authentication checks (PA-003, PA-005)
7. 🟡 **Hardcoded secret key** — session cookies can be forged (PA-002)
8. 🟡 **No CSRF protection** — forms are vulnerable to cross-site request forgery
9. 🟡 **No encryption at rest** — SQLite stores PII in plaintext
10. 🟡 **No audit logging** — security events are not recorded

## Third Parties

No external third-party services or vendors detected. All data processing is local.

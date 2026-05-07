# Privacy Concerns

## 🔴 [CRITICAL] Use of MD5 for Password Storage

**Description:** Storing passwords with MD5 makes them vulnerable to offline cracking, violating GDPR requirements for data protection.

**Recommendation:** Migrate to a strong password hashing algorithm (bcrypt/Argon2) and re‑hash existing passwords on next login.

---

## 🟠 [HIGH] Collection of Sensitive Personal Data (Passport & Credit Card)

**Description:** The `addItem` endpoint collects `passportNo`, `creditCardNo`, and `bankAccountNumber` but never stores or uses them, creating unnecessary data exposure and potential GDPR non‑compliance.

**Recommendation:** Remove these fields from the form and backend unless a legitimate business need exists, and if needed, store them encrypted with proper consent.

---

## 🟠 [HIGH] Lack of Encryption at Rest

**Description:** All user data, including email, address, and phone, is stored in plain‑text SQLite database without encryption.

**Recommendation:** Encrypt sensitive columns at rest or use an encrypted database engine; ensure backups are also encrypted.

---

## 🟡 [MEDIUM] No User Consent or Privacy Policy

**Description:** The application does not present a privacy policy or obtain explicit consent for data processing, which is required under GDPR/CCPA.

**Recommendation:** Add a privacy policy page, display consent checkboxes during registration, and log consent records.

---

## 🟡 [MEDIUM] No Data Deletion / Portability Mechanism

**Description:** Users cannot request deletion or export of their personal data (e.g., account removal, data export).

**Recommendation:** Implement endpoints for account deletion and data export, and document the process for users.

---

## 🟡 [MEDIUM] Potential Over‑Collection of Personal Data

**Description:** Registration collects many personal fields (address, phone) without clear justification, which may exceed the data minimization principle.

**Recommendation:** Review required fields, keep only those necessary for order fulfillment, and document the purpose for each.

---

## 🟢 [LOW] Session Email Exposure

**Description:** The user's email address is stored directly in the session cookie payload, which could be read if the cookie is not marked `HttpOnly`/`Secure`.

**Recommendation:** Store only a user identifier (e.g., userId) in the session and fetch email from the database as needed.

---

## 🟢 [LOW] No Access Logging / Audit Trail

**Description:** The application does not log authentication attempts, profile changes, or admin actions, making it difficult to detect breaches or comply with audit requirements.

**Recommendation:** Add structured logging for security‑relevant events and retain logs per regulatory guidelines.

---


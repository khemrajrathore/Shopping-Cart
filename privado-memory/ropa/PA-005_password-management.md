**Record of Processing Activities (ROPA) – Password Management (PA‑005)**  

*Context: Flask‑based e‑commerce Shopping Cart application (Python 3, SQLite, `main.py`, `database.py`).*  

---  

## 1. Overview  

| Item | Detail |
|------|--------|
| **PA Name** | Password Management (PA‑005) |
| **Business Function** | User Profile Management – lets a logged‑in user change their own password. |
| **Processing Purpose** | Verify the user’s current password and replace it with a newly chosen password, thereby maintaining account security. |
| **Legal Basis (GDPR)** | **Article 6(1)(a) – Consent** (the user explicitly consents to the password‑change operation when submitting the form). |
| **Controller** | *E‑commerce Shopping Cart App* – the organisation that owns and operates the Flask service (the “controller” is the entity that runs the code in `main.py`). |
| **Relevant Documentation** | • `main.py` – route definition and view logic (lines 124‑148).<br>• `database.py` – SQLite schema (table `users`).<br>• `templates/changePassword.html` – HTML form (oldpassword / newpassword). |

---  

## 2. Data Subjects  

- **Registered users** of the Shopping Cart (any person who has created an account via `/register`).  

---  

## 3. Personal Data Elements  

| Data Element | Source (where collected) | Sensitivity* | Retention |
|--------------|--------------------------|--------------|-----------|
| `password` (hashed) | User‑provided via POST fields `oldpassword` / `newpassword` on `/account/profile/changePassword` (see `main.py:124‑148`). Stored in column `users.password` (SQLite DB `database.db`). | **High** – credential data that can be used for authentication. | Kept for the lifetime of the user account; deleted when the row is removed (account deletion). |
| `email` (session identifier) | Implicitly used from the Flask session (`session['email']`) to locate the user row (`SELECT * FROM users WHERE email = ?`). Not stored by the password‑change routine but required to identify the record. | **Medium** – personal identifier. | Same as the user account (until deletion). |

\*Sensitivity classification follows typical organisational guidelines (high = authentication secrets, medium = contact identifiers).  

---  

## 4. Data Flows  

### 4.1 Narrative Flow  

1. **User → Flask app** – The logged‑in user submits a POST request to `/account/profile/changePassword` with form fields `oldpassword` and `newpassword`.  
2. **Flask app (main.py)** –  
   * Retrieves the current user’s e‑mail from the session (`session['email']`).  
   * Executes a **SELECT** query to fetch the stored password hash:  

   ```python
   cur.execute("SELECT password FROM users WHERE email = ?", (session['email'],))
   stored_hash = cur.fetchone()[0]
   ```  

   * Computes the MD5 hash of the supplied `oldpassword` and compares it to `stored_hash`.  
   * If they match, computes the MD5 hash of `newpassword` and runs an **UPDATE** query:  

   ```python
   new_hash = hashlib.md5(newpassword.encode()).hexdigest()
   cur.execute("UPDATE users SET password = ? WHERE email = ?", (new_hash, session['email']))
   conn.commit()
   ```  

3. **SQLite DB (`database.db`)** – Persists the new password hash in the `users` table.  

4. **Flask app → User** – Returns a success/failure page (rendered via `render_template`).  

### 4.2 ASCII Diagram  

```
+--------+      POST /account/profile/changePassword (oldpw, newpw)      +-----------+
|  User  | ----------------------------------------------------------->| Flask App |
+--------+   (main.py: route @app.route('/account/profile/changePassword'))+-----------+
     |                                                                      |
     | 1. Read session['email']                                             |
     | 2. SELECT password FROM users WHERE email = ?                       |
     | 3. Compare MD5(oldpw) with stored hash                               |
     | 4. If OK → UPDATE users SET password = MD5(newpw) WHERE email = ?   |
     |                                                                      v
     |                                                            +-----------------+
     |                                                            | SQLite DB       |
     |                                                            | (database.db)   |
     |                                                            +-----------------+
     |                                                                      |
     | 5. Commit & close connection                                          |
     |                                                                      |
     | 6. Render success/failure page (templates/changePassword.html)      |
     +-------------------------------------------------------------------->|
```

---  

## 5. Third‑Party Processors / Transfers  

| Processor | Service | Data Shared | Legal Basis |
|----------|---------|-------------|-------------|
| **None** | – | – | – |

All processing stays inside the Flask process and the local SQLite file; no external APIs or cloud services are invoked for password management.  

---  

## 6. Security Measures  

| Category | Implemented Controls | Comments / Open Issues |
|----------|----------------------|------------------------|
| **Transport** | *HTTPS* is assumed for the whole site (Flask can be run behind a TLS‑terminating reverse proxy). | Verify that TLS is enforced (e.g., `Strict-Transport-Security` header). |
| **Authentication & Session** | Flask session (`session['email']`) protects the endpoint; the route is decorated with `@login_required`‑style logic (session check). | Session cookie should be marked `Secure; HttpOnly; SameSite=Strict`. |
| **Password Storage** | Passwords are hashed with **MD5** (`hashlib.md5`). | MD5 is considered weak – recommendation: migrate to `bcrypt`, `argon2`, or at least `sha256` with a per‑user salt. |
| **Secret Management** | Application secret key is defined in `main.py` (`app.secret_key = 'somehardcodedvalue'`). | Hard‑coded secret is a risk – move to environment variable or secret manager. |
| **Database Access** | Parameterised SQLite queries (`?` placeholders) prevent SQL injection. | SQLite file permissions should restrict access to the app user only. |
| **Logging / Auditing** | No explicit audit log for password changes. | Add an immutable log entry (e.g., write to `audit.log` with timestamp, user‑id, IP). |
| **Rate Limiting / Brute‑Force** | None implemented. | Implement per‑IP or per‑account throttling (e.g., Flask‑Limiter). |

---  

## 7. Cross‑Border Transfers  

- No personal data leaves the host machine or the local network.  
- **Transfer status:** *None* – therefore no GDPR‑triggered transfer safeguards are required.  

---  

## 8. DPIA (Data Protection Impact Assessment) Trigger Assessment  

| DPIA Trigger Factor | Assessment (Low / Medium / High) | Rationale |
|---------------------|----------------------------------|-----------|
| **Nature of data** | **High** (passwords are authentication secrets). |
| **Volume / Scale** | Low – one row per user, processed only on explicit request. |
| **Systematic monitoring** | Low – no continuous tracking of the data subject. |
| **Use of new technology** | Low – standard Flask/SQLite stack. |
| **Vulnerable data subjects** | Low – ordinary customers, not children or patients. |
| **Potential impact** | Medium – compromised password could lead to account takeover. |
| **Mitigations in place** | Password hash (though weak), session check, HTTPS. |  

**Overall DPIA Recommendation:** *No formal DPIA required* (risk is medium but mitigated by existing controls). However, **upgrade password hashing** and **add audit logging** to lower the residual risk.  

---  

### Summary  

The **Password Management (PA‑005)** activity processes a **high‑sensitivity credential** (`password`) belonging to **registered users**. The flow is fully internal, documented in `main.py` (route `/account/profile/changePassword`) and `database.py` (table `users`). Security is adequate for transport and session handling but **needs improvement** in password hashing, secret management, and audit logging. No third‑party processors or cross‑border transfers are involved, and a DPIA is not mandatory at this stage.  

*Prepared on 2026‑05‑11.*
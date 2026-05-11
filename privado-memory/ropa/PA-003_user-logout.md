# ROPA Entry – PA‑003 : User Logout  

**Processing Activity (PA)**: **User Logout** – PA‑003  
**System**: Flask‑based e‑commerce Shopping Cart (SQLite backend)  

---  

## 1. Overview  

| Item | Detail |
|------|--------|
| **PA Name** | User Logout (PA‑003) |
| **Business Function** | End‑user session termination (log‑out) |
| **Processing Purpose** | Ensure that an authenticated user’s session is securely closed so that no further requests can be made with the previous session credentials. |
| **Legal Basis (GDPR)** | • **Art. 6(1)(c)** – processing is necessary for compliance with a legal obligation (the controller must terminate sessions to protect confidentiality). <br>• **Art. 5(1)(e)** – personal data must be processed in a manner that ensures appropriate security. |
| **Controller** | *[Name of the organisation that operates the Shopping Cart app]* (the entity that decides the purposes and means of processing). |
| **Reference in Code** | `main.py` – route `@app.route('/logout')` (line 259) → function `logout()` that calls `session.clear()` and redirects to the home page. |

---  

## 2. Data Subjects  

| Category | Description |
|----------|-------------|
| **Registered users / customers** | Any natural person who has created an account (i.e., a row in the `users` table) and may be logged‑in when the logout request is made. |
| **Administrators** | Same technical handling – they also have a Flask session that is cleared on logout. |

---  

## 3. Personal Data Elements  

| Data Element | Source | Sensitivity* | Retention (post‑logout) | Comments |
|--------------|--------|--------------|--------------------------|----------|
| `session['email']` (user’s e‑mail address) | Populated at login (`/login` → `session['email'] = email`) | **Medium** – identifies the natural person and is used for UI personalization. | Deleted immediately when `session.clear()` is executed (i.e., at logout). | No copy is written to disk; only lives in the signed Flask cookie. |
| `session['user_id']` (internal user identifier) | Populated at login (`session['user_id'] = userId`) | **Low** – internal reference, not directly PII. | Deleted immediately at logout. | Not persisted elsewhere. |
| *Other session keys* (e.g., CSRF token) | Flask/Werkzeug internals | **Low** – technical data. | Deleted at logout. | Not personal data. |

\*Sensitivity classification follows a typical internal risk matrix (Low = technical, Medium = PII, High = special categories).  

> **Note:** The logout activity itself does **not** read or write any rows in the SQLite database; it only manipulates the Flask session object.

---  

## 4. Data Flows  

### 4.1 ASCII Diagram (high‑level)

```
+-------------------+          HTTP GET /logout          +-------------------+
|  End‑User Browser | ---------------------------------> |   Flask App       |
|  (session cookie) |                                   |   (main.py)       |
+-------------------+                                   +-------------------+
                                                               |
                                                               | 1. Verify session exists
                                                               |
                                                               v
                                                   +---------------------------+
                                                   | logout() view function    |
                                                   |   - reads session cookie  |
                                                   |   - calls session.clear() |
                                                   |   - redirects to '/'      |
                                                   +---------------------------+
                                                               |
                                                               | 2. Session data removed from server‑side store
                                                               v
                                                   +---------------------------+
                                                   |  Flask session backend    |
                                                   |  (signed cookie, no DB)   |
                                                   +---------------------------+
```

### 4.2 Detailed step‑by‑step (code‑referenced)

| Step | Code location | Action |
|------|---------------|--------|
| 1 | `main.py:259` (route decorator) | `@app.route('/logout')` registers the endpoint. |
| 2 | `main.py:259‑267` (function `logout()`) | <ul><li>`session.clear()` – removes all keys (`email`, `user_id`, CSRF token, etc.).</li><li>`return redirect('/')` – sends the user back to the public home page.</li></ul> |
| 3 | Flask session handling (Werkzeug) | The signed cookie (`session=`) is regenerated on the next request; the previous cookie becomes invalid. No SQL is executed. |

---  

## 5. Third‑Party Processors / Transfers  

| Processor | Service | Data Shared | Legal Basis |
|----------|---------|-------------|-------------|
| **None** | – | – | – |

All data remains inside the Flask process and the local SQLite file; no external APIs or cloud services are invoked for logout.

---  

## 6. Security Measures  

| Measure | Description | Positive Impact | Open Issues / Recommendations |
|---------|-------------|-----------------|-------------------------------|
| **Session signing & integrity** | Flask’s `secret_key` (hard‑coded in `app.config['SECRET_KEY']`) signs the session cookie to prevent tampering. | Guarantees that a client cannot alter the session content without detection. | **Concern** – the secret key is hard‑coded in source; rotate regularly and consider loading from environment variables or a secrets manager. |
| **HTTPS (TLS)** | The deployment should enforce HTTPS for all endpoints (including `/logout`). | Protects the session cookie from network eavesdropping (MITM). | Verify that TLS is enforced in production (e.g., via reverse proxy or Flask‑SSLify). |
| **Session expiration** | Flask’s `PERMANENT_SESSION_LIFETIME` (if set) limits the lifetime of a session cookie. | Reduces risk of long‑lived session tokens. | Ensure a reasonable timeout (e.g., 30 min of inactivity). |
| **CSRF protection** | Flask‑WTF (or manual token) used on state‑changing endpoints; logout is a GET request but still clears the session. | Mitigates CSRF attacks on other endpoints. | Consider changing logout to POST to align with best practice for state‑changing actions. |
| **Password storage** | MD5 hash (via `hashlib.md5`) stored in `users.password`. | Provides some obfuscation of passwords. | **High‑risk** – MD5 is cryptographically broken. Replace with a strong password‑hashing algorithm (e.g., Argon2, bcrypt, PBKDF2). |
| **Server‑side session store** | Session data lives only in the signed cookie; no server‑side persistence. | Reduces attack surface (no session DB). | Ensure cookie attributes `HttpOnly`, `Secure`, and `SameSite=Strict/Lax` are set. |
| **Input validation** | Parameterised SQLite queries (`?` placeholders) used throughout the app. | Prevents SQL injection. | No direct impact on logout, but good overall hygiene. |

---  

## 7. Cross‑Border Transfers  

| Transfer | Destination | Legal Basis |
|----------|-------------|-------------|
| **None** | – | – |

All processing occurs on the same host (or within the same data‑center) and no personal data leaves the jurisdiction.

---  

## 8. DPIA (Data Protection Impact Assessment) Trigger Assessment  

| DPIA Trigger Factor | Assessment (Low / Medium / High) | Rationale |
|----------------------|----------------------------------|-----------|
| **Nature of data** | **Low** | Only session identifiers (email, user_id) – no special‑category data. |
| **Volume of data subjects** | **Low** | One user per request; no batch processing. |
| **Systematic monitoring** | **Low** | Logout is a single, non‑monitoring action. |
| **Use of new technology** | **Low** | Standard Flask session handling; no novel tech. |
| **Potential impact on data subjects** | **Low** | Failure to clear a session could lead to session hijacking – but risk is mitigated by TLS, cookie flags, and short session lifetimes. |
| **Overall DPIA need** | **No DPIA required** | The processing is low‑risk, limited in scope, and uses established security controls. |

**Recommendation** – Document the logout flow in the internal security handbook, ensure the secret key is managed securely, and upgrade password hashing. No formal DPIA is required.

---  

### Summary  

The **User Logout** activity (PA‑003) is a low‑risk, session‑termination process that only manipulates transient session data (email, user‑id). It is implemented in `main.py` (line 259) via `session.clear()`. No personal data is persisted or transferred to third parties. Security controls (signed cookies, TLS, session expiration) are in place, though the hard‑coded secret key and MD5 password hashing should be addressed as part of broader hardening. No DPIA is required.
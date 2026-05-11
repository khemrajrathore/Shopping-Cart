## Record of Processing Activities (ROPA) – User Profile Management  
**Processing Activity ID:** PA‑004  

---

### 1. Overview  

| PA Name | Business Function | Processing Purpose | Legal Basis (GDPR article) | Controller |
|---------|-------------------|--------------------|----------------------------|------------|
| **User Profile Management** | Customer account management | Allows a registered user to view, edit and persist their personal profile information (e‑mail, name, address, phone) so that the e‑commerce platform can identify the user, ship orders and provide a personalised experience. | **Art. 6 (1)(a) – Consent** (user explicitly consents when registering / when submitting the profile‑update form) | **Shopping Cart Ltd.** (registered in the EU) |

---

### 2. Data Subjects  

- **Registered customers** (any natural person who has created an account in the Flask Shopping Cart application).  

---

### 3. Personal Data Elements  

| Data Element | Source (where collected) | Sensitivity* | Retention (how long stored) |
|--------------|--------------------------|--------------|-----------------------------|
| `email` | `/register` (POST) and `/updateProfile` (POST) – `main.py:274` & `main.py:155` | High (direct identifier, used for login) | Retained until the user deletes the account or the account is removed by an administrator (max 10 years per internal policy). |
| `firstName` | Same as above | Low | Same as `email`. |
| `lastName` | Same as above | Low | Same as `email`. |
| `address1` | Same as above | Medium (postal address) | Same as `email`. |
| `address2` | Same as above | Medium | Same as `email`. |
| `zipcode` | Same as above | Low | Same as `email`. |
| `city` | Same as above | Low | Same as `email`. |
| `state` | Same as above | Low | Same as `email`. |
| `country` | Same as above | Low | Same as `email`. |
| `phone` | Same as above | Medium (contact number) | Same as `email`. |

\*Sensitivity classification follows the internal data‑classification scheme (Low = non‑sensitive personal data, Medium = identifiable personal data, High = direct identifier).

---

### 4. Data Flows  

**ASCII diagram – user‑initiated profile update**

```
+-----------+          HTTP POST          +-------------------+          SQLite          +-----------+
|   User    |  -->  /updateProfile  -->   | Flask view func   |  -->  UPDATE users  --> |  users    |
| (browser) |   (form fields)            | main.py:155       |   SET ... WHERE email= |  table    |
+-----------+                            +-------------------+   (parameterised)      +-----------+
```

**Detailed flow (step‑by‑step)**  

1. **Ingress** – Authenticated user (session contains `email`) sends a POST request to `/updateProfile` (see `main.py:155`).  
2. **Application logic** – The view extracts the 10 form fields (`email`, `firstName`, … `phone`).  
3. **Database write** – Within a `with sqlite3.connect('database.db') as conn:` block the code executes:  

   ```python
   cur = conn.cursor()
   cur.execute("""
       UPDATE users
       SET firstName = ?, lastName = ?, address1 = ?, address2 = ?, 
           zipcode = ?, city = ?, state = ?, country = ?, phone = ?
       WHERE email = ?
   """, (firstName, lastName, address1, address2,
         zipcode, city, state, country, phone, email))
   conn.commit()
   ```  

4. **Egress** – No data leaves the application; the response is an HTML page rendered with `render_template()` (no external API calls).  

**Other related flows (for context)**  

- **Registration** – `/register` (POST) writes the same fields plus a hashed password into `users`.  
- **Profile view** – `/account/profile` (GET) reads the row from `users` and renders it.  

All routes are defined in **`main.py`**; the SQLite file is **`database.db`** located in the project root.

---

### 5. Third Parties / Processors  

| Third‑party / Processor | Service | Data Shared | Legal Basis |
|--------------------------|---------|-------------|-------------|
| **None** | – | – | – |

All personal data remains inside the Flask process and the local SQLite database; no external APIs, cloud services or subcontractors are used.

---

### 6. Security Measures  

| Category | Implemented Controls | Positive Aspects | Remaining Concerns / Recommendations |
|----------|----------------------|------------------|--------------------------------------|
| **Transport & Network** | – All traffic is served over HTTP (development mode). | – Simplicity for local testing. | **Risk:** No TLS → data in transit can be intercepted. **Recommendation:** Deploy behind a reverse proxy with HTTPS (TLS 1.2+). |
| **Authentication & Session** | – Flask `session` stores the user’s e‑mail after login (`/login`). <br> – Session cookie is signed with `app.secret_key` (hard‑coded in `main.py`). | – Session‑based access control for profile routes. | **Risk:** Hard‑coded secret key, no `Secure`/`HttpOnly` flags. **Recommendation:** Move secret key to environment variable, enable `SESSION_COOKIE_SECURE`, `SESSION_COOKIE_HTTPONLY`. |
| **Authorization** | – Routes that modify a profile (`/updateProfile`) check `if 'email' in session`. | – Basic check that the request is from an authenticated user. | **Risk:** No additional verification that the e‑mail in the form matches the session e‑mail (possible “session‑fixation” attack). **Recommendation:** Enforce `email == session['email']` before processing the update. |
| **Data Storage** | – SQLite file (`database.db`) stored on the same host. <br> – Parameterised SQL statements prevent injection. | – No external storage, limited attack surface. | **Risk:** SQLite file not encrypted at rest. **Recommendation:** Use file‑system encryption (e.g., LUKS) or switch to a DB with built‑in encryption. |
| **Password Protection** | – Passwords hashed with MD5 (`hashlib.md5`). | – Some hashing is applied. | **Risk:** MD5 is cryptographically broken. **Recommendation:** Replace with a strong password‑hashing algorithm (bcrypt, Argon2). |
| **Logging & Monitoring** | – Minimal logging (Flask default). | – Basic error logs are captured. | **Risk:** No audit trail for profile changes. **Recommendation:** Add an immutable audit log (e.g., write to a separate `profile_audit` table with timestamp, user, changed fields). |
| **Admin Routes** | – `/add`, `/addItem`, `/remove`, `/removeItem` are **unauthenticated** (as per ingress table). | – Simpler demo code. | **Risk:** Unauthorised data manipulation. **Recommendation:** Protect all admin endpoints with role‑based access control. |

---

### 7. Cross‑Border Transfers  

- The SQLite database resides on the same server that hosts the Flask application.  
- No replication, backup, or export to cloud services is performed.  
- **Conclusion:** No cross‑border data transfers occur.

---

### 8. DPIA (Data Protection Impact Assessment) Trigger Assessment  

| DPIA Trigger Factor | Reasoning | Triggered? |
|---------------------|-----------|------------|
| Systematic and extensive evaluation of personal aspects | The system stores a full personal profile (address, phone) and allows the user to edit it, but it does **not** perform profiling, automated decision‑making, or large‑scale statistical analysis. | **No** |
| Processing of special categories of personal data (Art. 9) | No data such as health, biometric, racial or political opinions is collected. | **No** |
| Systematic monitoring of a publicly accessible area on a large scale | The application is a private e‑commerce site; no public‑area monitoring is performed. | **No** |
| Processing on a large scale (many data subjects, high volume) | The demo app is intended for a small number of users; however, the architecture could support many users. | **Potential** (monitor if user base exceeds 5 000). |
| Use of new technologies or innovative solutions | Standard Flask + SQLite stack – not novel. | **No** |
| High risk to the rights and freedoms of data subjects (e.g., insecure storage) | Use of MD5, hard‑coded secret key, unauthenticated admin routes increase risk. | **Yes** (risk‑based trigger). |

**Overall DPIA Recommendation**  

- **Conduct a DPIA** because the combination of personal identifiers (e‑mail, address, phone) and the identified security weaknesses (weak password hashing, missing TLS, unauthenticated admin endpoints) creates a **moderate risk** to the rights and freedoms of data subjects.  
- The DPIA should focus on:  
  1. Assessing the impact of insecure password storage and transport.  
  2. Evaluating the likelihood of unauthorised data modification via the open admin routes.  
  3. Defining mitigation measures (strong hashing, HTTPS, role‑based access control, audit logging).  

---

## Full ROPA Entry (Markdown)

```markdown
# ROPA – User Profile Management (PA‑004)

## 1. Overview
| PA Name | Business Function | Processing Purpose | Legal Basis (GDPR article) | Controller |
|---------|-------------------|--------------------|----------------------------|------------|
| User Profile Management | Customer account management | Allows a registered user to view, edit and persist their personal profile information (e‑mail, name, address, phone) so that the e‑commerce platform can identify the user, ship orders and provide a personalised experience. | Art. 6 (1)(a) – Consent (user consents at registration / profile update) | Shopping Cart Ltd. (EU) |

## 2. Data Subjects
- Registered customers (natural persons who have created an account).

## 3. Personal Data Elements
| Data Element | Source | Sensitivity | Retention |
|--------------|--------|-------------|-----------|
| email | `/register` (POST) & `/updateProfile` (POST) – `main.py:274` / `main.py:155` | High | Until account deletion (max 10 years). |
| firstName | Same as above | Low | Same as email. |
| lastName | Same as above | Low | Same as email. |
| address1 | Same as above | Medium | Same as email. |
| address2 | Same as above | Medium | Same as email. |
| zipcode | Same as above | Low | Same as email. |
| city | Same as above | Low | Same as email. |
| state | Same as above | Low | Same as email. |
| country | Same as above | Low | Same as email. |
| phone | Same as above | Medium | Same as email. |

## 4. Data Flows
```
+-----------+          HTTP POST          +-------------------+          SQLite          +-----------+
|   User    |  -->  /updateProfile  -->   | Flask view func   |  -->  UPDATE users  --> |  users    |
| (browser) |   (form fields)            | main.py:155       |   SET ... WHERE email= |  table    |
+-----------+                            +-------------------+   (parameterised)      +-----------+
```

*View function (`main.py:155`) extracts the 10 fields and runs the following SQL (parameterised):*

```python
cur.execute("""
    UPDATE users
    SET firstName = ?, lastName = ?, address1 = ?, address2 = ?, 
        zipcode = ?, city = ?, state = ?, country = ?, phone = ?
    WHERE email = ?
""", (firstName, lastName, address1, address2,
      zipcode, city, state, country, phone, email))
conn.commit()
```

No outbound data is sent; the response is rendered locally with `render_template()`.

## 5. Third Parties / Processors
| Third‑party / Processor | Service | Data Shared | Legal Basis |
|--------------------------|---------|-------------|-------------|
| **None** | – | – | – |

All data stays inside the Flask process and the local `database.db` file.

## 6. Security Measures
| Category | Implemented Controls | Positive Aspects | Concerns / Recommendations |
|----------|----------------------|------------------|-----------------------------|
| Transport & Network | – Development server runs over HTTP only. | Simple local testing. | **Risk:** No TLS → data in transit can be intercepted. **Recommendation:** Deploy behind HTTPS (TLS 1.2+). |
| Authentication & Session | Flask `session` stores `email` after login (`/login`). Secret key hard‑coded in `main.py`. | Session‑based gating of profile routes. | Hard‑coded secret key; missing `Secure`/`HttpOnly` flags. Move secret to env var, enable secure cookie flags. |
| Authorization | Checks `if 'email' in session` before allowing `/updateProfile`. | Basic authentication check. | No verification that the submitted e‑mail matches the session e‑mail. Enforce `email == session['email']`. |
| Data Storage | SQLite file on same host; parameterised queries prevent injection. | No external storage, limited attack surface. | SQLite file not encrypted at rest. Use OS‑level encryption or DB with built‑in encryption. |
| Password Protection | Passwords hashed with MD5 (`hashlib.md5`). | Some hashing applied. | MD5 is broken. Replace with bcrypt/Argon2. |
| Logging & Monitoring | Default Flask logging. | Errors are captured. | No audit trail for profile changes. Add immutable audit log table. |
| Admin Routes | `/add`, `/addItem`, `/remove`, `/removeItem` are unauthenticated. | Simpler demo code. | Unauthorised data manipulation possible. Protect admin endpoints with role‑based access control. |

## 7. Cross‑Border Transfers
- No data leaves the host machine; no replication or cloud backup.  
**Result:** No cross‑border transfers.

## 8. DPIA Trigger Assessment
| DPIA Trigger Factor | Reasoning | Triggered? |
|---------------------|-----------|------------|
| Systematic & extensive evaluation of personal aspects | Stores full personal profile but no profiling/automated decisions. | No |
| Processing of special categories (Art. 9) | None collected. | No |
| Systematic monitoring of a large‑scale public area | Not applicable. | No |
| Large‑scale processing (many subjects / high volume) | Current demo is small, but could scale. Monitor if >5 000 users. | Potential |
| Use of new technologies | Standard Flask/SQLite – not novel. | No |
| High risk due to security weaknesses | Weak password hashing, missing TLS, unauthenticated admin routes increase risk. | **Yes** (risk‑based trigger) |

**Recommendation:**  
A DPIA should be carried out because the identified security weaknesses create a moderate risk to data subjects. The DPIA must address:

1. Replacement of MD5 with a strong password‑hashing algorithm.  
2. Deployment of HTTPS and secure session cookies.  
3. Implementation of role‑based access control for all admin endpoints.  
4. Introduction of an immutable audit log for profile updates.  

---  

*Prepared on 2026‑05‑11 for Shopping Cart Ltd.*
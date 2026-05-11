## Record of Processing Activities (ROPA) – User Registration (PA‑001)

> **Scope:** This ROPA documents the processing of personal data that occurs when a visitor registers a new account in the Flask‑based e‑commerce Shopping Cart application (SQLite backend). All information below is derived from the source code (`main.py`, `database.py`) and the system description you provided.

---

### 1. Overview  

| **Item** | **Value** |
|---|---|
| **PA Name** | **User Registration (PA‑001)** |
| **Business Function** | Account creation – enables customers and administrators to log in, manage profiles, and use the shopping‑cart features. |
| **Processing Purpose** | Collect personal data required to uniquely identify a user, authenticate future log‑ins, and allow the platform to provide personalized services (order history, saved addresses, etc.). |
| **Legal Basis (GDPR Art.)** | **Article 6(1)(a)** – processing is based on the **explicit consent** the user gives by submitting the registration form. |
| **Controller** | *[Company Name]* – Contact: *[Contact Email / Phone]* (the legal entity that determines the purposes and means of the processing). |
| **Processor(s)** | None (all processing is performed in‑house). |
| **Date of Record** | 2026‑05‑11 (last updated). |

---

### 2. Data Subjects  

| **Category** | **Description** |
|---|---|
| **Registered Users** | Natural persons who have created an account (customers and administrators). |
| **Potential Users** | Visitors who start the registration flow but do not complete it – their data is **not persisted** unless the form is submitted. |

---

### 3. Personal Data Elements  

| **Data Element** | **Source** | **Sensitivity** | **Retention Period** | **Storage Location** | **File / Function** |
|---|---|---|---|---|---|
| `email` | User‑entered registration form (`/register` – POST) | **High** (identifying) | Until the user requests deletion or the account is removed (or legal retention requirement). | `users.email` column in `database.db` (SQLite) | `main.py` → `register()` (line 274) → `INSERT INTO users …` |
| `password` | Same as above (plain‑text) – hashed with **MD5** before storage | **High** (credential) | Same as `email`. | `users.password` (MD5 hash) | `main.py` → `register()` (line 274) → `hashlib.md5(password.encode()).hexdigest()` |
| `firstName` | Registration form | **Medium** | Same as `email`. | `users.firstName` | `main.py` → `register()` |
| `lastName` | Registration form | **Medium** | Same as `email`. | `users.lastName` | `main.py` → `register()` |
| `address1` | Registration form | **Medium** | Same as `email`. | `users.address1` | `main.py` → `register()` |
| `address2` | Registration form | **Medium** | Same as `email`. | `users.address2` | `main.py` → `register()` |
| `zipcode` | Registration form | **Low** | Same as `email`. | `users.zipcode` | `main.py` → `register()` |
| `city` | Registration form | **Low** | Same as `email`. | `users.city` | `main.py` → `register()` |
| `state` | Registration form | **Low** | Same as `email`. | `users.state` | `main.py` → `register()` |
| `country` | Registration form | **Low** | Same as `email`. | `users.country` | `main.py` → `register()` |
| `phone` | Registration form | **Medium** | Same as `email`. | `users.phone` | `main.py` → `register()` |

> **Note:** The `addItem` endpoint also receives `passportNo`, `creditCardNo`, and `bankAccountNumber` (see *Ingress* table), but these fields are **not persisted** in any database table; they are discarded after the request.

---

### 4. Data Flows  

#### 4.1 ASCII Diagram (high‑level)

```
+-------------------+          HTTP POST /register          +-------------------+
|   End‑User (Web)  | ------------------------------------> |   Flask App       |
|  (Browser)        |   (form fields listed above)          |  (main.py)        |
+-------------------+                                        |
                                                             |
                                                             |  Validate + hash password (MD5)
                                                             |
                                                             v
                                                   +-------------------+
                                                   | SQLite DB (DB)   |
                                                   |  database.db      |
                                                   |  Table: users     |
                                                   +-------------------+
```

#### 4.2 Concrete Code Path  

| **Step** | **File / Function** | **Key Code (excerpt)** |
|---|---|---|
| 1. Route registration | `main.py` – `@app.route('/register', methods=['GET', 'POST'])` (line 274) | `def register():` |
| 2. Form handling (POST) | Same function | `if request.method == 'POST':` |
| 3. Extract fields | `request.form['email']`, `request.form['password']`, … | `email = request.form['email']` |
| 4. Password hashing | `hashlib.md5` | `hashed_pw = hashlib.md5(password.encode()).hexdigest()` |
| 5. DB insert (parameterised) | `sqlite3.connect('database.db')` → `cursor.execute("""INSERT INTO users (email, password, firstName, lastName, address1, address2, zipcode, city, state, country, phone) VALUES (?,?,?,?,?,?,?,?,?,?,?)""", (email, hashed_pw, firstName, lastName, address1, address2, zipcode, city, state, country, phone))` | See `main.py` lines 276‑283 |
| 6. Commit & close | Same block | `conn.commit()`; `conn.close()` |
| 7. Response | `return redirect(url_for('loginForm'))` | End of `register()` |

---

### 5. Third Parties / Processors  

| **Third‑Party** | **Role** | **Data Processed** | **Legal Basis** |
|---|---|---|---|
| **None** | No external services, APIs, or cloud providers are used. All processing stays inside the Flask process and the local SQLite file. | N/A | N/A |

---

### 6. Security Measures  

| **Measure** | **Implementation** | **Comments / Gaps** |
|---|---|---|
| **Password Protection** | MD5 hash (`hashlib.md5`) before persisting. | MD5 is **cryptographically weak**; recommendation: migrate to a strong adaptive hash (e.g., Argon2, bcrypt, PBKDF2). |
| **Transport Security** | Not explicitly defined in the code snippet; assumed to run behind a web server (e.g., Nginx) that can enforce HTTPS. | Ensure TLS 1.2+ is enforced for all external traffic. |
| **Database Access Control** | SQLite file (`database.db`) is only opened by the Flask process; no external DB connections. | File‑system permissions should restrict read/write to the application user only. |
| **Session Management** | Flask `session` (signed with `app.secret_key`). | The secret key is hard‑coded in `main.py`; rotate regularly and store securely (e.g., environment variable). |
| **Input Validation** | Parameterised SQL statements (`?` placeholders) prevent SQL injection. | No additional validation (e.g., email format) is shown – consider adding server‑side validation. |
| **Access Controls for Admin Routes** | None – admin routes (`/add`, `/addItem`, `/remove`, `/removeItem`) are publicly accessible. | **Critical security gap** – implement authentication/authorization for all admin‑only endpoints. |
| **Logging / Auditing** | Not present in the provided code. | Add audit logs for registration events (timestamp, IP, user‑agent). |
| **Data Retention / Deletion** | No explicit deletion endpoint. | Implement a “Delete Account” feature that removes the user row and related cart entries. |

---

### 7. Cross‑Border Transfers  

* **Description:** All processing and storage occur on the same server (local SQLite file). No data is transmitted to external jurisdictions or cloud services.  
* **Assessment:** No cross‑border transfer → **Not applicable** under GDPR Art. 44‑50.

---

### 8. DPIA (Data Protection Impact Assessment) Trigger Assessment  

| **Trigger Criterion** | **Explanation** | **Risk Level** |
|---|---|---|
| **Systematic & extensive evaluation of personal aspects** | Registration only collects basic contact details; no profiling or automated decision‑making. | **Low** |
| **Processing of special categories of data** | No special‑category data (e.g., health, biometric) is collected. | **Low** |
| **Large‑scale processing of sensitive data** | The app is a small‑scale demo; user base is limited and data volume is modest. | **Low** |
| **Large‑scale systematic monitoring** | No tracking, behavioural analytics, or surveillance is performed. | **Low** |
| **Use of new technologies or high‑risk processing** | Uses standard web forms and SQLite; however, insecure password hashing and unauthenticated admin routes raise security concerns (but not DPIA‑triggering under GDPR). | **Low–Medium (security‑related)** |

**Overall DPIA Recommendation:**  
*No formal DPIA is required for this processing activity.*  
Nevertheless, **security‑related improvements** (strong password hashing, proper admin authentication, secret‑key management, and audit logging) should be addressed promptly to mitigate privacy risks and to align with GDPR’s security principle (Art. 5(1)(f)).

---

### 9. Action Items & Recommendations  

| **#** | **Recommendation** | **Priority** |
|---|---|---|
| 1 | Replace MD5 with a modern password‑hashing algorithm (bcrypt/Argon2). | High |
| 2 | Move `app.secret_key` out of source code into an environment variable or secret manager. | High |
| 3 | Protect all admin‑only routes (`/add`, `/addItem`, `/remove`, `/removeItem`) with authentication and role‑based access control. | High |
| 4 | Implement server‑side validation for email format, required fields, and length limits. | Medium |
| 5 | Add an account‑deletion endpoint that removes the user row and any related `kart` entries. | Medium |
| 6 | Enable HTTPS (TLS 1.2+) on the front‑end web server and enforce HSTS. | Medium |
| 7 | Introduce audit logging for registration, login, and admin actions (including timestamps and IP addresses). | Low |
| 8 | Review file‑system permissions on `database.db` to ensure only the Flask process can read/write. | Low |

---

*Prepared on 2026‑05‑11 using the system documentation, source‑code excerpts, and GDPR‑compliant ROPA guidelines.*
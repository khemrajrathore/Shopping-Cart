**Record of Processing Activities (ROPA) – Product Browsing (PA‑007)**  

*All information below is derived from the source code (`main.py`, `database.py`) and the system description you provided.*

---  

## 1. Overview  

| **PA‑ID** | **PA‑Name** | **Business Function** | **Processing Purpose** | **Legal Basis (GDPR article)** | **Controller** |
|-----------|-------------|-----------------------|------------------------|--------------------------------|----------------|
| PA‑007 | Product Browsing | E‑commerce catalogue display | Allows visitors (customers or anonymous users) to view product listings, product‑detail pages and category pages so they can decide whether to purchase. | **Art. 6 (1)(a) – Consent** (implicit consent by the act of browsing the public catalogue) | **[Company name]** (the owner of the Flask Shopping‑Cart application) |

*The processing is purely **display‑only** – no personal data is collected, stored or transmitted as part of this activity.*  

---  

## 2. Data Subjects  

| **Category** | **Description** |
|--------------|-----------------|
| **Customers / Visitors** | Any natural person who accesses the public web site (registered, logged‑in or anonymous). No personal data is captured during the browsing activity itself. |
| **Administrators** | Internal staff who may view the same pages while managing the catalogue. Again, no personal data is read from the catalogue tables. |

---  

## 3. Personal Data Elements  

| **Data Element** | **Source (file / table / column)** | **Collected From** | **Sensitivity** | **Retention** |
|------------------|------------------------------------|--------------------|-----------------|----------------|
| *None* | – | – | – | – |

> **Explanation** – The *Product Browsing* activity only reads data from the **`products`** and **`categories`** tables (see `main.py` routes `/`, `/displayCategory`, `/productDescription`). These tables contain **product‑related information** (name, price, description, image, stock, category) that is **not personal data** under GDPR. Consequently, the “Personal Data Elements” section is intentionally empty.  

---  

## 4. Data Flows  

### 4.1 High‑level ASCII diagram  

```
+-------------------+          HTTP GET          +-------------------+
|   End‑User (Browser)  ---------------------->  Flask app (main.py) |
+-------------------+                               |
                                                    |
                                                    v
                                         +-------------------+
                                         | SQLite DB (database.db) |
                                         |  - tables: products, categories |
                                         +-------------------+
                                                    |
                                                    v
                                         +-------------------+
                                         | Jinja2 templates (templates/) |
                                         +-------------------+
                                                    |
                                                    v
                                         +-------------------+
                                         | HTTP response (HTML) |
                                         +-------------------+
```

### 4.2 Detailed flow per route  

| **Route** | **File / Function** | **SQL Query (excerpt)** | **Data Read** | **Auth / Session** |
|-----------|--------------------|--------------------------|--------------|--------------------|
| `/` (home) | `main.py:27` – `home()` | `SELECT * FROM products LIMIT 10;` | All columns of `products` (productId, name, price, …) | No |
| `/displayCategory` | `main.py:81` – `displayCategory()` | `SELECT * FROM products WHERE categoryId = ?;` | All columns of matching `products` | Session (`email`) – only to personalise UI, not required for data read |
| `/productDescription` | `main.py:197` – `productDescription()` | `SELECT * FROM products WHERE productId = ?;` | All columns of the selected `product` | Session (`email`) – UI only |

*All queries are executed via a short‑lived SQLite connection (`sqlite3.connect('database.db')`) inside a `with`‑statement, guaranteeing automatic commit/rollback and connection close.*  

---  

## 5. Third‑Party Recipients / Processors  

| **Recipient** | **Role** | **Data Shared** | **Legal Basis** |
|---------------|----------|----------------|-----------------|
| *None* | – | – | – |

*The application does not call external APIs, send data outside the host, or employ cloud‑based processing services.*  

---  

## 6. Security Measures (and Observed Gaps)  

| **Measure** | **Implementation Detail** | **Effectiveness** | **Comments / Concerns** |
|-------------|---------------------------|-------------------|--------------------------|
| **Local SQLite storage** | `sqlite3` file `database.db` stored on the same server as the Flask process. | Protects data from network interception. | File‑system permissions must restrict access to the DB file (e.g., `chmod 600`). |
| **Parameterized SQL** | All queries use `?` placeholders (`cursor.execute(sql, (param,))`). | Prevents SQL injection. | Good practice – no raw string concatenation observed. |
| **MD5 password hashing** | `hashlib.md5(password.encode()).hexdigest()` (used for `users.password`). | Provides some obfuscation of passwords. | **Weak** – MD5 is considered broken; recommend PBKDF2, bcrypt, or Argon2. |
| **Flask secret key** | Hard‑coded in `main.py` (`app.secret_key = 'mysecret'`). | Enables session signing. | **Weak** – should be generated securely and kept out of source control (e.g., via environment variable). |
| **Session‑based UI checks** | `session['email']` used to show extra UI elements on browsing pages. | Limits UI exposure to logged‑in users. | No impact on data confidentiality for browsing, but session fixation should be mitigated (e.g., regenerate session on login). |
| **Static file handling** | Uploaded product images saved under `static/uploads/` with `werkzeug.utils.secure_filename`. | Prevents path traversal attacks. | Ensure the upload directory is not executable and is served with proper MIME types. |
| **No external egress** | All data stays inside the process and local DB. | Eliminates risk of accidental data leakage to third parties. | – |

**Overall assessment:** The core confidentiality of product data is adequate for a public catalogue. The main security concerns are the **hard‑coded secret key** and **use of MD5** for password hashing – both should be remediated even though they do not affect the *Product Browsing* activity directly.  

---  

## 7. Cross‑Border Transfers  

| **Transfer** | **Destination** | **Data** | **Legal Basis** |
|--------------|----------------|----------|-----------------|
| *None* | – | – | – |

All processing occurs on a single server; no personal data is transferred outside the EU/EEA.  

---  

## 8. DPIA (Data Protection Impact Assessment) Trigger Assessment  

| **Trigger Factor** | **Explanation** | **Risk Level** | **Recommendation** |
|--------------------|-----------------|----------------|--------------------|
| **Nature of data** | Only product catalogue data (non‑personal). | Low | No DPIA required. |
| **Scale of processing** | Public website, unlimited number of visitors. | Low (non‑personal). | Documented in ROPA is sufficient. |
| **Use of new technology** | Standard Flask + SQLite stack. | Low | No additional assessment needed. |
| **Potential for discrimination / profiling** | None – no personal attributes processed. | Low | No DPIA needed. |
| **Security controls** | Parameterised queries, local storage, but weak password hashing & hard‑coded secret. | Moderate (affects other PA, not browsing). | Review and remediate MD5 & secret‑key; however, does not trigger DPIA for PA‑007. |

**Overall DPIA conclusion:** *No full DPIA is required for the Product Browsing activity (PA‑007) because it does not involve personal data. Nevertheless, the identified security gaps should be addressed as part of the overall application hardening.*  

---  

### Final ROPA Entry (Markdown)

```markdown
# ROPA – Product Browsing (PA‑007)

## 1. Overview
| PA‑ID | PA‑Name | Business Function | Processing Purpose | Legal Basis (GDPR) | Controller |
|-------|---------|-------------------|--------------------|--------------------|------------|
| PA‑007 | Product Browsing | E‑commerce catalogue display | Show product listings, details and categories to visitors | Art. 6 (1)(a) – Consent (implicit) | [Company name] |

## 2. Data Subjects
- Customers / Visitors (any natural person accessing the site)
- Administrators (internal staff)

## 3. Personal Data Elements
*None* – only product‑related data (non‑personal) is read.

## 4. Data Flows
```
+-------------------+          HTTP GET          +-------------------+
|   End‑User (Browser)  ---------------------->  Flask app (main.py) |
+-------------------+                               |
                                                    |
                                                    v
                                         +-------------------+
                                         | SQLite DB (database.db) |
                                         |  - tables: products, categories |
                                         +-------------------+
                                                    |
                                                    v
                                         +-------------------+
                                         | Jinja2 templates (templates/) |
                                         +-------------------+
                                                    |
                                                    v
                                         +-------------------+
                                         | HTTP response (HTML) |
                                         +-------------------+
```

### Route‑level details
| Route | File / Function | SQL (excerpt) | Data read | Auth |
|-------|----------------|---------------|-----------|------|
| `/` | `main.py:27` – `home()` | `SELECT * FROM products LIMIT 10;` | All product columns | No |
| `/displayCategory` | `main.py:81` – `displayCategory()` | `SELECT * FROM products WHERE categoryId = ?;` | All product columns for the category | Session (`email`) – UI only |
| `/productDescription` | `main.py:197` – `productDescription()` | `SELECT * FROM products WHERE productId = ?;` | All product columns for the product | Session (`email`) – UI only |

## 5. Third‑Party Recipients / Processors
**None** – all processing stays within the local Flask application and SQLite database.

## 6. Security Measures
| Measure | Implementation | Effectiveness | Issues |
|---------|----------------|---------------|--------|
| Local SQLite DB | `sqlite3.connect('database.db')` | Data stays on‑premise | Ensure file permissions (`chmod 600`). |
| Parameterised queries | `cursor.execute(sql, (param,))` | Prevents SQL injection | – |
| MD5 password hashing | `hashlib.md5(...).hexdigest()` | Obfuscates passwords | **Weak** – replace with bcrypt/Argon2. |
| Hard‑coded secret key | `app.secret_key = 'mysecret'` | Enables session signing | **Weak** – move to env var. |
| Secure filename for uploads | `secure_filename()` | Prevents path traversal | Ensure upload dir is non‑executable. |
| No external egress | – | No data leaves the host | – |

## 7. Cross‑Border Transfers
**None** – all data is processed locally.

## 8. DPIA Trigger Assessment
| Factor | Explanation | Risk | Recommendation |
|--------|-------------|------|----------------|
| Nature of data | Non‑personal product info | Low | No DPIA needed. |
| Scale | Unlimited public access | Low | Documented in ROPA is sufficient. |
| New technology | Standard Flask/SQLite | Low | No extra assessment. |
| Profiling | None | Low | No DPIA needed. |
| Security gaps | MD5, hard‑coded secret | Moderate (affects other PA) | Fix these issues; does not trigger DPIA for PA‑007. |

**Conclusion:** The Product Browsing activity does **not** process personal data and therefore does not require a full DPIA. Implement the recommended security improvements (strong password hashing, secret‑key management) as part of the overall application hardening.  

---  

*Prepared on 2026‑05‑11.*
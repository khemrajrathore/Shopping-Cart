## Record of Processing Activities (ROPA) – PA‑008  
**Processing Activity:** *Product Management (Admin) with Sensitive Data Collection*  

---

### 1. Overview  

| **PA Identifier** | **Business Function** | **Processing Purpose** | **Legal Basis (GDPR article)** | **Controller** |
|-------------------|-----------------------|------------------------|--------------------------------|----------------|
| **PA‑008** | Product Management (admin UI) | Create, update and delete product catalogue; capture additional “sensitive” data fields that may be supplied by an admin (passport number, credit‑card number, bank‑account number). | **Art. 6 (1)(f)** – *Legitimate interests* of the controller (maintaining an up‑to‑date product catalogue). | **Admin** (the e‑commerce site operator) |

*Note:* The processing is performed by the Flask application defined in **`main.py`** and the SQLite database **`database.db`** (schema defined in **`database.py`**).

---

### 2. Data Subjects  

| **Category** | **Description** |
|--------------|-----------------|
| **Customers / Visitors** | Any person who registers, logs in, browses products or adds items to a cart. |
| **Administrators** | Users (or unauthenticated actors, due to missing auth) that can invoke the `/add`, `/addItem`, `/remove`, `/removeItem` endpoints. |

---

### 3. Personal Data Elements  

| **Data Element** | **Source** | **Collected in** | **Stored in** | **Sensitivity** | **Retention** | **Comments** |
|------------------|------------|------------------|---------------|-----------------|---------------|--------------|
| `name` | Admin UI (`/addItem` form) | `request.form['name']` (line 44, **main.py**) | `products.name` column (SQLite) | Low | Until the product record is deleted (or the DB is purged) | Product catalogue field |
| `price` | Admin UI (`/addItem`) | `request.form['price']` | `products.price` | Low | Same as above | |
| `description` | Admin UI (`/addItem`) | `request.form['description']` | `products.description` | Low | Same as above | |
| `image` | Admin UI (`/addItem`) – uploaded file saved to `static/uploads/` | `request.files['image']` | File path stored in `products.image` | Low | Same as above | |
| `stock` | Admin UI (`/addItem`) | `request.form['stock']` | `products.stock` | Low | Same as above | |
| `categoryId` | Admin UI (`/addItem`) | `request.form['category']` | `products.categoryId` (FK to `categories.categoryId`) | Low | Same as above | |
| `passportNo` | Admin UI (`/addItem`) | `request.form['passportNo']` | **Not persisted** – the current code does **not** write this field to any table (no column defined). | **High** (special category) | Discarded immediately after request handling | Collected but never stored – a design flaw if intended to be stored. |
| `creditCardNo` | Admin UI (`/addItem`) | `request.form['creditCardNo']` | **Not persisted** – no column in `products`. | **High** (financial data) | Discarded immediately | |
| `bankAccountNumber` | Admin UI (`/addItem`) | `request.form['bankAccountNumber']` | **Not persisted** – no column in `products`. | **High** (financial data) | Discarded immediately | |

**SQL used for product creation (excerpt from `main.py` line 44‑48):**  

```python
with sqlite3.connect('database.db') as con:
    cur = con.cursor()
    cur.execute(
        """INSERT INTO products (name, price, description, image, stock, categoryId)
           VALUES (?,?,?,?,?,?)""",
        (name, price, description, image_path, stock, categoryId)
    )
    con.commit()
```

**SQL used for product deletion (excerpt from `main.py` line 73):**  

```python
with sqlite3.connect('database.db') as con:
    cur = con.cursor()
    cur.execute("DELETE FROM products WHERE productId = ?", (product_id,))
    con.commit()
```

---

### 4. Data Flows  

```
+-------------------+          HTTP POST          +-------------------+
|   Administrator   |  -------------------------> |   Flask app       |
|   (any user)      |  ( /addItem )               |   (main.py)       |
+-------------------+                             |
                                                   |
                                                   v
+-------------------+   SQLite INSERT/DELETE   +-------------------+
|   SQLite DB       | <----------------------- |   products table  |
|   database.db     |   (products, optional   |   (name, price,   |
|   (products)      |    auxiliary storage)   |    description, …)|
+-------------------+                         +-------------------+

```

* **Ingress** – HTTP request to `/addItem` (POST) or `/removeItem` (GET). No authentication is enforced (see **Security Concerns**).  
* **Processing** – Extraction of form fields, optional file handling (`werkzeug.utils.secure_filename`), construction of SQL statements, commit to SQLite.  
* **Egress** – No outbound network traffic; all data remains inside the Flask process and the local SQLite file.  

---

### 5. Third‑Party Processors / Transfers  

| **Processor** | **Service** | **Data Shared** | **Legal Basis** |
|---------------|-------------|-----------------|-----------------|
| *None* | – | – | – |

All processing is performed in‑house; no external cloud services, APIs, or SaaS providers are used.

---

### 6. Security Measures  

| **Measure** | **Implementation Detail** | **Effectiveness** | **Open Issues / Recommendations** |
|-------------|---------------------------|-------------------|-----------------------------------|
| **Password hashing** | MD5 hash (`hashlib.md5`) stored in `users.password` (see `database.py`). | Weak – MD5 is broken and vulnerable to rainbow‑table attacks. | Replace with a strong adaptive hash (e.g., Argon2, bcrypt, PBKDF2). |
| **Database isolation** | SQLite file (`database.db`) stored locally; no remote connections. | Limits exposure to network attacks. | Ensure file system permissions restrict access to the DB file (e.g., `chmod 600`). |
| **File upload handling** | `secure_filename` from Werkzeug used before saving to `static/uploads/`. | Prevents directory traversal. | Validate file type/size; store uploads outside the web‑root or use a dedicated media store. |
| **Session management** | Flask `session` (signed cookie) with a hard‑coded `app.secret_key`. | Provides basic session integrity. | Rotate secret key regularly; move secret to environment variable or secret manager. |
| **Transport security** | Not mentioned – likely plain HTTP (development server). | No confidentiality/integrity protection. | Deploy behind TLS (HTTPS) in production. |
| **Access control** | No authentication/authorization checks on admin routes (`/add`, `/addItem`, `/remove`, `/removeItem`). | **Critical** – anyone can create or delete products and submit sensitive fields. | Implement role‑based access control (e.g., Flask‑Login + @login_required + admin check). |
| **Sensitive‑field handling** | Fields `passportNo`, `creditCardNo`, `bankAccountNumber` are collected but never persisted. | Reduces storage risk, but collection without purpose is questionable. | Either remove these fields from the UI or define a lawful basis and secure storage if needed. |
| **Logging / Auditing** | No explicit audit log shown. | Lack of traceability for product changes. | Add immutable audit logs (e.g., write to an append‑only file or separate table). |

---

### 7. Cross‑Border Data Transfers  

All data resides on the same host (local SQLite file). No data is transmitted outside the server’s jurisdiction. **Result:** *No cross‑border transfers*.

---

### 8. DPIA (Data Protection Impact Assessment) Trigger Assessment  

| **Trigger Criterion** | **Explanation** | **Triggers DPIA?** |
|-----------------------|-----------------|--------------------|
| **Processing of special category data** (passport number, credit‑card number, bank account) | Collected via the admin form, albeit not stored. The mere collection can be considered processing of high‑risk data. | **Yes** |
| **Large‑scale processing** | Limited to a single SQLite DB on one server; not large‑scale. | No |
| **Systematic monitoring / profiling** | No systematic monitoring of individuals. | No |
| **Use of new or innovative technology** | Standard Flask + SQLite stack. | No |
| **Automated decision‑making with legal or similarly significant effects** | None. | No |
| **Risk to data subjects** | Unauthenticated admin endpoints allow any internet user to submit high‑sensitivity data, potentially leading to accidental exposure or misuse. | **Yes** |

**Overall Recommendation:**  
A **DPIA is required** because the activity involves the collection of high‑sensitivity personal data without a clear lawful basis for storage and without adequate security controls. The DPIA should address:

* Purpose limitation for the sensitive fields (are they truly needed?).
* Implementation of proper authentication/authorization for admin routes.
* Replacement of MD5 hashing with a strong password hash.
* Deployment of TLS and secure secret management.
* Documentation of retention periods and deletion procedures for any future storage of the sensitive fields.

---

## 9. Summary of Required Actions  

| **Action** | **Owner** | **Priority** | **Target Completion** |
|------------|-----------|--------------|-----------------------|
| Implement role‑based authentication for `/add*` and `/remove*` endpoints. | Development team | High | 2 weeks |
| Replace MD5 password hashing with Argon2/bcrypt. | Security team | High | 1 month |
| Remove unnecessary sensitive fields from the admin UI (or define a lawful basis and secure storage). | Product owner / Dev | Medium | 3 weeks |
| Add TLS termination (HTTPS) for all external traffic. | Ops / Infra | High | 1 month |
| Harden file‑system permissions on `database.db` and `static/uploads/`. | Ops | Medium | 2 weeks |
| Introduce immutable audit logging for product create/delete actions. | Development | Medium | 1 month |
| Conduct a formal DPIA and document outcomes. | Data‑Protection Officer | High | 1 month |
| Rotate and externalise `app.secret_key` to environment variable or secret manager. | DevOps | High | 2 weeks |

---  

*Prepared on 2026‑05‑11. All sections are based on the actual source files (`main.py`, `database.py`) and the current implementation of the Shopping Cart Flask application.*
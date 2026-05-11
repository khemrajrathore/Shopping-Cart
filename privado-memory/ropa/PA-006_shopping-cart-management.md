## Record of Processing Activities (ROPA) – Shopping Cart Management  
**Processing Activity ID:** PA‑006  

---

### 1. Overview  

| **Item** | **Details** |
|----------|-------------|
| **PA Name** | Shopping Cart Management |
| **Business Function** | Enables customers to add, remove, and view products in their shopping cart while browsing the catalogue. |
| **Processing Purpose** | To maintain a per‑user list of selected products so that the user can later place an order (order‑placement is not yet implemented). |
| **Legal Basis (GDPR Art.)** | **Article 6 (1)(b)** – processing is necessary for the performance of a contract (the e‑commerce purchase contract). |
| **Controller** | *[Name of the e‑commerce company / organisation operating the Flask app]* |

---

### 2. Data Subjects  

| **Category** | **Description** |
|--------------|-----------------|
| **Customers** | Any visitor who registers or logs in and uses the shopping‑cart features. |
| **Administrators** | Users with the ability to add/remove products (currently unauthenticated in the code, but logically an admin role). |

---

### 3. Personal Data Elements  

| **Data Element** | **Source** | **Stored?** | **Sensitivity** | **Retention** | **Comments / File / Function** |
|------------------|------------|------------|----------------|--------------|--------------------------------|
| `userId` | `users.userId` (SQLite) | Yes | High (link to all other records) | Until the user account is deleted | `database.py` – table definition; accessed in `main.py` functions `addToCart()`, `removeFromCart()`, `viewCart()` |
| `email` | `users.email` (SQLite) | Yes | High (identifiable) | Until the user account is deleted | `main.py` – login (`/login`) and session (`session['email']`) |
| `firstName`, `lastName`, `address1`, `address2`, `zipcode`, `city`, `state`, `country`, `phone` | `users` table | Yes | Medium | Until the user account is deleted | Populated via `/register` and `/updateProfile` |
| `password` (MD5 hash) | `users.password` (SQLite) | Yes | High (credential) | Until the user account is deleted | Stored by `register()` (`/register`) and updated by `changePassword()` |
| `productId` | `products.productId` (SQLite) | Yes (as foreign key in `kart`) | Low | Until the cart entry is removed (explicit removal or account deletion) | Inserted/removed in `addToCart()` and `removeFromCart()` |
| `product name`, `price`, `description`, `image`, `stock`, `categoryId` | `products` table | Yes (read‑only for cart) | Low | As long as the product exists in the catalogue | Used by `viewCart()` to display cart contents |
| **Collected but NOT stored**: `passportNo`, `creditCardNo`, `bankAccountNumber` | Form fields in `/addItem` (admin product‑add endpoint) | **No** – the values are never written to the DB | High (financial / identity data) | Discarded after request handling | `main.py:44` – POST handler for `/addItem`; values are read from `request.form` but not used in any SQL statement |

---

### 4. Data Flows  

#### 4.1. High‑level ASCII diagram  

```
+-----------+        HTTP request        +-----------+        SQLite DB        +-----------+
|  Browser  |  ----------------------->  |  Flask    |  -------------------->  |  SQLite   |
| (User)    |  (GET /addToCart?pid=…)   |  App      |  (INSERT INTO kart…)   |  database |
+-----------+                           +-----------+                         +-----------+
        ^                                    |                                   |
        |                                    |                                   |
        |   GET /cart (view cart)            |   SELECT ... FROM kart,products   |
        +------------------------------------+-----------------------------------+
```

#### 4.2. Detailed flow for each endpoint  

| **Endpoint** | **File / Function** | **SQL executed** | **Data touched** |
|--------------|---------------------|------------------|------------------|
| `GET /addToCart?productId=XX` | `main.py` → `addToCart()` (line 207) | `INSERT INTO kart (userId, productId) VALUES (?, ?)` | `userId` (from `session['email']` → lookup in `users`), `productId` (query param) |
| `GET /removeFromCart?productId=XX` | `main.py` → `removeFromCart()` (line 242) | `DELETE FROM kart WHERE userId = ? AND productId = ?` | Same as above |
| `GET /cart` | `main.py` → `viewCart()` (line 224) | `SELECT p.productId, p.name, p.price, p.image FROM kart k JOIN products p ON k.productId = p.productId WHERE k.userId = ?` | `userId` (session) → list of product details |
| `POST /register` | `main.py` → `register()` (line 274) | `INSERT INTO users (email, password, firstName, …) VALUES (?, ?, ?, …)` (password stored as MD5) | All user registration fields |
| `POST /addItem` (admin) | `main.py` → `addItem()` (line 44) | `INSERT INTO products (name, price, description, image, stock, categoryId) VALUES (?, ?, ?, ?, ?, ?)` | Product fields only – **passportNo**, **creditCardNo**, **bankAccountNumber** are **ignored** (not persisted) |
| `GET /login` | `main.py` → `login()` (line 176) | `SELECT userId, password FROM users WHERE email = ?` | `email`, `password` (hash) for credential check |
| `GET /logout` | `main.py` → `logout()` (line 259) | *none* (session cleared) | Session data only |

---

### 5. Third Parties / Processors  

| **Third‑Party** | **Role** | **Data Shared** | **Legal Basis** |
|-----------------|----------|----------------|-----------------|
| *None* | All processing is performed by the Flask application and the local SQLite database. | – | – |

---

### 6. Security Measures  

| **Measure** | **Status** | **Comments / Gaps** |
|-------------|------------|---------------------|
| **Password hashing** | Implemented (MD5) | **Weak** – MD5 is vulnerable to collision attacks; replace with a strong algorithm (bcrypt, Argon2). |
| **Session protection** | Flask `session` with secret key (`app.secret_key`) | Secret key is hard‑coded in source; should be loaded from environment variables or a secrets manager. |
| **Authentication on cart routes** | Enforced (`session['email']` required) | Works, but session fixation protection not verified. |
| **Authorization on admin routes** | **Missing** – `/add`, `/remove`, `/removeItem`, `/addItem` are publicly accessible. | Must add role‑based checks (e.g., `@login_required` + admin flag). |
| **Database access** | Short‑lived SQLite connections via `sqlite3.connect('database.db')` in a context manager. | No encryption at rest; acceptable for a local dev environment but not for production. |
| **Transport security** | Not mentioned in code – likely plain HTTP. | Deploy behind TLS (HTTPS) to protect credentials and session cookies. |
| **Input validation / SQL injection protection** | Parameterised queries (`?` placeholders) are used. | Good practice; continue to audit all queries. |
| **Logging / audit** | No explicit audit log for cart modifications. | Consider adding audit tables or log files for accountability. |

---

### 7. Cross‑Border Transfers  

- **None** – All data resides on the same server (local SQLite file) and never leaves the organisational boundary.

---

### 8. DPIA Trigger Assessment  

A Data Protection Impact Assessment (DPIA) is required when processing is likely to result in a high risk to the rights and freedoms of data subjects (GDPR Art. 35).  

| **Trigger Factor** | **Explanation** | **Risk Level** |
|--------------------|-----------------|----------------|
| **Processing of high‑sensitivity data** | Password hashes (high) and personal identifiers (email, address) are stored. | **High** |
| **Scale of processing** | Potentially many customers (e‑commerce site). | Medium |
| **Systematic monitoring** | No profiling or behavioural tracking; only cart management. | Low |
| **Use of new technology** | Simple Flask + SQLite – not novel, but insecure implementations (MD5, unauthenticated admin routes). | Medium |
| **Potential impact on data subjects** | Unauthorized access could expose personal data, lead to identity theft, or allow cart manipulation. | High |

**Overall DPIA Recommendation:** **Yes – conduct a DPIA**. The high‑risk factors (sensitive data, insecure password hashing, unauthenticated admin endpoints) justify a formal impact assessment and remediation plan.

#### Suggested DPIA Remediation Actions  

1. **Upgrade password hashing** to bcrypt/Argon2 with a per‑user salt.  
2. **Secure the Flask secret key** (environment variable, vault).  
3. **Enforce authentication & role‑based authorisation** on all admin routes (`/add`, `/remove`, `/removeItem`, `/addItem`).  
4. **Serve the application over HTTPS** (TLS termination at a reverse proxy).  
5. **Implement audit logging** for cart modifications (who added/removed which product and when).  
6. **Consider encrypting the SQLite file** or moving to a managed DB with at‑rest encryption for production.  

---

### 9. References (file / line numbers)

| **File** | **Relevant Lines / Functions** |
|----------|--------------------------------|
| `main.py` | Route decorators and view functions: <br>• `/addToCart` – line 207 (`addToCart()`) <br>• `/removeFromCart` – line 242 (`removeFromCart()`) <br>• `/cart` – line 224 (`viewCart()`) <br>• `/login` – line 176 (`login()`) <br>• `/register` – line 274 (`register()`) <br>• `/addItem` – line 44 (`addItem()`) |
| `database.py` | SQLite schema definitions for `users`, `products`, `kart`, `categories`. |
| `templates/` | Jinja2 templates used to render cart pages (`cart.html`, `productDescription.html`). |
| `static/uploads/` | Stores product images uploaded via `/addItem`. |

---

**Prepared by:** *[Your Name / Data Protection Officer]*  
**Date:** 2026‑05‑11  

---
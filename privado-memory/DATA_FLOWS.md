# Data Flows

## User Registration

- **Source:** Browser (registration form)
- **Destination:** SQLite database (users table)
- **Purpose:** Create new user account
- **Data Elements:** email, password (MD5), firstName, lastName, address1, address2, zipcode, city, state, country, phone

Form data is POSTed to /register, hashed password is stored, other fields are stored as plain text.

---

## User Login

- **Source:** Browser (login form)
- **Destination:** SQLite database (users table) for credential verification
- **Purpose:** Authenticate user and create session
- **Data Elements:** email, password (MD5)

Submitted credentials are compared against stored MD5 hash; on success email is stored in Flask session.

---

## Session Management

- **Source:** Flask server
- **Destination:** Client browser (signed cookie)
- **Purpose:** Maintain authenticated state
- **Data Elements:** email

session['email'] is set after login and cleared on logout.

---

## Product Browsing

- **Source:** SQLite database (products, categories)
- **Destination:** Browser (HTML rendered by templates)
- **Purpose:** Display catalog to users
- **Data Elements:** productId, name, price, description, image, stock, categoryId

SELECT queries retrieve product data, which is passed to Jinja2 templates.

---

## Add Product (Admin)

- **Source:** Browser (admin form)
- **Destination:** File system (uploaded image) and SQLite database (products table)
- **Purpose:** Create new product entry
- **Data Elements:** name, price, description, stock, categoryId, image filename, passportNo, creditCardNo, bankAccountNumber

Form data is processed, image saved to static/uploads, product row inserted. Sensitive fields are collected but not persisted.

---

## Add to Cart

- **Source:** Browser (addToCart link)
- **Destination:** SQLite database (kart table)
- **Purpose:** Associate product with user's shopping cart
- **Data Elements:** userId (derived from session email), productId

INSERT into kart for the logged-in user.

---


# Business Features

## User Registration

**Description:** Allows a new user to create an account by providing personal details and a password.

**User-facing:** True

**Routes:**
- `/registerationForm`
- `/register`

**Data Involved:**
- email
- password
- firstName
- lastName
- address1
- address2
- zipcode
- city
- state
- country
- phone

---

## User Login / Logout

**Description:** Authenticates users against stored credentials and manages session state.

**User-facing:** True

**Routes:**
- `/loginForm`
- `/login`
- `/logout`

**Data Involved:**
- email
- password

---

## Product Catalog Browsing

**Description:** Displays all products, allows filtering by category, and shows product details.

**User-facing:** True

**Routes:**
- `/`
- `/displayCategory`
- `/productDescription`

**Data Involved:**
- productId
- name
- price
- description
- image
- stock
- categoryId

---

## Admin Product Management

**Description:** Enables an admin user to add new products (including uploading images) and remove existing products.

**User-facing:** False

**Routes:**
- `/add`
- `/addItem`
- `/remove`
- `/removeItem`

**Data Involved:**
- name
- price
- description
- image
- stock
- categoryId
- passportNo
- creditCardNo
- bankAccountNumber

---

## Shopping Cart

**Description:** Authenticated users can add products to a cart, view cart contents, and remove items.

**User-facing:** True

**Routes:**
- `/addToCart`
- `/cart`
- `/removeFromCart`

**Data Involved:**
- userId
- productId

---

## User Profile Management

**Description:** Users can view, edit personal details and change their password.

**User-facing:** True

**Routes:**
- `/account/profile`
- `/account/profile/edit`
- `/account/profile/changePassword`
- `/updateProfile`

**Data Involved:**
- email
- firstName
- lastName
- address1
- address2
- zipcode
- city
- state
- country
- phone
- oldpassword
- newpassword

---


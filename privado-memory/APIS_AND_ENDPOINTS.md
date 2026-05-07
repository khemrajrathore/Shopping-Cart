# API Endpoints

| Method | Path | Handler | Auth Required | Description |
|--------|------|---------|--------------|-------------|
| GET | `/` | `root` | False | Render home page with product list and categories. |
| GET | `/add` | `admin` | False | Render admin product-addition page (category selector). |
| POST | `/addItem` | `addItem` | False | Process product creation, store image file, insert product record. |
| GET | `/remove` | `remove` | False | Render page showing all products with delete links. |
| GET | `/removeItem` | `removeItem` | False | Delete a product identified by productId query parameter. |
| GET | `/displayCategory` | `displayCategory` | False | Show products belonging to a specific category. |
| GET | `/account/profile` | `profileHome` | True | Landing page for user profile section. |
| GET | `/account/profile/edit` | `editProfile` | True | Render form pre-filled with user profile data for editing. |
| POST | `/account/profile/changePassword` | `changePassword` | True | Validate old password, update to new password (MD5). |
| GET | `/account/profile/changePassword` | `changePassword` | True | Render password-change form. |
| POST | `/updateProfile` | `updateProfile` | False | Update user profile fields (except email). |
| GET | `/loginForm` | `loginForm` | False | Render login page. |
| POST | `/login` | `login` | False | Authenticate user; on success store email in session. |
| GET | `/productDescription` | `productDescription` | False | Show detailed view of a single product. |
| GET | `/addToCart` | `addToCart` | True | Add a product to the authenticated user's cart. |
| GET | `/cart` | `cart` | True | Display current cart contents and total price. |
| GET | `/removeFromCart` | `removeFromCart` | True | Remove a product from the authenticated user's cart. |
| GET | `/logout` | `logout` | False | Clear session and redirect to home. |
| GET | `/registerationForm` | `registrationForm` | False | Render registration page. |
| POST | `/register` | `register` | False | Create a new user record with hashed password. |

## Endpoint Details

### `GET` `/`

- **Handler:** `root`
- **Auth:** False
- **Output:** itemData, categoryData, loggedIn, firstName, noOfItems

### `GET` `/add`

- **Handler:** `admin`
- **Auth:** False
- **Output:** categories

### `POST` `/addItem`

- **Handler:** `addItem`
- **Auth:** False
- **Input:** name, price, description, stock, category, image, passportNo, creditCardNo, bankAccountNumber
- **Security Notes:** ['Collects high-sensitivity data (passport, credit card, bank account) without encryption or justification.', 'File upload only checks extension; no content-type validation.']

### `GET` `/remove`

- **Handler:** `remove`
- **Auth:** False
- **Output:** data

### `GET` `/removeItem`

- **Handler:** `removeItem`
- **Auth:** False
- **Input:** productId
- **Security Notes:** ['SQL uses parameterised query, but typo in column name (productID) may cause silent failure.']

### `GET` `/displayCategory`

- **Handler:** `displayCategory`
- **Auth:** False
- **Input:** categoryId
- **Output:** data, categoryName, loggedIn, firstName, noOfItems

### `GET` `/account/profile`

- **Handler:** `profileHome`
- **Auth:** True
- **Output:** loggedIn, firstName, noOfItems

### `GET` `/account/profile/edit`

- **Handler:** `editProfile`
- **Auth:** True
- **Output:** profileData, loggedIn, firstName, noOfItems

### `POST` `/account/profile/changePassword`

- **Handler:** `changePassword`
- **Auth:** True
- **Input:** oldpassword, newpassword
- **Output:** msg
- **Security Notes:** ['Uses MD5 for password hashing - insecure.', 'No CSRF protection.']

### `GET` `/account/profile/changePassword`

- **Handler:** `changePassword`
- **Auth:** True

### `POST` `/updateProfile`

- **Handler:** `updateProfile`
- **Auth:** False
- **Input:** email, firstName, lastName, address1, address2, zipcode, city, state, country, phone
- **Security Notes:** ['No validation of input lengths or formats.', 'No CSRF protection.']

### `GET` `/loginForm`

- **Handler:** `loginForm`
- **Auth:** False
- **Output:** error

### `POST` `/login`

- **Handler:** `login`
- **Auth:** False
- **Input:** email, password
- **Output:** error
- **Security Notes:** ['Password verification uses MD5.', 'Brute-force protection not implemented.']

### `GET` `/productDescription`

- **Handler:** `productDescription`
- **Auth:** False
- **Input:** productId
- **Output:** productData, loggedIn, firstName, noOfItems

### `GET` `/addToCart`

- **Handler:** `addToCart`
- **Auth:** True
- **Input:** productId

### `GET` `/cart`

- **Handler:** `cart`
- **Auth:** True
- **Output:** products, totalPrice, loggedIn, firstName, noOfItems

### `GET` `/removeFromCart`

- **Handler:** `removeFromCart`
- **Auth:** True
- **Input:** productId

### `GET` `/logout`

- **Handler:** `logout`
- **Auth:** False

### `GET` `/registerationForm`

- **Handler:** `registrationForm`
- **Auth:** False

### `POST` `/register`

- **Handler:** `register`
- **Auth:** False
- **Input:** email, password, firstName, lastName, address1, address2, zipcode, city, state, country, phone
- **Output:** msg
- **Security Notes:** ['Password stored as MD5 hash.', 'No email verification or consent handling.']


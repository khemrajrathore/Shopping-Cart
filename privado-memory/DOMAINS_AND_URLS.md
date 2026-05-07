# Domains & URLs

| URL / Domain | Type | Purpose | Found In |
|-------------|------|---------|----------|
| `/` | route | Home page displaying product listings | `main.py` |
| `/add` | route | Admin page to render product‑addition form | `main.py` |
| `/addItem` | route | Handle POST for adding a new product (including image upload) | `main.py` |
| `/remove` | route | Render list of products that can be removed | `main.py` |
| `/removeItem` | route | Delete a product by `productId` query parameter | `main.py` |
| `/displayCategory` | route | Show products belonging to a specific category | `main.py` |
| `/account/profile` | route | User profile home page (requires login) | `main.py` |
| `/account/profile/edit` | route | Render profile edit form | `main.py` |
| `/account/profile/changePassword` | route | Change user password | `main.py` |
| `/updateProfile` | route | Process POST to update user profile details | `main.py` |
| `/loginForm` | route | Render login page | `main.py` |
| `/login` | route | Authenticate user credentials | `main.py` |
| `/registerationForm` | route | Render registration page | `main.py` |
| `/register` | route | Handle new user registration | `main.py` |
| `/productDescription` | route | Display detailed product information | `main.py` |
| `/addToCart` | route | Add a product to the user's shopping cart | `main.py` |
| `/cart` | route | Show current cart contents and total price | `main.py` |
| `/removeFromCart` | route | Remove a product from the cart | `main.py` |
| `/logout` | route | Log the user out by clearing the session | `main.py` |
| `/static/js/validateForm.js` | static asset | Client‑side password‑match validation for registration | `templates/register.html` |
| `/static/js/changePassword.js` | static asset | Client‑side password‑match validation for password change | `templates/changePassword.html` |
| `/static/css/editProfile.css` | static asset | Styling for the edit‑profile page | `templates/editProfile.html` |
| `/static/css/topStyle.css` | static asset | Common top navigation styling | `templates/editProfile.html` |
| `/static/images/logo.png` | static asset | Site logo displayed in header | `templates/editProfile.html` |
| `/static/images/shoppingCart.png` | static asset | Cart icon displayed in header | `templates/editProfile.html` |

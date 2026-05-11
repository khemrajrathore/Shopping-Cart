# Shopping Cart — Knowledge Base

> Auto-generated documentation of the [Shopping-Cart](https://github.com/khemrajrathore/Shopping-Cart) repository.

## Architecture

- **Type:** Monolith
- **Language:** Python 3.8
- **Framework:** Flask 2.0.3
- **Database:** SQLite (database.db)
- **Templates:** Jinja2 (HTML)

## Engineering Doc

- [Engineering Doc (ERD)](erd.md) — System architecture, data stores, ingress/egress, security concerns.

## Features

- [Product Browsing](features/product-browsing.md) — Allows users to view products, product descriptions, and products by category.
- [User Registration](features/user-registration.md) — Enables users to create an account.
- [User Login/Logout](features/user-login-logout.md) — Allows users to log in and log out of their accounts.
- [User Profile Management](features/user-profile-management.md) — Enables users to view, edit, and update their profiles.
- [Password Management](features/password-management.md) — Allows users to change their passwords.
- [Shopping Cart Management](features/shopping-cart-management.md) — Enables users to add, remove, and view products in their cart.
- [Product Management](features/product-management.md) — Allows administrators to add, remove, and manage products.

## ROPA (Record of Processing Activities)

See the [ropa/](ropa/) directory for per-activity ROPA files.

- [PA-001: User Registration](ropa/PA-001_user-registration.md)
- [PA-002: User Login](ropa/PA-002_user-login.md)
- [PA-003: User Logout](ropa/PA-003_user-logout.md)
- [PA-004: User Profile Management](ropa/PA-004_user-profile-management.md)
- [PA-005: Password Management](ropa/PA-005_password-management.md)
- [PA-006: Shopping Cart Management](ropa/PA-006_shopping-cart-management.md)
- [PA-007: Product Browsing](ropa/PA-007_product-browsing.md)
- [PA-008: Product Management (Admin) with Sensitive Data Collection](ropa/PA-008_product-management-admin.md)

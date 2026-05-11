# Product Browsing

## Overview
The Product Browsing feature lets customers explore the catalog: they can see a list of all products on the home page, view a detailed description of a single product, and filter products by category. The feature is used by any visitor (authenticated or not) who wants to browse the store.

## Behavior
Step‑by‑step execution of the three entry points:

| Step | Action | Code reference |
|------|--------|----------------|
| 1 | **Home page** (`/`) is requested. `root()` is called. | `main.py:24` |
| 2 | `getLoginDetails()` gathers login state, first name, and cart count. | `main.py:9` |
| 3 | All products are fetched: `SELECT productId, name, price, description, image, stock FROM products`. | `main.py:27` |
| 4 | All categories are fetched: `SELECT categoryId, name FROM categories`. | `main.py:29` |
| 5 | The raw rows are reshaped by `parse()` and passed to `home.html`. | `main.py:30‑31` |
| 6 | **Product description** (`/productDescription?productId=…`) calls `productDescription()`. | `main.py:176` |
| 7 | Login details are refreshed (`getLoginDetails()`). | `main.py:177` |
| 8 | The specific product is fetched: `SELECT productId, name, price, description, image, stock FROM products WHERE productId = ?`. | `main.py:181` |
| 9 | The row is sent to `productDescription.html`. | `main.py:186` |
| 10 | **Category view** (`/displayCategory?categoryId=…`) calls `displayCategory()`. | `main.py:138` |
| 11 | Login details are refreshed (`getLoginDetails()`). | `main.py:139` |
| 12 | Products for the chosen category are fetched: `SELECT products.productId, products.name, products.price, products.image, categories.name FROM products, categories WHERE products.categoryId = categories.categoryId AND categories.categoryId = ?`. | `main.py:144` |
| 13 | The first row’s `categories.name` is used as `categoryName`. | `main.py:148` |
| 14 | The result set is reshaped by `parse()` and rendered with `displayCategory.html`. | `main.py:149‑150` |

## Triggers
The feature is invoked via three HTTP GET routes:

| Route | Function | Purpose |
|-------|----------|---------|
| `/` | `root()` | Show all products and categories on the home page. |
| `/productDescription` | `productDescription()` | Show detailed info for a single product (`productId` query param). |
| `/displayCategory` | `displayCategory()` | Show products belonging to a specific category (`categoryId` query param). |

These routes are linked from the HTML templates (`home.html` provides links to the description and category pages).

## Flow Diagram
```mermaid
flowchart TD
    A[User visits /] --> B[root()]
    B --> C[Query products]
    B --> D[Query categories]
    C --> E[parse() groups rows]
    D --> E
    E --> F[Render home.html]

    G[User clicks product] --> H[productDescription()]
    H --> I[Query product by id]
    I --> J[Render productDescription.html]

    K[User clicks category] --> L[displayCategory()]
    L --> M[Query products for category]
    M --> N[parse() groups rows]
    N --> O[Render displayCategory.html]
```

## State & Storage
| Table | Columns accessed | Operation | Code location |
|-------|------------------|-----------|---------------|
| `products` | `productId, name, price, description, image, stock, categoryId` | SELECT all (home) | `main.py:27` |
| `products` | same as above | SELECT by `productId` (detail) | `main.py:181` |
| `products` | `productId, name, price, image, categoryId` | SELECT by `categoryId` (category view) | `main.py:144` |
| `categories` | `categoryId, name` | SELECT all (home) | `main.py:29` |
| `categories` | `name` (via join) | SELECT name for chosen category | `main.py:148` |
| **No writes** are performed by this feature. |

## External Dependencies
* **Flask** – request handling, routing, template rendering.  
* **sqlite3** – embedded relational database access.  
* **werkzeug.utils.secure_filename** – used elsewhere for uploads (not in browsing).  
* **hashlib, os** – imported but not used in the browsing paths.

## Configuration
* `app.secret_key` is hard‑coded as `'random string'`.  
* Database file is hard‑coded as `'database.db'` in every `sqlite3.connect()` call.  
* No environment variables or external service URLs are referenced for browsing.

## Edge Cases & Concerns
| Issue | Explanation |
|-------|-------------|
| **Missing validation on query parameters** | `productId` and `categoryId` are taken directly from `request.args` and used in parameterised queries, which is safe against SQL injection, but there is no check that the values are present or that they correspond to existing rows. A missing or invalid `categoryId` will cause `data[0][4]` to raise `IndexError`. |
| **Empty category handling** | If a category has no products, `data` is empty and `categoryName = data[0][4]` crashes. |
| **`parse()` design** | `parse()` groups rows into sub‑lists of up to 7 items (`while i < len(data): … for j in range(7)`). This is a presentation helper, not a data‑integrity function, but it can produce uneven groups and is unrelated to security. |
| **Hard‑coded DB path** | Ties the app to a specific file location; moving to a different environment requires code change. |
| **No pagination / limits** | The home page loads *all* products (`SELECT … FROM products`) which can become a performance problem as the catalog grows. |
| **No caching** | Every request hits the SQLite file; repeated reads could be optimized with caching. |
| **Potential information leakage** | All product fields, including `stock`, are exposed to any visitor, which may be undesirable for inventory privacy. |
| **Error handling** | Database errors are not caught in the browsing routes; a DB failure would raise an exception and return a 500 error. |

## Open Questions
* **Pagination strategy** – Will the system later introduce page limits or infinite scroll?  
* **Search / filtering** – Is there a plan to add keyword search or price filters?  
* **Authorization** – Should some product details (e.g., stock levels) be hidden from anonymous users?  
* **`parse()` purpose** – The function appears only to chunk rows for the template; could the templates be refactored to avoid this extra step?  
* **Image storage** – Images are stored as filenames on the filesystem (`static/uploads`). Would a CDN or database BLOB be preferable for scalability?
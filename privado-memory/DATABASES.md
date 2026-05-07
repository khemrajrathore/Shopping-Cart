# Database Schema

## database.db (SQLite)

### Table: `users`

| Column | Type | Is PII | PII Category |
|--------|------|--------|-------------|
| `userId` | INTEGER PRIMARY KEY | True | user identifier |
| `password` | TEXT | True | authentication secret |
| `email` | TEXT | True | email address |
| `firstName` | TEXT | True | name |
| `lastName` | TEXT | True | name |
| `address1` | TEXT | True | address |
| `address2` | TEXT | True | address |
| `zipcode` | TEXT | True | address |
| `city` | TEXT | True | address |
| `state` | TEXT | True | address |
| `country` | TEXT | True | address |
| `phone` | TEXT | True | phone number |

### Table: `products`

| Column | Type | Is PII | PII Category |
|--------|------|--------|-------------|
| `productId` | INTEGER PRIMARY KEY | False | None |
| `name` | TEXT | False | None |
| `price` | REAL | False | None |
| `description` | TEXT | False | None |
| `image` | TEXT | False | None |
| `stock` | INTEGER | False | None |
| `categoryId` | INTEGER | False | None |

### Table: `kart`

| Column | Type | Is PII | PII Category |
|--------|------|--------|-------------|
| `userId` | INTEGER | True | user identifier |
| `productId` | INTEGER | False | None |

### Table: `categories`

| Column | Type | Is PII | PII Category |
|--------|------|--------|-------------|
| `categoryId` | INTEGER PRIMARY KEY | False | None |
| `name` | TEXT | False | None |


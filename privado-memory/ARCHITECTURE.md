# Architecture Overview

## Summary

The Shopping-Cart application is a monolithic Flask web app that follows a simple Model-View-Controller style. The model layer is represented by an SQLite database accessed directly via the sqlite3 module. The view layer consists of Jinja2 HTML templates and static assets (CSS, JavaScript, images). The controller layer is the Flask route handlers defined in main.py, which orchestrate request handling, session management, and interaction with the database. All components run in a single Python process and the app is started with Flask's built-in development server.

The codebase is small and tightly coupled: database schema creation lives in database.py, route logic directly opens SQLite connections, and there is no service layer or ORM abstraction. User authentication is session-based using Flask's signed cookie mechanism, and file uploads are stored on the local filesystem under static/uploads.

## Tech Stack

- Python 3.8
- Flask
- SQLite (pysqlite3)
- Jinja2 templates
- HTML/CSS
- JavaScript

## Components

| Component | Type | File | Description |
|-----------|------|------|-------------|
| database.py | Database schema initializer | `database.py` | Creates SQLite tables for users, products, kart (shopping cart), and categories. |
| main.py | Web application (controller) | `main.py` | Defines all Flask routes, session handling, business logic, and file-upload handling. |
| templates/ | View layer | `templates/` | Jinja2 HTML templates that render pages for home, product details, cart, profile, registration, etc. |
| static/ | Static assets | `static/` | CSS, JavaScript, images and uploaded product images served directly to the browser. |
| Pipfile | Dependency manifest | `Pipfile` | Specifies required Python packages (Flask, pysqlite3) and Python version. |

## Design Patterns

- Model-View-Controller (MVC) - separation of data (SQLite), presentation (templates), and control (Flask routes)
- Singleton (Flask app instance)
- Factory (secure_filename utility for file uploads)

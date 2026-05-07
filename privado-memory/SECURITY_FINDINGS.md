# Security Findings

## 🔴 [CRITICAL] Weak Cryptography (MD5 for passwords)

**Description:** Passwords are hashed with MD5 in registration, login validation, and password change, which is fast and vulnerable to rainbow table attacks.

**Affected Code:** `['hashlib.md5(password.encode()).hexdigest()  # registration', 'oldPassword = hashlib.md5(oldPassword.encode()).hexdigest()  # changePassword', 'if row[1] == hashlib.md5(password.encode()).hexdigest():  # is_valid']`

**Recommendation:** Replace MD5 with a strong password hashing algorithm such as bcrypt, Argon2, or PBKDF2 with a per‑user salt.

---

## 🔴 [CRITICAL] Missing Authentication/Authorization on Sensitive Routes

**Description:** Routes that modify data (`/add`, `/addItem`, `/remove`, `/removeItem`, `/updateProfile`) do not verify that the user is logged in or has admin privileges.

**Affected Code:** `['@app.route("/add")', '@app.route("/addItem", methods=["GET", "POST"])', '@app.route("/remove")', '@app.route("/removeItem")', '@app.route("/updateProfile", methods=["GET", "POST"])']`

**Recommendation:** Add authentication checks (`if 'email' not in session: redirect`) and role‑based access control for admin functions.

---

## 🟠 [HIGH] Cross‑Site Request Forgery (CSRF) Protection Missing

**Description:** All state‑changing POST endpoints lack CSRF tokens, allowing attackers to forge requests on behalf of authenticated users.

**Affected Code:** `['@app.route("/addItem", methods=["GET", "POST"])', '@app.route("/login", methods=[\'POST\', \'GET\'])', '@app.route("/register", methods=[\'GET\', \'POST\'])', '@app.route("/changePassword", methods=["GET", "POST"])', '@app.route("/updateProfile", methods=["GET", "POST"])']`

**Recommendation:** Integrate Flask‑WTF or another CSRF protection mechanism and include hidden tokens in all forms.

---

## 🟠 [HIGH] Insecure File Upload Handling

**Description:** Uploaded images are saved after only checking the file extension. An attacker could upload a malicious file with a permitted extension or a large file to exhaust storage.

**Affected Code:** `['if image and allowed_file(image.filename):', 'filename = secure_filename(image.filename)', "image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))"]`

**Recommendation:** Validate MIME type, enforce size limits, store uploads outside the static directory, and consider scanning files for malware.

---

## 🟡 [MEDIUM] SQL Injection (Potential)

**Description:** Although most queries use parameterized placeholders, the `removeItem` route uses a mismatched column name (`productID`) which could be exploited if the query were altered. Additionally, the `is_valid` function loads all users and iterates, which is inefficient but not directly injectable. Recommend reviewing all queries for proper parameterization and avoiding string concatenation.

**Affected Code:** `["cur.execute('DELETE FROM products WHERE productID = ?', (productId, ))  # removeItem", "def is_valid(email, password):\n    cur.execute('SELECT email, password FROM users')"]`

**Recommendation:** Ensure all SQL statements use parameterized queries and validate/whitelist input types. Rename column to correct case and use proper placeholders.

---

## 🟡 [MEDIUM] Debug Mode Enabled

**Description:** The Flask app is started with `debug=True`, which can expose stack traces and internal configuration to attackers.

**Affected Code:** `app.run(debug=True)`

**Recommendation:** Disable debug mode in production (`debug=False`) and use a proper WSGI server.

---

## 🟡 [MEDIUM] Hard‑coded Secret Key

**Description:** The Flask `secret_key` is a static string, making session data predictable.

**Affected Code:** `app.secret_key = 'random string'`

**Recommendation:** Generate a strong random secret key and load it from environment variables or a secrets manager.

---

## 🟢 [LOW] Improper Session Cookie Settings

**Description:** Flask defaults are used; `SESSION_COOKIE_SECURE` and `SESSION_COOKIE_HTTPONLY` are not set, potentially exposing the session cookie over insecure connections.

**Affected Code:** `app = Flask(__name__)  # no explicit session config`

**Recommendation:** Set `SESSION_COOKIE_SECURE=True` (HTTPS only) and `SESSION_COOKIE_HTTPONLY=True`.

---

## 🟢 [LOW] Potential Open Redirect via `url_for` with User Input

**Description:** Although not directly exploitable in current code, using `url_for` with user‑controlled values without validation can lead to open redirects.

**Affected Code:** `return redirect(url_for('root'))  # pattern used throughout`

**Recommendation:** Validate any dynamic URL destinations or avoid redirecting based on user input.

---

## 🟢 [LOW] Improper Error Handling Reveals Internal State

**Description:** Generic `except:` blocks swallow exceptions and print messages to console, which may leak stack traces in logs.

**Affected Code:** `['except:', 'msg="error occured"', 'print(msg)']`

**Recommendation:** Log errors securely and return user‑friendly messages without exposing internal details.

---


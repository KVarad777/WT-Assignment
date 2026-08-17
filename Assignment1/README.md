# PowerPay Hub — Utility Billing System (Assignment 1)

A compact utility-billing web app built with PHP and MySQL. It demonstrates a simple workflow for registering customers, recording monthly consumption, generating invoices, and viewing customer analytics.

**Author:** Varad Khedkar — TY CS N-53

## Key Features
- Register customers with meter numbers and contact details
- Generate month-wise electricity bills (tiered slab calculation)
- View and toggle bill payment status (PAID / UNPAID)
- Customer-specific analytics and monthly usage charts (Chart.js)
- Printable invoice/receipt view

## Tech Stack
- PHP (server-side application)
- MySQL / MariaDB (database)
- HTML, CSS (responsive UI)
- Chart.js (client-side charts)

## Project Structure (important files)
- `index.php` — Main application entry and controller
- `schema.sql` — Database schema and seed data
- `config/db.php` — Database connection config
- `testdb.php` — Simple DB connectivity test
- `includes/` — Header, footer and shared helpers
- `modules/` — Feature modules (generate-bill, analytics, register customer, receipt)
- `assets/style.css` — Main UI styles

## Setup & Run (quick)
1. Ensure you have PHP, Apache (or XAMPP) and MySQL installed.
2. Place the `Assignment1` folder inside your webserver root (e.g., `htdocs`).
3. Import the database schema:

```bash
mysql -u root -p < schema.sql
```

4. Update database credentials in `config/db.php` if needed (host/port/user/password).
5. Open in browser: `http://localhost/Assignment1/index.php`

Notes:
- The default DB port in the repo is set in `config/db.php` — change it to match your local MySQL port if different.
- Use `testdb.php` to quickly verify DB connectivity.

## Development & Troubleshooting
- If charts don't render, make sure `Chart.js` is reachable (the app uses CDN by default).
- For permission issues on Apache, ensure the project folder has correct read permissions.

---
Created for Assignment 1. If you want, I can also add a small automated test script or a Dockerfile for local dev.

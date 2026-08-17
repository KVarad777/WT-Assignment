# ⚡ Voltage — Electricity Bill Calculator

A complete, production-styled **Java Servlet + JSP** web application that
calculates electricity bills using a four-tier slab tariff, with a modern
Bootstrap 5 UI (glassmorphism, gradients, dark mode) — and **no external
database required**.

The project is deliberately architected so that a real database (MySQL) can
be added later by changing a **single line of code**. See
["Future MySQL Support"](#-future-mysql-support) below.

---

## ✨ Features

- Slab-wise electricity bill calculation (4 tariff tiers)
- Home, Calculator, Result, History, About, Contact and 404 pages
- Bill history with **search**, **sort**, and **delete**
- Print-friendly bill receipt
- Light / dark mode with persisted preference
- Toast notifications and a loading spinner
- Fully responsive, Bootstrap 5 + Bootstrap Icons + Google Fonts UI
- Clean MVC + Repository/DAO architecture — no direct data-structure access
  from controllers

---

## 🧱 Tech Stack

| Layer        | Technology                                   |
|--------------|-----------------------------------------------|
| Language     | Java 17                                        |
| Web layer    | Jakarta Servlet 6.0 / JSP (Tomcat 10.1+)       |
| View helpers | JSTL 3.0 (`core`, `fmt`)                       |
| Build        | Maven (packaged as `.war`)                     |
| Frontend     | Bootstrap 5.3, Bootstrap Icons, jQuery 3.7     |
| Fonts        | Google Fonts — Sora (display) + Inter (body)   |
| Data layer   | In-memory `ConcurrentHashMap` (no database)    |

---

## 🗂️ Project Structure

```
electricity-bill-calculator/
├── pom.xml
├── README.md
├── INSTALLATION.md
└── src/main/
    ├── java/com/ebill/
    │   ├── model/
    │   │   ├── Bill.java              # domain model
    │   │   └── SlabDetail.java        # one row of the slab breakdown
    │   ├── repository/
    │   │   ├── BillRepository.java        # <-- interface (the contract)
    │   │   ├── InMemoryBillRepository.java# <-- current implementation
    │   │   └── MySQLBillRepository.java   # <-- future implementation (TODO stub)
    │   ├── service/
    │   │   └── BillService.java       # business logic (calculation, search/sort)
    │   ├── util/
    │   │   └── BillCalculator.java    # pure slab-calculation math
    │   ├── controller/
    │   │   ├── HomeServlet.java
    │   │   ├── BillServlet.java       # /calculator (GET), /calculate (POST)
    │   │   ├── HistoryServlet.java    # /history
    │   │   ├── DeleteServlet.java     # /delete
    │   │   ├── AboutServlet.java
    │   │   └── ContactServlet.java
    │   └── listener/
    │       └── AppContextListener.java# composition root / dependency injection
    └── webapp/
        ├── WEB-INF/
        │   ├── web.xml
        │   └── views/                 # JSP pages (not directly web-accessible)
        │       ├── common/header.jsp
        │       ├── common/footer.jsp
        │       ├── index.jsp
        │       ├── calculator.jsp
        │       ├── result.jsp
        │       ├── history.jsp
        │       ├── about.jsp
        │       ├── contact.jsp
        │       └── 404.jsp
        ├── css/style.css
        └── js/script.js
```

JSP views live under `WEB-INF/views/` so they can **only** be reached via a
Servlet's `RequestDispatcher.forward()` — never requested directly by URL.
This enforces the MVC flow: **Browser → Servlet (Controller) → Service →
Repository**, and back out through a forward to a JSP (View).

---

## 🏗️ Architecture — Repository / DAO Pattern

```
        ┌────────────┐      ┌─────────────┐      ┌───────────────────┐
Browser │  Servlet   │ ---> │ BillService │ ---> │  BillRepository     │
◄──────►│ Controller │      │ (business   │      │  <<interface>>     │
        │            │◄---- │  logic)     │◄---- │                     │
        └────────────┘      └─────────────┘      └──────────┬──────────┘
                                                              │
                                              ┌───────────────┴────────────────┐
                                              │                                │
                                   InMemoryBillRepository          MySQLBillRepository
                                   (ACTIVE — ConcurrentHashMap)    (placeholder / TODO)
```

- **Controllers (Servlets)** never touch a collection or a database. They
  only call methods on `BillService`.
- **`BillService`** contains all business logic (slab calculation
  delegation, search, sorting) and depends only on the `BillRepository`
  *interface*.
- **`BillRepository`** is the contract. `InMemoryBillRepository` is the only
  class in the project that touches a `ConcurrentHashMap` directly.
- **`AppContextListener`** is the single "composition root" where a concrete
  repository implementation is instantiated and wired into `BillService` at
  application startup, then published on the `ServletContext` for every
  Servlet to use (simple, framework-free Dependency Injection).

---

## 💡 Electricity Tariff Slabs

| Slab             | Units        | Rate (Rs./unit) |
|-------------------|--------------|------------------|
| Slab 1            | First 50     | 3.50             |
| Slab 2            | Next 100 (51–150)   | 4.00      |
| Slab 3            | Next 100 (151–250)  | 5.20      |
| Slab 4            | Above 250    | 6.50             |

Example: **275 units** →
- 50 × 3.50 = 175.00
- 100 × 4.00 = 400.00
- 100 × 5.20 = 520.00
- 25 × 6.50 = 162.50
- **Total = Rs. 1257.50**

---

## 🚀 Quick Start

See **[INSTALLATION.md](./INSTALLATION.md)** for the full, step-by-step
guide (JDK, Maven, Tomcat, Eclipse/IntelliJ import, deployment).

TL;DR:

```bash
mvn clean package
# deploy target/electricity-bill-calculator.war to Tomcat's webapps/ folder
# then visit:
http://localhost:8080/electricity-bill-calculator/
```

---

## 🔮 Future MySQL Support

**MySQL is intentionally NOT implemented right now.** The project runs
entirely in memory. When you're ready to add persistence:

### Step 1 — Install MySQL
Install MySQL Server locally (or use a hosted instance) and create the schema:

```sql
CREATE DATABASE ebill_db;

CREATE TABLE bills (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    customer_name      VARCHAR(100) NOT NULL,
    customer_number    VARCHAR(50)  NOT NULL,
    units_consumed     INT NOT NULL,
    total_amount       DOUBLE NOT NULL,
    bill_date          DATETIME NOT NULL,
    slab_details_json  TEXT
);
```

### Step 2 — Add the MySQL driver dependency
In `pom.xml`, uncomment the `mysql-connector-j` dependency block (already
present, commented out, with instructions).

### Step 3 — Implement `MySQLBillRepository`
Open `src/main/java/com/ebill/repository/MySQLBillRepository.java`. It
already implements the `BillRepository` interface with every method
stubbed out and a `TODO` describing the exact SQL to write (`INSERT`,
`SELECT`, `UPDATE`, `DELETE`). Fill these in using JDBC (or JPA/Hibernate if
you prefer).

### Step 4 — Flip one line
In `src/main/java/com/ebill/listener/AppContextListener.java`, change:

```java
BillRepository repository = new InMemoryBillRepository();
```

to:

```java
BillRepository repository = new MySQLBillRepository();
```

**That's it.** No Servlet, no JSP, and no line of `BillService` needs to
change — they were all written against the `BillRepository` interface from
day one.

---

## 📄 License

This is a demonstration/learning project. Use it, extend it, and adapt it
freely for your own projects.

# Energy Ledger — Electricity Bill Calculator & Management System

A full-stack, enterprise-grade Java web application for progressive electricity tariff calculation, utility statement generation, and consumption analytics built with **JSP**, **Java Servlets**, **JDBC**, **MySQL**, and **Apache Tomcat**.

---

## Overview

**Energy Ledger** provides transparent, multi-tier progressive billing for domestic electricity consumers. Unlike simplified flat-rate calculators, this system implements true piecewise slab mathematics, ensuring baseline consumption is protected at subsidized rates while higher tiers apply incrementally.

The application features a responsive user interface ("Energy Ledger" design system) with real-time reactive client estimates, server-side validation, persistent MySQL audit trails, printable invoices, interactive tariff simulators, and a dark/light theme switcher.

---

## Technology Stack

| Layer | Technology | Version / Specification |
|---|---|---|
| **Frontend UI** | JSP (JavaServer Pages) &amp; JSTL | JSP 2.3 / JSTL 1.2 |
| **Styling** | Vanilla Modern CSS3 | Custom Design System, CSS Variables, Print Optimization |
| **Client Scripting** | Vanilla JavaScript (ES6+) | Live Reactive Estimator, Theme Persistence |
| **Backend Controller** | Java Servlets | Servlet 3.1 (`javax.servlet`) |
| **Business Logic** | Core Java | Java 17 LTS (`BigDecimal` Precision) |
| **Persistence** | JDBC (Java Database Connectivity) | `PreparedStatement`, Parameterized Queries |
| **Database Server** | MySQL / MariaDB | 10.4+ (XAMPP Environment) |
| **Application Server** | Apache Tomcat | 8.5.96+ (Port 8080) |
| **Build &amp; Dependency** | Apache Maven | Maven 3.9+ |
| **Testing** | JUnit 5 | 5.10.2 (Parameterized Unit Tests) |

---

## Architecture

The project adheres to the standard **Model-View-Controller (MVC)** architectural pattern with clean separation between presentation, routing, business services, and database persistence.

```mermaid
graph TD
    Client[Web Browser / Client]
    
    subgraph Presentation Layer
        JSP[JSP Views: home, calculator, result, history, tariff, about]
        CSS[Modern CSS Design System & Print Styles]
        JS[Reactive Calculator & Theme Controller]
    end
    
    subgraph Controller Layer
        HomeServlet[HomeServlet /home]
        CalcServlet[CalculatorServlet /calculator]
        BillCalcServlet[BillCalculationServlet /calculate]
        HistoryServlet[BillHistoryServlet /history]
        DetailsServlet[BillDetailsServlet /bill-details]
        TariffServlet[TariffServlet /tariff]
        DeleteServlet[DeleteBillServlet /delete-bill]
    end
    
    subgraph Business Service Layer
        BillService[BillService]
        ElectricityBillService[ElectricityBillService - Progressive Engine]
        CustomerService[CustomerService]
        ValidationUtil[ValidationUtil & CurrencyUtil]
    end
    
    subgraph Data Access Layer
        BillDAO[BillDAO]
        CustomerDAO[CustomerDAO]
        TariffDAO[TariffDAO]
        DBConnection[DBConnection Pool Factory]
    end
    
    subgraph Database
        MySQL[(MySQL electricity_bill_db)]
    end

    Client --> JSP
    JSP --> Controller Layer
    Controller Layer --> Business Service Layer
    Business Service Layer --> Data Access Layer
    Data Access Layer --> DBConnection
    DBConnection --> MySQL
```

---

## Official Electricity Tariff

The application computes energy charges strictly according to the progressive multi-tier tariff structure:

| Tariff Slab | Consumption Range | Applicable Rate | Description |
|---|---|---|---|
| **Slab 1** | First 50 units (0 – 50) | **₹3.50 / unit** | Base subsidized lifeline tier |
| **Slab 2** | Next 100 units (51 – 150) | **₹4.00 / unit** | Moderate domestic usage |
| **Slab 3** | Next 100 units (151 – 250) | **₹5.20 / unit** | Higher domestic tier |
| **Slab 4** | Above 250 units (&gt; 250) | **₹6.50 / unit** | Peak consumption surcharge |

### Mathematical Billing Formula

For total billed units $U \ge 0$, the total energy charge $C(U)$ is computed as follows:

```text
If U <= 50:
    Bill = U × 3.50

If 50 < U <= 150:
    Bill = (50 × 3.50) + ((U - 50) × 4.00)

If 150 < U <= 250:
    Bill = (50 × 3.50) + (100 × 4.00) + ((U - 150) × 5.20)

If U > 250:
    Bill = (50 × 3.50) + (100 × 4.00) + (100 × 5.20) + ((U - 250) × 6.50)
```

#### Progressive Calculation Example (300 units)
- **First 50 units:** $50 \times ₹3.50 = ₹175.00$
- **Next 100 units:** $100 \times ₹4.00 = ₹400.00$
- **Next 100 units:** $100 \times ₹5.20 = ₹520.00$
- **Remaining 50 units:** $50 \times ₹6.50 = ₹325.00$
- **Total Payable:** $175 + 400 + 520 + 325 = \mathbf{₹1,420.00}$
- **Effective Average Rate:** $₹1,420 / 300 = \mathbf{₹4.73 \text{ per unit}}$

---

## Project Structure

```text
ElectricityBillCalculator/
├── pom.xml                                    # Maven project configuration & dependencies
├── database.sql                               # Complete MySQL schema, indexes, and seed records
├── .gitignore                                 # Git ignore rules for build artifacts & credentials
├── README.md                                  # Comprehensive project documentation
└── src/
    ├── main/
    │   ├── java/
    │   │   └── com/
    │   │       └── electricity/
    │   │           ├── controller/
    │   │           │   ├── HomeServlet.java           # GET /home - Landing dashboard
    │   │           │   ├── CalculatorServlet.java     # GET /calculator - Bill form
    │   │           │   ├── BillCalculationServlet.java# POST /calculate - Processing & validation
    │   │           │   ├── BillHistoryServlet.java    # GET /history - Search & CSV export
    │   │           │   ├── BillDetailsServlet.java    # GET /bill-details - Individual invoice
    │   │           │   ├── TariffServlet.java         # GET /tariff - Schedule & simulator
    │   │           │   ├── AboutServlet.java          # GET /about - System specs
    │   │           │   └── DeleteBillServlet.java     # POST /delete-bill - Record deletion
    │   │           ├── dao/
    │   │           │   ├── BillDAO.java               # CRUD & aggregation for bills
    │   │           │   ├── CustomerDAO.java           # Customer queries & UPSERT
    │   │           │   └── TariffDAO.java             # Progressive slabs query & fallback
    │   │           ├── model/
    │   │           │   ├── Bill.java                  # Bill entity
    │   │           │   ├── BillBreakdown.java         # Calculation breakdown output
    │   │           │   ├── Customer.java              # Customer profile entity
    │   │           │   ├── DashboardStats.java        # Aggregate analytics model
    │   │           │   ├── SlabBreakdownItem.java     # Per-slab unit and cost item
    │   │           │   └── TariffSlab.java            # Configurable slab model
    │   │           ├── service/
    │   │           │   ├── BillService.java           # Bill generation & workflow coordination
    │   │           │   ├── CustomerService.java       # Customer service operations
    │   │           │   └── ElectricityBillService.java# Core progressive math & insights
    │   │           └── util/
    │   │               ├── CurrencyUtil.java          # INR currency & unit formatting
    │   │               ├── DBConnection.java          # JDBC connection factory
    │   │               └── ValidationUtil.java        # Server-side validation logic
    │   ├── resources/
    │   │   └── db.properties                          # Centralized database configuration
    │   └── webapp/
    │       ├── WEB-INF/
    │       │   ├── web.xml                            # Servlet mappings & error page handlers
    │       │   └── views/
    │       │       ├── common/
    │       │       │   ├── header.jsp             # HTML head & fonts
    │       │       │   ├── navbar.jsp             # Responsive navigation & theme toggle
    │       │       │   └── footer.jsp             # Footer & scripts
    │       │       ├── home.jsp                   # Landing hero & recent statements
    │       │       ├── calculator.jsp             # Split-screen calculator & live estimate
    │       │       ├── result.jsp                 # Authoritative invoice & breakdown
    │       │       ├── bill-details.jsp           # Standalone invoice view
    │       │       ├── history.jsp                # Searchable audit history table
    │       │       ├── tariff.jsp                 # Interactive tariff schedule & simulator
    │       │       ├── about.jsp                  # Architecture & mathematical formula
    │       │       └── error.jsp                  # Branded error page
    │       ├── css/
    │       │   └── style.css                          # Complete design system & print stylesheet
    │       ├── js/
    │       │   ├── app.js                             # Theme persistence & mobile navigation
    │       │   └── calculator.js                      # Real-time reactive client estimator
    │       └── index.jsp                              # Entry redirect to /home
    └── test/
        └── java/
            └── com/
                └── electricity/
                    └── service/
                        └── ElectricityBillServiceTest.java # 17 JUnit 5 boundary tests
```

---

## Prerequisites

Ensure the following software is installed on your workstation:
- **Java Development Kit (JDK):** Version 17 LTS (`java -version`, `javac -version`)
- **Apache Tomcat:** Version 8.5.x or 9.0.x (Configured on port 8080)
- **MySQL / MariaDB Server:** Running via XAMPP on port 3306
- **Apache Maven:** Version 3.9+ (`mvn -version`)

---

## Database Setup (XAMPP / MySQL)

> **Important Note:** XAMPP is used for the **MySQL database server** (`localhost:3306`). The Java/JSP web application itself is hosted and executed on **Apache Tomcat** (`localhost:8080`).

1. Open the **XAMPP Control Panel**.
2. Click **Start** next to the **MySQL** module.
3. Import the provided schema and seed data into MySQL using the command line or phpMyAdmin:

```bash
# Using MySQL Command Line Client:
mysql -u root < database.sql
```

Alternatively, open phpMyAdmin (`http://localhost/phpmyadmin`), create a database named `electricity_bill_db`, and import `database.sql`.

### Database Configuration (`db.properties`)

Database credentials are centralized in `src/main/resources/db.properties`:

```properties
db.driver=com.mysql.cj.jdbc.Driver
db.host=localhost
db.port=3306
db.name=electricity_bill_db
db.user=root
db.password=
db.useSSL=false
db.allowPublicKeyRetrieval=true
db.serverTimezone=UTC
```

Environment variables `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` can also be used to override these settings without modifying the source code.

---

## Building and Running the Application

### 1. Build the WAR Package
Execute Maven package command in the project root:

```bash
mvn clean package
```

This compiles all Java source files, runs all JUnit 5 unit tests, and packages the web application into:
`target/ElectricityBillCalculator.war`

### 2. Deploy to Apache Tomcat
Copy the generated WAR file into Tomcat's `webapps` directory:

```bash
# Windows Command Prompt / PowerShell Example:
copy "target\ElectricityBillCalculator.war" "C:\xampp\tomcat\webapps\ElectricityBillCalculator.war"
```

### 3. Start Apache Tomcat
Start Tomcat via Catalina script:

```bash
# Using Catalina Start Script:
C:\xampp\tomcat\bin\catalina.bat run
```

### 4. Access the Web Application
Open your web browser and navigate to:

```text
http://localhost:8080/ElectricityBillCalculator/
```

---

## Core Pages & Features

1. **Home Dashboard (`/home`):**
   - Editorial headline and energy ledger concept.
   - Live interactive statement preview card.
   - Aggregate statistics (Total Bills, Total kWh Billed, Total Revenue, Average Statement).
   - Quick progressive tariff cards.
   - Recent bill statements table with quick-view actions.

2. **Intelligent Calculator (`/calculator`):**
   - Customer details input (Name, Consumer #, Contact, Month, Address).
   - Mode switcher: Previous & Current Meter Readings (delta computation) OR Direct Units.
   - Quick Demo Presets: "Lifeline (45u)", "Family (120u)", "Moderate (200u)", "High (300u)", "Heavy (450u)".
   - Real-time client-side reactive preview panel with dynamic segmented energy meter, slab breakdown, total estimate, and usage tier badge.

3. **Authoritative Statement Result (`/calculate`):**
   - Official invoice receipt view with unique statement reference ID (`ELC-BILL-X`).
   - Detailed progressive slab table with unit capacity, rate, billed units, and percentage contributions.
   - Consumption insight analysis (e.g., surcharge tier alerts, energy-saving opportunities).
   - One-click print-optimized invoice trigger (`window.print()`).

4. **Statements History & Audit Ledger (`/history`):**
   - Search by consumer number, customer name, or billing month.
   - Filter by month and sort by date, units consumed, or bill amount.
   - Export full audit history to CSV (`?format=csv`).
   - Action controls for viewing full invoice details or deleting records.

5. **Official Tariff Schedule & Simulator (`/tariff`):**
   - Full rate card for all 4 progressive slabs.
   - Interactive live tariff slider/input to simulate charges for any custom unit consumption.
   - Mathematical comparison highlighting consumer savings under progressive vs flat-rate billing.

6. **System Architecture & About (`/about`):**
   - Full technical documentation, MVC stack overview, formula definitions, and schema details.

---

## Boundary Verification & Automated Tests

All progressive slab boundaries and calculation edge-cases are validated via automated JUnit 5 parameterized tests in `ElectricityBillServiceTest.java`:

| Test Consumption | Calculated Energy Charge | Tariff Slabs Traversed | Status |
|---|---|---|---|
| **0 units** | ₹0.00 | Slab 1 (0 units) | PASSED |
| **1 unit** | ₹3.50 | Slab 1 (1 unit @ ₹3.50) | PASSED |
| **30 units** | ₹105.00 | Slab 1 (30 units @ ₹3.50) | PASSED |
| **50 units** | ₹175.00 | Slab 1 Boundary (50 units @ ₹3.50) | PASSED |
| **51 units** | ₹179.00 | Slab 1 (50u) + Slab 2 (1u @ ₹4.00) | PASSED |
| **100 units** | ₹375.00 | Slab 1 (50u) + Slab 2 (50u @ ₹4.00) | PASSED |
| **150 units** | ₹575.00 | Slab 1 (50u) + Slab 2 Boundary (100u @ ₹4.00) | PASSED |
| **200 units** | ₹835.00 | Slab 1 (50u) + Slab 2 (100u) + Slab 3 (50u @ ₹5.20) | PASSED |
| **201 units** | ₹840.20 | Slab 1 (50u) + Slab 2 (100u) + Slab 3 (51u @ ₹5.20) | PASSED |
| **250 units** | ₹1,095.00 | Slab 1 (50u) + Slab 2 (100u) + Slab 3 Boundary (100u @ ₹5.20) | PASSED |
| **251 units** | ₹1,101.50 | Slabs 1-3 (250u) + Slab 4 (1u @ ₹6.50) | PASSED |
| **300 units** | ₹1,420.00 | Slabs 1-3 (250u) + Slab 4 (50u @ ₹6.50) | PASSED |
| **500 units** | ₹2,720.00 | Slabs 1-3 (250u) + Slab 4 (250u @ ₹6.50) | PASSED |
| **1000 units** | ₹5,970.00 | Slabs 1-3 (250u) + Slab 4 (750u @ ₹6.50) | PASSED |
| **Negative input** | `IllegalArgumentException` | Server-side validation check | PASSED |

---

## Git Development Milestone Commits

The application was engineered in 6 structured development milestones:

| Commit Hash | Conventional Commit Message | Development Milestone Description |
|---|---|---|
| `af82a8d` | `chore: initialize JSP application and development environment` | Project scaffolding, Maven `pom.xml`, `web.xml`, and `.gitignore` setup. |
| `b33ae37` | `feat: add MySQL schema and JDBC persistence layer` | Schema `database.sql`, connection factory `DBConnection`, models, and DAOs. |
| `e664f54` | `feat: implement progressive electricity bill calculation engine` | Core `ElectricityBillService`, insights, and 17 JUnit 5 boundary tests. |
| `6dbb269` | `feat: build responsive electricity bill calculator and dynamic result view` | Split-screen calculator, reactive JS estimator, CSS design system, and result invoice. |
| `90fb5a4` | `feat: add bill history, tariff view, and bill details` | Search & filter audit history, CSV export, standalone invoice view, and tariff schedule. |
| `[Current]` | `style: refine responsive design, dark mode, and project documentation` | Production deployment verification, browser subagent walkthrough, and comprehensive README. |

---

## Troubleshooting

### 1. MySQL Connection Refused (`CommunicationsException` / `10061`)
- Ensure the MySQL service is started in XAMPP on port 3306.
- Check `src/main/resources/db.properties` to ensure the host, port, username (`root`), and password match your local XAMPP configuration.

### 2. HTTP Status 404 / Cannot find Context
- Verify that `ElectricityBillCalculator.war` is copied into `C:\xampp\tomcat\webapps\`.
- Confirm Tomcat has started and extracted the WAR into `C:\xampp\tomcat\webapps\ElectricityBillCalculator\`.
- Use the complete URL: `http://localhost:8080/ElectricityBillCalculator/home`.

### 3. Port 8080 Already in Use
- Check active listening ports with `Get-NetTCPConnection -LocalPort 8080`.
- If another application occupies port 8080, edit `C:\xampp\tomcat\conf\server.xml` to change `<Connector port="8080" ...>` to an available port (such as 8081).

---

## Author & Credits

Designed and developed by **Varad Khedkar** for SEM V Web Technology (WT Assignment 4).

## License

This project is developed for academic demonstration and utility billing reference under SEM V Web Technology.

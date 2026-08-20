# Energy Ledger — Electricity Bill Calculator & Management System

A modern full-stack Java web application for progressive electricity tariff calculation, statement generation, and consumption history management built using **JSP, Java Servlets, JDBC, MySQL, and Apache Tomcat**.

---

## Features

- **Progressive Tariff Engine**: Accurate multi-slab progressive calculation using `BigDecimal` precision.
- **Interactive Calculator**: Live client-side reactive bill estimation and preset demo auto-fillers.
- **Meter Reading Computation**: Automatically calculates units from Previous & Current meter readings or direct unit input.
- **Official Utility Statement**: Itemized breakdown table, consumption distribution bar, and printable invoice layout (`Ctrl+P` / Print button).
- **Statements Audit History**: Full database persistence with real-time search, month filtering, sorting, and CSV export.
- **Interactive Tariff Schedule**: Dedicated page explaining progressive slabs with an instant simulation widget.
- **Dark & Light Mode**: Seamless theme switcher persisted in `localStorage`.

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | JSP 2.3, JSTL 1.2, HTML5, Vanilla CSS3, JavaScript (ES6+) |
| **Backend** | Java Servlets (Servlet 3.1 Standard, Java 17 LTS) |
| **Database & Persistence** | MySQL / MariaDB (XAMPP), JDBC with `PreparedStatement` |
| **Server & Build** | Apache Tomcat 8.5+, Apache Maven 3.9+ |

---

## Progressive Tariff Slabs

Electricity charges are calculated incrementally across progressive consumption brackets:

| Slab | Units Bracket | Rate (INR) | Description |
|---|---|---|---|
| **Slab 1** | First 50 units (0 – 50) | **₹3.50 / unit** | Lifeline base tier |
| **Slab 2** | Next 100 units (51 – 150) | **₹4.00 / unit** | Moderate domestic usage |
| **Slab 3** | Next 100 units (151 – 250) | **₹5.20 / unit** | Higher domestic tier |
| **Slab 4** | Above 250 units (> 250) | **₹6.50 / unit** | Peak surcharge tier |

### Formula & Example (300 Units)

$$\text{Total Bill} = (50 \times 3.50) + (100 \times 4.00) + (100 \times 5.20) + (50 \times 6.50) = 175 + 400 + 520 + 325 = \mathbf{₹1,420.00}$$

---

## Quick Start & Setup

### 1. Database Setup (XAMPP MySQL)
1. Start **MySQL** in XAMPP (runs on `localhost:3306`).
2. Import `database.sql` into MySQL:
   ```bash
   mysql -u root < database.sql
   ```
   *(Or import `database.sql` using phpMyAdmin at `http://localhost/phpmyadmin`)*

### 2. Build the WAR Package
```bash
mvn clean package
```
This compiles source files, passes unit tests, and generates `target/ElectricityBillCalculator.war`.

### 3. Deploy & Run on Apache Tomcat
1. Copy `target/ElectricityBillCalculator.war` to your Tomcat `webapps/` folder:
   ```bash
   copy target\ElectricityBillCalculator.war C:\xampp\tomcat\webapps\
   ```
2. Start Tomcat (`C:\xampp\tomcat\bin\catalina.bat run`).
3. Open your browser at:
   ```text
   http://localhost:8080/ElectricityBillCalculator/
   ```

---

## Project Structure

```text
ElectricityBillCalculator/
├── pom.xml                                    # Maven configuration & dependencies
├── database.sql                               # MySQL schema & seed data
├── README.md                                  # Project documentation
└── src/
    ├── main/
    │   ├── java/com/electricity/
    │   │   ├── controller/                    # Servlets (Home, Calculator, History, Tariff, About)
    │   │   ├── dao/                           # JDBC Data Access Objects (Bill, Customer, Tariff)
    │   │   ├── model/                         # Domain models (Bill, Customer, TariffSlab, Breakdown)
    │   │   ├── service/                       # Progressive billing engine (ElectricityBillService)
    │   │   └── util/                          # DBConnection, CurrencyUtil, ValidationUtil
    │   ├── resources/
    │   │   └── db.properties                  # Database credentials & configuration
    │   └── webapp/
    │       ├── WEB-INF/views/                 # JSP views (home, calculator, result, history, tariff, about)
    │       ├── css/style.css                  # Modern design system & print stylesheet
    │       ├── js/                            # Client-side reactive estimator & theme scripts
    │       └── index.jsp                      # Welcome redirect
    └── test/java/com/electricity/service/     # JUnit 5 boundary test suite (17 test cases)
```

---

## Author & Credits

Designed and developed by **Varad Khedkar** for SEM V Web Technology (WT Assignment 4).

## License

Developed for academic demonstration and utility reference under SEM V Web Technology.

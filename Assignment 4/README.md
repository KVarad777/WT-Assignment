# Electricity Bill Calculator & Management System

A lightweight, clean Java web application for progressive electricity bill calculation and management built using **JSP, Servlets, JDBC, MySQL, and Apache Tomcat**.

---

## Features

- **Progressive Slab Calculation**: Accurately calculates bill based on 4 tariff slabs.
- **Easy-to-use Calculator**: Enter meter readings or direct units to get an instant calculation.
- **Bill Statement & Invoice**: Shows an itemized slab breakdown with a print-ready bill layout.
- **Bill History**: Saves calculated bills in MySQL with search and filtering.
- **Tariff Rates Page**: Clearly explains all 4 tariff slabs with an interactive simulator.
- **Lightweight Design**: Pure HTML, CSS, and Vanilla JavaScript with Dark/Light mode support.

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | JSP, HTML5, Vanilla CSS3, JavaScript |
| **Backend** | Java Servlets & Core Java |
| **Database** | MySQL (XAMPP) via JDBC |
| **Server** | Apache Tomcat 8.5+ |
| **Build Tool** | Apache Maven |

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

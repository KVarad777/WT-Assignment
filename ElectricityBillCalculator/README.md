# Electricity Bill Calculator (ElectroBill)

A full-stack Java web application designed to compute electricity bills based on tiered slab tariff rates. Built following standard Model-View-Controller (MVC) architecture and Data Access Object (DAO) design patterns, the system provides accurate bill generation, detailed cost breakdowns, persistent database storage, and record management.

---

## Author

- **Author:** Varad Khedkar
- **Course:** SEM V — Web Technology

---

## Project Overview

ElectroBill automates electricity tariff computation using standard tiered government/utility rate slabs. The application validates input data, calculates charges incrementally across individual consumption tiers, persists calculation records into a relational database (MySQL), and provides an interactive dashboard to inspect, filter, search, and manage historical billing records.

---

## Key Features

- **Tiered Slab Tariff Engine:** Computes total payable amounts accurately using progressive multi-tier rate calculations.
- **Detailed Billing Breakdown:** Generates a line-item breakdown showing unit distributions, rates, and individual sub-totals per tier.
- **Persistent Data Management:** Automatically records all generated bills to MySQL with timestamps and customer identifiers.
- **Historical Records & Search:** Search, sort, paginate, and delete billing history records with confirmation safeguards.
- **Dual Validation Layer:** Enforces data integrity through client-side validation (jQuery) and server-side validation (Java Servlets).
- **Responsive UI & Accessibility:** Modern layout built on Bootstrap 5 with responsive tables, clean typography, dark/light theme toggling, and dedicated print stylesheet formatting for physical invoices.
- **Embedded & Standalone Deployment:** Can be launched instantly via an embedded Tomcat server runner or deployed as a standard WAR archive to any servlet container (Apache Tomcat 10+).

---

## Tariff Slab Structure

The billing engine calculates consumption charges using the following tiered pricing matrix:

| Tariff Tier | Unit Range | Rate (INR / Unit) |
| :--- | :--- | :--- |
| **Tier 1** | First 50 units (0 – 50) | 3.50 |
| **Tier 2** | Next 100 units (51 – 150) | 4.00 |
| **Tier 3** | Next 100 units (151 – 250) | 5.20 |
| **Tier 4** | Units exceeding 250 | 6.50 |

### Calculation Example (Consumption = 320 Units)

$$\text{Tier 1 (50 units)} \times ₹3.50 = ₹175.00$$
$$\text{Tier 2 (100 units)} \times ₹4.00 = ₹400.00$$
$$\text{Tier 3 (100 units)} \times ₹5.20 = ₹520.00$$
$$\text{Tier 4 (70 units)} \times ₹6.50 = ₹455.00$$
$$\mathbf{\text{Total Bill Amount}} = \mathbf{₹1,550.00}$$

---

## Technical Architecture & Stack

### Backend
- **Language:** Java (JDK 17 or higher)
- **Servlet Specification:** Jakarta Servlet API 6.0 (Tomcat 10+ compatible)
- **View Layer:** JavaServer Pages (JSP 3.1) & JSTL 3.0
- **Data Access:** JDBC with Connection Singleton and DAO Pattern
- **Architecture:** Model-View-Controller (MVC)

### Frontend
- **Framework:** Bootstrap 5.3 & Bootstrap Icons
- **Scripting:** JavaScript / jQuery 3.7
- **Styling:** Custom CSS with theme support and responsive typography

### Database & Build Tools
- **Database:** MySQL 8.x (InnoDB Engine, UTF-8 character encoding)
- **Driver:** MySQL Connector/J 8.3+
- **Build System:** Apache Maven 3.6+
- **Application Server:** Apache Tomcat 10.1+ (or embedded launcher)

---

## Project Structure

```
ElectricityBillCalculator/
├── pom.xml                                      # Maven build configuration and dependencies
├── database.sql                                 # Database initialization schema and sample records
├── README.md                                    # Documentation
├── build.bat                                    # Automated build and package script
├── run.bat                                      # One-click execution script (Embedded Tomcat)
└── src/
    └── main/
        ├── java/
        │   └── com/electricitybill/
        │       ├── ServerLauncher.java          # Embedded server entry point
        │       ├── controller/
        │       │   ├── BillServlet.java         # Billing computation controller
        │       │   ├── HistoryServlet.java      # History listing controller
        │       │   └── DeleteServlet.java       # Record deletion controller
        │       ├── dao/
        │       │   └── BillDAO.java             # Data Access Object for CRUD operations
        │       ├── model/
        │       │   └── Bill.java                # Bill entity model
        │       └── util/
        │           └── DatabaseConnection.java  # Thread-safe JDBC connection manager
        └── webapp/
            ├── index.jsp                        # Calculator input interface
            ├── css/
            │   └── style.css                    # Application styles and print layouts
            ├── js/
            │   └── script.js                    # Dynamic DOM manipulation and validation
            └── WEB-INF/
                ├── web.xml                      # Deployment descriptor
                └── views/
                    ├── result.jsp               # Detailed bill breakdown invoice view
                    ├── history.jsp              # Historical records table view
                    └── error.jsp                # Standard error handling page
```

---

## Database Configuration & Setup

### 1. Database Initialization

Execute the included `database.sql` script in your MySQL instance:

```bash
mysql -u <db_user> -p < database.sql
```

Alternatively, run the SQL script via MySQL Workbench or phpMyAdmin.

### 2. Connection Settings

To adjust database credentials or connection parameters, update `src/main/java/com/electricitybill/util/DatabaseConnection.java`:

```java
private static final String DB_URL  = "jdbc:mysql://localhost:3306/electricity_bill_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
private static final String DB_USER = "your_username";
private static final String DB_PASS = "your_password";
```

---

## Installation & Running the Application

### Prerequisites
- Java Development Kit (JDK) 17+
- Apache Maven 3.6+
- MySQL Server 8.x
- Apache Tomcat 10.1+ (Optional if using embedded launcher)

### Option A: Running via Embedded Server (Recommended for Development)

1. Ensure your MySQL server is running.
2. Compile and launch the application using Maven:

```bash
mvn compile exec:java
```

3. Open your browser and navigate to:
```
http://localhost:8080/ElectricityBillCalculator/
```

### Option B: Deploying WAR to Apache Tomcat

1. Build the production WAR package:

```bash
mvn clean package
```

2. Copy the generated WAR file from `target/ElectricityBillCalculator.war` into your Tomcat `webapps/` directory:

```bash
cp target/ElectricityBillCalculator.war $TOMCAT_HOME/webapps/
```

3. Start Apache Tomcat:
- **Windows:** `%TOMCAT_HOME%\bin\startup.bat`
- **Linux/macOS:** `$TOMCAT_HOME/bin/startup.sh`

4. Access the web interface at:
```
http://localhost:8080/ElectricityBillCalculator/
```

---

## Application Routes & Endpoints

| HTTP Method | Route | Controller / View | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | `index.jsp` | Main calculator dashboard and input form |
| `POST` | `/calculate` | `BillServlet` | Processes unit calculations, saves record, redirects to result view |
| `GET` | `/history` | `HistoryServlet` | Retrieves and renders all stored billing transactions |
| `GET` | `/delete` | `DeleteServlet` | Removes a specific billing record by ID |

---

## License

This project is developed for educational and academic evaluation purposes.

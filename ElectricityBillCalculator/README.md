# ⚡ ElectroBill — Electricity Bill Calculator

> A modern, production-quality Electricity Bill Calculator built with Java Servlet, JSP, JDBC, MySQL, Bootstrap 5 and jQuery.

---

## 📌 Project Overview

**ElectroBill** is a full-stack Java web application that calculates electricity bills using government-defined slab rates. Every calculation is stored in a MySQL database and can be viewed on the History page with search, sort, and delete functionality.

---

## ✨ Features

| Feature | Details |
|--------|---------|
| 🧮 Slab-wise Calculation | Accurate 4-tier slab rate system |
| 💾 Database Storage | Every bill saved to MySQL automatically |
| 📊 Bill Breakdown | Visual progress-bar slab breakdown |
| 📜 History Page | Searchable, sortable, paginated table |
| 🗑️ Delete Records | Confirmation modal before deleting |
| 🌙 Dark/Light Mode | Saved in localStorage |
| 🔢 Live Preview | Estimate shown as user types |
| ⚡ Animated Counters | Smooth number animations |
| 📱 Responsive | Fully mobile-friendly layout |
| 🖨️ Print Bill | Browser print with print styles |
| 🛡️ Validation | Client-side (jQuery) + Server-side (Servlet) |

---

## 💡 Slab Rate System

| Slab | Units | Rate |
|------|-------|------|
| Slab 1 | First 50 units | ₹ 3.50 / unit |
| Slab 2 | Next 100 units (51–150) | ₹ 4.00 / unit |
| Slab 3 | Next 100 units (151–250) | ₹ 5.20 / unit |
| Slab 4 | Above 250 units | ₹ 6.50 / unit |

**Example — 320 Units:**
```
  50 × ₹3.50 = ₹175.00
100 × ₹4.00 = ₹400.00
100 × ₹5.20 = ₹520.00
  70 × ₹6.50 = ₹455.00
──────────────────────
Total         ₹1,550.00
```

---

## 🛠️ Technologies Used

### Backend
- Java 17
- Jakarta Servlet API 6.0 (Tomcat 10+)
- JSP 3.1 + JSTL 3.0
- JDBC
- DAO Pattern
- MVC Architecture

### Frontend
- Bootstrap 5.3
- Bootstrap Icons 1.11
- jQuery 3.7
- Custom CSS (Glassmorphism, Animations)
- Google Fonts (Inter, Space Grotesk)

### Database
- MySQL 8.x
- MySQL Connector/J 8.3

### Build
- Apache Maven 3.x
- Apache Tomcat 10+

---

## 📁 Project Structure

```
ElectricityBillCalculator/
├── pom.xml                          # Maven configuration
├── database.sql                     # DB setup + sample data
├── README.md
└── src/
    └── main/
        ├── java/
        │   └── com/electricitybill/
        │       ├── model/
        │       │   └── Bill.java            # POJO Model
        │       ├── dao/
        │       │   └── BillDAO.java         # Data Access Object
        │       ├── util/
        │       │   └── DatabaseConnection.java  # JDBC Singleton
        │       └── controller/
        │           ├── BillServlet.java     # Calculate endpoint
        │           ├── HistoryServlet.java  # History endpoint
        │           └── DeleteServlet.java   # Delete endpoint
        └── webapp/
            ├── index.jsp                    # Home / Calculator page
            ├── css/
            │   └── style.css               # All custom styles
            ├── js/
            │   └── script.js               # jQuery interactions
            └── WEB-INF/
                ├── web.xml                  # Servlet descriptor
                └── views/
                    ├── result.jsp           # Bill result page
                    ├── history.jsp          # History page
                    └── error.jsp            # 404/500 page
```

---

## 🗄️ Database Setup

### 1. Open MySQL and run:
```sql
-- Run the provided database.sql file
SOURCE /path/to/database.sql;
```

Or copy-paste the SQL directly into MySQL Workbench / phpMyAdmin.

### 2. Verify:
```sql
USE electricity_bill_db;
SELECT * FROM bill_history;
```

### 3. Configure credentials (if not root/root):
Edit `DatabaseConnection.java`:
```java
private static final String DB_USER = "your_username";
private static final String DB_PASS = "your_password";
```

---

## 🚀 How to Run

### Prerequisites
- JDK 17+
- Apache Maven 3.6+
- Apache Tomcat 10.1+
- MySQL 8.x

### Step 1: Clone / Extract the project
```bash
cd ElectricityBillCalculator
```

### Step 2: Set up the database
```bash
mysql -u root -p < database.sql
```

### Step 3: Build with Maven
```bash
mvn clean package
```

### Step 4: Deploy to Tomcat
Copy `target/ElectricityBillCalculator.war` to Tomcat's `webapps/` folder, then start Tomcat:
```bash
# Windows
%TOMCAT_HOME%\bin\startup.bat

# Linux/macOS
$TOMCAT_HOME/bin/startup.sh
```

### Step 5: Open in browser
```
http://localhost:8080/ElectricityBillCalculator/
```

---

## 🌐 URL Endpoints

| URL | Servlet | Description |
|-----|---------|-------------|
| `/` | index.jsp | Home / Calculator |
| `/calculate` (POST) | BillServlet | Process calculation |
| `/history` | HistoryServlet | View all bills |
| `/delete?id=X` | DeleteServlet | Delete a record |

---

## 🎨 Design Highlights

- **Glassmorphism**: Frosted-glass cards with backdrop blur
- **Gradient Background**: Deep cosmic purple gradient
- **Smooth Animations**: Fade-in, slide, bounce, counter
- **Dark/Light Mode**: Toggleable with persistence
- **Responsive Grid**: Bootstrap 5 responsive layout
- **Modern Typography**: Inter + Space Grotesk fonts

---

## 🔮 Future Enhancements

- [ ] PDF download of bill
- [ ] Email bill to customer
- [ ] Monthly consumption graph (Chart.js)
- [ ] Multi-user login system
- [ ] Admin dashboard with analytics
- [ ] Export history to Excel/CSV
- [ ] Tariff management (editable slab rates)
- [ ] SMS notification integration

---

## 👨‍💻 Author

Built as a **SEM V Web Technology Assignment** demonstrating:
- Full-stack Java web development
- MVC Architecture
- DAO Design Pattern
- JDBC Database Integration
- Responsive UI Design

---

## 📄 License

This project is for educational purposes.

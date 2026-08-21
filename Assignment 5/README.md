# VIT Semester Result Management System

A simple, responsive, and robust academic semester result preparation web application built for **Vishwakarma Institute of Technology (VIT)** students using **Spring Boot 3**, **Spring Data JPA**, **MySQL**, and **Thymeleaf** with a modern **Glassmorphism UI** (Midnight Navy & Cyan theme).

---

## 1. Project Overview

The application prepares and generates a one-semester academic grade report for VIT students across four core engineering subjects. It evaluates student performance by applying an academic weighted calculation (**30% MSE** and **70% ESE**), assigns appropriate letter grades, computes the semester grade point average (SGPA), evaluates PASS/FAIL status, and persists all student and result records in a MySQL database.

---

## 2. Features

* **MSE (30%) + ESE (70%) Calculation Engine**: Java backend service accurately computes weighted scores, total marks, letter grades, and SGPA.
* **Modern Glassmorphism UI**: High-contrast Midnight Navy (`#070d19`) theme with glowing Cyan (`#00f5d4`) accents and translucent cards.
* **Instant Live Calculation Preview**: Lightweight client-side script displays live weighted breakdown and projected SGPA as marks are typed.
* **Institutional Marksheet & Print Mode**: Official VIT Pune semester grade report format with dedicated `@media print` CSS for clean academic printing.
* **MySQL Persistence & Result History**: Generates durable student records and allows instant search by Roll Number or Student Name.
* **Pre-seeded Demo Profiles**: Instant quick-fill buttons for sample students (**Varad**, **Sarvesh**, **Niraj**, **Manas**, **Piyush**) demonstrating Distinction, A+, A, B+, and Failing scenarios.
* **Backend Form Validation & Safe Error Handling**: Validates input ranges (0–100) and prevents raw stack trace leakage.

---

## 3. Technology Stack

* **Backend Framework**: Java 17, Spring Boot 3.2.5, Spring MVC
* **Persistence & ORM**: Spring Data JPA (Hibernate 6)
* **Database**: MySQL 8.0+
* **Templating**: Thymeleaf
* **Frontend**: Vanilla CSS (CSS3 custom variables, Flexbox/Grid, Glassmorphism, Print CSS), Vanilla JavaScript
* **Build Tool**: Apache Maven 3.9+

---

## 4. System Requirements

* **Java Development Kit (JDK)**: Java 17 or higher (`Corretto-17` / `OpenJDK 17`)
* **Maven**: Apache Maven 3.9+ (or use included `mvn` command)
* **MySQL Server**: MySQL 8.0+ running on port `3306`
* **Web Browser**: Google Chrome, Mozilla Firefox, or Microsoft Edge

---

## 5. Project Structure

```text
Assignment 5/
├── pom.xml
├── database.sql
├── README.md
└── src/
    ├── main/
    │   ├── java/com/vit/result/
    │   │   ├── ResultApplication.java           # Spring Boot Application Entry Point
    │   │   ├── config/
    │   │   │   └── DataInitializer.java         # Seeds 4 subjects & demo students
    │   │   ├── controller/
    │   │   │   ├── HomeController.java          # Landing page controller
    │   │   │   └── ResultController.java        # Form, calculation & result views
    │   │   ├── dto/
    │   │   │   ├── SubjectMarkDto.java          # Subject mark binding & validation
    │   │   │   └── ResultFormDto.java           # Semester submission form DTO
    │   │   ├── entity/
    │   │   │   ├── Student.java                 # Student identity JPA entity
    │   │   │   ├── Subject.java                 # Curriculum subject JPA entity
    │   │   │   ├── SubjectMark.java             # Subject marks & grade JPA entity
    │   │   │   └── SemesterResult.java          # Consolidated result JPA entity
    │   │   ├── exception/
    │   │   │   └── GlobalExceptionHandler.java  # User-friendly error handler
    │   │   ├── repository/
    │   │   │   ├── StudentRepository.java       # Student JPA repository
    │   │   │   ├── SubjectRepository.java       # Subject JPA repository
    │   │   │   ├── SubjectMarkRepository.java   # Subject mark JPA repository
    │   │   │   └── SemesterResultRepository.java# Result & search JPA repository
    │   │   └── service/
    │   │       ├── ResultCalculationService.java# Core mathematical calculation logic
    │   │       └── ResultService.java           # Business workflow & DB transactions
    │   └── resources/
    │       ├── application.properties           # MySQL connection & server settings
    │       ├── static/
    │       │   ├── css/
    │       │   │   └── style.css                # Glassmorphism & Print stylesheets
    │       │   └── js/
    │       │       └── script.js                # Live mark preview & calculation
    │       └── templates/
    │           ├── index.html                   # Landing page
    │           ├── form.html                    # Semester result entry form
    │           ├── result.html                  # Academic result marksheet
    │           ├── history.html                 # Saved results table & search
    │           └── error.html                   # Clean error page
    └── test/
        ├── java/com/vit/result/
        │   └── ResultCalculationServiceTest.java# Comprehensive unit test suite
        └── resources/
            └── application-test.properties      # Test profile configuration
```

---

## 6. Database Configuration

```text
Database: MySQL
Database Name: vit_result_db
Host: localhost
Port: 3306
```

Database connection properties are configured in:

```text
src/main/resources/application.properties
```

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vit_result_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

---

## 7. Database Setup

### Option A: Import via MySQL Command Line

1. Start your local MySQL server service.
2. Open terminal and run:

```bash
mysql -u root -p < database.sql
```

*(Press Enter if no password is set for root)*

### Option B: Automatic Hibernate Initialization

Spring Boot will automatically create the schema (`ddl-auto=update`) and `DataInitializer` will seed the four curriculum subjects and sample records automatically upon initial application boot!

---

## 8. Four Curriculum Subjects

| Course Code | Course Title | Credits |
| :--- | :--- | :---: |
| **CSE101** | Data Structures | 4 |
| **CSE102** | Database Management Systems | 4 |
| **CSE103** | Computer Networks | 4 |
| **CSE104** | Web Technology | 4 |

**Total Semester Credits**: `16`

---

## 9. Result Calculation & Grading Rules

### Mark Calculation Formula

Marks for MSE and ESE are entered out of 100:

$$\text{Weighted MSE} = \text{MSE} \times 0.30$$
$$\text{Weighted ESE} = \text{ESE} \times 0.70$$
$$\text{Total Subject Score} = (\text{MSE} \times 0.30) + (\text{ESE} \times 0.70)$$

#### Calculation Example

$$\text{MSE} = 80, \quad \text{ESE} = 90$$
$$\text{Total} = (80 \times 0.30) + (90 \times 0.70) = 24.0 + 63.0 = 87.0 \quad (\text{Grade: A+}, \text{ Grade Point: } 9)$$

### Grading Scale

| Marks Range | Letter Grade | Grade Point | Performance Level |
| :---: | :---: | :---: | :--- |
| **90 – 100** | **O** | 10 | Outstanding / Distinction |
| **80 – 89** | **A+** | 9 | Excellent |
| **70 – 79** | **A** | 8 | Very Good / First Class |
| **60 – 69** | **B+** | 7 | Good |
| **50 – 59** | **B** | 6 | Above Average |
| **40 – 49** | **C** | 5 | Pass |
| **Below 40** | **F** | 0 | Fail / Backlog |

### SGPA & Outcome Determination

$$\text{SGPA} = \frac{\sum (\text{Grade Point}_i \times \text{Credits}_i)}{\sum \text{Credits}_i}$$

* **Subject Passing Condition**: $\text{Total} \ge 40.0$
* **Semester Result Outcome**: `PASS` if all 4 subjects have score $\ge 40.0$, otherwise `FAIL`.

---

## 10. How to Run the Application

### 1. Start MySQL Server
Make sure your MySQL 8 service is running on `localhost:3306`.

### 2. Build and Run via Maven
Navigate to the `Assignment 5` directory:

```bash
cd "Assignment 5"
```

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

Or using the direct Maven path:

```bash
& "D:\tools\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
```

### 3. Run Automated Unit Tests

```bash
mvn test
```

---

## 11. Application URLs

| Page Description | URL Endpoint |
| :--- | :--- |
| **Home / Landing Page** | [http://localhost:8080/](http://localhost:8080/) |
| **Prepare Semester Result Form** | [http://localhost:8080/result/new](http://localhost:8080/result/new) |
| **All Results / History Search** | [http://localhost:8080/result/all](http://localhost:8080/result/all) |
| **Sample Demo: Varad (Distinction)** | [http://localhost:8080/result/sample/varad](http://localhost:8080/result/sample/varad) |
| **Sample Demo: Sarvesh (Grade A+)** | [http://localhost:8080/result/sample/sarvesh](http://localhost:8080/result/sample/sarvesh) |
| **Sample Demo: Niraj (Grade A)** | [http://localhost:8080/result/sample/niraj](http://localhost:8080/result/sample/niraj) |
| **Sample Demo: Manas (Grade B+)** | [http://localhost:8080/result/sample/manas](http://localhost:8080/result/sample/manas) |
| **Sample Demo: Piyush (Fail Demo)** | [http://localhost:8080/result/sample/piyush](http://localhost:8080/result/sample/piyush) |

---

## 12. Troubleshooting

* **Port 8080 already in use**: Start the app on another port:
  ```bash
  mvn spring-boot:run -Dspring-boot.run.arguments="--server.port=8081"
  ```
* **MySQL Access Denied / Password Issue**:
  Set your MySQL credentials in `src/main/resources/application.properties` or provide environment variables:
  ```bash
  $env:DB_PASSWORD="your_password"; mvn spring-boot:run
  ```
* **Print Marksheet Layout**: Click the **Print Result** button or press `Ctrl + P` to trigger the clean, high-contrast academic print layout.

package com.ebill.repository;

import com.ebill.model.Bill;

import java.util.List;
import java.util.Optional;

/**
 * ============================================================================
 *  PLACEHOLDER — NOT YET IMPLEMENTED
 * ============================================================================
 * This class is a stub showing exactly where MySQL support will plug in.
 * It intentionally throws UnsupportedOperationException from every method so
 * that the project fails loudly (instead of silently doing nothing) if it is
 * wired up before it's actually implemented.
 *
 * -----------------------------------------------------------------------
 * HOW TO ACTIVATE MYSQL SUPPORT LATER (see README.md for full detail)
 * -----------------------------------------------------------------------
 * Step 1. Install MySQL Server and create a schema, e.g.:
 *
 *         CREATE DATABASE ebill_db;
 *         CREATE TABLE bills (
 *             id               INT AUTO_INCREMENT PRIMARY KEY,
 *             customer_name    VARCHAR(100) NOT NULL,
 *             customer_number  VARCHAR(50)  NOT NULL,
 *             units_consumed   INT NOT NULL,
 *             total_amount     DOUBLE NOT NULL,
 *             bill_date        DATETIME NOT NULL,
 *             slab_details_json TEXT
 *         );
 *
 * Step 2. In pom.xml, uncomment the mysql-connector-j dependency.
 *
 * Step 3. Implement every method below using JDBC (or later, JPA/Hibernate):
 *           - save()      -> INSERT ... RETURN_GENERATED_KEYS
 *           - findAll()   -> SELECT * FROM bills ORDER BY id DESC
 *           - findById()  -> SELECT * FROM bills WHERE id = ?
 *           - update()    -> UPDATE bills SET ... WHERE id = ?
 *           - delete()    -> DELETE FROM bills WHERE id = ?
 *           - deleteAll() -> TRUNCATE TABLE bills
 *         A DB connection can be obtained from a javax.sql.DataSource
 *         (recommended: configure a JNDI connection pool in Tomcat's
 *         context.xml, or use a simple DriverManager.getConnection() call
 *         with a connection string for a first pass).
 *
 * Step 4. In AppContextListener, change ONE line:
 *
 *             BillRepository repo = new InMemoryBillRepository();
 *         to
 *             BillRepository repo = new MySQLBillRepository();
 *
 *         BillService, every Servlet, and every JSP page require ZERO
 *         changes because they only ever depend on the BillRepository
 *         interface.
 * ============================================================================
 */
public class MySQLBillRepository implements BillRepository {

    // TODO: inject a javax.sql.DataSource (or hold JDBC connection details) here.
    // private final DataSource dataSource;
    //
    // public MySQLBillRepository(DataSource dataSource) {
    //     this.dataSource = dataSource;
    // }

    @Override
    public Bill save(Bill bill) {
        // TODO: implement INSERT INTO bills (...) VALUES (...)
        throw new UnsupportedOperationException(
            "MySQLBillRepository.save() is not implemented yet. " +
            "See the class-level Javadoc for setup steps.");
    }

    @Override
    public List<Bill> findAll() {
        // TODO: implement SELECT * FROM bills ORDER BY id DESC
        throw new UnsupportedOperationException(
            "MySQLBillRepository.findAll() is not implemented yet. " +
            "See the class-level Javadoc for setup steps.");
    }

    @Override
    public Optional<Bill> findById(int id) {
        // TODO: implement SELECT * FROM bills WHERE id = ?
        throw new UnsupportedOperationException(
            "MySQLBillRepository.findById() is not implemented yet. " +
            "See the class-level Javadoc for setup steps.");
    }

    @Override
    public boolean update(Bill bill) {
        // TODO: implement UPDATE bills SET ... WHERE id = ?
        throw new UnsupportedOperationException(
            "MySQLBillRepository.update() is not implemented yet. " +
            "See the class-level Javadoc for setup steps.");
    }

    @Override
    public boolean delete(int id) {
        // TODO: implement DELETE FROM bills WHERE id = ?
        throw new UnsupportedOperationException(
            "MySQLBillRepository.delete() is not implemented yet. " +
            "See the class-level Javadoc for setup steps.");
    }

    @Override
    public void deleteAll() {
        // TODO: implement TRUNCATE TABLE bills
        throw new UnsupportedOperationException(
            "MySQLBillRepository.deleteAll() is not implemented yet. " +
            "See the class-level Javadoc for setup steps.");
    }
}

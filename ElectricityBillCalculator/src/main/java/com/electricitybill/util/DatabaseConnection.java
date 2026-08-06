package com.electricitybill.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DatabaseConnection Utility — Singleton Pattern
 *
 * Manages a single JDBC connection to the MySQL database.
 * Configure DB credentials in the constants below.
 *
 * @author Senior Full Stack Java Developer
 * @version 1.0
 */
public class DatabaseConnection {

    private static final Logger LOGGER = Logger.getLogger(DatabaseConnection.class.getName());

    // ─── Database Configuration ───────────────────────────────────
    private static final String DRIVER   = "com.mysql.cj.jdbc.Driver";
    private static final String DB_URL   = "jdbc:mysql://localhost:3306/electricity_bill_db"
                                         + "?useSSL=false"
                                         + "&serverTimezone=Asia/Kolkata"
                                         + "&allowPublicKeyRetrieval=true"
                                         + "&useUnicode=true"
                                         + "&characterEncoding=UTF-8";
    private static final String DB_USER  = "root";       // Change if needed
    private static final String DB_PASS  = "root";       // Change if needed

    // ─── Singleton Instance ───────────────────────────────────────
    private static DatabaseConnection instance;
    private Connection connection;

    // ─── Private Constructor ──────────────────────────────────────
    private DatabaseConnection() {
        try {
            Class.forName(DRIVER);
            this.connection = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
            LOGGER.info("✅ Database connection established successfully.");
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.SEVERE, "❌ MySQL JDBC Driver not found! Running in fallback mode.", e);
            this.connection = null;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "❌ Failed to connect to database! Running in fallback mode.", e);
            this.connection = null;
        }
    }

    // ─── Public API ───────────────────────────────────────────────

    /**
     * Returns the singleton instance of DatabaseConnection.
     * Creates a new connection if one doesn't exist or is closed.
     */
    public static synchronized DatabaseConnection getInstance() {
        try {
            if (instance == null || instance.connection == null || instance.connection.isClosed()) {
                instance = new DatabaseConnection();
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error checking connection state", e);
            instance = new DatabaseConnection();
        }
        return instance;
    }

    /**
     * Returns the active JDBC Connection object.
     */
    public Connection getConnection() {
        return connection;
    }

    /**
     * Closes the database connection gracefully.
     */
    public static void closeConnection() {
        if (instance != null && instance.connection != null) {
            try {
                instance.connection.close();
                instance = null;
                LOGGER.info("Database connection closed.");
            } catch (SQLException e) {
                LOGGER.log(Level.WARNING, "Error closing database connection", e);
            }
        }
    }
}

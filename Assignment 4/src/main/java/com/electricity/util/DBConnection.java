package com.electricity.util;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Thread-safe centralized JDBC Connection Factory.
 * Loads connection configuration from db.properties with environment variable fallbacks.
 */
public class DBConnection {
    private static final Logger LOGGER = Logger.getLogger(DBConnection.class.getName());

    private static String jdbcUrl;
    private static String dbUser;
    private static String dbPassword;
    private static String driverClass;
    private static boolean initialized = false;

    static {
        init();
    }

    private static synchronized void init() {
        if (initialized) {
            return;
        }

        Properties props = new Properties();
        try (InputStream in = DBConnection.class.getClassLoader().getResourceAsStream("db.properties")) {
            if (in != null) {
                props.load(in);
            } else {
                LOGGER.warning("db.properties not found on classpath, using defaults.");
            }
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to load db.properties, using fallback defaults", e);
        }

        String host = System.getenv("DB_HOST") != null ? System.getenv("DB_HOST") : props.getProperty("db.host", "localhost");
        String port = System.getenv("DB_PORT") != null ? System.getenv("DB_PORT") : props.getProperty("db.port", "3306");
        String dbName = System.getenv("DB_NAME") != null ? System.getenv("DB_NAME") : props.getProperty("db.name", "electricity_bill_db");
        dbUser = System.getenv("DB_USER") != null ? System.getenv("DB_USER") : props.getProperty("db.user", "root");
        dbPassword = System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : props.getProperty("db.password", "");
        driverClass = props.getProperty("db.driver", "com.mysql.cj.jdbc.Driver");

        String useSSL = props.getProperty("db.useSSL", "false");
        String allowPublicKey = props.getProperty("db.allowPublicKeyRetrieval", "true");
        String serverTimezone = props.getProperty("db.serverTimezone", "UTC");

        jdbcUrl = String.format("jdbc:mysql://%s:%s/%s?useSSL=%s&allowPublicKeyRetrieval=%s&serverTimezone=%s",
                host, port, dbName, useSSL, allowPublicKey, serverTimezone);

        try {
            Class.forName(driverClass);
            initialized = true;
            LOGGER.info("JDBC Driver initialized successfully for URL: " + jdbcUrl.replaceAll("password=.*", ""));
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.SEVERE, "MySQL JDBC Driver not found: " + driverClass, e);
            throw new RuntimeException("Could not find MySQL JDBC Driver: " + driverClass, e);
        }
    }

    /**
     * Obtains a new database connection.
     * @return Connection object
     * @throws SQLException if a database access error occurs
     */
    public static Connection getConnection() throws SQLException {
        if (!initialized) {
            init();
        }
        return DriverManager.getConnection(jdbcUrl, dbUser, dbPassword);
    }

    /**
     * Gracefully closes JDBC resources.
     */
    public static void close(Connection conn, Statement stmt, ResultSet rs) {
        if (rs != null) {
            try {
                rs.close();
            } catch (SQLException ignored) {
            }
        }
        if (stmt != null) {
            try {
                stmt.close();
            } catch (SQLException ignored) {
            }
        }
        if (conn != null) {
            try {
                conn.close();
            } catch (SQLException ignored) {
            }
        }
    }

    public static void close(Connection conn, Statement stmt) {
        close(conn, stmt, null);
    }

    public static void close(Connection conn) {
        close(conn, null, null);
    }
}

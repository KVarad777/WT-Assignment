package com.vit.result.config;

import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.InetSocketAddress;
import java.net.Socket;

/**
 * Intelligent Database Configuration:
 * Connects to MySQL (vit_result_db on localhost:3306) when MySQL service is running.
 * Automatically falls back to an in-memory database (with MySQL compatibility mode)
 * if MySQL is temporarily offline, ensuring 100% uptime and accessibility.
 */
@Configuration
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:jdbc:mysql://localhost:3306/vit_result_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC}")
    private String mysqlUrl;

    @Value("${spring.datasource.username:root}")
    private String mysqlUser;

    @Value("${spring.datasource.password:}")
    private String mysqlPassword;

    @Value("${DB_HOST:localhost}")
    private String dbHost;

    @Value("${DB_PORT:3306}")
    private int dbPort;

    @Bean
    @Primary
    public DataSource dataSource() {
        if (isMySqlAvailable(dbHost, dbPort)) {
            log.info("✓ MySQL Server detected on {}:{}. Connecting to MySQL database 'vit_result_db'...", dbHost, dbPort);
            HikariDataSource ds = new HikariDataSource();
            ds.setDriverClassName("com.mysql.cj.jdbc.Driver");
            ds.setJdbcUrl(mysqlUrl);
            ds.setUsername(mysqlUser);
            ds.setPassword(mysqlPassword);
            ds.setMaximumPoolSize(10);
            ds.setConnectionTimeout(5000);
            return ds;
        } else {
            log.warn("! MySQL Server is currently stopped on {}:{}.", dbHost, dbPort);
            log.info("→ Activating resilient in-memory database fallback (MySQL mode) so website runs seamlessly on localhost:8080.");
            HikariDataSource ds = new HikariDataSource();
            ds.setDriverClassName("org.h2.Driver");
            ds.setJdbcUrl("jdbc:h2:mem:vit_result_db;MODE=MySQL;DB_CLOSE_DELAY=-1;DATABASE_TO_LOWER=TRUE");
            ds.setUsername("sa");
            ds.setPassword("");
            ds.setMaximumPoolSize(10);
            return ds;
        }
    }

    private boolean isMySqlAvailable(String host, int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, port), 1000);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}

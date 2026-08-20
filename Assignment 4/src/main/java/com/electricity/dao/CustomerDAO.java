package com.electricity.dao;

import com.electricity.model.Customer;
import com.electricity.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Data Access Object for Customer entities.
 */
public class CustomerDAO {
    private static final Logger LOGGER = Logger.getLogger(CustomerDAO.class.getName());

    public Customer findById(int id) throws SQLException {
        String sql = "SELECT id, customer_name, consumer_number, email, phone, address, created_at FROM customers WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToCustomer(rs);
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Customer findByConsumerNumber(String consumerNumber) throws SQLException {
        String sql = "SELECT id, customer_name, consumer_number, email, phone, address, created_at FROM customers WHERE consumer_number = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, consumerNumber.trim());
            rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToCustomer(rs);
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    /**
     * Finds an existing customer by consumer number or creates a new one.
     * Updates customer name/contact info if existing.
     */
    public Customer findOrCreateOrUpdate(Customer customer) throws SQLException {
        Customer existing = findByConsumerNumber(customer.getConsumerNumber());
        if (existing != null) {
            // Update name / contact if provided
            String updateSql = "UPDATE customers SET customer_name = ?, email = COALESCE(NULLIF(?, ''), email), " +
                    "phone = COALESCE(NULLIF(?, ''), phone), address = COALESCE(NULLIF(?, ''), address) WHERE id = ?";
            Connection conn = null;
            PreparedStatement stmt = null;
            try {
                conn = DBConnection.getConnection();
                stmt = conn.prepareStatement(updateSql);
                stmt.setString(1, customer.getCustomerName());
                stmt.setString(2, customer.getEmail());
                stmt.setString(3, customer.getPhone());
                stmt.setString(4, customer.getAddress());
                stmt.setInt(5, existing.getId());
                stmt.executeUpdate();

                existing.setCustomerName(customer.getCustomerName());
                if (customer.getEmail() != null && !customer.getEmail().isEmpty()) existing.setEmail(customer.getEmail());
                if (customer.getPhone() != null && !customer.getPhone().isEmpty()) existing.setPhone(customer.getPhone());
                if (customer.getAddress() != null && !customer.getAddress().isEmpty()) existing.setAddress(customer.getAddress());
                return existing;
            } finally {
                DBConnection.close(conn, stmt);
            }
        } else {
            // Insert new customer
            String insertSql = "INSERT INTO customers (customer_name, consumer_number, email, phone, address) VALUES (?, ?, ?, ?, ?)";
            Connection conn = null;
            PreparedStatement stmt = null;
            ResultSet rs = null;
            try {
                conn = DBConnection.getConnection();
                stmt = conn.prepareStatement(insertSql, Statement.RETURN_GENERATED_KEYS);
                stmt.setString(1, customer.getCustomerName());
                stmt.setString(2, customer.getConsumerNumber());
                stmt.setString(3, customer.getEmail());
                stmt.setString(4, customer.getPhone());
                stmt.setString(5, customer.getAddress());
                stmt.executeUpdate();

                rs = stmt.getGeneratedKeys();
                if (rs.next()) {
                    customer.setId(rs.getInt(1));
                }
                return customer;
            } finally {
                DBConnection.close(conn, stmt, rs);
            }
        }
    }

    public List<Customer> getAllCustomers() throws SQLException {
        List<Customer> list = new ArrayList<>();
        String sql = "SELECT id, customer_name, consumer_number, email, phone, address, created_at FROM customers ORDER BY customer_name ASC";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();

            while (rs.next()) {
                list.add(mapResultSetToCustomer(rs));
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    private Customer mapResultSetToCustomer(ResultSet rs) throws SQLException {
        Customer c = new Customer();
        c.setId(rs.getInt("id"));
        c.setCustomerName(rs.getString("customer_name"));
        c.setConsumerNumber(rs.getString("consumer_number"));
        c.setEmail(rs.getString("email"));
        c.setPhone(rs.getString("phone"));
        c.setAddress(rs.getString("address"));
        c.setCreatedAt(rs.getTimestamp("created_at"));
        return c;
    }
}

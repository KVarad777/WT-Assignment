package com.electricity.dao;

import com.electricity.model.Bill;
import com.electricity.model.Customer;
import com.electricity.model.DashboardStats;
import com.electricity.util.DBConnection;

import java.math.BigDecimal;
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
 * Data Access Object for Bill entities with search, filtering, and aggregation.
 */
public class BillDAO {
    private static final Logger LOGGER = Logger.getLogger(BillDAO.class.getName());

    public Bill save(Bill bill) throws SQLException {
        String sql = "INSERT INTO bills (customer_id, billing_month, previous_reading, current_reading, units_consumed, energy_charge, total_amount) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            stmt.setInt(1, bill.getCustomerId());
            stmt.setString(2, bill.getBillingMonth());
            stmt.setBigDecimal(3, bill.getPreviousReading());
            stmt.setBigDecimal(4, bill.getCurrentReading());
            stmt.setBigDecimal(5, bill.getUnitsConsumed());
            stmt.setBigDecimal(6, bill.getEnergyCharge());
            stmt.setBigDecimal(7, bill.getTotalAmount());
            stmt.executeUpdate();

            rs = stmt.getGeneratedKeys();
            if (rs.next()) {
                bill.setId(rs.getInt(1));
            }
            return bill;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public Bill findById(int id) throws SQLException {
        String sql = "SELECT b.id, b.customer_id, b.billing_month, b.previous_reading, b.current_reading, " +
                     "b.units_consumed, b.energy_charge, b.total_amount, b.created_at, " +
                     "c.customer_name, c.consumer_number, c.email, c.phone, c.address " +
                     "FROM bills b " +
                     "JOIN customers c ON b.customer_id = c.id " +
                     "WHERE b.id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            rs = stmt.executeQuery();

            if (rs.next()) {
                return mapResultSetToBillWithCustomer(rs);
            }
            return null;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public List<Bill> findAll(String search, String monthFilter, String sortOrder) throws SQLException {
        List<Bill> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
                "SELECT b.id, b.customer_id, b.billing_month, b.previous_reading, b.current_reading, " +
                "b.units_consumed, b.energy_charge, b.total_amount, b.created_at, " +
                "c.customer_name, c.consumer_number, c.email, c.phone, c.address " +
                "FROM bills b " +
                "JOIN customers c ON b.customer_id = c.id WHERE 1=1 ");

        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (c.customer_name LIKE ? OR c.consumer_number LIKE ? OR b.billing_month LIKE ?) ");
            String term = "%" + search.trim() + "%";
            params.add(term);
            params.add(term);
            params.add(term);
        }

        if (monthFilter != null && !monthFilter.trim().isEmpty() && !monthFilter.equalsIgnoreCase("ALL")) {
            sql.append("AND b.billing_month = ? ");
            params.add(monthFilter.trim());
        }

        if ("oldest".equalsIgnoreCase(sortOrder)) {
            sql.append("ORDER BY b.created_at ASC, b.id ASC");
        } else if ("units_desc".equalsIgnoreCase(sortOrder)) {
            sql.append("ORDER BY b.units_consumed DESC");
        } else if ("amount_desc".equalsIgnoreCase(sortOrder)) {
            sql.append("ORDER BY b.total_amount DESC");
        } else {
            sql.append("ORDER BY b.created_at DESC, b.id DESC");
        }

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql.toString());
            for (int i = 0; i < params.size(); i++) {
                stmt.setObject(i + 1, params.get(i));
            }
            rs = stmt.executeQuery();

            while (rs.next()) {
                list.add(mapResultSetToBillWithCustomer(rs));
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public List<Bill> getRecentBills(int limit) throws SQLException {
        List<Bill> list = new ArrayList<>();
        String sql = "SELECT b.id, b.customer_id, b.billing_month, b.previous_reading, b.current_reading, " +
                     "b.units_consumed, b.energy_charge, b.total_amount, b.created_at, " +
                     "c.customer_name, c.consumer_number, c.email, c.phone, c.address " +
                     "FROM bills b " +
                     "JOIN customers c ON b.customer_id = c.id " +
                     "ORDER BY b.created_at DESC LIMIT ?";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, limit);
            rs = stmt.executeQuery();

            while (rs.next()) {
                list.add(mapResultSetToBillWithCustomer(rs));
            }
            return list;
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
    }

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        String sqlBills = "SELECT COUNT(*) AS total_bills, " +
                          "COALESCE(SUM(units_consumed), 0) AS total_units, " +
                          "COALESCE(SUM(total_amount), 0) AS total_revenue, " +
                          "COALESCE(AVG(total_amount), 0) AS avg_bill, " +
                          "COALESCE(MAX(total_amount), 0) AS max_bill " +
                          "FROM bills";

        String sqlCust = "SELECT COUNT(*) AS total_customers FROM customers";

        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sqlBills);
            if (rs.next()) {
                stats.setTotalBillsCount(rs.getInt("total_bills"));
                stats.setTotalUnitsBilled(rs.getBigDecimal("total_units"));
                stats.setTotalRevenue(rs.getBigDecimal("total_revenue"));
                stats.setAverageBillAmount(rs.getBigDecimal("avg_bill"));
                stats.setHighestBillAmount(rs.getBigDecimal("max_bill"));
            }
            rs.close();

            rs = stmt.executeQuery(sqlCust);
            if (rs.next()) {
                stats.setTotalCustomersCount(rs.getInt("total_customers"));
            }
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to compute dashboard stats", e);
        } finally {
            DBConnection.close(conn, stmt, rs);
        }

        return stats;
    }

    public boolean deleteById(int id) throws SQLException {
        String sql = "DELETE FROM bills WHERE id = ?";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } finally {
            DBConnection.close(conn, stmt);
        }
    }

    public List<String> getDistinctBillingMonths() {
        List<String> months = new ArrayList<>();
        String sql = "SELECT DISTINCT billing_month FROM bills ORDER BY id DESC";
        Connection conn = null;
        Statement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.createStatement();
            rs = stmt.executeQuery(sql);
            while (rs.next()) {
                months.add(rs.getString("billing_month"));
            }
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to fetch distinct billing months", e);
        } finally {
            DBConnection.close(conn, stmt, rs);
        }
        return months;
    }

    private Bill mapResultSetToBillWithCustomer(ResultSet rs) throws SQLException {
        Bill b = new Bill();
        b.setId(rs.getInt("id"));
        b.setCustomerId(rs.getInt("customer_id"));
        b.setBillingMonth(rs.getString("billing_month"));
        b.setPreviousReading(rs.getBigDecimal("previous_reading"));
        b.setCurrentReading(rs.getBigDecimal("current_reading"));
        b.setUnitsConsumed(rs.getBigDecimal("units_consumed"));
        b.setEnergyCharge(rs.getBigDecimal("energy_charge"));
        b.setTotalAmount(rs.getBigDecimal("total_amount"));
        b.setCreatedAt(rs.getTimestamp("created_at"));

        Customer c = new Customer();
        c.setId(rs.getInt("customer_id"));
        c.setCustomerName(rs.getString("customer_name"));
        c.setConsumerNumber(rs.getString("consumer_number"));
        c.setEmail(rs.getString("email"));
        c.setPhone(rs.getString("phone"));
        c.setAddress(rs.getString("address"));
        b.setCustomer(c);

        return b;
    }
}

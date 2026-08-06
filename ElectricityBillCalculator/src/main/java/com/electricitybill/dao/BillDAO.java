package com.electricitybill.dao;

import com.electricitybill.model.Bill;
import com.electricitybill.util.DatabaseConnection;

import java.sql.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * BillDAO — Data Access Object
 *
 * Encapsulates all CRUD operations for the bill_history table.
 * Implements the DAO Design Pattern for clean separation of concerns.
 *
 * @author Senior Full Stack Java Developer
 * @version 1.0
 */
public class BillDAO {

    private static final Logger LOGGER = Logger.getLogger(BillDAO.class.getName());

    // ─── SQL Queries ─────────────────────────────────────────────
    private static final String INSERT_BILL =
            "INSERT INTO bill_history (customer_name, customer_number, units, bill_amount, bill_month, paid, calculation_date) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?)";

    private static final String SELECT_ALL_BILLS =
            "SELECT id, customer_name, customer_number, units, bill_amount, bill_month, paid, calculation_date " +
            "FROM bill_history ORDER BY calculation_date DESC";

    private static final String SELECT_BILL_BY_ID =
            "SELECT id, customer_name, customer_number, units, bill_amount, bill_month, paid, calculation_date " +
            "FROM bill_history WHERE id = ?";

    private static final String DELETE_BILL_BY_ID =
            "DELETE FROM bill_history WHERE id = ?";

        private static final String UPDATE_PAID_STATUS =
            "UPDATE bill_history SET paid = ? WHERE id = ?";

    private static final String COUNT_ALL_BILLS =
            "SELECT COUNT(*) FROM bill_history";

    private static final List<Bill> FALLBACK_BILLS = Collections.synchronizedList(new ArrayList<>());
    private static final AtomicInteger FALLBACK_ID_GENERATOR = new AtomicInteger(1000);

    // ─── Helper ──────────────────────────────────────────────────
    private Connection getConnection() {
        return DatabaseConnection.getInstance().getConnection();
    }

    private boolean isDatabaseAvailable() {
        Connection connection = getConnection();
        try {
            return connection != null && !connection.isClosed();
        } catch (SQLException e) {
            LOGGER.log(Level.WARNING, "Error checking database connection availability", e);
            return false;
        }
    }

    // ─── CREATE ──────────────────────────────────────────────────

    /**
     * Inserts a new bill record into the database.
     *
     * @param bill The Bill object to insert.
     * @return The auto-generated ID, or -1 on failure.
     */
    public int insertBill(Bill bill) {
        if (bill == null) {
            return -1;
        }

        if (!isDatabaseAvailable()) {
            int generatedId = FALLBACK_ID_GENERATOR.incrementAndGet();
            bill.setId(generatedId);
            FALLBACK_BILLS.add(bill);
            LOGGER.info("Database unavailable. Bill stored in fallback memory with ID: " + generatedId);
            return generatedId;
        }

        try (PreparedStatement ps = getConnection().prepareStatement(INSERT_BILL,
                Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, bill.getCustomerName());
            ps.setString(2, bill.getCustomerNumber());
            ps.setDouble(3, bill.getUnits());
            ps.setDouble(4, bill.getBillAmount());
            ps.setString(5, bill.getBillMonth());
            ps.setInt(6, bill.isPaid() ? 1 : 0);
            ps.setTimestamp(7, Timestamp.valueOf(bill.getCalculationDate()));

            int affectedRows = ps.executeUpdate();
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        int generatedId = generatedKeys.getInt(1);
                        LOGGER.info("Bill inserted successfully with ID: " + generatedId);
                        return generatedId;
                    }
                }
            }

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error inserting bill: " + bill + ". Falling back to memory storage.", e);
            int generatedId = FALLBACK_ID_GENERATOR.incrementAndGet();
            bill.setId(generatedId);
            FALLBACK_BILLS.add(bill);
            return generatedId;
        }
        return -1;
    }

    // ─── READ ALL ────────────────────────────────────────────────

    /**
     * Retrieves all bill records ordered by date descending.
     *
     * @return List of Bill objects, or empty list on failure.
     */
    public List<Bill> getAllBills() {
        List<Bill> bills = new ArrayList<>();

        if (!isDatabaseAvailable()) {
            synchronized (FALLBACK_BILLS) {
                bills.addAll(FALLBACK_BILLS);
            }
            bills.sort((a, b) -> b.getCalculationDate().compareTo(a.getCalculationDate()));
            LOGGER.info("Database unavailable. Returning " + bills.size() + " fallback bill(s).");
            return bills;
        }

        try (PreparedStatement ps = getConnection().prepareStatement(SELECT_ALL_BILLS);
             ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {
                    bills.add(mapResultSetToBill(rs));
                }
            LOGGER.info("Fetched " + bills.size() + " bill(s) from database.");

        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching all bills. Returning fallback data.", e);
            synchronized (FALLBACK_BILLS) {
                bills.addAll(FALLBACK_BILLS);
            }
        }
        return bills;
    }

    // ─── READ BY ID ──────────────────────────────────────────────

    /**
     * Retrieves a single bill by its ID.
     *
     * @param id The bill ID to search for.
     * @return The Bill object, or null if not found.
     */
    public Bill getBillById(int id) {
        if (!isDatabaseAvailable()) {
            synchronized (FALLBACK_BILLS) {
                return FALLBACK_BILLS.stream()
                    .filter(bill -> bill.getId() == id)
                    .findFirst()
                    .orElse(null);
            }
        }

        try (PreparedStatement ps = getConnection().prepareStatement(SELECT_BILL_BY_ID)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToBill(rs);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching bill with ID: " + id + ". Falling back to memory if available.", e);
            synchronized (FALLBACK_BILLS) {
                return FALLBACK_BILLS.stream()
                        .filter(bill -> bill.getId() == id)
                        .findFirst()
                        .orElse(null);
            }
        }
        return null;
    }

    // ─── DELETE ──────────────────────────────────────────────────

    /**
     * Deletes a bill record by its ID.
     *
     * @param id The bill ID to delete.
     * @return true if deletion was successful, false otherwise.
     */
    public boolean deleteBill(int id) {
        if (!isDatabaseAvailable()) {
            synchronized (FALLBACK_BILLS) {
                return FALLBACK_BILLS.removeIf(bill -> bill.getId() == id);
            }
        }

        try (PreparedStatement ps = getConnection().prepareStatement(DELETE_BILL_BY_ID)) {
            ps.setInt(1, id);
            int rowsAffected = ps.executeUpdate();
            if (rowsAffected > 0) {
                LOGGER.info("Bill with ID " + id + " deleted successfully.");
                return true;
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error deleting bill with ID: " + id + ". Attempting fallback deletion.", e);
            synchronized (FALLBACK_BILLS) {
                return FALLBACK_BILLS.removeIf(bill -> bill.getId() == id);
            }
        }
        return false;
    }

    /**
     * Updates the paid status of a bill.
     */
    public boolean updatePaidStatus(int id, boolean paid) {
        if (!isDatabaseAvailable()) {
            synchronized (FALLBACK_BILLS) {
                for (Bill b : FALLBACK_BILLS) {
                    if (b.getId() == id) {
                        b.setPaid(paid);
                        return true;
                    }
                }
            }
            return false;
        }

        try (PreparedStatement ps = getConnection().prepareStatement(UPDATE_PAID_STATUS)) {
            ps.setInt(1, paid ? 1 : 0);
            ps.setInt(2, id);
            int rows = ps.executeUpdate();
            return rows > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating paid status for id: " + id, e);
            return false;
        }
    }

    // ─── COUNT ───────────────────────────────────────────────────

    /**
     * Returns the total number of bill records.
     *
     * @return Count of records, or 0 on failure.
     */
    public int getTotalBillCount() {
        if (!isDatabaseAvailable()) {
            return FALLBACK_BILLS.size();
        }

        try (PreparedStatement ps = getConnection().prepareStatement(COUNT_ALL_BILLS);
             ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error counting bills. Returning fallback count.", e);
            return FALLBACK_BILLS.size();
        }
        return 0;
    }

    // ─── Mapper ──────────────────────────────────────────────────

    /**
     * Maps a ResultSet row to a Bill object.
     */
    private Bill mapResultSetToBill(ResultSet rs) throws SQLException {
        Bill bill = new Bill();
        bill.setId(rs.getInt("id"));
        bill.setCustomerName(rs.getString("customer_name"));
        bill.setCustomerNumber(rs.getString("customer_number"));
        bill.setUnits(rs.getDouble("units"));
        bill.setBillAmount(rs.getDouble("bill_amount"));
        bill.setBillMonth(rs.getString("bill_month"));
        bill.setPaid(rs.getInt("paid") == 1);

        Timestamp ts = rs.getTimestamp("calculation_date");
        if (ts != null) {
            bill.setCalculationDate(ts.toLocalDateTime());
        } else {
            bill.setCalculationDate(LocalDateTime.now());
        }
        return bill;
    }
}

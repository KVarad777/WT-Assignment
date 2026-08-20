package com.electricity.dao;

import com.electricity.model.TariffSlab;
import com.electricity.util.DBConnection;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Data Access Object for progressive Tariff Slabs.
 */
public class TariffDAO {
    private static final Logger LOGGER = Logger.getLogger(TariffDAO.class.getName());

    /**
     * Retrieves all progressive tariff slabs ordered by slab_order ASC.
     * If database query fails, returns the canonical fallback slabs.
     */
    public List<TariffSlab> getAllSlabs() {
        List<TariffSlab> slabs = new ArrayList<>();
        String sql = "SELECT id, slab_order, slab_name, min_units, max_units, rate, description, created_at " +
                     "FROM bill_slabs ORDER BY slab_order ASC";

        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = DBConnection.getConnection();
            stmt = conn.prepareStatement(sql);
            rs = stmt.executeQuery();

            while (rs.next()) {
                TariffSlab slab = new TariffSlab();
                slab.setId(rs.getInt("id"));
                slab.setSlabOrder(rs.getInt("slab_order"));
                slab.setSlabName(rs.getString("slab_name"));
                slab.setMinUnits(rs.getBigDecimal("min_units"));
                slab.setMaxUnits(rs.getBigDecimal("max_units")); // null if unbounded
                slab.setRate(rs.getBigDecimal("rate"));
                slab.setDescription(rs.getString("description"));
                slab.setCreatedAt(rs.getTimestamp("created_at"));
                slabs.add(slab);
            }
        } catch (Exception e) {
            LOGGER.log(Level.WARNING, "Failed to load tariff slabs from DB, falling back to default tariff specification", e);
            return getDefaultFallbackSlabs();
        } finally {
            DBConnection.close(conn, stmt, rs);
        }

        if (slabs.isEmpty()) {
            return getDefaultFallbackSlabs();
        }

        return slabs;
    }

    /**
     * Hardcoded canonical progressive slabs as per project requirements:
     * 1. First 50 units: ₹3.50/unit
     * 2. Next 100 units: ₹4.00/unit
     * 3. Next 100 units: ₹5.20/unit
     * 4. Above 250 units: ₹6.50/unit
     */
    public static List<TariffSlab> getDefaultFallbackSlabs() {
        List<TariffSlab> fallback = new ArrayList<>();
        fallback.add(new TariffSlab(1, 1, "First 50 units", new BigDecimal("0.00"), new BigDecimal("50.00"), new BigDecimal("3.50"), "First 50 units @ ₹3.50 / unit"));
        fallback.add(new TariffSlab(2, 2, "Next 100 units", new BigDecimal("50.00"), new BigDecimal("150.00"), new BigDecimal("4.00"), "Next 100 units @ ₹4.00 / unit"));
        fallback.add(new TariffSlab(3, 3, "Next 100 units", new BigDecimal("150.00"), new BigDecimal("250.00"), new BigDecimal("5.20"), "Next 100 units @ ₹5.20 / unit"));
        fallback.add(new TariffSlab(4, 4, "Above 250 units", new BigDecimal("250.00"), null, new BigDecimal("6.50"), "Above 250 units @ ₹6.50 / unit"));
        return fallback;
    }
}

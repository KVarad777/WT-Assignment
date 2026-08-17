package com.ebill.util;

import com.ebill.model.SlabDetail;

import java.util.ArrayList;
import java.util.List;

/**
 * Pure, stateless utility for computing slab-wise electricity charges.
 *
 * Slab structure:
 *   First 50 units        -> Rs. 3.50 / unit
 *   Next  100 units       -> Rs. 4.00 / unit  (units 51-150)
 *   Next  100 units       -> Rs. 5.20 / unit  (units 151-250)
 *   Above 250 units       -> Rs. 6.50 / unit  (units 251+)
 */
public final class BillCalculator {

    public static final double SLAB1_RATE = 3.50;
    public static final double SLAB2_RATE = 4.00;
    public static final double SLAB3_RATE = 5.20;
    public static final double SLAB4_RATE = 6.50;

    public static final int SLAB1_LIMIT = 50;
    public static final int SLAB2_LIMIT = 100;  // next 100 -> up to 150
    public static final int SLAB3_LIMIT = 100;  // next 100 -> up to 250

    private BillCalculator() {
        // utility class, no instances
    }

    /**
     * Result wrapper bundling the slab-wise breakdown together with the
     * final total, so callers get both in a single return value.
     */
    public static class CalculationResult {
        private final List<SlabDetail> slabDetails;
        private final double totalAmount;

        public CalculationResult(List<SlabDetail> slabDetails, double totalAmount) {
            this.slabDetails = slabDetails;
            this.totalAmount = totalAmount;
        }

        public List<SlabDetail> getSlabDetails() {
            return slabDetails;
        }

        public double getTotalAmount() {
            return totalAmount;
        }
    }

    public static CalculationResult calculate(int unitsConsumed) {
        if (unitsConsumed < 0) {
            throw new IllegalArgumentException("Units consumed cannot be negative");
        }

        List<SlabDetail> slabDetails = new ArrayList<>();
        int remainingUnits = unitsConsumed;
        double total = 0.0;

        // Slab 1: first 50 units
        int slab1Units = Math.min(remainingUnits, SLAB1_LIMIT);
        if (slab1Units > 0) {
            double amount = round(slab1Units * SLAB1_RATE);
            slabDetails.add(new SlabDetail("First 50 units", slab1Units, SLAB1_RATE, amount));
            total += amount;
            remainingUnits -= slab1Units;
        }

        // Slab 2: next 100 units (51 - 150)
        int slab2Units = Math.min(remainingUnits, SLAB2_LIMIT);
        if (slab2Units > 0) {
            double amount = round(slab2Units * SLAB2_RATE);
            slabDetails.add(new SlabDetail("Next 100 units", slab2Units, SLAB2_RATE, amount));
            total += amount;
            remainingUnits -= slab2Units;
        }

        // Slab 3: next 100 units (151 - 250)
        int slab3Units = Math.min(remainingUnits, SLAB3_LIMIT);
        if (slab3Units > 0) {
            double amount = round(slab3Units * SLAB3_RATE);
            slabDetails.add(new SlabDetail("Next 100 units", slab3Units, SLAB3_RATE, amount));
            total += amount;
            remainingUnits -= slab3Units;
        }

        // Slab 4: above 250 units
        if (remainingUnits > 0) {
            double amount = round(remainingUnits * SLAB4_RATE);
            slabDetails.add(new SlabDetail("Above 250 units", remainingUnits, SLAB4_RATE, amount));
            total += amount;
        }

        return new CalculationResult(slabDetails, round(total));
    }

    private static double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}

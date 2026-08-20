package com.electricity.service;

import com.electricity.dao.TariffDAO;
import com.electricity.model.BillBreakdown;
import com.electricity.model.SlabBreakdownItem;
import com.electricity.model.TariffSlab;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * Core business service for progressive electricity tariff calculation.
 * Accurately calculates charges across progressive tariff slabs using BigDecimal arithmetic.
 */
public class ElectricityBillService {

    private final TariffDAO tariffDAO;

    public ElectricityBillService() {
        this.tariffDAO = new TariffDAO();
    }

    public ElectricityBillService(TariffDAO tariffDAO) {
        this.tariffDAO = tariffDAO;
    }

    /**
     * Calculates the progressive electricity bill for the given consumed units.
     * 
     * Formula:
     * - First 50 units (0-50): ₹3.50 / unit
     * - Next 100 units (50-150): ₹4.00 / unit
     * - Next 100 units (150-250): ₹5.20 / unit
     * - Above 250 units (>250): ₹6.50 / unit
     *
     * @param units Total units consumed (must be non-negative)
     * @return Fully populated BillBreakdown
     */
    public BillBreakdown calculateBill(BigDecimal units) {
        if (units == null || units.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Units consumed must be non-negative.");
        }

        List<TariffSlab> slabs = tariffDAO != null ? tariffDAO.getAllSlabs() : TariffDAO.getDefaultFallbackSlabs();
        if (slabs == null || slabs.isEmpty()) {
            slabs = TariffDAO.getDefaultFallbackSlabs();
        }

        BillBreakdown breakdown = new BillBreakdown();
        breakdown.setUnitsConsumed(units.setScale(2, RoundingMode.HALF_UP));

        BigDecimal remainingUnits = units;
        BigDecimal totalCharge = BigDecimal.ZERO;
        int highestSlab = 1;

        for (TariffSlab slab : slabs) {
            BigDecimal min = slab.getMinUnits();
            BigDecimal max = slab.getMaxUnits();
            BigDecimal slabRate = slab.getRate();

            BigDecimal slabCapacity;
            if (max != null) {
                slabCapacity = max.subtract(min);
            } else {
                slabCapacity = null; // Unbounded
            }

            BigDecimal unitsInThisSlab = BigDecimal.ZERO;

            if (remainingUnits.compareTo(BigDecimal.ZERO) > 0) {
                highestSlab = slab.getSlabOrder();
                if (slabCapacity != null) {
                    if (remainingUnits.compareTo(slabCapacity) >= 0) {
                        unitsInThisSlab = slabCapacity;
                        remainingUnits = remainingUnits.subtract(slabCapacity);
                    } else {
                        unitsInThisSlab = remainingUnits;
                        remainingUnits = BigDecimal.ZERO;
                    }
                } else {
                    // Unbounded top slab
                    unitsInThisSlab = remainingUnits;
                    remainingUnits = BigDecimal.ZERO;
                }
            }

            BigDecimal slabAmount = unitsInThisSlab.multiply(slabRate).setScale(2, RoundingMode.HALF_UP);
            totalCharge = totalCharge.add(slabAmount);

            SlabBreakdownItem item = new SlabBreakdownItem();
            item.setSlabOrder(slab.getSlabOrder());
            item.setSlabName(slab.getSlabName());
            item.setSlabCapacity(slabCapacity);
            item.setUnitsInSlab(unitsInThisSlab.setScale(2, RoundingMode.HALF_UP));
            item.setRate(slabRate.setScale(2, RoundingMode.HALF_UP));
            item.setAmount(slabAmount);

            breakdown.addSlabItem(item);
        }

        breakdown.setEnergyCharge(totalCharge.setScale(2, RoundingMode.HALF_UP));
        breakdown.setTotalAmount(totalCharge.setScale(2, RoundingMode.HALF_UP));
        breakdown.setHighestSlabReached(highestSlab);

        // Effective average rate: Total Bill / Units
        if (units.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal effectiveRate = totalCharge.divide(units, 4, RoundingMode.HALF_UP);
            breakdown.setEffectiveAverageRate(effectiveRate);
        } else {
            breakdown.setEffectiveAverageRate(BigDecimal.ZERO);
        }

        // Compute percentages for visual charts
        for (SlabBreakdownItem item : breakdown.getSlabItems()) {
            if (units.compareTo(BigDecimal.ZERO) > 0) {
                double unitPct = item.getUnitsInSlab().doubleValue() / units.doubleValue() * 100.0;
                item.setPercentageOfTotalUnits(Math.round(unitPct * 100.0) / 100.0);
            } else {
                item.setPercentageOfTotalUnits(0.0);
            }

            if (totalCharge.compareTo(BigDecimal.ZERO) > 0) {
                double amtPct = item.getAmount().doubleValue() / totalCharge.doubleValue() * 100.0;
                item.setPercentageOfTotalAmount(Math.round(amtPct * 100.0) / 100.0);
            } else {
                item.setPercentageOfTotalAmount(0.0);
            }
        }

        // Usage Classification & Insights
        populateInsights(breakdown, units);

        return breakdown;
    }

    public BillBreakdown calculateBill(double units) {
        return calculateBill(BigDecimal.valueOf(units));
    }

    private void populateInsights(BillBreakdown breakdown, BigDecimal units) {
        double u = units.doubleValue();
        if (u <= 50) {
            breakdown.setUsageClassification("Low / Lifeline Consumption");
            breakdown.setUsageInsight("Your consumption is within the subsidized base lifeline slab (₹3.50/unit). Excellent energy conservation!");
        } else if (u <= 150) {
            breakdown.setUsageClassification("Moderate Domestic Usage");
            breakdown.setUsageInsight("Your consumption has entered Slab 2 (₹4.00/unit). Keeping usage under 150 units maintains affordable domestic rates.");
        } else if (u <= 250) {
            breakdown.setUsageClassification("High Domestic Usage");
            breakdown.setUsageInsight("Your consumption has entered Slab 3 (₹5.20/unit). Reducing usage by " + String.format("%.0f", (u - 150)) + " units would drop you to a lower tariff bracket.");
        } else {
            breakdown.setUsageClassification("Very High / Peak Tier Usage");
            breakdown.setUsageInsight("Your consumption has crossed into the top surcharge slab (₹6.50/unit) with " + String.format("%.1f", (u - 250)) + " units billed at the highest peak rate.");
        }
    }
}

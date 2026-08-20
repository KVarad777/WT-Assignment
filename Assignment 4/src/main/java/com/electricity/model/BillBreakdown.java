package com.electricity.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Encapsulates the complete computation output of a progressive electricity bill.
 */
public class BillBreakdown implements Serializable {
    private static final long serialVersionUID = 1L;

    private BigDecimal unitsConsumed;
    private BigDecimal energyCharge;
    private BigDecimal totalAmount;
    private BigDecimal effectiveAverageRate; // totalAmount / unitsConsumed
    private int highestSlabReached;          // 1, 2, 3, or 4
    private String usageClassification;     // Low, Moderate, High, Very High
    private String usageInsight;            // Contextual insight message
    private List<SlabBreakdownItem> slabItems = new ArrayList<>();

    public BillBreakdown() {
    }

    public BigDecimal getUnitsConsumed() {
        return unitsConsumed;
    }

    public void setUnitsConsumed(BigDecimal unitsConsumed) {
        this.unitsConsumed = unitsConsumed;
    }

    public BigDecimal getEnergyCharge() {
        return energyCharge;
    }

    public void setEnergyCharge(BigDecimal energyCharge) {
        this.energyCharge = energyCharge;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getEffectiveAverageRate() {
        return effectiveAverageRate;
    }

    public void setEffectiveAverageRate(BigDecimal effectiveAverageRate) {
        this.effectiveAverageRate = effectiveAverageRate;
    }

    public int getHighestSlabReached() {
        return highestSlabReached;
    }

    public void setHighestSlabReached(int highestSlabReached) {
        this.highestSlabReached = highestSlabReached;
    }

    public String getUsageClassification() {
        return usageClassification;
    }

    public void setUsageClassification(String usageClassification) {
        this.usageClassification = usageClassification;
    }

    public String getUsageInsight() {
        return usageInsight;
    }

    public void setUsageInsight(String usageInsight) {
        this.usageInsight = usageInsight;
    }

    public List<SlabBreakdownItem> getSlabItems() {
        return slabItems;
    }

    public void setSlabItems(List<SlabBreakdownItem> slabItems) {
        this.slabItems = slabItems;
    }

    public void addSlabItem(SlabBreakdownItem item) {
        this.slabItems.add(item);
    }
}

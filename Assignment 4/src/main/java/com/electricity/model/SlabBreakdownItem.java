package com.electricity.model;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Model representing the calculation outcome within a single progressive tariff slab.
 */
public class SlabBreakdownItem implements Serializable {
    private static final long serialVersionUID = 1L;

    private int slabOrder;
    private String slabName;
    private BigDecimal slabCapacity; // Max units accommodated by this slab (e.g. 50, 100, 100, unbounded)
    private BigDecimal unitsInSlab;  // Units actually consumed within this slab
    private BigDecimal rate;         // Rate per unit in INR
    private BigDecimal amount;       // Total cost for this slab (unitsInSlab * rate)
    private double percentageOfTotalUnits;
    private double percentageOfTotalAmount;

    public SlabBreakdownItem() {
    }

    public SlabBreakdownItem(int slabOrder, String slabName, BigDecimal slabCapacity, BigDecimal unitsInSlab, BigDecimal rate, BigDecimal amount) {
        this.slabOrder = slabOrder;
        this.slabName = slabName;
        this.slabCapacity = slabCapacity;
        this.unitsInSlab = unitsInSlab;
        this.rate = rate;
        this.amount = amount;
    }

    public int getSlabOrder() {
        return slabOrder;
    }

    public void setSlabOrder(int slabOrder) {
        this.slabOrder = slabOrder;
    }

    public String getSlabName() {
        return slabName;
    }

    public void setSlabName(String slabName) {
        this.slabName = slabName;
    }

    public BigDecimal getSlabCapacity() {
        return slabCapacity;
    }

    public void setSlabCapacity(BigDecimal slabCapacity) {
        this.slabCapacity = slabCapacity;
    }

    public BigDecimal getUnitsInSlab() {
        return unitsInSlab;
    }

    public void setUnitsInSlab(BigDecimal unitsInSlab) {
        this.unitsInSlab = unitsInSlab;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public double getPercentageOfTotalUnits() {
        return percentageOfTotalUnits;
    }

    public void setPercentageOfTotalUnits(double percentageOfTotalUnits) {
        this.percentageOfTotalUnits = percentageOfTotalUnits;
    }

    public double getPercentageOfTotalAmount() {
        return percentageOfTotalAmount;
    }

    public void setPercentageOfTotalAmount(double percentageOfTotalAmount) {
        this.percentageOfTotalAmount = percentageOfTotalAmount;
    }
}

package com.ebill.model;

import java.io.Serializable;

/**
 * Represents a single slab row used in the slab-wise bill breakdown.
 * e.g. "First 50 units @ Rs.3.50/unit = Rs.175.00"
 */
public class SlabDetail implements Serializable {

    private static final long serialVersionUID = 1L;

    private String slabName;   // e.g. "First 50 units"
    private int unitsInSlab;   // units billed at this slab
    private double ratePerUnit;
    private double slabAmount;

    public SlabDetail() {
    }

    public SlabDetail(String slabName, int unitsInSlab, double ratePerUnit, double slabAmount) {
        this.slabName = slabName;
        this.unitsInSlab = unitsInSlab;
        this.ratePerUnit = ratePerUnit;
        this.slabAmount = slabAmount;
    }

    public String getSlabName() {
        return slabName;
    }

    public void setSlabName(String slabName) {
        this.slabName = slabName;
    }

    public int getUnitsInSlab() {
        return unitsInSlab;
    }

    public void setUnitsInSlab(int unitsInSlab) {
        this.unitsInSlab = unitsInSlab;
    }

    public double getRatePerUnit() {
        return ratePerUnit;
    }

    public void setRatePerUnit(double ratePerUnit) {
        this.ratePerUnit = ratePerUnit;
    }

    public double getSlabAmount() {
        return slabAmount;
    }

    public void setSlabAmount(double slabAmount) {
        this.slabAmount = slabAmount;
    }
}

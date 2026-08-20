package com.electricity.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * Model representing a progressive electricity tariff slab.
 */
public class TariffSlab implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private int slabOrder;
    private String slabName;
    private BigDecimal minUnits;
    private BigDecimal maxUnits; // null indicates no upper bound (e.g. above 250 units)
    private BigDecimal rate;
    private String description;
    private Timestamp createdAt;

    public TariffSlab() {
    }

    public TariffSlab(int id, int slabOrder, String slabName, BigDecimal minUnits, BigDecimal maxUnits, BigDecimal rate, String description) {
        this.id = id;
        this.slabOrder = slabOrder;
        this.slabName = slabName;
        this.minUnits = minUnits;
        this.maxUnits = maxUnits;
        this.rate = rate;
        this.description = description;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public BigDecimal getMinUnits() {
        return minUnits;
    }

    public void setMinUnits(BigDecimal minUnits) {
        this.minUnits = minUnits;
    }

    public BigDecimal getMaxUnits() {
        return maxUnits;
    }

    public void setMaxUnits(BigDecimal maxUnits) {
        this.maxUnits = maxUnits;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isUnbounded() {
        return maxUnits == null;
    }

    @Override
    public String toString() {
        return "TariffSlab{" +
                "slabOrder=" + slabOrder +
                ", slabName='" + slabName + '\'' +
                ", minUnits=" + minUnits +
                ", maxUnits=" + maxUnits +
                ", rate=" + rate +
                '}';
    }
}

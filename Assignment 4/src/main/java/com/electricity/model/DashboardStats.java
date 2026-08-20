package com.electricity.model;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * Model representing aggregated utility analytics for the dashboard.
 */
public class DashboardStats implements Serializable {
    private static final long serialVersionUID = 1L;

    private int totalBillsCount;
    private int totalCustomersCount;
    private BigDecimal totalUnitsBilled;
    private BigDecimal totalRevenue;
    private BigDecimal averageBillAmount;
    private BigDecimal highestBillAmount;

    public DashboardStats() {
        this.totalUnitsBilled = BigDecimal.ZERO;
        this.totalRevenue = BigDecimal.ZERO;
        this.averageBillAmount = BigDecimal.ZERO;
        this.highestBillAmount = BigDecimal.ZERO;
    }

    public int getTotalBillsCount() {
        return totalBillsCount;
    }

    public void setTotalBillsCount(int totalBillsCount) {
        this.totalBillsCount = totalBillsCount;
    }

    public int getTotalCustomersCount() {
        return totalCustomersCount;
    }

    public void setTotalCustomersCount(int totalCustomersCount) {
        this.totalCustomersCount = totalCustomersCount;
    }

    public BigDecimal getTotalUnitsBilled() {
        return totalUnitsBilled;
    }

    public void setTotalUnitsBilled(BigDecimal totalUnitsBilled) {
        this.totalUnitsBilled = totalUnitsBilled;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getAverageBillAmount() {
        return averageBillAmount;
    }

    public void setAverageBillAmount(BigDecimal averageBillAmount) {
        this.averageBillAmount = averageBillAmount;
    }

    public BigDecimal getHighestBillAmount() {
        return highestBillAmount;
    }

    public void setHighestBillAmount(BigDecimal highestBillAmount) {
        this.highestBillAmount = highestBillAmount;
    }
}

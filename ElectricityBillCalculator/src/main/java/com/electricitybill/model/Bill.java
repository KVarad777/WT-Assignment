package com.electricitybill.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Bill Model (POJO)
 * Represents a single electricity bill record stored in the database.
 *
 * @author Senior Full Stack Java Developer
 * @version 1.0
 */
public class Bill {

    // ─── Fields ───────────────────────────────────────────────────
    private int id;
    private String customerName;
    private String customerNumber;
    private double units;
    private double billAmount;
    private LocalDateTime calculationDate;

    // ─── Slab breakdown fields (transient – not stored in DB) ─────
    private double slab1Amount;   // 0-50 units
    private double slab2Amount;   // 51-150 units
    private double slab3Amount;   // 151-250 units
    private double slab4Amount;   // 251+ units

    private double slab1Units;
    private double slab2Units;
    private double slab3Units;
    private double slab4Units;

    private String billNumber;    // Generated bill number
    private String billMonth;      // e.g., "2026-07" or "July 2026"
    private boolean paid;          // payment status

    // ─── Constants ────────────────────────────────────────────────
    public static final double RATE_SLAB1 = 3.50;
    public static final double RATE_SLAB2 = 4.00;
    public static final double RATE_SLAB3 = 5.20;
    public static final double RATE_SLAB4 = 6.50;

    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");

    // ─── Constructors ─────────────────────────────────────────────

    /** Default constructor */
    public Bill() {}

    public String getBillMonth() { return billMonth; }
    public void setBillMonth(String billMonth) { this.billMonth = billMonth; }

    public boolean isPaid() { return paid; }
    public void setPaid(boolean paid) { this.paid = paid; }

    /**
     * Full constructor for DB-fetched records.
     */
    public Bill(int id, String customerName, String customerNumber,
                double units, double billAmount, LocalDateTime calculationDate) {
        this.id              = id;
        this.customerName    = customerName;
        this.customerNumber  = customerNumber;
        this.units           = units;
        this.billAmount      = billAmount;
        this.calculationDate = calculationDate;
    }

    // ─── Getters & Setters ────────────────────────────────────────

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerNumber() { return customerNumber; }
    public void setCustomerNumber(String customerNumber) { this.customerNumber = customerNumber; }

    public double getUnits() { return units; }
    public void setUnits(double units) { this.units = units; }

    public double getBillAmount() { return billAmount; }
    public void setBillAmount(double billAmount) { this.billAmount = billAmount; }

    public LocalDateTime getCalculationDate() { return calculationDate; }
    public void setCalculationDate(LocalDateTime calculationDate) { this.calculationDate = calculationDate; }

    public double getSlab1Amount() { return slab1Amount; }
    public void setSlab1Amount(double slab1Amount) { this.slab1Amount = slab1Amount; }

    public double getSlab2Amount() { return slab2Amount; }
    public void setSlab2Amount(double slab2Amount) { this.slab2Amount = slab2Amount; }

    public double getSlab3Amount() { return slab3Amount; }
    public void setSlab3Amount(double slab3Amount) { this.slab3Amount = slab3Amount; }

    public double getSlab4Amount() { return slab4Amount; }
    public void setSlab4Amount(double slab4Amount) { this.slab4Amount = slab4Amount; }

    public double getSlab1Units() { return slab1Units; }
    public void setSlab1Units(double slab1Units) { this.slab1Units = slab1Units; }

    public double getSlab2Units() { return slab2Units; }
    public void setSlab2Units(double slab2Units) { this.slab2Units = slab2Units; }

    public double getSlab3Units() { return slab3Units; }
    public void setSlab3Units(double slab3Units) { this.slab3Units = slab3Units; }

    public double getSlab4Units() { return slab4Units; }
    public void setSlab4Units(double slab4Units) { this.slab4Units = slab4Units; }

    public String getBillNumber() { return billNumber; }
    public void setBillNumber(String billNumber) { this.billNumber = billNumber; }

    // ─── Utility Methods ──────────────────────────────────────────

    /**
     * Returns the calculation date formatted as a readable string.
     */
    public String getFormattedDate() {
        if (calculationDate == null) return "N/A";
        return calculationDate.format(FORMATTER);
    }

    /**
     * Returns bill amount formatted to 2 decimal places.
     */
    public String getFormattedBillAmount() {
        return String.format("%.2f", billAmount);
    }

    @Override
    public String toString() {
        return "Bill{" +
               "id=" + id +
               ", customerName='" + customerName + '\'' +
               ", customerNumber='" + customerNumber + '\'' +
               ", units=" + units +
               ", billAmount=" + billAmount +
               ", calculationDate=" + calculationDate +
               '}';
    }
}

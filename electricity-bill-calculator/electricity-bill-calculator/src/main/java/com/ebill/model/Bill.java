package com.ebill.model;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Domain model representing a single generated electricity bill.
 *
 * This class is persistence-agnostic on purpose: it has no idea whether it
 * is stored in an ArrayList/HashMap (in-memory) or in a MySQL table. That
 * decision belongs entirely to the repository implementation.
 */
public class Bill implements Serializable {

    private static final long serialVersionUID = 1L;

    private int id;
    private String customerName;
    private String customerNumber;
    private int unitsConsumed;
    private List<SlabDetail> slabDetails = new ArrayList<>();
    private double totalAmount;
    private LocalDateTime billDate;

    public Bill() {
        this.billDate = LocalDateTime.now();
    }

    public Bill(String customerName, String customerNumber, int unitsConsumed) {
        this.customerName = customerName;
        this.customerNumber = customerNumber;
        this.unitsConsumed = unitsConsumed;
        this.billDate = LocalDateTime.now();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerNumber() {
        return customerNumber;
    }

    public void setCustomerNumber(String customerNumber) {
        this.customerNumber = customerNumber;
    }

    public int getUnitsConsumed() {
        return unitsConsumed;
    }

    public void setUnitsConsumed(int unitsConsumed) {
        this.unitsConsumed = unitsConsumed;
    }

    public List<SlabDetail> getSlabDetails() {
        return slabDetails;
    }

    public void setSlabDetails(List<SlabDetail> slabDetails) {
        this.slabDetails = slabDetails;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public LocalDateTime getBillDate() {
        return billDate;
    }

    public void setBillDate(LocalDateTime billDate) {
        this.billDate = billDate;
    }

    /** Convenience getter used directly by JSP (EL calls getFormattedBillDate()). */
    public String getFormattedBillDate() {
        if (billDate == null) {
            return "";
        }
        return billDate.format(DateTimeFormatter.ofPattern("dd-MMM-yyyy hh:mm a"));
    }

    /** Convenience getter for a zero-padded, human-friendly bill number. */
    public String getBillNumber() {
        return String.format("EBC-%06d", id);
    }
}

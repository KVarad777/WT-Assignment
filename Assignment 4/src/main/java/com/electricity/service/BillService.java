package com.electricity.service;

import com.electricity.dao.BillDAO;
import com.electricity.dao.CustomerDAO;
import com.electricity.model.Bill;
import com.electricity.model.BillBreakdown;
import com.electricity.model.Customer;
import com.electricity.model.DashboardStats;

import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;

/**
 * High-level orchestration service for calculating, persisting, and querying electricity bills.
 */
public class BillService {

    private final ElectricityBillService calculationService;
    private final BillDAO billDAO;
    private final CustomerDAO customerDAO;

    public BillService() {
        this.calculationService = new ElectricityBillService();
        this.billDAO = new BillDAO();
        this.customerDAO = new CustomerDAO();
    }

    public BillService(ElectricityBillService calculationService, BillDAO billDAO, CustomerDAO customerDAO) {
        this.calculationService = calculationService;
        this.billDAO = billDAO;
        this.customerDAO = customerDAO;
    }

    /**
     * Processes and generates a new electricity bill:
     * 1. Calculates progressive breakdown
     * 2. Persists or updates customer information
     * 3. Saves bill record to database
     * 4. Returns hydrated Bill with breakdown
     */
    public Bill generateAndSaveBill(
            String customerName,
            String consumerNumber,
            String email,
            String phone,
            String address,
            String billingMonth,
            BigDecimal previousReading,
            BigDecimal currentReading,
            BigDecimal directUnits,
            boolean isDirectUnits) throws SQLException {

        BigDecimal units;
        if (isDirectUnits) {
            units = directUnits;
            if (previousReading == null) previousReading = BigDecimal.ZERO;
            if (currentReading == null) currentReading = units;
        } else {
            if (previousReading == null) previousReading = BigDecimal.ZERO;
            units = currentReading.subtract(previousReading);
        }

        // Calculate authoritative breakdown
        BillBreakdown breakdown = calculationService.calculateBill(units);

        // Save or update customer
        Customer customer = new Customer(customerName.trim(), consumerNumber.trim(), email, phone, address);
        Customer savedCustomer = customerDAO.findOrCreateOrUpdate(customer);

        // Build bill
        Bill bill = new Bill();
        bill.setCustomerId(savedCustomer.getId());
        bill.setCustomer(savedCustomer);
        bill.setBillingMonth(billingMonth);
        bill.setPreviousReading(previousReading);
        bill.setCurrentReading(currentReading);
        bill.setUnitsConsumed(units);
        bill.setEnergyCharge(breakdown.getEnergyCharge());
        bill.setTotalAmount(breakdown.getTotalAmount());
        bill.setBreakdown(breakdown);

        // Persist bill
        Bill savedBill = billDAO.save(bill);
        savedBill.setCustomer(savedCustomer);
        savedBill.setBreakdown(breakdown);

        return savedBill;
    }

    public Bill getBillDetails(int billId) throws SQLException {
        Bill bill = billDAO.findById(billId);
        if (bill != null) {
            BillBreakdown breakdown = calculationService.calculateBill(bill.getUnitsConsumed());
            bill.setBreakdown(breakdown);
        }
        return bill;
    }

    public List<Bill> getBillHistory(String search, String monthFilter, String sortOrder) throws SQLException {
        List<Bill> list = billDAO.findAll(search, monthFilter, sortOrder);
        for (Bill bill : list) {
            bill.setBreakdown(calculationService.calculateBill(bill.getUnitsConsumed()));
        }
        return list;
    }

    public List<Bill> getRecentBills(int limit) throws SQLException {
        List<Bill> list = billDAO.getRecentBills(limit);
        for (Bill bill : list) {
            bill.setBreakdown(calculationService.calculateBill(bill.getUnitsConsumed()));
        }
        return list;
    }

    public DashboardStats getDashboardStats() {
        return billDAO.getDashboardStats();
    }

    public boolean deleteBill(int billId) throws SQLException {
        return billDAO.deleteById(billId);
    }

    public List<String> getDistinctBillingMonths() {
        return billDAO.getDistinctBillingMonths();
    }

    public ElectricityBillService getCalculationService() {
        return calculationService;
    }
}

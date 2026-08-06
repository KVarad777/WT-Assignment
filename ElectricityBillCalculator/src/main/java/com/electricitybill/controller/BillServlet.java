package com.electricitybill.controller;

import com.electricitybill.dao.BillDAO;
import com.electricitybill.model.Bill;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * BillServlet — Electricity Bill Calculation Controller
 *
 * Handles POST requests from the calculator form.
 * Applies slab-wise rate calculation, persists to DB,
 * and forwards the result to result.jsp.
 *
 * Slab Rates:
 *  First 50 units      → Rs. 3.50 / unit
 *  Next 100 (51-150)   → Rs. 4.00 / unit
 *  Next 100 (151-250)  → Rs. 5.20 / unit
 *  Above 250           → Rs. 6.50 / unit
 *
 * @author Senior Full Stack Java Developer
 * @version 1.0
 */
@WebServlet(name = "BillServlet", urlPatterns = {"/calculate"})
public class BillServlet extends HttpServlet {

    private static final Logger LOGGER  = Logger.getLogger(BillServlet.class.getName());
    private static final long   serialVersionUID = 1L;

    private BillDAO billDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        billDAO = new BillDAO();
        LOGGER.info("BillServlet initialized.");
    }

    // ─── GET: redirect to home ────────────────────────────────────
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.sendRedirect(request.getContextPath() + "/");
    }

    // ─── POST: process form ───────────────────────────────────────
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        request.setCharacterEncoding("UTF-8");

        String customerName   = sanitize(request.getParameter("customerName"));
        String customerNumber = sanitize(request.getParameter("customerNumber"));
        String unitsParam     = sanitize(request.getParameter("units"));
        String billMonthParam  = sanitize(request.getParameter("billMonth"));

        // ── Validation ──────────────────────────────────────────
        StringBuilder errors = new StringBuilder();

        if (customerName.isEmpty()) {
            errors.append("Customer name is required. ");
        }
        if (customerNumber.isEmpty()) {
            errors.append("Customer number is required. ");
        }
        if (unitsParam.isEmpty()) {
            errors.append("Units consumed is required. ");
        }

        double units = 0;
        if (!unitsParam.isEmpty()) {
            try {
                units = Double.parseDouble(unitsParam);
                if (units < 0) {
                    errors.append("Units cannot be negative. ");
                }
            } catch (NumberFormatException e) {
                errors.append("Units must be a valid number. ");
            }
        }

        // If validation failed, redirect back with error
        if (errors.length() > 0) {
            HttpSession session = request.getSession();
            session.setAttribute("errorMessage", errors.toString().trim());
            response.sendRedirect(request.getContextPath() + "/");
            return;
        }

        // ── Slab-wise Calculation ──────────────────────────────
        Bill bill = calculateBill(customerName, customerNumber, units);
        // set month and default paid status
        bill.setBillMonth(billMonthParam.isEmpty() ? null : billMonthParam);
        bill.setPaid(false);

        // ── Persist to Database ────────────────────────────────
        try {
            int generatedId = billDAO.insertBill(bill);
            if (generatedId > 0) {
                bill.setId(generatedId);
                String billNumber = generateBillNumber(generatedId);
                bill.setBillNumber(billNumber);
                LOGGER.info("Bill saved: ID=" + generatedId + ", Customer=" + customerName);
            } else {
                LOGGER.warning("Bill insert returned no ID for customer: " + customerName);
            }
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Database error while saving bill", e);
            // Don't block the user — show result even if DB fails
        }

        // ── Forward to Result Page ─────────────────────────────
        request.setAttribute("bill", bill);
        request.getRequestDispatcher("/WEB-INF/views/result.jsp")
               .forward(request, response);
    }

    // ─── Slab Calculation Logic ───────────────────────────────────

    /**
     * Applies slab-wise electricity rate calculation.
     *
     * @param customerName   Customer's full name
     * @param customerNumber Customer's account/meter number
     * @param units          Total units consumed
     * @return Populated Bill object with slab breakdown
     */
    private Bill calculateBill(String customerName, String customerNumber, double units) {
        Bill bill = new Bill();
        bill.setCustomerName(customerName);
        bill.setCustomerNumber(customerNumber);
        bill.setUnits(units);
        bill.setCalculationDate(LocalDateTime.now());

        double totalAmount = 0;
        double remaining   = units;

        // ── Slab 1: First 50 units @ Rs. 3.50 ──────────────────
        double s1Units = Math.min(remaining, 50);
        double s1Amt   = s1Units * Bill.RATE_SLAB1;
        remaining     -= s1Units;

        // ── Slab 2: Next 100 units (51-150) @ Rs. 4.00 ─────────
        double s2Units = Math.min(remaining, 100);
        double s2Amt   = s2Units * Bill.RATE_SLAB2;
        remaining     -= s2Units;

        // ── Slab 3: Next 100 units (151-250) @ Rs. 5.20 ────────
        double s3Units = Math.min(remaining, 100);
        double s3Amt   = s3Units * Bill.RATE_SLAB3;
        remaining     -= s3Units;

        // ── Slab 4: Above 250 units @ Rs. 6.50 ─────────────────
        double s4Units = remaining;           // whatever is left
        double s4Amt   = s4Units * Bill.RATE_SLAB4;

        totalAmount = s1Amt + s2Amt + s3Amt + s4Amt;

        // ── Populate Bill ───────────────────────────────────────
        bill.setSlab1Units(s1Units);   bill.setSlab1Amount(s1Amt);
        bill.setSlab2Units(s2Units);   bill.setSlab2Amount(s2Amt);
        bill.setSlab3Units(s3Units);   bill.setSlab3Amount(s3Amt);
        bill.setSlab4Units(s4Units);   bill.setSlab4Amount(s4Amt);
        bill.setBillAmount(Math.round(totalAmount * 100.0) / 100.0);

        return bill;
    }

    // ─── Helpers ─────────────────────────────────────────────────

    /** Generates a human-readable bill number: EBC-YYYYMMDD-{id} */
    private String generateBillNumber(int id) {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        return String.format("EBC-%s-%04d", date, id);
    }

    /** Trims and null-safes a request parameter. */
    private String sanitize(String value) {
        return (value == null) ? "" : value.trim();
    }
}

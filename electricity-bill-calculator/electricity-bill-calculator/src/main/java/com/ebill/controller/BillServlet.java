package com.ebill.controller;

import com.ebill.listener.AppContextListener;
import com.ebill.model.Bill;
import com.ebill.service.BillService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Controller responsible for:
 *   GET  /calculator -> shows the calculator input form
 *   POST /calculate   -> validates input, delegates to BillService, shows result
 *
 * Notice this class never touches a repository or collection directly — it
 * only ever calls methods on {@link BillService}, obtained from the
 * ServletContext (injected once at startup by AppContextListener).
 */
@WebServlet(name = "BillServlet", urlPatterns = {"/calculator", "/calculate"})
public class BillServlet extends HttpServlet {

    private BillService billService;

    @Override
    public void init() throws ServletException {
        this.billService = (BillService) getServletContext()
                .getAttribute(AppContextListener.BILL_SERVICE_ATTR);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        req.getRequestDispatcher("/WEB-INF/views/calculator.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String customerName = trim(req.getParameter("customerName"));
        String customerNumber = trim(req.getParameter("customerNumber"));
        String unitsRaw = trim(req.getParameter("unitsConsumed"));

        String error = validate(customerName, customerNumber, unitsRaw);
        if (error != null) {
            req.setAttribute("errorMessage", error);
            req.setAttribute("customerName", customerName);
            req.setAttribute("customerNumber", customerNumber);
            req.setAttribute("unitsConsumed", unitsRaw);
            req.getRequestDispatcher("/WEB-INF/views/calculator.jsp").forward(req, resp);
            return;
        }

        int units = Integer.parseInt(unitsRaw);
        Bill bill = billService.generateBill(customerName, customerNumber, units);

        req.setAttribute("bill", bill);
        req.getRequestDispatcher("/WEB-INF/views/result.jsp").forward(req, resp);
    }

    private String validate(String customerName, String customerNumber, String unitsRaw) {
        if (customerName == null || customerName.isEmpty()) {
            return "Customer name is required.";
        }
        if (customerName.length() > 100) {
            return "Customer name is too long (max 100 characters).";
        }
        if (customerNumber == null || customerNumber.isEmpty()) {
            return "Customer number is required.";
        }
        if (customerNumber.length() > 50) {
            return "Customer number is too long (max 50 characters).";
        }
        if (unitsRaw == null || unitsRaw.isEmpty()) {
            return "Units consumed is required.";
        }
        int units;
        try {
            units = Integer.parseInt(unitsRaw);
        } catch (NumberFormatException e) {
            return "Units consumed must be a whole number.";
        }
        if (units < 0) {
            return "Units consumed cannot be negative.";
        }
        if (units > 1_000_000) {
            return "Units consumed value is unrealistically large.";
        }
        return null;
    }

    private String trim(String s) {
        return s == null ? null : s.trim();
    }
}

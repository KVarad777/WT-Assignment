package com.electricity.controller;

import com.electricity.dao.TariffDAO;
import com.electricity.model.Bill;
import com.electricity.service.BillService;
import com.electricity.util.ValidationUtil;
import com.electricity.util.ValidationUtil.ValidationResult;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Controller servlet for processing bill calculation form submissions.
 */
@WebServlet(name = "BillCalculationServlet", urlPatterns = {"/calculate"})
public class BillCalculationServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(BillCalculationServlet.class.getName());

    private BillService billService;
    private TariffDAO tariffDAO;

    @Override
    public void init() throws ServletException {
        this.billService = new BillService();
        this.tariffDAO = new TariffDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String customerName = request.getParameter("customerName");
        String consumerNumber = request.getParameter("consumerNumber");
        String email = request.getParameter("email");
        String phone = request.getParameter("phone");
        String address = request.getParameter("address");
        String billingMonth = request.getParameter("billingMonth");
        String readingMode = request.getParameter("readingMode"); // "meter" or "direct"
        String prevReadingStr = request.getParameter("previousReading");
        String currReadingStr = request.getParameter("currentReading");
        String directUnitsStr = request.getParameter("directUnits");

        boolean isDirect = "direct".equalsIgnoreCase(readingMode);

        // Server-side validation
        ValidationResult validation = ValidationUtil.validateBillInput(
                customerName, consumerNumber, billingMonth, prevReadingStr, currReadingStr, directUnitsStr, isDirect);

        if (!ValidationUtil.isValidEmail(email)) {
            validation.addError("Please enter a valid email address.");
        }

        if (!validation.isValid()) {
            // Keep entered parameters for user convenience
            request.setAttribute("validationErrors", validation.getErrors());
            request.setAttribute("paramCustomerName", customerName);
            request.setAttribute("paramConsumerNumber", consumerNumber);
            request.setAttribute("paramEmail", email);
            request.setAttribute("paramPhone", phone);
            request.setAttribute("paramAddress", address);
            request.setAttribute("paramBillingMonth", billingMonth);
            request.setAttribute("paramReadingMode", readingMode);
            request.setAttribute("paramPrevReading", prevReadingStr);
            request.setAttribute("paramCurrReading", currReadingStr);
            request.setAttribute("paramDirectUnits", directUnitsStr);
            request.setAttribute("slabs", tariffDAO.getAllSlabs());
            request.setAttribute("activePage", "calculator");

            request.getRequestDispatcher("/WEB-INF/views/calculator.jsp").forward(request, response);
            return;
        }

        try {
            BigDecimal prevReading = (prevReadingStr != null && !prevReadingStr.trim().isEmpty())
                    ? new BigDecimal(prevReadingStr.trim()) : BigDecimal.ZERO;
            BigDecimal currReading = (currReadingStr != null && !currReadingStr.trim().isEmpty())
                    ? new BigDecimal(currReadingStr.trim()) : null;
            BigDecimal directUnits = (directUnitsStr != null && !directUnitsStr.trim().isEmpty())
                    ? new BigDecimal(directUnitsStr.trim()) : null;

            Bill bill = billService.generateAndSaveBill(
                    customerName,
                    consumerNumber,
                    email,
                    phone,
                    address,
                    billingMonth,
                    prevReading,
                    currReading,
                    directUnits,
                    isDirect
            );

            request.setAttribute("bill", bill);
            request.setAttribute("successMessage", "Electricity bill calculated and recorded successfully.");
            request.setAttribute("activePage", "result");

            request.getRequestDispatcher("/WEB-INF/views/result.jsp").forward(request, response);

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error processing bill calculation", e);
            request.setAttribute("errorMessage", "An error occurred while calculating the bill: " + e.getMessage());
            request.setAttribute("slabs", tariffDAO.getAllSlabs());
            request.setAttribute("activePage", "calculator");
            request.getRequestDispatcher("/WEB-INF/views/calculator.jsp").forward(request, response);
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        response.sendRedirect(request.getContextPath() + "/calculator");
    }
}

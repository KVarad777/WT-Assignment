package com.electricity.controller;

import com.electricity.model.Bill;
import com.electricity.model.DashboardStats;
import com.electricity.service.BillService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Controller servlet for querying and filtering bill calculation history.
 * Also supports exporting history records as CSV.
 */
@WebServlet(name = "BillHistoryServlet", urlPatterns = {"/history"})
public class BillHistoryServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(BillHistoryServlet.class.getName());

    private BillService billService;

    @Override
    public void init() throws ServletException {
        this.billService = new BillService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String search = request.getParameter("search");
        String month = request.getParameter("month");
        String sort = request.getParameter("sort");
        String format = request.getParameter("format");

        try {
            List<Bill> bills = billService.getBillHistory(search, month, sort);
            List<String> distinctMonths = billService.getDistinctBillingMonths();
            DashboardStats stats = billService.getDashboardStats();

            // Export as CSV if requested
            if ("csv".equalsIgnoreCase(format)) {
                exportAsCsv(response, bills);
                return;
            }

            request.setAttribute("bills", bills);
            request.setAttribute("distinctMonths", distinctMonths);
            request.setAttribute("stats", stats);
            request.setAttribute("paramSearch", search);
            request.setAttribute("paramMonth", month);
            request.setAttribute("paramSort", sort);
            request.setAttribute("activePage", "history");

            request.getRequestDispatcher("/WEB-INF/views/history.jsp").forward(request, response);

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error retrieving bill history", e);
            request.setAttribute("errorMessage", "Failed to retrieve bill history from database: " + e.getMessage());
            request.setAttribute("activePage", "history");
            request.getRequestDispatcher("/WEB-INF/views/history.jsp").forward(request, response);
        }
    }

    private void exportAsCsv(HttpServletResponse response, List<Bill> bills) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=\"energy_ledger_bills.csv\"");

        PrintWriter writer = response.getWriter();
        writer.println("Bill ID,Consumer Number,Customer Name,Email,Phone,Billing Month,Previous Reading,Current Reading,Units Consumed,Total Amount (INR),Created At");

        for (Bill b : bills) {
            writer.printf("%d,\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",%.2f,%.2f,%.2f,%.2f,\"%s\"%n",
                    b.getId(),
                    b.getCustomer().getConsumerNumber(),
                    b.getCustomer().getCustomerName(),
                    b.getCustomer().getEmail() != null ? b.getCustomer().getEmail() : "",
                    b.getCustomer().getPhone() != null ? b.getCustomer().getPhone() : "",
                    b.getBillingMonth(),
                    b.getPreviousReading(),
                    b.getCurrentReading(),
                    b.getUnitsConsumed(),
                    b.getTotalAmount(),
                    b.getCreatedAt()
            );
        }
        writer.flush();
    }
}

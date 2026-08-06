package com.electricitybill.controller;

import com.electricitybill.dao.BillDAO;
import com.electricitybill.model.Bill;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

/**
 * HistoryServlet — Bill History Controller
 *
 * Handles GET requests to display all previous bill calculations.
 * Fetches all records from the database via BillDAO and forwards
 * to history.jsp for rendering.
 *
 * @author Senior Full Stack Java Developer
 * @version 1.0
 */
@WebServlet(name = "HistoryServlet", urlPatterns = {"/history"})
public class HistoryServlet extends HttpServlet {

    private static final Logger LOGGER          = Logger.getLogger(HistoryServlet.class.getName());
    private static final long   serialVersionUID = 1L;

    private BillDAO billDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        billDAO = new BillDAO();
        LOGGER.info("HistoryServlet initialized.");
    }

    // ─── GET: show history page ───────────────────────────────────
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        try {
            // Fetch all bills from database (most recent first)
            List<Bill> bills = billDAO.getAllBills();
            int totalCount   = bills.size();

            // Pass data to JSP
            request.setAttribute("bills",      bills);
            request.setAttribute("totalCount", totalCount);

            LOGGER.info("Loaded " + totalCount + " bill(s) for history page.");

        } catch (Exception e) {
            LOGGER.severe("Error loading history: " + e.getMessage());
            request.setAttribute("errorMessage",
                    "Unable to load history. Please check the database connection.");
        }

        request.getRequestDispatcher("/WEB-INF/views/history.jsp")
               .forward(request, response);
    }
}

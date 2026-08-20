package com.electricity.controller;

import com.electricity.model.Bill;
import com.electricity.model.DashboardStats;
import com.electricity.model.TariffSlab;
import com.electricity.service.BillService;
import com.electricity.service.ElectricityBillService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Controller servlet for the Landing / Home page.
 */
@WebServlet(name = "HomeServlet", urlPatterns = {"/home", ""})
public class HomeServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(HomeServlet.class.getName());

    private BillService billService;

    @Override
    public void init() throws ServletException {
        this.billService = new BillService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        try {
            DashboardStats stats = billService.getDashboardStats();
            List<Bill> recentBills = billService.getRecentBills(5);
            List<TariffSlab> slabs = billService.getCalculationService().calculateBill(0).getSlabItems() != null
                    ? new com.electricity.dao.TariffDAO().getAllSlabs()
                    : com.electricity.dao.TariffDAO.getDefaultFallbackSlabs();

            request.setAttribute("stats", stats);
            request.setAttribute("recentBills", recentBills);
            request.setAttribute("slabs", slabs);
            request.setAttribute("activePage", "home");

            request.getRequestDispatcher("/WEB-INF/views/home.jsp").forward(request, response);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error loading home page data", e);
            request.setAttribute("errorMessage", "Unable to load dashboard data. Please verify database connection.");
            request.getRequestDispatcher("/WEB-INF/views/home.jsp").forward(request, response);
        }
    }
}

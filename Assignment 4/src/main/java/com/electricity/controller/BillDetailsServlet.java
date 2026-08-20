package com.electricity.controller;

import com.electricity.model.Bill;
import com.electricity.service.BillService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Controller servlet for viewing individual bill statement details.
 */
@WebServlet(name = "BillDetailsServlet", urlPatterns = {"/bill-details"})
public class BillDetailsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(BillDetailsServlet.class.getName());

    private BillService billService;

    @Override
    public void init() throws ServletException {
        this.billService = new BillService();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String idStr = request.getParameter("id");
        if (idStr == null || idStr.trim().isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/history");
            return;
        }

        try {
            int id = Integer.parseInt(idStr.trim());
            Bill bill = billService.getBillDetails(id);

            if (bill == null) {
                request.setAttribute("errorMessage", "Bill statement with ID #" + id + " was not found.");
                request.getRequestDispatcher("/WEB-INF/views/error.jsp").forward(request, response);
                return;
            }

            request.setAttribute("bill", bill);
            request.setAttribute("activePage", "history");
            request.getRequestDispatcher("/WEB-INF/views/bill-details.jsp").forward(request, response);

        } catch (NumberFormatException e) {
            response.sendRedirect(request.getContextPath() + "/history");
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error retrieving bill details", e);
            request.setAttribute("errorMessage", "Failed to retrieve bill details: " + e.getMessage());
            request.getRequestDispatcher("/WEB-INF/views/error.jsp").forward(request, response);
        }
    }
}

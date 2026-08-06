package com.electricitybill.controller;

import com.electricitybill.dao.BillDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.util.logging.Logger;

/**
 * DeleteServlet — Delete Bill Record Controller
 *
 * Handles GET requests to delete a specific bill by ID.
 * Redirects back to the history page with a success/error message.
 *
 * URL pattern: /delete?id={billId}
 *
 * @author Senior Full Stack Java Developer
 * @version 1.0
 */
@WebServlet(name = "DeleteServlet", urlPatterns = {"/delete"})
public class DeleteServlet extends HttpServlet {

    private static final Logger LOGGER          = Logger.getLogger(DeleteServlet.class.getName());
    private static final long   serialVersionUID = 1L;

    private BillDAO billDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        billDAO = new BillDAO();
        LOGGER.info("DeleteServlet initialized.");
    }

    // ─── GET: delete bill and redirect ───────────────────────────
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session   = request.getSession();
        String      idParam   = request.getParameter("id");

        if (idParam == null || idParam.trim().isEmpty()) {
            session.setAttribute("errorMessage", "Invalid request: Bill ID is missing.");
            response.sendRedirect(request.getContextPath() + "/history");
            return;
        }

        try {
            int id = Integer.parseInt(idParam.trim());

            if (id <= 0) {
                session.setAttribute("errorMessage", "Invalid Bill ID: " + id);
            } else {
                boolean deleted = billDAO.deleteBill(id);
                if (deleted) {
                    session.setAttribute("successMessage",
                            "Bill record #" + id + " has been deleted successfully.");
                    LOGGER.info("Bill with ID " + id + " deleted.");
                } else {
                    session.setAttribute("errorMessage",
                            "Could not find or delete bill with ID: " + id);
                    LOGGER.warning("Delete failed for ID: " + id);
                }
            }

        } catch (NumberFormatException e) {
            session.setAttribute("errorMessage", "Invalid Bill ID format: " + idParam);
            LOGGER.warning("Invalid ID format: " + idParam);
        } catch (Exception e) {
            session.setAttribute("errorMessage",
                    "Database error while deleting record: " + e.getMessage());
            LOGGER.severe("Error deleting bill: " + e.getMessage());
        }

        response.sendRedirect(request.getContextPath() + "/history");
    }
}

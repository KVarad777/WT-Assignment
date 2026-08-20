package com.electricity.controller;

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
 * Controller servlet for deleting a bill statement.
 */
@WebServlet(name = "DeleteBillServlet", urlPatterns = {"/delete-bill"})
public class DeleteBillServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private static final Logger LOGGER = Logger.getLogger(DeleteBillServlet.class.getName());

    private BillService billService;

    @Override
    public void init() throws ServletException {
        this.billService = new BillService();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        String idStr = request.getParameter("id");
        if (idStr != null && !idStr.trim().isEmpty()) {
            try {
                int id = Integer.parseInt(idStr.trim());
                billService.deleteBill(id);
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Failed to delete bill #" + idStr, e);
            }
        }
        response.sendRedirect(request.getContextPath() + "/history");
    }
}

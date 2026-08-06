package com.electricitybill.controller;

import com.electricitybill.dao.BillDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

@WebServlet(name = "StatusServlet", urlPatterns = {"/toggleStatus"})
public class StatusServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(StatusServlet.class.getName());
    private BillDAO billDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        billDAO = new BillDAO();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String idParam = req.getParameter("id");
        String paidParam = req.getParameter("paid");
        try {
            int id = Integer.parseInt(idParam);
            boolean paid = "1".equals(paidParam) || "true".equalsIgnoreCase(paidParam);
            boolean ok = billDAO.updatePaidStatus(id, paid);
            resp.setStatus(ok ? HttpServletResponse.SC_OK : HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Error toggling paid status", e);
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        }
    }
}

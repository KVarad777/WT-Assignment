package com.electricitybill.controller;

import com.electricitybill.dao.BillDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.logging.Logger;

@WebServlet(name = "HomeServlet", urlPatterns = {"/home"})
public class HomeServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(HomeServlet.class.getName());
    private BillDAO billDAO;

    @Override
    public void init() throws ServletException {
        super.init();
        billDAO = new BillDAO();
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int total = 0;
        try {
            total = billDAO.getTotalBillCount();
        } catch (Exception e) {
            LOGGER.warning("Unable to fetch total bill count: " + e.getMessage());
        }
        req.setAttribute("totalBillsCount", total);
        req.getRequestDispatcher("/index.jsp").forward(req, resp);
    }
}

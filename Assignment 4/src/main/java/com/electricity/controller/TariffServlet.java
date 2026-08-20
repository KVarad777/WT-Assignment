package com.electricity.controller;

import com.electricity.dao.TariffDAO;
import com.electricity.model.TariffSlab;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;

/**
 * Controller servlet for the official Tariff page.
 */
@WebServlet(name = "TariffServlet", urlPatterns = {"/tariff"})
public class TariffServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    private TariffDAO tariffDAO;

    @Override
    public void init() throws ServletException {
        this.tariffDAO = new TariffDAO();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        List<TariffSlab> slabs = tariffDAO.getAllSlabs();
        request.setAttribute("slabs", slabs);
        request.setAttribute("activePage", "tariff");

        request.getRequestDispatcher("/WEB-INF/views/tariff.jsp").forward(request, response);
    }
}

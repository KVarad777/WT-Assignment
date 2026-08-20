package com.electricity.controller;

import com.electricity.dao.TariffDAO;
import com.electricity.model.TariffSlab;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * Controller servlet for displaying the interactive Electricity Bill Calculator.
 */
@WebServlet(name = "CalculatorServlet", urlPatterns = {"/calculator"})
public class CalculatorServlet extends HttpServlet {
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

        // Prepopulate current month if not provided
        String currentMonth = LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM yyyy"));
        request.setAttribute("currentMonth", currentMonth);
        request.setAttribute("activePage", "calculator");

        request.getRequestDispatcher("/WEB-INF/views/calculator.jsp").forward(request, response);
    }
}

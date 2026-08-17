package com.ebill.controller;

import com.ebill.listener.AppContextListener;
import com.ebill.model.Bill;
import com.ebill.service.BillService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.List;

/**
 * Controller responsible for displaying bill history, with optional
 * search (?q=) and sort (?sort=) query parameters. Client-side Bootstrap
 * table search/sort is also available via jQuery in script.js for a snappy
 * UX, but the server-side version works even with JS disabled.
 */
@WebServlet(name = "HistoryServlet", urlPatterns = {"/history"})
public class HistoryServlet extends HttpServlet {

    private BillService billService;

    @Override
    public void init() throws ServletException {
        this.billService = (BillService) getServletContext()
                .getAttribute(AppContextListener.BILL_SERVICE_ATTR);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String query = req.getParameter("q");
        String sortBy = req.getParameter("sort");

        List<Bill> bills = billService.searchAndSort(query, sortBy);

        req.setAttribute("bills", bills);
        req.setAttribute("query", query == null ? "" : query);
        req.setAttribute("sortBy", sortBy == null ? "date_desc" : sortBy);

        req.getRequestDispatcher("/WEB-INF/views/history.jsp").forward(req, resp);
    }
}

package com.ebill.controller;

import com.ebill.listener.AppContextListener;
import com.ebill.service.BillService;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Controller responsible for deleting a single bill (POST /delete?id=..)
 * or clearing the entire history (POST /delete?clearAll=true).
 * Redirects back to /history afterwards (Post/Redirect/Get pattern to
 * avoid duplicate-delete on page refresh).
 */
@WebServlet(name = "DeleteServlet", urlPatterns = {"/delete"})
public class DeleteServlet extends HttpServlet {

    private BillService billService;

    @Override
    public void init() throws ServletException {
        this.billService = (BillService) getServletContext()
                .getAttribute(AppContextListener.BILL_SERVICE_ATTR);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        String clearAll = req.getParameter("clearAll");
        if ("true".equalsIgnoreCase(clearAll)) {
            billService.clearHistory();
            resp.sendRedirect(req.getContextPath() + "/history?deleted=all");
            return;
        }

        String idParam = req.getParameter("id");
        if (idParam != null) {
            try {
                int id = Integer.parseInt(idParam);
                boolean deleted = billService.deleteBill(id);
                resp.sendRedirect(req.getContextPath() + "/history?deleted=" + deleted);
                return;
            } catch (NumberFormatException ignored) {
                // fall through to redirect below
            }
        }

        resp.sendRedirect(req.getContextPath() + "/history?deleted=false");
    }

    // Support simple <a href="delete?id=1"> links as well as form POSTs.
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        doPost(req, resp);
    }
}

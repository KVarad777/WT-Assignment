package com.ebill.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Serves the Contact page and handles a (mock, non-persisted) form
 * submission — there is no email/database backend in this stage of the
 * project, so a submission simply re-renders the page with a success toast.
 */
@WebServlet(name = "ContactServlet", urlPatterns = {"/contact"})
public class ContactServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        req.getRequestDispatcher("/WEB-INF/views/contact.jsp").forward(req, resp);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        String name = req.getParameter("name");
        String email = req.getParameter("email");
        String message = req.getParameter("message");

        boolean valid = name != null && !name.trim().isEmpty()
                && email != null && !email.trim().isEmpty()
                && message != null && !message.trim().isEmpty();

        req.setAttribute("submitted", valid);
        req.getRequestDispatcher("/WEB-INF/views/contact.jsp").forward(req, resp);
    }
}

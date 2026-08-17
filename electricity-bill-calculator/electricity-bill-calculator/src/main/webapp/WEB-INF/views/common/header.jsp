<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%--
  Shared header include.
  Expects an optional request attribute "activePage" (e.g. "home",
  "calculator", "history", "about", "contact") to highlight the current
  nav link, and an optional "pageTitle".
--%>
<%
    String activePage = (String) request.getAttribute("activePage");
    if (activePage == null) activePage = "";
    String pageTitle = (String) request.getAttribute("pageTitle");
    if (pageTitle == null) pageTitle = "Electricity Bill Calculator";
    String ctx = request.getContextPath();
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= pageTitle %> | Voltage</title>
    <meta name="description" content="A modern, slab-wise electricity bill calculator built with Java Servlets and JSP.">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">

    <!-- App styles -->
    <link rel="stylesheet" href="<%= ctx %>/css/style.css">

    <!-- Favicon (inline SVG lightning bolt) -->
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffb800'%3E%3Cpath d='M13 2 3 14h7l-1 8 10-12h-7l1-8z'/%3E%3C/svg%3E">
</head>
<body data-theme="light">

<!-- Loading Overlay -->
<div id="loadingOverlay">
    <div class="spinner-volt" role="status" aria-label="Loading"></div>
</div>

<!-- Toast Container -->
<div id="toastContainer" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 2100;"></div>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-volt sticky-top">
    <div class="container">
        <a class="navbar-brand" href="<%= ctx %>/">
            <i class="bi bi-lightning-charge-fill"></i> Voltage
        </a>
        <button class="navbar-toggler border-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
            <i class="bi bi-list" style="font-size:1.6rem;color:#fff;"></i>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav mx-auto mt-2 mt-lg-0">
                <li class="nav-item"><a class="nav-link <%= "home".equals(activePage) ? "active" : "" %>" href="<%= ctx %>/">Home</a></li>
                <li class="nav-item"><a class="nav-link <%= "calculator".equals(activePage) ? "active" : "" %>" href="<%= ctx %>/calculator">Calculator</a></li>
                <li class="nav-item"><a class="nav-link <%= "history".equals(activePage) ? "active" : "" %>" href="<%= ctx %>/history">History</a></li>
                <li class="nav-item"><a class="nav-link <%= "about".equals(activePage) ? "active" : "" %>" href="<%= ctx %>/about">About</a></li>
                <li class="nav-item"><a class="nav-link <%= "contact".equals(activePage) ? "active" : "" %>" href="<%= ctx %>/contact">Contact</a></li>
            </ul>
            <div class="d-flex align-items-center gap-2 mt-3 mt-lg-0">
                <button id="themeToggle" class="theme-toggle-btn" type="button" title="Toggle dark mode">
                    <i id="themeIcon" class="bi bi-moon-stars-fill"></i>
                </button>
                <a href="<%= ctx %>/calculator" class="btn btn-spark btn-sm">
                    <i class="bi bi-calculator me-1"></i> Calculate Bill
                </a>
            </div>
        </div>
    </div>
</nav>

<main>

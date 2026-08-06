<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page isErrorPage="true" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Error — ElectroBill</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
    <link href="${pageContext.request.contextPath}/css/style.css" rel="stylesheet" />
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark glass-nav sticky-top">
    <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="${pageContext.request.contextPath}/">
            <div class="brand-icon"><i class="bi bi-lightning-charge-fill"></i></div>
            <span class="brand-name">ElectroBill</span>
        </a>
    </div>
</nav>

<section class="d-flex align-items-center justify-content-center" style="min-height: 80vh;">
    <div class="text-center animate-fadeIn">
        <div class="empty-state-icon" style="font-size: 5rem; color: var(--color-danger);">
            <i class="bi bi-exclamation-triangle-fill"></i>
        </div>
        <h1 class="hero-title mt-3" style="font-size: 4rem;">
            <%
                Integer statusCode = (Integer) request.getAttribute("jakarta.servlet.error.status_code");
                out.print(statusCode != null ? statusCode : "Error");
            %>
        </h1>
        <h2 class="mb-3">
            <%
                if (statusCode != null && statusCode == 404) { out.print("Page Not Found"); }
                else { out.print("Something Went Wrong"); }
            %>
        </h2>
        <p class="text-muted mb-4">
            The page you are looking for doesn't exist or an internal error occurred.
        </p>
        <a href="${pageContext.request.contextPath}/" class="btn btn-calculate px-5">
            <i class="bi bi-house-fill me-2"></i>Go Home
        </a>
    </div>
</section>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${pageContext.request.contextPath}/js/script.js"></script>
</body>
</html>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<header class="navbar">
    <div class="container nav-container">
        <a href="${pageContext.request.contextPath}/home" class="brand-logo">
            <div class="brand-icon-box">⚡</div>
            <span>ENERGY LEDGER</span>
        </a>

        <ul class="nav-links" id="navLinks">
            <li><a href="${pageContext.request.contextPath}/home" class="nav-link ${activePage == 'home' ? 'active' : ''}">Home</a></li>
            <li><a href="${pageContext.request.contextPath}/calculator" class="nav-link ${activePage == 'calculator' ? 'active' : ''}">Calculator</a></li>
            <li><a href="${pageContext.request.contextPath}/history" class="nav-link ${activePage == 'history' ? 'active' : ''}">History</a></li>
            <li><a href="${pageContext.request.contextPath}/tariff" class="nav-link ${activePage == 'tariff' ? 'active' : ''}">Tariff</a></li>
            <li><a href="${pageContext.request.contextPath}/about" class="nav-link ${activePage == 'about' ? 'active' : ''}">About</a></li>
        </ul>

        <div class="nav-actions">
            <button type="button" class="theme-toggle-btn" id="themeToggleBtn" aria-label="Toggle Theme">
                <span id="themeIcon">🌙</span>
            </button>
            <a href="${pageContext.request.contextPath}/calculator" class="btn btn-primary btn-sm">Calculate Bill</a>
            <button type="button" class="mobile-toggle-btn" id="mobileMenuToggle" aria-label="Toggle Menu">☰</button>
        </div>
    </div>
</header>

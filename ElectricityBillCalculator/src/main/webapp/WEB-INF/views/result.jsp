<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Your electricity bill calculation result with slab-wise breakdown." />
    <title>Bill Result — ElectroBill</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <link href="${pageContext.request.contextPath}/css/style.css" rel="stylesheet" />
</head>
<body>

<!-- ═══════════════════════════════════════
     NAVBAR
════════════════════════════════════════ -->
<nav class="navbar navbar-expand-lg navbar-dark glass-nav sticky-top">
    <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="${pageContext.request.contextPath}/">
            <div class="brand-icon"><i class="bi bi-lightning-charge-fill"></i></div>
            <span class="brand-name">ElectroBill</span>
        </a>
        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto align-items-center gap-1">
                <li class="nav-item">
                    <a class="nav-link" href="${pageContext.request.contextPath}/">
                        <i class="bi bi-house-fill me-1"></i>Calculator
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="${pageContext.request.contextPath}/history">
                        <i class="bi bi-clock-history me-1"></i>History
                    </a>
                </li>
                <li class="nav-item ms-lg-2">
                    <button id="darkModeToggle" class="btn btn-outline-light btn-sm rounded-pill px-3">
                        <i class="bi bi-moon-fill" id="darkModeIcon"></i>
                    </button>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- ═══════════════════════════════════════
     RESULT PAGE
════════════════════════════════════════ -->
<section class="result-section py-5">
    <div class="container">

        <c:choose>
            <c:when test="${not empty bill}">

                <!-- ── Success Banner ──────────────────────────────── -->
                <div class="text-center mb-5 animate-fadeInDown">
                    <div class="result-success-icon">
                        <i class="bi bi-check-circle-fill"></i>
                    </div>
                    <h1 class="result-page-title">Bill Calculated Successfully!</h1>
                    <p class="result-page-subtitle">
                        <c:if test="${not empty bill.billNumber}">
                            Bill No: <strong class="text-primary">${bill.billNumber}</strong> &nbsp;|&nbsp;
                        </c:if>
                        Saved to database on ${bill.formattedDate}
                    </p>
                </div>

                <div class="row g-4 justify-content-center">

                    <!-- ── Customer Info Card ─────────────────────── -->
                    <div class="col-lg-5 animate-fadeInLeft">
                        <div class="result-card glass-card h-100">
                            <div class="result-card-header">
                                <i class="bi bi-person-badge-fill me-2"></i>
                                Customer Information
                            </div>
                            <div class="result-card-body">
                                <div class="info-row">
                                    <span class="info-label"><i class="bi bi-person-fill"></i> Name</span>
                                    <span class="info-value">${bill.customerName}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label"><i class="bi bi-hash"></i> Meter No.</span>
                                    <span class="info-value">${bill.customerNumber}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label"><i class="bi bi-speedometer2"></i> Units</span>
                                    <span class="info-value">${bill.units} kWh</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label"><i class="bi bi-calendar3"></i> Date</span>
                                    <span class="info-value">${bill.formattedDate}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label"><i class="bi bi-receipt"></i> Bill No.</span>
                                    <span class="info-value">
                                        <c:choose>
                                            <c:when test="${not empty bill.billNumber}">${bill.billNumber}</c:when>
                                            <c:otherwise>N/A</c:otherwise>
                                        </c:choose>
                                    </span>
                                </div>

                                <!-- Total Bill Amount -->
                                <div class="total-amount-box mt-4">
                                    <div class="total-label">Total Bill Amount</div>
                                    <div class="total-amount animate-countUp" data-target="${bill.billAmount}">
                                        ₹<span id="totalAmountDisplay">0.00</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ── Slab Breakdown Card ────────────────────── -->
                    <div class="col-lg-7 animate-fadeInRight">
                        <div class="result-card glass-card h-100">
                            <div class="result-card-header">
                                <i class="bi bi-bar-chart-fill me-2"></i>
                                Slab-wise Bill Breakdown
                            </div>
                            <div class="result-card-body">

                                <!-- Progress-bar style slab breakdown -->
                                <div class="slabs-container">

                                    <!-- Slab 1 -->
                                    <c:if test="${bill.slab1Units > 0}">
                                        <div class="slab-breakdown-row animate-slideIn" style="animation-delay:0.1s">
                                            <div class="slab-breakdown-header">
                                                <div class="d-flex align-items-center gap-2">
                                                    <span class="slab-circle s1">1</span>
                                                    <div>
                                                        <div class="slab-range">First 50 Units</div>
                                                        <div class="slab-formula">
                                                            <fmt:formatNumber value="${bill.slab1Units}" pattern="#.##"/> units × ₹3.50
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="slab-amount s1-text">
                                                    ₹<fmt:formatNumber value="${bill.slab1Amount}" pattern="#,##0.00"/>
                                                </div>
                                            </div>
                                            <div class="progress slab-progress">
                                                <div class="progress-bar bg-slab1"
                                                     style="width: ${(bill.slab1Amount / bill.billAmount) * 100}%">
                                                </div>
                                            </div>
                                        </div>
                                    </c:if>

                                    <!-- Slab 2 -->
                                    <c:if test="${bill.slab2Units > 0}">
                                        <div class="slab-breakdown-row animate-slideIn" style="animation-delay:0.2s">
                                            <div class="slab-breakdown-header">
                                                <div class="d-flex align-items-center gap-2">
                                                    <span class="slab-circle s2">2</span>
                                                    <div>
                                                        <div class="slab-range">Next 100 Units (51–150)</div>
                                                        <div class="slab-formula">
                                                            <fmt:formatNumber value="${bill.slab2Units}" pattern="#.##"/> units × ₹4.00
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="slab-amount s2-text">
                                                    ₹<fmt:formatNumber value="${bill.slab2Amount}" pattern="#,##0.00"/>
                                                </div>
                                            </div>
                                            <div class="progress slab-progress">
                                                <div class="progress-bar bg-slab2"
                                                     style="width: ${(bill.slab2Amount / bill.billAmount) * 100}%">
                                                </div>
                                            </div>
                                        </div>
                                    </c:if>

                                    <!-- Slab 3 -->
                                    <c:if test="${bill.slab3Units > 0}">
                                        <div class="slab-breakdown-row animate-slideIn" style="animation-delay:0.3s">
                                            <div class="slab-breakdown-header">
                                                <div class="d-flex align-items-center gap-2">
                                                    <span class="slab-circle s3">3</span>
                                                    <div>
                                                        <div class="slab-range">Next 100 Units (151–250)</div>
                                                        <div class="slab-formula">
                                                            <fmt:formatNumber value="${bill.slab3Units}" pattern="#.##"/> units × ₹5.20
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="slab-amount s3-text">
                                                    ₹<fmt:formatNumber value="${bill.slab3Amount}" pattern="#,##0.00"/>
                                                </div>
                                            </div>
                                            <div class="progress slab-progress">
                                                <div class="progress-bar bg-slab3"
                                                     style="width: ${(bill.slab3Amount / bill.billAmount) * 100}%">
                                                </div>
                                            </div>
                                        </div>
                                    </c:if>

                                    <!-- Slab 4 -->
                                    <c:if test="${bill.slab4Units > 0}">
                                        <div class="slab-breakdown-row animate-slideIn" style="animation-delay:0.4s">
                                            <div class="slab-breakdown-header">
                                                <div class="d-flex align-items-center gap-2">
                                                    <span class="slab-circle s4">4</span>
                                                    <div>
                                                        <div class="slab-range">Above 250 Units</div>
                                                        <div class="slab-formula">
                                                            <fmt:formatNumber value="${bill.slab4Units}" pattern="#.##"/> units × ₹6.50
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="slab-amount s4-text">
                                                    ₹<fmt:formatNumber value="${bill.slab4Amount}" pattern="#,##0.00"/>
                                                </div>
                                            </div>
                                            <div class="progress slab-progress">
                                                <div class="progress-bar bg-slab4"
                                                     style="width: ${(bill.slab4Amount / bill.billAmount) * 100}%">
                                                </div>
                                            </div>
                                        </div>
                                    </c:if>

                                </div>

                                <!-- Grand Total -->
                                <div class="grand-total-row">
                                    <span class="grand-label">
                                        <i class="bi bi-receipt-cutoff me-2"></i>Grand Total
                                    </span>
                                    <span class="grand-amount">
                                        ₹<fmt:formatNumber value="${bill.billAmount}" pattern="#,##0.00"/>
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>

                <!-- ── Action Buttons ──────────────────────────────── -->
                <div class="d-flex justify-content-center gap-3 mt-5 flex-wrap animate-fadeInUp">
                    <a href="${pageContext.request.contextPath}/"
                       class="btn btn-calculate px-5">
                        <i class="bi bi-plus-circle-fill me-2"></i>New Calculation
                    </a>
                    <a href="${pageContext.request.contextPath}/history"
                       class="btn btn-outline-primary-custom px-5">
                        <i class="bi bi-clock-history me-2"></i>View History
                    </a>
                    <button onclick="window.print()" class="btn btn-outline-secondary-custom px-5">
                        <i class="bi bi-printer-fill me-2"></i>Print Bill
                    </button>
                </div>

            </c:when>
            <c:otherwise>
                <!-- No Bill data -->
                <div class="text-center py-5">
                    <div class="empty-state-icon"><i class="bi bi-exclamation-triangle-fill"></i></div>
                    <h2 class="mt-3">No bill data found</h2>
                    <p class="text-muted">Please calculate a bill first.</p>
                    <a href="${pageContext.request.contextPath}/" class="btn btn-calculate mt-3">
                        <i class="bi bi-arrow-left me-2"></i>Go to Calculator
                    </a>
                </div>
            </c:otherwise>
        </c:choose>

    </div>
</section>

<!-- Footer -->
<footer class="site-footer mt-auto">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-6">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-lightning-charge-fill footer-logo-icon"></i>
                    <span class="footer-brand">ElectroBill</span>
                </div>
                <p class="footer-tagline">Smart electricity bill management</p>
            </div>
            <div class="col-md-6 text-md-end">
                <p class="footer-copy">
                    &copy; 2026 ElectroBill. Built with
                    <i class="bi bi-heart-fill text-danger mx-1"></i>
                    using Java Servlet &amp; JSP
                </p>
            </div>
        </div>
    </div>
</footer>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="${pageContext.request.contextPath}/js/script.js"></script>

<script>
// Animate total amount counter on result page
$(document).ready(function () {
    var target = parseFloat('${bill.billAmount}') || 0;
    animateCounter($('#totalAmountDisplay'), 0, target, 1200);
});
</script>

</body>
</html>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Calculate your electricity bill instantly with slab-wise rate breakdown. Fast, accurate and free." />
    <meta name="keywords" content="electricity bill calculator, power bill, unit calculator" />
    <title>ElectroBill — Smart Electricity Bill Calculator</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" />
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <!-- Custom CSS -->
    <link href="${pageContext.request.contextPath}/css/style.css" rel="stylesheet" />
</head>
<body>

<!-- ═══════════════════════════════════════════════════
     NAVBAR
════════════════════════════════════════════════════ -->
<nav class="navbar navbar-expand-lg navbar-dark glass-nav sticky-top">
    <div class="container">
        <a class="navbar-brand d-flex align-items-center gap-2" href="${pageContext.request.contextPath}/">
            <div class="brand-icon">
                <i class="bi bi-lightning-charge-fill"></i>
            </div>
            <span class="brand-name">ElectroBill</span>
        </a>

        <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarNav" aria-controls="navbarNav"
                aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto align-items-center gap-1">
                <li class="nav-item">
                    <a class="nav-link active" href="${pageContext.request.contextPath}/">
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

<!-- ═══════════════════════════════════════════════════
     HERO SECTION
════════════════════════════════════════════════════ -->
<section class="hero-section">
    <div class="hero-bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
    </div>
    <div class="container position-relative">
        <div class="row align-items-center min-vh-screen">
            <div class="col-lg-6 mb-5 mb-lg-0 animate-fadeInLeft">
                <div class="hero-badge mb-3">
                    <i class="bi bi-lightning-charge-fill me-2"></i>
                    Smart Bill Calculator
                </div>
                <h1 class="hero-title">
                    Calculate Your<br/>
                    <span class="gradient-text">Electricity Bill</span><br/>
                    Instantly
                </h1>
                <p class="hero-subtitle">
                    Get accurate slab-wise electricity bill breakdown in seconds.
                    Track your consumption history and manage your energy costs smarter.
                </p>
                <div class="hero-stats d-flex gap-4 mt-4 flex-wrap">
                    <div class="stat-item">
                        <div class="stat-number" id="counterBills"><c:out value="${totalBillsCount}"/></div>
                        <div class="stat-label">Bills Calculated</div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <div class="stat-number">4</div>
                        <div class="stat-label">Rate Slabs</div>
                    </div>
                    <div class="stat-divider"></div>
                    <div class="stat-item">
                        <div class="stat-number">100%</div>
                        <div class="stat-label">Accurate</div>
                    </div>
                </div>
            </div>

            <!-- ── Calculator Card ──────────────────────────── -->
            <div class="col-lg-6 animate-fadeInRight">
                <div class="calculator-card glass-card">
                    <div class="card-header-custom">
                        <div class="d-flex align-items-center gap-3">
                            <div class="card-icon">
                                <i class="bi bi-calculator-fill"></i>
                            </div>
                            <div>
                                <h2 class="card-title-main mb-0">Bill Calculator</h2>
                                <p class="card-subtitle-main mb-0">Fill in your details below</p>
                            </div>
                        </div>
                        <div class="slab-indicator">
                            <span class="slab-dot s1" title="Slab 1: ₹3.50"></span>
                            <span class="slab-dot s2" title="Slab 2: ₹4.00"></span>
                            <span class="slab-dot s3" title="Slab 3: ₹5.20"></span>
                            <span class="slab-dot s4" title="Slab 4: ₹6.50"></span>
                        </div>
                    </div>

                    <!-- Error Alert (from session) -->
                    <c:if test="${not empty sessionScope.errorMessage}">
                        <div class="alert alert-danger alert-dismissible fade show mx-3 mt-3" role="alert">
                            <i class="bi bi-exclamation-triangle-fill me-2"></i>
                            ${sessionScope.errorMessage}
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                        <c:remove var="errorMessage" scope="session"/>
                    </c:if>

                    <!-- Calculation Form -->
                    <form id="billForm" action="${pageContext.request.contextPath}/calculate"
                          method="post" novalidate class="p-4">

                        <!-- Customer Name -->
                        <div class="mb-4 form-group-custom">
                            <label for="customerName" class="form-label-custom">
                                <i class="bi bi-person-fill"></i> Customer Name
                            </label>
                            <input type="text"
                                   id="customerName"
                                   name="customerName"
                                   class="form-control form-control-custom"
                                   placeholder="e.g. Aarav Sharma"
                                   maxlength="100"
                                   autocomplete="name"
                                   required />
                            <div class="invalid-feedback-custom" id="nameError"></div>
                        </div>

                        <!-- Customer Number -->
                        <div class="mb-4 form-group-custom">
                            <label for="customerNumber" class="form-label-custom">
                                <i class="bi bi-hash"></i> Customer / Meter Number
                            </label>
                            <input type="text"
                                   id="customerNumber"
                                   name="customerNumber"
                                   class="form-control form-control-custom"
                                   placeholder="e.g. CUST-1001"
                                   maxlength="50"
                                   autocomplete="off"
                                   required />
                            <div class="invalid-feedback-custom" id="numberError"></div>
                        </div>

                        <!-- Units Consumed -->
                        <div class="mb-4 form-group-custom">
                            <label for="units" class="form-label-custom">
                                <i class="bi bi-speedometer2"></i> Units Consumed (kWh)
                            </label>
                            <div class="input-group-custom">
                                <input type="number"
                                       id="units"
                                       name="units"
                                       class="form-control form-control-custom"
                                       placeholder="e.g. 320"
                                       min="0"
                                       step="0.01"
                                       required />
                                <span class="input-addon">kWh</span>
                            </div>
                            <div class="invalid-feedback-custom" id="unitsError"></div>
                            <!-- Live preview -->
                            <div id="livePreview" class="live-preview d-none mt-2">
                                Estimated: <strong id="liveAmount">₹0.00</strong>
                            </div>
                        </div>

                        <!-- Billing Month -->
                        <div class="mb-4 form-group-custom">
                            <label for="billMonth" class="form-label-custom">
                                <i class="bi bi-calendar-event"></i> Billing Month
                            </label>
                            <select id="billMonth" name="billMonth" class="form-select form-control-custom" required>
                                <option value="">Select month</option>
                                <option value="2026-07">July 2026</option>
                                <option value="2026-08">August 2026</option>
                                <option value="2026-09">September 2026</option>
                                <option value="2026-10">October 2026</option>
                            </select>
                            <div class="invalid-feedback-custom" id="monthError"></div>
                        </div>

                        <!-- Slab Rate Info -->
                        <div class="slab-info-box mb-4">
                            <div class="slab-info-title">
                                <i class="bi bi-info-circle-fill me-1"></i> Applicable Rate Slabs
                            </div>
                            <div class="slab-rates">
                                <div class="slab-rate-item">
                                    <span class="slab-badge s1">0–50</span>
                                    <span>₹3.50/unit</span>
                                </div>
                                <div class="slab-rate-item">
                                    <span class="slab-badge s2">51–150</span>
                                    <span>₹4.00/unit</span>
                                </div>
                                <div class="slab-rate-item">
                                    <span class="slab-badge s3">151–250</span>
                                    <span>₹5.20/unit</span>
                                </div>
                                <div class="slab-rate-item">
                                    <span class="slab-badge s4">250+</span>
                                    <span>₹6.50/unit</span>
                                </div>
                            </div>
                        </div>

                        <!-- Buttons -->
                        <div class="d-grid gap-3">
                            <button type="submit" id="calculateBtn" class="btn btn-calculate">
                                <span class="btn-text">
                                    <i class="bi bi-lightning-charge-fill me-2"></i>
                                    Calculate Bill
                                </span>
                                <span class="btn-spinner d-none">
                                    <span class="spinner-border spinner-border-sm me-2"></span>
                                    Calculating...
                                </span>
                            </button>
                            <button type="reset" id="resetBtn" class="btn btn-reset">
                                <i class="bi bi-arrow-counterclockwise me-2"></i>
                                Reset Form
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ═══════════════════════════════════════════════════
     FEATURES SECTION
════════════════════════════════════════════════════ -->
<section class="features-section py-5">
    <div class="container">
        <div class="text-center mb-5">
            <h2 class="section-title">Why Use ElectroBill?</h2>
            <p class="section-subtitle">Everything you need for electricity bill management</p>
        </div>
        <div class="row g-4">
            <div class="col-md-4 animate-fadeUp">
                <div class="feature-card">
                    <div class="feature-icon-wrap icon-blue">
                        <i class="bi bi-lightning-fill"></i>
                    </div>
                    <h3 class="feature-title">Instant Calculation</h3>
                    <p class="feature-desc">Get your accurate electricity bill calculated in milliseconds with proper slab-wise breakdown.</p>
                </div>
            </div>
            <div class="col-md-4 animate-fadeUp" style="animation-delay: 0.1s">
                <div class="feature-card">
                    <div class="feature-icon-wrap icon-purple">
                        <i class="bi bi-database-fill"></i>
                    </div>
                    <h3 class="feature-title">History Tracking</h3>
                    <p class="feature-desc">All calculations are automatically saved to our database for your future reference and comparison.</p>
                </div>
            </div>
            <div class="col-md-4 animate-fadeUp" style="animation-delay: 0.2s">
                <div class="feature-card">
                    <div class="feature-icon-wrap icon-green">
                        <i class="bi bi-shield-check-fill"></i>
                    </div>
                    <h3 class="feature-title">100% Accurate</h3>
                    <p class="feature-desc">Based on official government slab rates with precise calculations — no rounding errors.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- ═══════════════════════════════════════════════════
     FOOTER
════════════════════════════════════════════════════ -->
<footer class="site-footer">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-4 mb-3 mb-md-0">
                <div class="d-flex align-items-center gap-2">
                    <i class="bi bi-lightning-charge-fill footer-logo-icon"></i>
                    <span class="footer-brand">ElectroBill</span>
                </div>
                <p class="footer-tagline">Smart electricity bill management</p>
            </div>
            <div class="col-md-4 text-center mb-3 mb-md-0">
                <div class="footer-links">
                    <a href="${pageContext.request.contextPath}/">Calculator</a>
                    <a href="${pageContext.request.contextPath}/history">History</a>
                </div>
            </div>
            <div class="col-md-4 text-md-end">
                <p class="footer-copy">
                    &copy; 2026 ElectroBill. Built with
                    <i class="bi bi-heart-fill text-danger mx-1"></i>
                    using Java Servlet &amp; JSP
                </p>
                <div class="tech-badges">
                    <span class="tech-badge">Java</span>
                    <span class="tech-badge">MySQL</span>
                    <span class="tech-badge">Bootstrap 5</span>
                </div>
            </div>
        </div>
    </div>
</footer>

<!-- Toast Notification -->
<div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div id="successToast" class="toast align-items-center text-white border-0" role="alert">
        <div class="d-flex">
            <div class="toast-body" id="toastMessage">
                <i class="bi bi-check-circle-fill me-2"></i> Action completed successfully!
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto"
                    data-bs-dismiss="toast"></button>
        </div>
    </div>
</div>

<!-- Bootstrap 5 JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<!-- Custom JS -->
<script src="${pageContext.request.contextPath}/js/script.js"></script>

</body>
</html>

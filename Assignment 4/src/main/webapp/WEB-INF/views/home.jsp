<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<jsp:include page="common/header.jsp">
    <jsp:param name="title" value="Energy Ledger — Simple & Accurate Electricity Billing" />
</jsp:include>
<jsp:include page="common/navbar.jsp" />

<main class="main-content">
    
    <!-- Hero Section -->
    <section class="hero-section" style="padding: 3rem 0 2rem 0;">
        <div class="container" style="text-align: center; max-width: 800px;">
            <span class="badge badge-amber" style="margin-bottom: 1rem;">⚡ Smart Utility Calculator</span>
            <h1 class="hero-title" style="font-size: 2.75rem; margin-bottom: 1rem;">
                Calculate Your Electricity Bill <span>Accurately &amp; Instantly</span>
            </h1>
            <p class="hero-subtitle" style="margin: 0 auto 2rem auto; font-size: 1.1rem; color: var(--text-muted);">
                Transparent progressive slab calculation according to official domestic tariff rates. Enter your meter readings to get a complete breakdown.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="${pageContext.request.contextPath}/calculator" class="btn btn-primary btn-lg">
                    ⚡ Calculate Bill Now
                </a>
                <a href="${pageContext.request.contextPath}/tariff" class="btn btn-secondary btn-lg">
                    View Tariff Rates
                </a>
            </div>
        </div>
    </section>

    <!-- Quick Stats -->
    <section class="container" style="margin-top: 1rem;">
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-box-value">${stats.totalBillsCount}</div>
                <div class="stat-box-label">Bills Generated</div>
            </div>
            <div class="stat-box">
                <div class="stat-box-value">
                    <fmt:formatNumber value="${stats.totalUnitsBilled}" pattern="#,##0" /> <span style="font-size: 0.9rem; font-weight: 500;">kWh</span>
                </div>
                <div class="stat-box-label">Total Units Calculated</div>
            </div>
            <div class="stat-box">
                <div class="stat-box-value">
                    ₹<fmt:formatNumber value="${stats.totalRevenue}" pattern="#,##0.00" />
                </div>
                <div class="stat-box-label">Total Billed Amount</div>
            </div>
            <div class="stat-box">
                <div class="stat-box-value">
                    ₹<fmt:formatNumber value="${stats.averageBillAmount}" pattern="#,##0.00" />
                </div>
                <div class="stat-box-label">Average Bill</div>
            </div>
        </div>
    </section>

    <!-- Tariff Rates Summary -->
    <section class="container" style="margin-top: 2.5rem;">
        <div style="text-align: center; margin-bottom: 1.5rem;">
            <h2 style="font-size: 1.75rem;">Official Electricity Tariff Slabs</h2>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Progressive rates are charged step-by-step for each slab bracket.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem;">
            <div class="card" style="border-left: 4px solid var(--slab-1-color);">
                <span class="badge badge-emerald">Slab 1</span>
                <h3 style="font-size: 1.15rem; margin: 0.5rem 0;">First 50 units</h3>
                <div style="font-size: 1.6rem; font-weight: 800; color: var(--text-main);">₹3.50 <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ unit</span></div>
            </div>

            <div class="card" style="border-left: 4px solid var(--slab-2-color);">
                <span class="badge badge-blue">Slab 2</span>
                <h3 style="font-size: 1.15rem; margin: 0.5rem 0;">Next 100 units</h3>
                <div style="font-size: 1.6rem; font-weight: 800; color: var(--text-main);">₹4.00 <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ unit</span></div>
            </div>

            <div class="card" style="border-left: 4px solid var(--slab-3-color);">
                <span class="badge badge-amber">Slab 3</span>
                <h3 style="font-size: 1.15rem; margin: 0.5rem 0;">Next 100 units</h3>
                <div style="font-size: 1.6rem; font-weight: 800; color: var(--text-main);">₹5.20 <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ unit</span></div>
            </div>

            <div class="card" style="border-left: 4px solid var(--slab-4-color);">
                <span class="badge badge-rose">Slab 4</span>
                <h3 style="font-size: 1.15rem; margin: 0.5rem 0;">Above 250 units</h3>
                <div style="font-size: 1.6rem; font-weight: 800; color: var(--text-main);">₹6.50 <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ unit</span></div>
            </div>
        </div>
    </section>

    <!-- Recent Calculations -->
    <section class="container" style="margin-top: 3rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div>
                <h2 style="font-size: 1.5rem;">Recent Bill Calculations</h2>
            </div>
            <a href="${pageContext.request.contextPath}/history" class="btn btn-secondary btn-sm">View All History →</a>
        </div>

        <c:choose>
            <c:when test="${not empty recentBills}">
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Consumer No</th>
                                <th>Customer Name</th>
                                <th>Billing Month</th>
                                <th>Units Consumed</th>
                                <th>Total Amount</th>
                                <th style="text-align: right;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="b" items="${recentBills}">
                                <tr>
                                    <td><span class="badge badge-amber">${b.customer.consumerNumber}</span></td>
                                    <td style="font-weight: 600;">${b.customer.customerName}</td>
                                    <td>${b.billingMonth}</td>
                                    <td style="font-weight: 700;">
                                        <fmt:formatNumber value="${b.unitsConsumed}" pattern="#,##0" /> units
                                    </td>
                                    <td style="font-weight: 700; color: var(--text-main);">
                                        ₹<fmt:formatNumber value="${b.totalAmount}" pattern="#,##0.00" />
                                    </td>
                                    <td style="text-align: right;">
                                        <a href="${pageContext.request.contextPath}/bill-details?id=${b.id}" class="btn btn-secondary btn-sm">View</a>
                                    </td>
                                </tr>
                            </c:forEach>
                        </tbody>
                    </table>
                </div>
            </c:when>
            <c:otherwise>
                <div class="card" style="text-align: center; padding: 2.5rem 1rem;">
                    <p style="color: var(--text-muted); margin-bottom: 1rem;">No bills recorded yet.</p>
                    <a href="${pageContext.request.contextPath}/calculator" class="btn btn-primary btn-sm">Calculate Your First Bill</a>
                </div>
            </c:otherwise>
        </c:choose>
    </section>

</main>

<jsp:include page="common/footer.jsp" />

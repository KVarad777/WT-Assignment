<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<jsp:include page="common/header.jsp">
    <jsp:param name="title" value="Energy Ledger — Progressive Electricity Billing & Analytics" />
</jsp:include>
<jsp:include page="common/navbar.jsp" />

<main class="main-content">
    <!-- Hero Section -->
    <section class="hero-section">
        <div class="container">
            <div class="hero-grid">
                <div>
                    <div class="hero-eyebrow">
                        <span>⚡</span> Enterprise Tariff Billing
                    </div>
                    <h1 class="hero-title">
                        Electricity, calculated with <span>mathematical precision.</span>
                    </h1>
                    <p class="hero-subtitle">
                        Experience transparent progressive slab billing. Accurate energy calculation according to official multi-tier tariff rates with real-time analytics and persistence.
                    </p>
                    <div class="hero-ctas">
                        <a href="${pageContext.request.contextPath}/calculator" class="btn btn-primary btn-lg">
                            Calculate Your Bill →
                        </a>
                        <a href="${pageContext.request.contextPath}/tariff" class="btn btn-secondary btn-lg">
                            View Tariff Schedule
                        </a>
                    </div>
                </div>

                <!-- Floating Live Interactive Statement Card -->
                <div>
                    <div class="statement-card">
                        <div class="statement-header">
                            <div>
                                <span class="badge badge-amber">Sample Statement</span>
                                <h3 style="margin-top: 0.5rem; font-size: 1.15rem;">Domestic Energy Account</h3>
                            </div>
                            <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">ELC-10042</span>
                        </div>

                        <div style="margin-bottom: 1.5rem;">
                            <div class="statement-title">Billed Consumption</div>
                            <div class="statement-amount-hero">300 <span style="font-size: 1.25rem; font-weight: 500; color: var(--text-muted);">units</span></div>
                        </div>

                        <!-- Mini Segmented Meter Bar -->
                        <div class="meter-container" style="margin: 1rem 0;">
                            <div class="meter-track">
                                <div class="meter-segment meter-segment-1" style="width: 16.6%;"></div>
                                <div class="meter-segment meter-segment-2" style="width: 33.3%;"></div>
                                <div class="meter-segment meter-segment-3" style="width: 33.3%;"></div>
                                <div class="meter-segment meter-segment-4" style="width: 16.6%;"></div>
                            </div>
                        </div>

                        <div class="statement-metric-grid">
                            <div class="statement-metric-item">
                                <small>Total Energy Charge</small>
                                <strong>₹1,420.00</strong>
                            </div>
                            <div class="statement-metric-item">
                                <small>Effective Average Rate</small>
                                <strong>₹4.73 / unit</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Statistics Grid -->
    <section class="container">
        <div class="stats-grid">
            <div class="stat-box">
                <div class="stat-box-icon">📊</div>
                <div class="stat-box-value">${stats.totalBillsCount}</div>
                <div class="stat-box-label">Bills Recorded</div>
            </div>
            <div class="stat-box">
                <div class="stat-box-icon">⚡</div>
                <div class="stat-box-value">
                    <fmt:formatNumber value="${stats.totalUnitsBilled}" pattern="#,##0" />
                </div>
                <div class="stat-box-label">Total Units Billed</div>
            </div>
            <div class="stat-box">
                <div class="stat-box-icon">💳</div>
                <div class="stat-box-value">
                    ₹<fmt:formatNumber value="${stats.totalRevenue}" pattern="#,##0.00" />
                </div>
                <div class="stat-box-label">Total Revenue Managed</div>
            </div>
            <div class="stat-box">
                <div class="stat-box-icon">📈</div>
                <div class="stat-box-value">
                    ₹<fmt:formatNumber value="${stats.averageBillAmount}" pattern="#,##0.00" />
                </div>
                <div class="stat-box-label">Average Statement</div>
            </div>
        </div>
    </section>

    <!-- Progressive Tariff Quick Reference -->
    <section class="container" style="margin-top: 2rem;">
        <div style="margin-bottom: 1.5rem;">
            <h2>Official Progressive Tariff Slabs</h2>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Multi-tier progressive calculation applied incrementally by slab brackets.</p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
            <div class="card" style="border-left: 4px solid var(--slab-1-color);">
                <span class="badge badge-emerald">Slab 01</span>
                <h3 style="font-size: 1.25rem; margin: 0.75rem 0 0.25rem 0;">First 50 units</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Lifeline base tier</p>
                <div style="font-size: 1.75rem; font-weight: 800; font-family: var(--font-heading);">₹3.50 <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ unit</span></div>
            </div>

            <div class="card" style="border-left: 4px solid var(--slab-2-color);">
                <span class="badge badge-blue">Slab 02</span>
                <h3 style="font-size: 1.25rem; margin: 0.75rem 0 0.25rem 0;">Next 100 units</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">51 to 150 units</p>
                <div style="font-size: 1.75rem; font-weight: 800; font-family: var(--font-heading);">₹4.00 <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ unit</span></div>
            </div>

            <div class="card" style="border-left: 4px solid var(--slab-3-color);">
                <span class="badge badge-amber">Slab 03</span>
                <h3 style="font-size: 1.25rem; margin: 0.75rem 0 0.25rem 0;">Next 100 units</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">151 to 250 units</p>
                <div style="font-size: 1.75rem; font-weight: 800; font-family: var(--font-heading);">₹5.20 <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ unit</span></div>
            </div>

            <div class="card" style="border-left: 4px solid var(--slab-4-color);">
                <span class="badge badge-rose">Slab 04</span>
                <h3 style="font-size: 1.25rem; margin: 0.75rem 0 0.25rem 0;">Above 250 units</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">Peak surcharge tier</p>
                <div style="font-size: 1.75rem; font-weight: 800; font-family: var(--font-heading);">₹6.50 <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ unit</span></div>
            </div>
        </div>
    </section>

    <!-- Recent Statements Table -->
    <section class="container" style="margin-top: 3.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
            <div>
                <h2>Recent Bill Calculations</h2>
                <p style="color: var(--text-muted); font-size: 0.95rem;">Recently generated utility statements from MySQL database.</p>
            </div>
            <a href="${pageContext.request.contextPath}/history" class="btn btn-secondary btn-sm">View All History →</a>
        </div>

        <c:choose>
            <c:when test="${not empty recentBills}">
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Bill ID</th>
                                <th>Consumer</th>
                                <th>Customer Name</th>
                                <th>Billing Month</th>
                                <th>Units Consumed</th>
                                <th>Total Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="b" items="${recentBills}">
                                <tr>
                                    <td style="font-family: var(--font-mono); font-weight: 600;">#${b.id}</td>
                                    <td><span class="badge badge-amber">${b.customer.consumerNumber}</span></td>
                                    <td style="font-weight: 600;">${b.customer.customerName}</td>
                                    <td>${b.billingMonth}</td>
                                    <td style="font-family: var(--font-mono); font-weight: 700;">
                                        <fmt:formatNumber value="${b.unitsConsumed}" pattern="#,##0.00" /> u
                                    </td>
                                    <td style="font-family: var(--font-mono); font-weight: 700; color: var(--text-main);">
                                        ₹<fmt:formatNumber value="${b.totalAmount}" pattern="#,##0.00" />
                                    </td>
                                    <td>
                                        <a href="${pageContext.request.contextPath}/bill-details?id=${b.id}" class="btn btn-secondary btn-sm">View Statement</a>
                                    </td>
                                </tr>
                            </c:forEach>
                        </tbody>
                    </table>
                </div>
            </c:when>
            <c:otherwise>
                <div class="card" style="text-align: center; padding: 3rem 1.5rem;">
                    <div style="font-size: 2.5rem; margin-bottom: 1rem;">📋</div>
                    <h3>No Bills Recorded Yet</h3>
                    <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Be the first to generate a progressive electricity statement.</p>
                    <a href="${pageContext.request.contextPath}/calculator" class="btn btn-primary">Calculate Bill Now</a>
                </div>
            </c:otherwise>
        </c:choose>
    </section>
</main>

<jsp:include page="common/footer.jsp" />

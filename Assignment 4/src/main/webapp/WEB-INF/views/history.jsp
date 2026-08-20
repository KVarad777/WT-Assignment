<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<jsp:include page="common/header.jsp">
    <jsp:param name="title" value="Statements History — Energy Ledger" />
</jsp:include>
<jsp:include page="common/navbar.jsp" />

<main class="main-content">
    <div class="container" style="padding-top: 2.5rem;">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <div>
                <span class="badge badge-amber">Database Audit Ledger</span>
                <h1 style="font-size: 2.25rem; margin-top: 0.5rem;">Utility Statements History</h1>
                <p style="color: var(--text-muted); font-size: 1rem;">Search, filter, and audit electricity bills recorded in the MySQL database.</p>
            </div>
            <div style="display: flex; gap: 0.75rem;">
                <a href="${pageContext.request.contextPath}/history?format=csv&search=${paramSearch != null ? paramSearch : ''}&month=${paramMonth != null ? paramMonth : ''}&sort=${paramSort != null ? paramSort : ''}" 
                   class="btn btn-secondary btn-sm">
                    📥 Export CSV
                </a>
                <a href="${pageContext.request.contextPath}/calculator" class="btn btn-primary btn-sm">
                    + New Calculation
                </a>
            </div>
        </div>

        <!-- Filter & Search Toolbar Card -->
        <div class="card" style="margin-bottom: 2rem; padding: 1.25rem;">
            <form action="${pageContext.request.contextPath}/history" method="GET" style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
                
                <!-- Search Input -->
                <div style="flex: 2; min-width: 220px;">
                    <input type="text" name="search" class="form-control" 
                           placeholder="Search customer name, consumer #..." 
                           value="${paramSearch != null ? paramSearch : ''}">
                </div>

                <!-- Month Filter -->
                <div style="flex: 1; min-width: 160px;">
                    <select name="month" class="form-control">
                        <option value="ALL">All Billing Months</option>
                        <c:forEach var="m" items="${distinctMonths}">
                            <option value="${m}" ${paramMonth == m ? 'selected' : ''}>${m}</option>
                        </c:forEach>
                    </select>
                </div>

                <!-- Sort Order -->
                <div style="flex: 1; min-width: 160px;">
                    <select name="sort" class="form-control">
                        <option value="newest" ${paramSort == 'newest' ? 'selected' : ''}>Newest First</option>
                        <option value="oldest" ${paramSort == 'oldest' ? 'selected' : ''}>Oldest First</option>
                        <option value="units_desc" ${paramSort == 'units_desc' ? 'selected' : ''}>Highest Units</option>
                        <option value="amount_desc" ${paramSort == 'amount_desc' ? 'selected' : ''}>Highest Amount</option>
                    </select>
                </div>

                <!-- Buttons -->
                <div style="display: flex; gap: 0.5rem;">
                    <button type="submit" class="btn btn-primary btn-sm">Filter</button>
                    <a href="${pageContext.request.contextPath}/history" class="btn btn-outline btn-sm">Reset</a>
                </div>
            </form>
        </div>

        <!-- Statements Table -->
        <c:choose>
            <c:when test="${not empty bills}">
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Bill ID</th>
                                <th>Consumer #</th>
                                <th>Customer Name</th>
                                <th>Month</th>
                                <th>Meter Readings (Prev → Curr)</th>
                                <th>Units Consumed</th>
                                <th>Tariff Tier</th>
                                <th>Total Amount</th>
                                <th>Created Date</th>
                                <th style="text-align: right;">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="b" items="${bills}">
                                <tr>
                                    <td style="font-family: var(--font-mono); font-weight: 700;">#${b.id}</td>
                                    <td><span class="badge badge-amber">${b.customer.consumerNumber}</span></td>
                                    <td style="font-weight: 600;">${b.customer.customerName}</td>
                                    <td>${b.billingMonth}</td>
                                    <td style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted);">
                                        <fmt:formatNumber value="${b.previousReading}" pattern="#,##0" /> → <fmt:formatNumber value="${b.currentReading}" pattern="#,##0" />
                                    </td>
                                    <td style="font-family: var(--font-mono); font-weight: 700;">
                                        <fmt:formatNumber value="${b.unitsConsumed}" pattern="#,##0.00" /> u
                                    </td>
                                    <td>
                                        <span class="badge ${b.unitsConsumed <= 50 ? 'badge-emerald' : (b.unitsConsumed <= 150 ? 'badge-blue' : (b.unitsConsumed <= 250 ? 'badge-amber' : 'badge-rose'))}">
                                            ${b.unitsConsumed <= 50 ? 'Lifeline' : (b.unitsConsumed <= 150 ? 'Moderate' : (b.unitsConsumed <= 250 ? 'High' : 'Surcharge'))}
                                        </span>
                                    </td>
                                    <td style="font-family: var(--font-mono); font-weight: 800; font-size: 1rem; color: var(--text-main);">
                                        ₹<fmt:formatNumber value="${b.totalAmount}" pattern="#,##0.00" />
                                    </td>
                                    <td style="font-size: 0.85rem; color: var(--text-muted);">
                                        <fmt:formatDate value="${b.createdAt}" pattern="dd MMM yyyy" />
                                    </td>
                                    <td style="text-align: right;">
                                        <div style="display: flex; gap: 0.35rem; justify-content: flex-end;">
                                            <a href="${pageContext.request.contextPath}/bill-details?id=${b.id}" class="btn btn-secondary btn-sm" title="View Statement">
                                                View
                                            </a>
                                            <form action="${pageContext.request.contextPath}/delete-bill" method="POST" onsubmit="return confirm('Are you sure you want to delete Bill Statement #${b.id}?');" style="display:inline;">
                                                <input type="hidden" name="id" value="${b.id}">
                                                <button type="submit" class="btn btn-danger-outline" title="Delete">🗑️</button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            </c:forEach>
                        </tbody>
                    </table>
                </div>
            </c:when>
            <c:otherwise>
                <div class="card" style="text-align: center; padding: 4rem 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
                    <h3>No Statements Found</h3>
                    <p style="color: var(--text-muted); margin-bottom: 1.5rem;">No bill records matched your active search and filter criteria.</p>
                    <a href="${pageContext.request.contextPath}/history" class="btn btn-secondary">Clear Filters</a>
                </div>
            </c:otherwise>
        </c:choose>

    </div>
</main>

<jsp:include page="common/footer.jsp" />

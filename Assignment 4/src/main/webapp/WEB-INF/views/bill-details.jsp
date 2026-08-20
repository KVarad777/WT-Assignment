<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<jsp:include page="common/header.jsp">
    <jsp:param name="title" value="Bill Statement #${bill.id} — Energy Ledger" />
</jsp:include>
<jsp:include page="common/navbar.jsp" />

<main class="main-content">
    <div class="container" style="padding-top: 2rem; max-width: 820px;">

        <!-- Top Action Bar -->
        <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <a href="${pageContext.request.contextPath}/history" class="btn btn-secondary btn-sm">
                ← Back to History
            </a>
            <button type="button" onclick="window.print();" class="btn btn-primary btn-sm">
                🖨️ Print Bill
            </button>
        </div>

        <!-- Clean Bill Statement Card -->
        <div class="card" style="padding: 2rem; border-radius: var(--radius-lg); box-shadow: var(--shadow-md);">
            
            <!-- Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid var(--border-subtle); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                <div>
                    <h2 style="font-size: 1.5rem; letter-spacing: -0.02em;">⚡ ENERGY LEDGER</h2>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Electricity Utility Bill Statement</p>
                </div>
                <div style="text-align: right;">
                    <span class="badge badge-amber">Bill #${bill.id}</span>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem;">
                        Month: <strong>${bill.billingMonth}</strong>
                    </div>
                </div>
            </div>

            <!-- Customer & Consumption Information Grid -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
                <div>
                    <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); margin-bottom: 0.25rem;">Customer Details</div>
                    <div style="font-size: 1.1rem; font-weight: 700;">${bill.customer.customerName}</div>
                    <div style="font-size: 0.9rem; color: var(--accent-amber); font-weight: 600; margin-top: 0.2rem;">Consumer No: ${bill.customer.consumerNumber}</div>
                    <c:if test="${not empty bill.customer.email}">
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.15rem;">${bill.customer.email}</div>
                    </c:if>
                </div>

                <div>
                    <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); margin-bottom: 0.25rem;">Meter Readings</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">
                        Prev: <strong><fmt:formatNumber value="${bill.previousReading}" pattern="#,##0.00" /></strong> | Curr: <strong><fmt:formatNumber value="${bill.currentReading}" pattern="#,##0.00" /></strong>
                    </div>
                    <div style="font-size: 1rem; font-weight: 700; color: var(--text-main); margin-top: 0.35rem;">
                        Units Consumed: <fmt:formatNumber value="${bill.unitsConsumed}" pattern="#,##0.00" /> kWh
                    </div>
                </div>
            </div>

            <!-- Progressive Slab Breakdown Table -->
            <div style="margin-bottom: 1.5rem;">
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Tariff Slab</th>
                                <th>Applicable Rate</th>
                                <th>Units Billed</th>
                                <th style="text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="item" items="${bill.breakdown.slabItems}">
                                <tr>
                                    <td><strong>${item.slabName}</strong></td>
                                    <td>₹<fmt:formatNumber value="${item.rate}" pattern="#,##0.00" /> / unit</td>
                                    <td><fmt:formatNumber value="${item.unitsInSlab}" pattern="#,##0.00" /> units</td>
                                    <td style="text-align: right; font-weight: 600;">
                                        ₹<fmt:formatNumber value="${item.amount}" pattern="#,##0.00" />
                                    </td>
                                </tr>
                            </c:forEach>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Total Amount Box -->
            <div style="background: var(--accent-amber-light); border: 1px solid var(--accent-amber); border-radius: var(--radius-md); padding: 1.25rem 1.5rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <div>
                    <span class="badge badge-emerald">${bill.breakdown.usageClassification}</span>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.35rem;">
                        Average Rate: ₹<fmt:formatNumber value="${bill.breakdown.effectiveAverageRate}" pattern="#,##0.00" /> / unit
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Total Amount Payable</div>
                    <div style="font-size: 2.25rem; font-weight: 800; color: var(--text-main);">
                        ₹<fmt:formatNumber value="${bill.totalAmount}" pattern="#,##0.00" />
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
                <div>Generated through Energy Ledger.</div>
                <div>Statement ID: <strong>ELC-BILL-${bill.id}</strong></div>
            </div>

        </div>

    </div>
</main>

<jsp:include page="common/footer.jsp" />

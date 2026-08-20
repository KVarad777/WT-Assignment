<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<jsp:include page="common/header.jsp">
    <jsp:param name="title" value="Bill Statement #${bill.id} — Energy Ledger" />
</jsp:include>
<jsp:include page="common/navbar.jsp" />

<main class="main-content">
    <div class="container" style="padding-top: 2rem;">

        <!-- Top Action Bar -->
        <div class="no-print" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
            <a href="${pageContext.request.contextPath}/history" class="btn btn-secondary btn-sm">
                ← Back to History
            </a>
            <div style="display: flex; gap: 0.75rem;">
                <button type="button" onclick="window.print();" class="btn btn-primary btn-sm">
                    🖨️ Print / Save as PDF
                </button>
            </div>
        </div>

        <!-- Official Printable Invoice Card -->
        <div class="invoice-card">
            
            <!-- Invoice Header -->
            <div class="invoice-header">
                <div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <div class="brand-icon-box" style="width: 32px; height: 32px; font-size: 0.9rem;">⚡</div>
                        <h2 style="font-size: 1.5rem; letter-spacing: -0.02em;">ENERGY LEDGER</h2>
                    </div>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">Electricity Utility Distribution &amp; Billing Authority</p>
                    <p style="font-size: 0.8rem; color: var(--text-subtle);">Official Progressive Tariff Statement</p>
                </div>

                <div class="invoice-bill-meta">
                    <span class="badge badge-amber" style="font-size: 0.8rem;">Statement #${bill.id}</span>
                    <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
                        Billing Period: <strong style="color: var(--text-main);">${bill.billingMonth}</strong>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-subtle); margin-top: 0.25rem;">
                        Generated: <fmt:formatDate value="${bill.createdAt}" pattern="dd MMM yyyy, hh:mm a" />
                    </div>
                </div>
            </div>

            <!-- Customer & Meter Details Grid -->
            <div class="invoice-customer-box">
                <div>
                    <small style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">
                        Consumer Information
                    </small>
                    <div style="font-size: 1.15rem; font-weight: 700; color: var(--text-main);">${bill.customer.customerName}</div>
                    <div style="margin-top: 0.25rem; font-size: 0.9rem;">
                        Consumer No: <strong style="font-family: var(--font-mono); color: var(--accent-amber);">${bill.customer.consumerNumber}</strong>
                    </div>
                    <c:if test="${not empty bill.customer.email}">
                        <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.2rem;">Email: ${bill.customer.email}</div>
                    </c:if>
                    <c:if test="${not empty bill.customer.phone}">
                        <div style="font-size: 0.85rem; color: var(--text-muted);">Phone: ${bill.customer.phone}</div>
                    </c:if>
                </div>

                <div>
                    <small style="text-transform: uppercase; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); display: block; margin-bottom: 0.4rem;">
                        Meter &amp; Consumption Details
                    </small>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.85rem; margin-bottom: 0.5rem;">
                        <div>
                            <span style="color: var(--text-muted);">Previous Reading:</span><br>
                            <strong style="font-family: var(--font-mono);"><fmt:formatNumber value="${bill.previousReading}" pattern="#,##0.00" /> kWh</strong>
                        </div>
                        <div>
                            <span style="color: var(--text-muted);">Current Reading:</span><br>
                            <strong style="font-family: var(--font-mono);"><fmt:formatNumber value="${bill.currentReading}" pattern="#,##0.00" /> kWh</strong>
                        </div>
                    </div>
                    <div style="padding-top: 0.4rem; border-top: 1px dashed var(--border-subtle); font-size: 0.9rem;">
                        Total Units Consumed: <strong style="font-family: var(--font-mono); color: var(--text-main); font-size: 1rem;"><fmt:formatNumber value="${bill.unitsConsumed}" pattern="#,##0.00" /> Units (kWh)</strong>
                    </div>
                    <c:if test="${not empty bill.customer.address}">
                        <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">Premises: ${bill.customer.address}</div>
                    </c:if>
                </div>
            </div>

            <!-- Total Amount Highlight -->
            <div class="invoice-total-highlight">
                <div>
                    <span class="badge ${bill.unitsConsumed <= 50 ? 'badge-emerald' : (bill.unitsConsumed <= 150 ? 'badge-blue' : (bill.unitsConsumed <= 250 ? 'badge-amber' : 'badge-rose'))}">
                        ${bill.breakdown.usageClassification}
                    </span>
                    <div style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">
                        Total Progressive Energy Charge
                    </div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.15rem;">
                        Effective Average Rate: <strong style="color: var(--text-main); font-family: var(--font-mono);">₹<fmt:formatNumber value="${bill.breakdown.effectiveAverageRate}" pattern="#,##0.00" /> / unit</strong>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); letter-spacing: 0.05em;">Total Payable</div>
                    <div style="font-size: 2.75rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-main); line-height: 1.1;">
                        ₹<fmt:formatNumber value="${bill.totalAmount}" pattern="#,##0.00" />
                    </div>
                </div>
            </div>

            <!-- Progressive Slab Breakdown Table -->
            <div style="margin-bottom: 2rem;">
                <h3 style="font-size: 1.15rem; margin-bottom: 0.75rem;">Progressive Tariff Slab Breakdown</h3>
                <div class="table-responsive">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Tariff Slab</th>
                                <th>Bracket Capacity</th>
                                <th>Applicable Rate</th>
                                <th>Billed Units</th>
                                <th style="text-align: right;">Amount (INR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <c:forEach var="item" items="${bill.breakdown.slabItems}">
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <span class="ladder-dot" style="background-color: ${item.slabOrder == 1 ? 'var(--slab-1-color)' : (item.slabOrder == 2 ? 'var(--slab-2-color)' : (item.slabOrder == 3 ? 'var(--slab-3-color)' : 'var(--slab-4-color)'))};"></span>
                                            <strong>${item.slabName}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <c:choose>
                                            <c:when test="${item.slabCapacity != null}">
                                                ${item.slabCapacity} units
                                            </c:when>
                                            <c:otherwise>
                                                Above 250 units (Unbounded)
                                            </c:otherwise>
                                        </c:choose>
                                    </td>
                                    <td style="font-family: var(--font-mono);">₹<fmt:formatNumber value="${item.rate}" pattern="#,##0.00" /> / unit</td>
                                    <td style="font-family: var(--font-mono); font-weight: 600;">
                                        <fmt:formatNumber value="${item.unitsInSlab}" pattern="#,##0.00" /> u
                                        <c:if test="${bill.unitsConsumed > 0}">
                                            <small style="color: var(--text-muted); margin-left: 0.25rem;">(${item.percentageOfTotalUnits}%)</small>
                                        </c:if>
                                    </td>
                                    <td style="text-align: right; font-family: var(--font-mono); font-weight: 700;">
                                        ₹<fmt:formatNumber value="${item.amount}" pattern="#,##0.00" />
                                    </td>
                                </tr>
                            </c:forEach>
                            <tr style="background: var(--bg-surface-elevated); font-weight: 700;">
                                <td colspan="3" style="text-align: right; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.05em;">Total Energy Charge:</td>
                                <td style="font-family: var(--font-mono);"><fmt:formatNumber value="${bill.unitsConsumed}" pattern="#,##0.00" /> u</td>
                                <td style="text-align: right; font-family: var(--font-mono); font-size: 1.1rem; color: var(--accent-amber);">
                                    ₹<fmt:formatNumber value="${bill.totalAmount}" pattern="#,##0.00" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Segmented Distribution Bar -->
            <div style="margin-bottom: 2rem;">
                <small style="display: block; font-weight: 700; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.5rem;">
                    Consumption Slab Distribution
                </small>
                <div class="meter-track" style="height: 16px;">
                    <c:forEach var="item" items="${bill.breakdown.slabItems}">
                        <div class="meter-segment" 
                             style="width: ${item.percentageOfTotalUnits}%; background-color: ${item.slabOrder == 1 ? 'var(--slab-1-color)' : (item.slabOrder == 2 ? 'var(--slab-2-color)' : (item.slabOrder == 3 ? 'var(--slab-3-color)' : 'var(--slab-4-color)'))};"
                             title="${item.slabName}: ${item.unitsInSlab} units (${item.percentageOfTotalUnits}%)"></div>
                    </c:forEach>
                </div>
            </div>

            <!-- Insights Card -->
            <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); padding: 1.25rem 1.5rem; border-radius: var(--radius-md);">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem;">
                    <span>💡</span>
                    <h4 style="font-size: 0.95rem;">Consumption Insight &amp; Analysis</h4>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-muted);">
                    ${bill.breakdown.usageInsight}
                </p>
            </div>

            <!-- Invoice Footer -->
            <div style="margin-top: 2.5rem; padding-top: 1.25rem; border-top: 1px solid var(--border-subtle); display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: var(--text-subtle);">
                <div>This is a computer-generated utility statement authenticated by the Energy Ledger Progressive Engine.</div>
                <div>Record ID: <strong>ELC-BILL-${bill.id}</strong></div>
            </div>

        </div>

    </div>
</main>

<jsp:include page="common/footer.jsp" />

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<% request.setAttribute("activePage", "calculator"); request.setAttribute("pageTitle", "Bill Result"); %>
<jsp:include page="common/header.jsp" />

<section class="section-pad" id="printArea">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-8">

                <div class="text-center mb-4 fade-in-up">
                    <span class="hero-eyebrow" style="background: rgba(67,56,202,0.1); border-color: rgba(67,56,202,0.25); color: var(--volt-indigo);">
                        <i class="bi bi-check-circle-fill"></i> Bill Generated Successfully
                    </span>
                </div>

                <div class="card-volt p-4 p-md-5">
                    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-4 pb-4" style="border-bottom: 1px dashed var(--card-border);">
                        <div>
                            <h4 class="mb-1"><i class="bi bi-lightning-charge-fill" style="color:var(--volt-amber);"></i> Electricity Bill</h4>
                            <div class="text-muted-custom small">Bill No: <strong>${bill.billNumber}</strong></div>
                        </div>
                        <div class="text-sm-end mt-3 mt-sm-0">
                            <div class="text-muted-custom small">Generated on</div>
                            <div class="fw-semibold">${bill.formattedBillDate}</div>
                        </div>
                    </div>

                    <div class="row g-4 mb-4">
                        <div class="col-sm-6">
                            <div class="form-label-volt mb-1">Customer Name</div>
                            <div class="fw-semibold fs-5">${bill.customerName}</div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-label-volt mb-1">Customer Number</div>
                            <div class="fw-semibold fs-5">${bill.customerNumber}</div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-label-volt mb-1">Units Consumed</div>
                            <div class="fw-semibold fs-5">${bill.unitsConsumed} kWh</div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-label-volt mb-1">Billing Status</div>
                            <div class="fw-semibold fs-5 text-success"><i class="bi bi-check-circle-fill"></i> Paid Reference Generated</div>
                        </div>
                    </div>

                    <h6 class="eyebrow-volt mb-3">Slab-wise Breakdown</h6>
                    <c:forEach var="slab" items="${bill.slabDetails}">
                        <c:set var="pct" value="${(slab.slabAmount / bill.totalAmount) * 100}" />
                        <div class="slab-row">
                            <div style="min-width: 150px;">
                                <div class="fw-semibold small">${slab.slabName}</div>
                                <div class="text-muted-custom" style="font-size:0.78rem;">${slab.unitsInSlab} units &times; Rs. <fmt:formatNumber value="${slab.ratePerUnit}" minFractionDigits="2" maxFractionDigits="2"/></div>
                            </div>
                            <div class="slab-bar-track">
                                <div class="slab-bar-fill" style="width: <fmt:formatNumber value='${pct}' maxFractionDigits='1'/>%;"></div>
                            </div>
                            <div class="fw-bold" style="min-width: 90px; text-align:right;">Rs. <fmt:formatNumber value="${slab.slabAmount}" minFractionDigits="2" maxFractionDigits="2"/></div>
                        </div>
                    </c:forEach>

                    <div class="total-banner d-flex justify-content-between align-items-center mt-4">
                        <div>
                            <div style="opacity:.85;font-size:.85rem;">Total Amount Payable</div>
                            <div class="fs-3 fw-bold">Rs. <fmt:formatNumber value="${bill.totalAmount}" minFractionDigits="2" maxFractionDigits="2"/></div>
                        </div>
                        <i class="bi bi-lightning-charge-fill" style="font-size:2.5rem; color: var(--volt-amber); opacity:.9;"></i>
                    </div>

                    <div class="d-flex flex-column flex-sm-row gap-3 mt-5 no-print">
                        <button type="button" class="btn btn-volt btn-lg flex-fill" onclick="window.print()">
                            <i class="bi bi-printer-fill me-2"></i>Print Bill
                        </button>
                        <a href="<%= request.getContextPath() %>/calculator" class="btn btn-outline-volt btn-lg flex-fill">
                            <i class="bi bi-arrow-left me-2"></i>Back to Calculator
                        </a>
                        <a href="<%= request.getContextPath() %>/history" class="btn btn-outline-volt btn-lg flex-fill">
                            <i class="bi bi-clock-history me-2"></i>View History
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<style>
    @media print {
        .navbar-volt, .footer-volt, .no-print, #loadingOverlay, #toastContainer { display: none !important; }
        body { background: #fff !important; }
        .card-volt { box-shadow: none !important; border: 1px solid #ccc !important; }
    }
</style>

<jsp:include page="common/footer.jsp" />

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<% request.setAttribute("activePage", "history"); request.setAttribute("pageTitle", "Bill History"); %>
<jsp:include page="common/header.jsp" />

<section class="hero-volt" style="padding: 3.5rem 0 5rem;">
    <div class="container">
        <div class="text-center">
            <span class="hero-eyebrow"><i class="bi bi-clock-history"></i> Bill History</span>
            <h1 class="mt-3 mb-2" style="font-size: clamp(1.9rem, 4vw, 2.8rem);">All generated bills</h1>
            <p class="lead mx-auto">Search, sort, print, or remove any previously generated bill.</p>
        </div>
    </div>
</section>

<section class="section-pad" style="margin-top: -4.5rem;">
    <div class="container">

        <%-- Server-rendered toast for post-delete redirects --%>
        <c:if test="${not empty param.deleted}">
            <div class="toast align-items-center text-bg-${param.deleted == 'true' or param.deleted == 'all' ? 'success' : 'danger'} border-0 position-fixed top-0 end-0 m-3"
                 style="z-index:2100;" data-autoshow="true" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <c:choose>
                            <c:when test="${param.deleted == 'all'}">All bills were cleared from history.</c:when>
                            <c:when test="${param.deleted == 'true'}">Bill deleted successfully.</c:when>
                            <c:otherwise>Could not delete the bill. It may have already been removed.</c:otherwise>
                        </c:choose>
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        </c:if>

        <div class="card-volt p-4 p-md-5">

            <div class="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
                <div class="input-group" style="max-width: 360px;">
                    <span class="input-group-text bg-transparent border-end-0"><i class="bi bi-search"></i></span>
                    <input type="text" id="historySearch" class="form-control form-control-volt border-start-0" placeholder="Search by name, number, or bill no.">
                </div>
                <div class="d-flex gap-2">
                    <a href="<%= request.getContextPath() %>/calculator" class="btn btn-spark">
                        <i class="bi bi-plus-lg me-1"></i>New Bill
                    </a>
                    <c:if test="${not empty bills}">
                        <form method="post" action="<%= request.getContextPath() %>/delete" class="delete-bill-form" onsubmit="return confirm('Clear ALL bill history? This cannot be undone.');">
                            <input type="hidden" name="clearAll" value="true">
                            <button type="submit" class="btn btn-outline-volt"><i class="bi bi-trash3 me-1"></i>Clear All</button>
                        </form>
                    </c:if>
                </div>
            </div>

            <c:choose>
                <c:when test="${empty bills}">
                    <div class="text-center py-5" id="historyEmptyState">
                        <i class="bi bi-inbox" style="font-size:3rem;color:var(--text-muted);"></i>
                        <h5 class="mt-3">No bills yet</h5>
                        <p class="text-muted-custom">Generate your first bill to see it appear here.</p>
                        <a href="<%= request.getContextPath() %>/calculator" class="btn btn-volt mt-2">
                            <i class="bi bi-calculator me-1"></i>Go to Calculator
                        </a>
                    </div>
                </c:when>
                <c:otherwise>
                    <div class="table-responsive">
                        <table class="table table-volt align-middle" id="historyTable">
                            <thead>
                            <tr>
                                <th data-sort-key="billno">Bill No. <i class="sort-icon bi bi-arrow-down-up small"></i></th>
                                <th data-sort-key="name">Customer <i class="sort-icon bi bi-arrow-down-up small"></i></th>
                                <th data-sort-key="units">Units <i class="sort-icon bi bi-arrow-down-up small"></i></th>
                                <th data-sort-key="amount">Amount <i class="sort-icon bi bi-arrow-down-up small"></i></th>
                                <th data-sort-key="date">Date <i class="sort-icon bi bi-arrow-down-up small"></i></th>
                                <th class="text-end">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <c:forEach var="b" items="${bills}">
                                <tr data-billno="${b.billNumber}" data-name="${b.customerName}" data-units="${b.unitsConsumed}"
                                    data-amount="${b.totalAmount}" data-date="${b.id}">
                                    <td class="fw-semibold">${b.billNumber}</td>
                                    <td>
                                        <div class="fw-semibold">${b.customerName}</div>
                                        <div class="text-muted-custom small">${b.customerNumber}</div>
                                    </td>
                                    <td>${b.unitsConsumed} kWh</td>
                                    <td><span class="badge-amount">Rs. <fmt:formatNumber value="${b.totalAmount}" minFractionDigits="2" maxFractionDigits="2"/></span></td>
                                    <td class="small text-muted-custom">${b.formattedBillDate}</td>
                                    <td class="text-end">
                                        <div class="d-flex justify-content-end gap-2">
                                            <form method="post" action="<%= request.getContextPath() %>/delete" class="delete-bill-form">
                                                <input type="hidden" name="id" value="${b.id}">
                                                <button type="submit" class="btn btn-sm btn-outline-danger" title="Delete">
                                                    <i class="bi bi-trash3"></i>
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            </c:forEach>
                            </tbody>
                        </table>
                    </div>
                    <div id="historyEmptyState" class="text-center py-5" style="display:none;">
                        <i class="bi bi-search" style="font-size:2.5rem;color:var(--text-muted);"></i>
                        <h6 class="mt-3">No matching bills</h6>
                        <p class="text-muted-custom small">Try a different search term.</p>
                    </div>
                </c:otherwise>
            </c:choose>
        </div>
    </div>
</section>

<jsp:include page="common/footer.jsp" />

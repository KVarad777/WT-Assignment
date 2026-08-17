<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<%@ taglib uri="jakarta.tags.fmt" prefix="fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Full history of electricity bill calculations with search and pagination." />
    <title>Bill History — ElectroBill</title>

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
                    <a class="nav-link active" href="${pageContext.request.contextPath}/history">
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
     PAGE HEADER
════════════════════════════════════════ -->
<div class="history-header">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-md-8">
                <h1 class="history-page-title animate-fadeInLeft">
                    <i class="bi bi-clock-history me-3"></i>Bill History
                </h1>
                <p class="history-page-subtitle animate-fadeInLeft">
                    All electricity bill calculations — searchable and filterable
                </p>
            </div>
            <div class="col-md-4 text-md-end animate-fadeInRight">
                <div class="history-stat-badge">
                    <i class="bi bi-database-fill me-2"></i>
                    <span id="totalRecords">${totalCount}</span> Total Records
                </div>
            </div>
        </div>
    </div>
</div>

<!-- ═══════════════════════════════════════
     HISTORY CONTENT
════════════════════════════════════════ -->
<section class="history-section py-4">
    <div class="container">

        <!-- Flash Messages -->
        <c:if test="${not empty sessionScope.successMessage}">
            <div class="alert alert-success alert-dismissible fade show animate-fadeIn" role="alert">
                <i class="bi bi-check-circle-fill me-2"></i>
                ${sessionScope.successMessage}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
            <c:remove var="successMessage" scope="session"/>
        </c:if>

        <c:if test="${not empty sessionScope.errorMessage}">
            <div class="alert alert-danger alert-dismissible fade show animate-fadeIn" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                ${sessionScope.errorMessage}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
            <c:remove var="errorMessage" scope="session"/>
        </c:if>

        <c:if test="${not empty errorMessage}">
            <div class="alert alert-danger alert-dismissible fade show animate-fadeIn" role="alert">
                <i class="bi bi-database-x-fill me-2"></i>
                ${errorMessage}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        </c:if>

        <!-- ── Table Card ─────────────────────────────────────── -->
        <div class="history-table-card glass-card animate-fadeInUp">

            <!-- Toolbar -->
            <div class="history-toolbar">
                <div class="search-wrapper">
                    <i class="bi bi-search search-icon"></i>
                    <input type="text"
                           id="historySearch"
                           class="form-control search-input"
                           placeholder="Search by name, meter no., amount..."
                           autocomplete="off" />
                    <button id="clearSearch" class="btn btn-clear-search d-none" title="Clear">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="d-flex gap-2 align-items-center">
                    <span class="records-info" id="recordsInfo">
                        Showing <strong id="visibleCount">${totalCount}</strong> of ${totalCount} records
                    </span>
                    <a href="${pageContext.request.contextPath}/" class="btn btn-new-bill">
                        <i class="bi bi-plus-circle-fill me-1"></i>New Bill
                    </a>
                </div>
            </div>

            <!-- Table -->
            <div class="table-responsive">
                <c:choose>
                    <c:when test="${not empty bills}">
                        <table class="table history-table" id="historyTable">
                            <thead>
                                <tr>
                                    <th class="sortable" data-sort="id">
                                        <i class="bi bi-hash me-1"></i>#
                                        <i class="bi bi-chevron-expand sort-icon"></i>
                                    </th>
                                    <th class="sortable" data-sort="name">
                                        <i class="bi bi-person me-1"></i>Customer Name
                                        <i class="bi bi-chevron-expand sort-icon"></i>
                                    </th>
                                    <th>
                                        <i class="bi bi-hash me-1"></i>Meter No.
                                    </th>
                                    <th class="sortable text-end" data-sort="units">
                                        <i class="bi bi-speedometer2 me-1"></i>Units
                                        <i class="bi bi-chevron-expand sort-icon"></i>
                                    </th>
                                    <th class="sortable text-end" data-sort="amount">
                                        <i class="bi bi-currency-rupee me-1"></i>Amount
                                        <i class="bi bi-chevron-expand sort-icon"></i>
                                    </th>
                                    <th class="sortable" data-sort="date">
                                        <i class="bi bi-calendar3 me-1"></i>Date
                                        <i class="bi bi-chevron-expand sort-icon"></i>
                                    </th>
                                    <th class="sortable">Month</th>
                                    <th class="sortable">Paid</th>
                                    <th class="text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody id="historyTableBody">
                                <c:forEach var="bill" items="${bills}" varStatus="status">
                                    <tr class="history-row"
                                        data-id="${bill.id}"
                                        data-name="${bill.customerName}"
                                        data-number="${bill.customerNumber}"
                                        data-units="${bill.units}"
                                        data-amount="${bill.billAmount}"
                                        data-date="${bill.formattedDate}">

                                        <!-- Serial -->
                                        <td>
                                            <span class="badge-serial">${status.index + 1}</span>
                                        </td>

                                        <!-- Name -->
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="customer-avatar">
                                                    ${bill.customerName.substring(0,1).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div class="customer-name">${bill.customerName}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <!-- Meter No -->
                                        <td>
                                            <span class="meter-badge">${bill.customerNumber}</span>
                                        </td>

                                        <!-- Units -->
                                        <td class="text-end">
                                            <span class="units-value">${bill.units}</span>
                                            <small class="text-muted ms-1">kWh</small>
                                        </td>

                                        <!-- Amount -->
                                        <td class="text-end">
                                            <span class="amount-value">
                                                ₹<fmt:formatNumber value="${bill.billAmount}" pattern="#,##0.00"/>
                                            </span>
                                        </td>

                                        <!-- Date -->
                                        <td>
                                            <span class="date-value">${bill.formattedDate}</span>
                                        </td>
                                        <!-- Month -->
                                        <td>
                                            <span class="month-value">${bill.billMonth}</span>
                                        </td>

                                        <!-- Paid -->
                                        <td class="text-center">
                                            <button class="btn btn-sm btn-toggle-paid" data-id="${bill.id}" data-paid="${bill.paid}">
                                                <c:choose>
                                                    <c:when test="${bill.paid}">
                                                        <i class="bi bi-check-circle-fill text-success"></i>
                                                    </c:when>
                                                    <c:otherwise>
                                                        <i class="bi bi-x-circle-fill text-muted"></i>
                                                    </c:otherwise>
                                                </c:choose>
                                            </button>
                                        </td>

                                        <!-- Action -->
                                        <td class="text-center">
                                            <button type="button"
                                                    class="btn btn-delete"
                                                    data-id="${bill.id}"
                                                    data-name="${bill.customerName}"
                                                    data-bs-toggle="modal"
                                                    data-bs-target="#deleteModal"
                                                    title="Delete record">
                                                <i class="bi bi-trash3-fill"></i>
                                            </button>
                                        </td>

                                    </tr>
                                </c:forEach>
                            </tbody>
                        </table>

                        <!-- No Search Results Row (hidden by default) -->
                        <div id="noSearchResults" class="no-results d-none">
                            <i class="bi bi-search"></i>
                            <p>No records match your search</p>
                        </div>

                        <!-- Pagination -->
                        <div class="history-pagination" id="paginationContainer">
                            <div class="d-flex align-items-center gap-2">
                                <label class="page-size-label">Rows:</label>
                                <select id="pageSizeSelect" class="page-size-select">
                                    <option value="5">5</option>
                                    <option value="10" selected>10</option>
                                    <option value="25">25</option>
                                    <option value="50">All</option>
                                </select>
                            </div>
                            <ul class="pagination pagination-custom mb-0" id="paginationList">
                            </ul>
                        </div>

                    </c:when>
                    <c:otherwise>
                        <!-- Empty State -->
                        <div class="empty-state-container">
                            <div class="empty-state-icon">
                                <i class="bi bi-inbox"></i>
                            </div>
                            <h3 class="empty-state-title">No Bills Yet</h3>
                            <p class="empty-state-desc">
                                You haven't calculated any bills. Start by using the calculator!
                            </p>
                            <a href="${pageContext.request.contextPath}/" class="btn btn-calculate">
                                <i class="bi bi-calculator-fill me-2"></i>Calculate First Bill
                            </a>
                        </div>
                    </c:otherwise>
                </c:choose>
            </div>

        </div>

    </div>
</section>

<!-- ═══════════════════════════════════════
     DELETE CONFIRMATION MODAL
════════════════════════════════════════ -->
<div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content modal-custom">
            <div class="modal-header modal-header-danger">
                <h5 class="modal-title" id="deleteModalLabel">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    Confirm Deletion
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center py-4">
                <div class="delete-warning-icon">
                    <i class="bi bi-trash3-fill"></i>
                </div>
                <p class="modal-body-text">
                    Are you sure you want to delete the bill record for
                    <strong id="deleteCustomerName">this customer</strong>?
                </p>
                <p class="text-muted small">This action cannot be undone.</p>
            </div>
            <div class="modal-footer justify-content-center border-0">
                <button type="button" class="btn btn-outline-secondary-custom px-4" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-2"></i>Cancel
                </button>
                <a href="#" id="confirmDeleteBtn" class="btn btn-danger-custom px-4">
                    <i class="bi bi-trash3-fill me-2"></i>Delete Record
                </a>
            </div>
        </div>
    </div>
</div>

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
$(document).ready(function () {
    var contextPath = '${pageContext.request.contextPath}';

    // ── Delete modal: populate customer name + confirm link
    $('#deleteModal').on('show.bs.modal', function (e) {
        var btn         = $(e.relatedTarget);
        var id          = btn.data('id');
        var name        = btn.data('name');
        $('#deleteCustomerName').text(name);
        $('#confirmDeleteBtn').attr('href', contextPath + '/delete?id=' + id);
    });

    // ── Search & Pagination
    initHistoryTable(contextPath);
});
</script>

</body>
</html>

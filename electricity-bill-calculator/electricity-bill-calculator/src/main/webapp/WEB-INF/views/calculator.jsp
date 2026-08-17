<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<% request.setAttribute("activePage", "calculator"); request.setAttribute("pageTitle", "Calculator"); %>
<jsp:include page="common/header.jsp" />

<section class="hero-volt" style="padding: 3.5rem 0 5rem;">
    <div class="container">
        <div class="text-center">
            <span class="hero-eyebrow"><i class="bi bi-calculator"></i> Bill Calculator</span>
            <h1 class="mt-3 mb-2" style="font-size: clamp(1.9rem, 4vw, 2.8rem);">Let's calculate your electricity bill</h1>
            <p class="lead mx-auto">Fill in the details below and get an instant, slab-wise breakdown.</p>
        </div>
    </div>
</section>

<section class="section-pad" style="margin-top: -4.5rem;">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-7">

                <%-- Error alert (server-side validation failure) --%>
                <% if (request.getAttribute("errorMessage") != null) { %>
                <div class="alert alert-danger d-flex align-items-center gap-2" role="alert">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <div><%= request.getAttribute("errorMessage") %></div>
                </div>
                <% } %>

                <div class="card-volt p-4 p-md-5">
                    <form id="calculatorForm" class="needs-validation" novalidate method="post" action="<%= request.getContextPath() %>/calculate">

                        <div class="mb-4">
                            <label for="customerName" class="form-label-volt">Customer Name</label>
                            <input type="text" class="form-control form-control-volt" id="customerName" name="customerName"
                                   placeholder="e.g. Priya Sharma" maxlength="100" required
                                   value="<%= request.getAttribute("customerName") != null ? request.getAttribute("customerName") : "" %>">
                            <div class="invalid-feedback">Please enter the customer's name.</div>
                        </div>

                        <div class="mb-4">
                            <label for="customerNumber" class="form-label-volt">Customer Number</label>
                            <input type="text" class="form-control form-control-volt" id="customerNumber" name="customerNumber"
                                   placeholder="e.g. CUST-10234" maxlength="50" required
                                   value="<%= request.getAttribute("customerNumber") != null ? request.getAttribute("customerNumber") : "" %>">
                            <div class="invalid-feedback">Please enter a customer number.</div>
                        </div>

                        <div class="mb-4">
                            <label for="unitsConsumed" class="form-label-volt">Units Consumed (kWh)</label>
                            <input type="number" class="form-control form-control-volt" id="unitsConsumed" name="unitsConsumed"
                                   placeholder="e.g. 275" min="0" max="1000000" step="1" required
                                   value="<%= request.getAttribute("unitsConsumed") != null ? request.getAttribute("unitsConsumed") : "" %>">
                            <div class="invalid-feedback">Please enter a valid, non-negative number of units.</div>
                            <div class="form-text text-muted-custom">Enter the total units (kWh) shown on your meter for this billing cycle.</div>
                        </div>

                        <div class="d-flex flex-column flex-sm-row gap-3 mt-5">
                            <button type="submit" class="btn btn-spark btn-lg flex-fill">
                                <i class="bi bi-lightning-charge-fill me-2"></i>Calculate Bill
                            </button>
                            <button type="button" id="resetBtn" class="btn btn-outline-volt btn-lg flex-fill">
                                <i class="bi bi-arrow-counterclockwise me-2"></i>Reset
                            </button>
                        </div>
                    </form>
                </div>

                <div class="card-volt p-4 mt-4">
                    <h6 class="eyebrow-volt mb-3"><i class="bi bi-info-circle me-1"></i>Tariff Reference</h6>
                    <div class="row g-2 small">
                        <div class="col-6 col-md-3"><strong>0–50:</strong> Rs. 3.50/unit</div>
                        <div class="col-6 col-md-3"><strong>51–150:</strong> Rs. 4.00/unit</div>
                        <div class="col-6 col-md-3"><strong>151–250:</strong> Rs. 5.20/unit</div>
                        <div class="col-6 col-md-3"><strong>250+:</strong> Rs. 6.50/unit</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</section>

<jsp:include page="common/footer.jsp" />

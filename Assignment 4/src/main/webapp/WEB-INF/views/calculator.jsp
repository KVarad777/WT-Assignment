<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<jsp:include page="common/header.jsp">
    <jsp:param name="title" value="Electricity Bill Calculator — Energy Ledger" />
</jsp:include>
<jsp:include page="common/navbar.jsp" />

<main class="main-content">
    <div class="container" style="padding-top: 2rem; max-width: 1040px;">
        
        <!-- Header -->
        <div style="margin-bottom: 1.75rem;">
            <h1 style="font-size: 2rem;">Electricity Bill Calculator</h1>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Enter customer details and meter readings to calculate your progressive electricity bill.</p>
        </div>

        <!-- Validation Errors -->
        <c:if test="${not empty validationErrors}">
            <div class="alert alert-error">
                <div>
                    <strong>Please check the following:</strong>
                    <ul style="margin-left: 1.25rem; margin-top: 0.25rem;">
                        <c:forEach var="err" items="${validationErrors}">
                            <li>${err}</li>
                        </c:forEach>
                    </ul>
                </div>
            </div>
        </c:if>

        <c:if test="${not empty errorMessage}">
            <div class="alert alert-error">
                <div>${errorMessage}</div>
            </div>
        </c:if>

        <!-- Calculator Split Layout -->
        <div class="calculator-grid">
            
            <!-- Form Card (Left) -->
            <div class="card">
                
                <!-- Quick Demo Presets -->
                <div style="margin-bottom: 1.25rem;">
                    <label class="form-label" style="font-size: 0.8rem; color: var(--text-muted);">Quick Sample Values:</label>
                    <div class="presets-container" id="presetsContainer"></div>
                </div>

                <form action="${pageContext.request.contextPath}/calculate" method="POST" id="billForm">
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="customerName">Customer Name <span class="required">*</span></label>
                            <input type="text" id="customerName" name="customerName" class="form-control" 
                                   placeholder="e.g. Rajesh Patel" 
                                   value="${paramCustomerName != null ? paramCustomerName : ''}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="consumerNumber">Consumer Number <span class="required">*</span></label>
                            <input type="text" id="consumerNumber" name="consumerNumber" class="form-control" 
                                   placeholder="e.g. ELC-10042" 
                                   value="${paramConsumerNumber != null ? paramConsumerNumber : ''}" required>
                        </div>
                    </div>

                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="billingMonth">Billing Month <span class="required">*</span></label>
                            <input type="text" id="billingMonth" name="billingMonth" class="form-control" 
                                   placeholder="e.g. August 2026" 
                                   value="${paramBillingMonth != null ? paramBillingMonth : currentMonth}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="email">Email Address (Optional)</label>
                            <input type="email" id="email" name="email" class="form-control" 
                                   placeholder="e.g. name@example.com" 
                                   value="${paramEmail != null ? paramEmail : ''}">
                        </div>
                    </div>

                    <!-- Reading Mode Switcher -->
                    <div class="form-group" style="margin-top: 0.25rem;">
                        <label class="form-label">Consumption Input Type:</label>
                        <div class="radio-pill-group">
                            <input type="radio" id="modeMeter" name="readingMode" value="meter" class="radio-pill-input" 
                                   ${paramReadingMode != 'direct' ? 'checked' : ''}>
                            <label for="modeMeter" class="radio-pill-label">Meter Readings (Prev &amp; Current)</label>

                            <input type="radio" id="modeDirect" name="readingMode" value="direct" class="radio-pill-input"
                                   ${paramReadingMode == 'direct' ? 'checked' : ''}>
                            <label for="modeDirect" class="radio-pill-label">Direct Units</label>
                        </div>
                    </div>

                    <!-- Meter Readings Inputs -->
                    <div class="form-row" id="meterReadingsGroup" style="${paramReadingMode == 'direct' ? 'display:none;' : ''}">
                        <div class="form-group">
                            <label class="form-label" for="previousReading">Previous Reading</label>
                            <input type="number" step="0.01" min="0" id="previousReading" name="previousReading" class="form-control" 
                                   placeholder="0.00" 
                                   value="${paramPrevReading != null ? paramPrevReading : ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="currentReading">Current Reading <span class="required">*</span></label>
                            <input type="number" step="0.01" min="0" id="currentReading" name="currentReading" class="form-control" 
                                   placeholder="e.g. 300.00" 
                                   value="${paramCurrReading != null ? paramCurrReading : ''}">
                        </div>
                    </div>

                    <!-- Direct Units Input -->
                    <div class="form-group" id="directUnitsGroup" style="${paramReadingMode == 'direct' ? '' : 'display:none;'}">
                        <label class="form-label" for="directUnits">Units Consumed (kWh) <span class="required">*</span></label>
                        <input type="number" step="0.01" min="0" id="directUnits" name="directUnits" class="form-control" 
                               placeholder="e.g. 150" 
                               value="${paramDirectUnits != null ? paramDirectUnits : ''}">
                    </div>

                    <div style="margin-top: 1.5rem;">
                        <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
                            ⚡ Calculate &amp; Save Bill
                        </button>
                    </div>
                </form>
            </div>

            <!-- Live Estimate Card (Right) -->
            <div class="card" style="background: var(--bg-surface-elevated); border: 1px solid var(--border-strong);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="font-size: 1.15rem;">Live Estimate</h3>
                    <span class="badge badge-emerald" id="liveTierBadge">Slab 1</span>
                </div>

                <div style="margin-bottom: 1.25rem;">
                    <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted);">Estimated Amount</div>
                    <div style="font-size: 2.5rem; font-weight: 800; color: var(--text-main); margin-top: 0.2rem;" id="liveTotalDisplay">₹0.00</div>
                    <div style="font-size: 0.9rem; color: var(--text-muted);">
                        Units: <strong id="liveUnitsDisplay" style="color: var(--text-main);">0</strong> kWh
                    </div>
                </div>

                <!-- Live Slab Breakdown -->
                <div style="border-top: 1px solid var(--border-subtle); padding-top: 1rem;">
                    <div style="font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.75rem;">
                        Slab Breakdown
                    </div>

                    <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.85rem;">
                        <span>First 50u (@ ₹3.50):</span>
                        <strong id="liveSlabAmount_1">₹0.00</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.85rem;">
                        <span>Next 100u (@ ₹4.00):</span>
                        <strong id="liveSlabAmount_2">₹0.00</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.85rem;">
                        <span>Next 100u (@ ₹5.20):</span>
                        <strong id="liveSlabAmount_3">₹0.00</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; padding: 0.4rem 0; font-size: 0.85rem;">
                        <span>Above 250u (@ ₹6.50):</span>
                        <strong id="liveSlabAmount_4">₹0.00</strong>
                    </div>
                </div>

                <!-- Info note -->
                <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px dashed var(--border-subtle); font-size: 0.8rem; color: var(--text-muted);">
                    <span id="liveInsightText">Enter meter readings to see live calculation.</span>
                </div>
            </div>

        </div>

    </div>
</main>

<jsp:include page="common/footer.jsp" />

<script src="${pageContext.request.contextPath}/js/calculator.js"></script>

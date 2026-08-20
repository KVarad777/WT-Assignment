<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<jsp:include page="common/header.jsp">
    <jsp:param name="title" value="Calculate Bill — Energy Ledger" />
</jsp:include>
<jsp:include page="common/navbar.jsp" />

<main class="main-content">
    <div class="container" style="padding-top: 2.5rem;">
        
        <!-- Header -->
        <div style="margin-bottom: 2rem;">
            <span class="badge badge-amber">Progressive Billing Engine</span>
            <h1 style="font-size: 2.25rem; margin-top: 0.5rem;">Electricity Bill Calculator</h1>
            <p style="color: var(--text-muted); font-size: 1rem;">Enter customer details and consumption readings to calculate the official progressive tariff bill.</p>
        </div>

        <!-- Validation Errors Display -->
        <c:if test="${not empty validationErrors}">
            <div class="alert alert-error">
                <div>⚠️</div>
                <div>
                    <strong>Please resolve the following input issues:</strong>
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
                <div>⚠️</div>
                <div>${errorMessage}</div>
            </div>
        </c:if>

        <!-- Split Grid: Form (Left) & Live Reactive Estimate (Right) -->
        <div class="calculator-grid">
            
            <!-- LEFT PANEL: Interactive Form -->
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3 style="font-size: 1.25rem;">Customer &amp; Consumption Details</h3>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">* Required Fields</span>
                </div>

                <!-- Quick Presets -->
                <div style="margin-bottom: 1.5rem; background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md);">
                    <small style="display: block; font-weight: 700; color: var(--text-muted); text-transform: uppercase; font-size: 0.75rem; margin-bottom: 0.5rem;">
                        ⚡ Quick Demo Presets (Click to autofill)
                    </small>
                    <div class="presets-container" id="presetsContainer">
                        <!-- Populated dynamically by calculator.js -->
                    </div>
                </div>

                <form action="${pageContext.request.contextPath}/calculate" method="POST" id="billForm">
                    
                    <!-- Customer Name & Consumer Number -->
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

                    <!-- Contact Details -->
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="email">Email Address (Optional)</label>
                            <input type="email" id="email" name="email" class="form-control" 
                                   placeholder="e.g. rajesh@example.com" 
                                   value="${paramEmail != null ? paramEmail : ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="phone">Phone Number (Optional)</label>
                            <input type="tel" id="phone" name="phone" class="form-control" 
                                   placeholder="e.g. +91 98201 44521" 
                                   value="${paramPhone != null ? paramPhone : ''}">
                        </div>
                    </div>

                    <!-- Billing Month & Address -->
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="billingMonth">Billing Month <span class="required">*</span></label>
                            <input type="text" id="billingMonth" name="billingMonth" class="form-control" 
                                   placeholder="e.g. August 2026" 
                                   value="${paramBillingMonth != null ? paramBillingMonth : currentMonth}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="address">Premises / Address (Optional)</label>
                            <input type="text" id="address" name="address" class="form-control" 
                                   placeholder="e.g. 12, Sunrise Bungalows, Ahmedabad" 
                                   value="${paramAddress != null ? paramAddress : ''}">
                        </div>
                    </div>

                    <!-- Input Mode Toggle (Meter Reading vs Direct Units) -->
                    <div class="form-group" style="margin-top: 0.5rem;">
                        <label class="form-label">Consumption Input Mode</label>
                        <div class="radio-pill-group">
                            <input type="radio" id="modeMeter" name="readingMode" value="meter" class="radio-pill-input" 
                                   ${paramReadingMode != 'direct' ? 'checked' : ''}>
                            <label for="modeMeter" class="radio-pill-label">Meter Readings (Prev &amp; Current)</label>

                            <input type="radio" id="modeDirect" name="readingMode" value="direct" class="radio-pill-input"
                                   ${paramReadingMode == 'direct' ? 'checked' : ''}>
                            <label for="modeDirect" class="radio-pill-label">Direct Units Consumed</label>
                        </div>
                    </div>

                    <!-- Meter Readings Inputs -->
                    <div class="form-row" id="meterReadingsGroup" style="${paramReadingMode == 'direct' ? 'display:none;' : ''}">
                        <div class="form-group">
                            <label class="form-label" for="previousReading">Previous Meter Reading (kWh)</label>
                            <input type="number" step="0.01" min="0" id="previousReading" name="previousReading" class="form-control" 
                                   placeholder="e.g. 3450.00" 
                                   value="${paramPrevReading != null ? paramPrevReading : ''}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="currentReading">Current Meter Reading (kWh) <span class="required">*</span></label>
                            <input type="number" step="0.01" min="0" id="currentReading" name="currentReading" class="form-control" 
                                   placeholder="e.g. 3750.00" 
                                   value="${paramCurrReading != null ? paramCurrReading : ''}">
                        </div>
                    </div>

                    <!-- Direct Units Input -->
                    <div class="form-group" id="directUnitsGroup" style="${paramReadingMode == 'direct' ? '' : 'display:none;'}">
                        <label class="form-label" for="directUnits">Total Units Consumed (kWh) <span class="required">*</span></label>
                        <input type="number" step="0.01" min="0" id="directUnits" name="directUnits" class="form-control" 
                               placeholder="e.g. 300.00" 
                               value="${paramDirectUnits != null ? paramDirectUnits : ''}">
                    </div>

                    <!-- Submit Button -->
                    <div style="margin-top: 2rem;">
                        <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
                            ⚡ Calculate &amp; Generate Official Statement
                        </button>
                    </div>
                </form>
            </div>

            <!-- RIGHT PANEL: Live Reactive Estimate -->
            <div class="statement-card">
                <div class="statement-header">
                    <div>
                        <span class="badge badge-emerald" id="liveTierBadge">Slab 1: Lifeline</span>
                        <h3 style="margin-top: 0.5rem; font-size: 1.15rem;">Live Real-Time Estimate</h3>
                    </div>
                    <span style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Interactive</span>
                </div>

                <!-- Total Amount Highlight -->
                <div style="margin-bottom: 1.5rem;">
                    <div class="statement-title">Estimated Total Charge</div>
                    <div class="statement-amount-hero" id="liveTotalDisplay">₹0.00</div>
                    <div style="font-size: 0.9rem; color: var(--text-muted);">
                        Based on <strong id="liveUnitsDisplay" style="color: var(--text-main); font-family: var(--font-mono);">0</strong> units consumed
                    </div>
                </div>

                <!-- Live Dynamic Segmented Meter -->
                <div class="meter-container">
                    <small style="display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); margin-bottom: 0.4rem;">
                        Slab Consumption Distribution
                    </small>
                    <div class="meter-track">
                        <div class="meter-segment meter-segment-1" id="liveMeterSeg_1" style="width: 0%;"></div>
                        <div class="meter-segment meter-segment-2" id="liveMeterSeg_2" style="width: 0%;"></div>
                        <div class="meter-segment meter-segment-3" id="liveMeterSeg_3" style="width: 0%;"></div>
                        <div class="meter-segment meter-segment-4" id="liveMeterSeg_4" style="width: 0%;"></div>
                    </div>
                </div>

                <!-- Progressive Slabs Ladder List -->
                <ul class="ladder-list">
                    <li class="ladder-item">
                        <div class="ladder-item-info">
                            <span class="ladder-dot" style="background-color: var(--slab-1-color);"></span>
                            <div>
                                <div class="ladder-slab-name">First 50 units</div>
                                <div class="ladder-slab-rate">@ ₹3.50 / unit (<span id="liveSlabUnits_1">0.0 u</span>)</div>
                            </div>
                        </div>
                        <div class="ladder-slab-amount" id="liveSlabAmount_1">₹0.00</div>
                    </li>
                    <li class="ladder-item">
                        <div class="ladder-item-info">
                            <span class="ladder-dot" style="background-color: var(--slab-2-color);"></span>
                            <div>
                                <div class="ladder-slab-name">Next 100 units</div>
                                <div class="ladder-slab-rate">@ ₹4.00 / unit (<span id="liveSlabUnits_2">0.0 u</span>)</div>
                            </div>
                        </div>
                        <div class="ladder-slab-amount" id="liveSlabAmount_2">₹0.00</div>
                    </li>
                    <li class="ladder-item">
                        <div class="ladder-item-info">
                            <span class="ladder-dot" style="background-color: var(--slab-3-color);"></span>
                            <div>
                                <div class="ladder-slab-name">Next 100 units</div>
                                <div class="ladder-slab-rate">@ ₹5.20 / unit (<span id="liveSlabUnits_3">0.0 u</span>)</div>
                            </div>
                        </div>
                        <div class="ladder-slab-amount" id="liveSlabAmount_3">₹0.00</div>
                    </li>
                    <li class="ladder-item">
                        <div class="ladder-item-info">
                            <span class="ladder-dot" style="background-color: var(--slab-4-color);"></span>
                            <div>
                                <div class="ladder-slab-name">Above 250 units</div>
                                <div class="ladder-slab-rate">@ ₹6.50 / unit (<span id="liveSlabUnits_4">0.0 u</span>)</div>
                            </div>
                        </div>
                        <div class="ladder-slab-amount" id="liveSlabAmount_4">₹0.00</div>
                    </li>
                </ul>

                <!-- Insight Box -->
                <div style="background: var(--bg-surface-elevated); padding: 1rem; border-radius: var(--radius-md); margin-top: 1rem;">
                    <small style="display: block; font-weight: 700; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase;">Energy Intelligence</small>
                    <p id="liveInsightText" style="font-size: 0.85rem; color: var(--text-main); margin-top: 0.25rem;">
                        Enter readings to preview real-time slab calculations.
                    </p>
                </div>

                <!-- Footer Summary Metrics -->
                <div class="statement-metric-grid">
                    <div class="statement-metric-item">
                        <small>Effective Avg Rate</small>
                        <strong id="liveAvgRateDisplay">₹0.00 / unit</strong>
                    </div>
                    <div class="statement-metric-item">
                        <small>Engine</small>
                        <strong>Progressive Slabs</strong>
                    </div>
                </div>

            </div>
        </div>

    </div>
</main>

<jsp:include page="common/footer.jsp" />

<!-- Load Calculator Reactive Script -->
<script src="${pageContext.request.contextPath}/js/calculator.js"></script>

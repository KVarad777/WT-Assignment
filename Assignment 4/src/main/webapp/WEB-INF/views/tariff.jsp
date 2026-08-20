<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<jsp:include page="common/header.jsp">
    <jsp:param name="title" value="Electricity Tariff Rates — Energy Ledger" />
</jsp:include>
<jsp:include page="common/navbar.jsp" />

<main class="main-content">
    <div class="container" style="padding-top: 2rem; max-width: 900px;">
        
        <!-- Page Title -->
        <div style="margin-bottom: 2rem; text-align: center;">
            <h1 style="font-size: 2rem;">Electricity Tariff Slabs</h1>
            <p style="color: var(--text-muted); font-size: 0.95rem;">Official progressive domestic tariff rates applied sequentially.</p>
        </div>

        <!-- Tariff Slabs Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem;">
            
            <div class="card" style="border-top: 4px solid var(--slab-1-color);">
                <span class="badge badge-emerald">Slab 1</span>
                <h3 style="font-size: 1.2rem; margin: 0.5rem 0 0.25rem 0;">First 50 units</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">0 – 50 kWh</p>
                <div style="font-size: 1.75rem; font-weight: 800; color: var(--text-main);">
                    ₹3.50 <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ unit</span>
                </div>
            </div>

            <div class="card" style="border-top: 4px solid var(--slab-2-color);">
                <span class="badge badge-blue">Slab 2</span>
                <h3 style="font-size: 1.2rem; margin: 0.5rem 0 0.25rem 0;">Next 100 units</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">51 – 150 kWh</p>
                <div style="font-size: 1.75rem; font-weight: 800; color: var(--text-main);">
                    ₹4.00 <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ unit</span>
                </div>
            </div>

            <div class="card" style="border-top: 4px solid var(--slab-3-color);">
                <span class="badge badge-amber">Slab 3</span>
                <h3 style="font-size: 1.2rem; margin: 0.5rem 0 0.25rem 0;">Next 100 units</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">151 – 250 kWh</p>
                <div style="font-size: 1.75rem; font-weight: 800; color: var(--text-main);">
                    ₹5.20 <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ unit</span>
                </div>
            </div>

            <div class="card" style="border-top: 4px solid var(--slab-4-color);">
                <span class="badge badge-rose">Slab 4</span>
                <h3 style="font-size: 1.2rem; margin: 0.5rem 0 0.25rem 0;">Above 250 units</h3>
                <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem;">&gt; 250 kWh</p>
                <div style="font-size: 1.75rem; font-weight: 800; color: var(--text-main);">
                    ₹6.50 <span style="font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">/ unit</span>
                </div>
            </div>

        </div>

        <!-- Simple Calculation Example Card -->
        <div class="card" style="margin-bottom: 2rem;">
            <h3 style="font-size: 1.2rem; margin-bottom: 0.75rem;">Example: Calculation for 300 Units</h3>
            <div style="background: var(--bg-surface-elevated); padding: 1rem 1.25rem; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.8;">
                • First 50 units  @ ₹3.50 = ₹175.00<br>
                • Next 100 units @ ₹4.00 = ₹400.00<br>
                • Next 100 units @ ₹5.20 = ₹520.00<br>
                • Next 50 units  @ ₹6.50 = ₹325.00<br>
                -----------------------------------<br>
                <strong>Total Bill Amount       = ₹1,420.00</strong>
            </div>
            <div style="margin-top: 1.5rem; text-align: center;">
                <a href="${pageContext.request.contextPath}/calculator" class="btn btn-primary">
                    ⚡ Go to Calculator
                </a>
            </div>
        </div>

    </div>
</main>

<jsp:include page="common/footer.jsp" />

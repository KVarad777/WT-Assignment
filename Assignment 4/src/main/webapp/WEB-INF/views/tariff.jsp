<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<jsp:include page="common/header.jsp">
    <jsp:param name="title" value="Electricity Tariff Schedule — Energy Ledger" />
</jsp:include>
<jsp:include page="common/navbar.jsp" />

<main class="main-content">
    <div class="container" style="padding-top: 2.5rem;">
        
        <!-- Page Title -->
        <div style="margin-bottom: 2.5rem;">
            <span class="badge badge-amber">Approved Utility Tariff 2026</span>
            <h1 style="font-size: 2.25rem; margin-top: 0.5rem;">Residential Energy Tariff Schedule</h1>
            <p style="color: var(--text-muted); font-size: 1rem; max-width: 700px;">
                Understanding progressive multi-slab tariff structures: consumption is divided across tier intervals, ensuring affordable lifeline rates while encouraging energy conservation.
            </p>
        </div>

        <!-- Tariff Slabs Grid Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 3rem;">
            
            <div class="card" style="border-top: 5px solid var(--slab-1-color);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <span class="badge badge-emerald">Slab 01</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">0 – 50 Units</span>
                </div>
                <h3 style="font-size: 1.35rem; margin-bottom: 0.25rem;">First 50 units</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Lifeline base tier for essential domestic needs.</p>
                <div style="font-size: 2.25rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-main);">
                    ₹3.50 <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">/ kWh</span>
                </div>
                <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-subtle); font-size: 0.8rem; color: var(--text-muted);">
                    Max slab cost: <strong>₹175.00</strong>
                </div>
            </div>

            <div class="card" style="border-top: 5px solid var(--slab-2-color);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <span class="badge badge-blue">Slab 02</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">51 – 150 Units</span>
                </div>
                <h3 style="font-size: 1.35rem; margin-bottom: 0.25rem;">Next 100 units</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Moderate tier for standard domestic households.</p>
                <div style="font-size: 2.25rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-main);">
                    ₹4.00 <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">/ kWh</span>
                </div>
                <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-subtle); font-size: 0.8rem; color: var(--text-muted);">
                    Max slab cost: <strong>₹400.00</strong> (Cum: ₹575.00)
                </div>
            </div>

            <div class="card" style="border-top: 5px solid var(--slab-3-color);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <span class="badge badge-amber">Slab 03</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">151 – 250 Units</span>
                </div>
                <h3 style="font-size: 1.35rem; margin-bottom: 0.25rem;">Next 100 units</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">High consumption bracket for multi-appliance usage.</p>
                <div style="font-size: 2.25rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-main);">
                    ₹5.20 <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">/ kWh</span>
                </div>
                <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-subtle); font-size: 0.8rem; color: var(--text-muted);">
                    Max slab cost: <strong>₹520.00</strong> (Cum: ₹1,095.00)
                </div>
            </div>

            <div class="card" style="border-top: 5px solid var(--slab-4-color);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <span class="badge badge-rose">Slab 04</span>
                    <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">Above 250 Units</span>
                </div>
                <h3 style="font-size: 1.35rem; margin-bottom: 0.25rem;">Above 250 units</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.25rem;">Heavy consumption tier with surcharge rate.</p>
                <div style="font-size: 2.25rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-main);">
                    ₹6.50 <span style="font-size: 0.9rem; font-weight: 500; color: var(--text-muted);">/ kWh</span>
                </div>
                <div style="margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed var(--border-subtle); font-size: 0.8rem; color: var(--text-muted);">
                    Unbounded tier (@ ₹6.50/unit)
                </div>
            </div>

        </div>

        <!-- Progressive Tariff Explanation & Simulator Split Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 3rem;">
            
            <!-- Explanation Card -->
            <div class="card">
                <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">How Progressive Slab Billing Works</h3>
                <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1rem; line-height: 1.6;">
                    Unlike flat-rate billing where all units are charged at a single rate, a <strong>progressive tariff</strong> distributes consumed units sequentially into rate brackets:
                </p>
                
                <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md); font-size: 0.9rem; font-family: var(--font-mono); margin-bottom: 1rem;">
                    <strong>Example: 300 units consumption</strong><br><br>
                    • First 50 units  × ₹3.50 = ₹175.00<br>
                    • Next 100 units × ₹4.00 = ₹400.00<br>
                    • Next 100 units × ₹5.20 = ₹520.00<br>
                    • Next 50 units  × ₹6.50 = ₹325.00<br>
                    ----------------------------------<br>
                    <strong>Total Amount Payable   = ₹1,420.00</strong>
                </div>

                <p style="color: var(--text-muted); font-size: 0.85rem;">
                    Notice that if flat-rate were used (300 × ₹6.50), the cost would be <strong>₹1,950.00</strong>. Progressive billing saves you <strong>₹530.00</strong> by keeping baseline power affordable.
                </p>
            </div>

            <!-- Interactive Simulator Card -->
            <div class="statement-card">
                <div class="statement-header">
                    <div>
                        <span class="badge badge-amber">Interactive Simulator</span>
                        <h3 style="margin-top: 0.5rem; font-size: 1.15rem;">Instant Tariff Simulator</h3>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label" for="simUnits">Test Consumption (Units):</label>
                    <input type="number" id="simUnits" class="form-control" value="284" min="0" max="5000">
                </div>

                <div style="margin-bottom: 1rem;">
                    <div class="statement-title">Simulated Total Amount</div>
                    <div class="statement-amount-hero" id="simTotalDisplay">₹0.00</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted);">
                        Effective Average Rate: <strong id="simAvgRateDisplay" style="color: var(--text-main);">₹0.00/u</strong>
                    </div>
                </div>

                <!-- Simulator Progress Bar -->
                <div class="meter-track" style="height: 12px; margin-bottom: 1rem;">
                    <div class="meter-segment meter-segment-1" id="simSeg1" style="width: 0%;"></div>
                    <div class="meter-segment meter-segment-2" id="simSeg2" style="width: 0%;"></div>
                    <div class="meter-segment meter-segment-3" id="simSeg3" style="width: 0%;"></div>
                    <div class="meter-segment meter-segment-4" id="simSeg4" style="width: 0%;"></div>
                </div>

                <div style="margin-top: 1.5rem;">
                    <a href="${pageContext.request.contextPath}/calculator" class="btn btn-primary" style="width: 100%;">
                        ⚡ Open Full Bill Calculator
                    </a>
                </div>
            </div>

        </div>

    </div>
</main>

<jsp:include page="common/footer.jsp" />

<script>
    document.addEventListener('DOMContentLoaded', () => {
        const simUnitsInput = document.getElementById('simUnits');
        function updateSim() {
            const u = Math.max(0, parseFloat(simUnitsInput.value) || 0);
            let rem = u;
            let total = 0;
            const slabs = [
                { cap: 50, rate: 3.50 },
                { cap: 100, rate: 4.00 },
                { cap: 100, rate: 5.20 },
                { cap: null, rate: 6.50 }
            ];
            const segUnits = [0, 0, 0, 0];

            slabs.forEach((s, idx) => {
                if (rem > 0) {
                    if (s.cap !== null) {
                        const inSlab = Math.min(rem, s.cap);
                        total += inSlab * s.rate;
                        segUnits[idx] = inSlab;
                        rem -= inSlab;
                    } else {
                        total += rem * s.rate;
                        segUnits[idx] = rem;
                        rem = 0;
                    }
                }
            });

            document.getElementById('simTotalDisplay').innerText = '₹' + total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const avg = u > 0 ? (total / u) : 0;
            document.getElementById('simAvgRateDisplay').innerText = '₹' + avg.toFixed(2) + ' / unit';

            for (let i = 1; i <= 4; i++) {
                const segEl = document.getElementById('simSeg' + i);
                if (segEl) {
                    segEl.style.width = u > 0 ? (segUnits[i - 1] / u * 100) + '%' : '0%';
                }
            }
        }

        if (simUnitsInput) {
            simUnitsInput.addEventListener('input', updateSim);
            updateSim();
        }
    });
</script>

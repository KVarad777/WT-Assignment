<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<% request.setAttribute("activePage", "home"); request.setAttribute("pageTitle", "Home"); %>
<jsp:include page="common/header.jsp" />

<!-- HERO -->
<section class="hero-volt">
    <div class="container">
        <div class="row align-items-center gy-5">
            <div class="col-lg-7 fade-in-up">
                <span class="hero-eyebrow"><i class="bi bi-broadcast"></i> Slab-wise billing, done right</span>
                <h1 class="mt-3 mb-3">Know your electricity bill before it arrives.</h1>
                <p class="lead">Enter your units consumed and instantly see a transparent, slab-by-slab breakdown of exactly how your bill is calculated — no surprises, no guesswork.</p>
                <div class="d-flex flex-wrap gap-3 mt-4">
                    <a href="<%= request.getContextPath() %>/calculator" class="btn btn-spark btn-lg">
                        <i class="bi bi-calculator me-2"></i>Calculate My Bill
                    </a>
                    <a href="<%= request.getContextPath() %>/history" class="btn btn-outline-light btn-lg">
                        <i class="bi bi-clock-history me-2"></i>View History
                    </a>
                </div>
                <div class="row mt-5 gy-3">
                    <div class="col-4">
                        <div class="fw-bold fs-4">4</div>
                        <div class="small text-on-dark-muted" style="color:rgba(255,255,255,.75)">Pricing slabs</div>
                    </div>
                    <div class="col-4">
                        <div class="fw-bold fs-4">100%</div>
                        <div class="small" style="color:rgba(255,255,255,.75)">Transparent</div>
                    </div>
                    <div class="col-4">
                        <div class="fw-bold fs-4">&lt; 1s</div>
                        <div class="small" style="color:rgba(255,255,255,.75)">Calculation time</div>
                    </div>
                </div>
            </div>
            <div class="col-lg-5">
                <div class="current-meter d-flex justify-content-center">
                    <!-- Signature element: an animated voltage meter -->
                    <svg width="280" height="240" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="100" cy="100" r="92" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
                        <path d="M 30 130 A 80 80 0 0 1 170 130" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="10" stroke-linecap="round"/>
                        <path d="M 30 130 A 80 80 0 0 1 100 20" fill="none" stroke="#0ea5e9" stroke-width="10" stroke-linecap="round"/>
                        <path d="M 100 20 A 80 80 0 0 1 150 45" fill="none" stroke="#7c3aed" stroke-width="10" stroke-linecap="round"/>
                        <path d="M 150 45 A 80 80 0 0 1 170 130" fill="none" stroke="#ffb800" stroke-width="10" stroke-linecap="round"/>
                        <g class="meter-needle">
                            <line x1="100" y1="100" x2="100" y2="35" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
                            <circle cx="100" cy="100" r="8" fill="#ffffff"/>
                        </g>
                        <path class="bolt-path" d="M105 145 L92 168 L102 168 L90 190 L112 160 L100 160 Z" fill="none" stroke="#ffb800" stroke-width="3" stroke-linejoin="round"/>
                        <path d="M105 145 L92 168 L102 168 L90 190 L112 160 L100 160 Z" fill="#ffb800" opacity="0.85"/>
                    </svg>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- FEATURES -->
<section class="section-pad" id="features">
    <div class="container">
        <div class="text-center mb-5">
            <div class="eyebrow-volt">Why Voltage</div>
            <h2 class="mt-2">Everything you need to understand your bill</h2>
        </div>
        <div class="row g-4 stagger">
            <div class="col-md-6 col-lg-3">
                <div class="card-volt h-100 p-4">
                    <div class="icon-tile mb-3"><i class="bi bi-layers-half"></i></div>
                    <h5>Slab-wise Breakdown</h5>
                    <p class="text-muted-custom mb-0 small">See exactly how many units fall into each tariff slab and what each slab costs.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="card-volt h-100 p-4">
                    <div class="icon-tile mb-3"><i class="bi bi-clock-history"></i></div>
                    <h5>Bill History</h5>
                    <p class="text-muted-custom mb-0 small">Every bill you generate is saved so you can search, sort, and revisit it anytime.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="card-volt h-100 p-4">
                    <div class="icon-tile mb-3"><i class="bi bi-printer"></i></div>
                    <h5>Print-ready Receipts</h5>
                    <p class="text-muted-custom mb-0 small">Generate a clean, printable bill receipt in a single click.</p>
                </div>
            </div>
            <div class="col-md-6 col-lg-3">
                <div class="card-volt h-100 p-4">
                    <div class="icon-tile mb-3"><i class="bi bi-moon-stars"></i></div>
                    <h5>Light &amp; Dark Mode</h5>
                    <p class="text-muted-custom mb-0 small">A comfortable viewing experience, day or night, on any device.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- HOW IT WORKS -->
<section class="section-pad" style="background: var(--card-bg);">
    <div class="container">
        <div class="row align-items-center gy-5">
            <div class="col-lg-6">
                <div class="eyebrow-volt">How it works</div>
                <h2 class="mt-2 mb-4">Three simple steps</h2>
                <div class="d-flex gap-3 mb-4">
                    <div class="icon-tile flex-shrink-0">1</div>
                    <div>
                        <h6 class="mb-1">Enter your details</h6>
                        <p class="text-muted-custom small mb-0">Provide your name, customer number, and units consumed this cycle.</p>
                    </div>
                </div>
                <div class="d-flex gap-3 mb-4">
                    <div class="icon-tile flex-shrink-0">2</div>
                    <div>
                        <h6 class="mb-1">Instant slab calculation</h6>
                        <p class="text-muted-custom small mb-0">Our engine applies the four-tier tariff and computes your exact total.</p>
                    </div>
                </div>
                <div class="d-flex gap-3">
                    <div class="icon-tile flex-shrink-0">3</div>
                    <div>
                        <h6 class="mb-1">Save, print, or revisit</h6>
                        <p class="text-muted-custom small mb-0">Your bill is saved to history — print it now or come back later.</p>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="card-volt p-4">
                    <h6 class="eyebrow-volt mb-3">Current Tariff Slabs</h6>
                    <div class="slab-row"><span>First 50 units</span><span class="fw-bold">Rs. 3.50 / unit</span></div>
                    <div class="slab-row"><span>Next 100 units</span><span class="fw-bold">Rs. 4.00 / unit</span></div>
                    <div class="slab-row"><span>Next 100 units</span><span class="fw-bold">Rs. 5.20 / unit</span></div>
                    <div class="slab-row mb-0"><span>Above 250 units</span><span class="fw-bold">Rs. 6.50 / unit</span></div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA -->
<section class="section-pad">
    <div class="container">
        <div class="total-banner text-center py-5">
            <h2 class="mb-2">Ready to see your bill?</h2>
            <p class="mb-4" style="color:rgba(255,255,255,.85)">It takes less than a minute.</p>
            <a href="<%= request.getContextPath() %>/calculator" class="btn btn-spark btn-lg">
                <i class="bi bi-lightning-charge-fill me-2"></i>Start Calculating
            </a>
        </div>
    </div>
</section>

<jsp:include page="common/footer.jsp" />

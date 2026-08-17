<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<% request.setAttribute("activePage", "about"); request.setAttribute("pageTitle", "About"); %>
<jsp:include page="common/header.jsp" />

<section class="hero-volt" style="padding: 3.5rem 0 5rem;">
    <div class="container">
        <div class="text-center">
            <span class="hero-eyebrow"><i class="bi bi-info-circle"></i> About</span>
            <h1 class="mt-3 mb-2" style="font-size: clamp(1.9rem, 4vw, 2.8rem);">Built for clarity, not confusion</h1>
            <p class="lead mx-auto">Electricity bills shouldn't feel like a mystery. Voltage breaks every bill down slab by slab, so you always know exactly what you're paying for.</p>
        </div>
    </div>
</section>

<section class="section-pad" style="margin-top: -4.5rem;">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-9">
                <div class="card-volt p-4 p-md-5 mb-4">
                    <h4 class="mb-3">Our Approach</h4>
                    <p class="text-muted-custom">Voltage is a demonstration project built with a Java Servlet + JSP stack, following an MVC architecture with a clean Repository/DAO abstraction. Bills are currently stored in an in-memory repository — no external database is required to run the project — but the architecture is deliberately designed so a real database (such as MySQL) can be plugged in later by changing a single line of wiring code.</p>
                    <p class="text-muted-custom mb-0">Every bill is calculated using a transparent four-tier tariff slab, and every calculation is shown in full so nothing is hidden.</p>
                </div>

                <div class="row g-4 stagger">
                    <div class="col-md-4">
                        <div class="card-volt h-100 p-4 text-center">
                            <div class="icon-tile mx-auto mb-3"><i class="bi bi-diagram-3"></i></div>
                            <h6>MVC Architecture</h6>
                            <p class="text-muted-custom small mb-0">Controllers, services, and views are cleanly separated.</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card-volt h-100 p-4 text-center">
                            <div class="icon-tile mx-auto mb-3"><i class="bi bi-hdd-stack"></i></div>
                            <h6>Swappable Storage</h6>
                            <p class="text-muted-custom small mb-0">The Repository pattern means today's in-memory store can become MySQL tomorrow.</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card-volt h-100 p-4 text-center">
                            <div class="icon-tile mx-auto mb-3"><i class="bi bi-shield-check"></i></div>
                            <h6>Validated Input</h6>
                            <p class="text-muted-custom small mb-0">Both client-side and server-side validation keep your data clean.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<jsp:include page="common/footer.jsp" />

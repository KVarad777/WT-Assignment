<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="jakarta.tags.core" prefix="c" %>
<% request.setAttribute("activePage", "contact"); request.setAttribute("pageTitle", "Contact"); %>
<jsp:include page="common/header.jsp" />

<section class="hero-volt" style="padding: 3.5rem 0 5rem;">
    <div class="container">
        <div class="text-center">
            <span class="hero-eyebrow"><i class="bi bi-envelope"></i> Contact</span>
            <h1 class="mt-3 mb-2" style="font-size: clamp(1.9rem, 4vw, 2.8rem);">Get in touch</h1>
            <p class="lead mx-auto">Questions, feedback, or found a bug? Send us a message.</p>
        </div>
    </div>
</section>

<section class="section-pad" style="margin-top: -4.5rem;">
    <div class="container">
        <div class="row justify-content-center">
            <div class="col-lg-7">

                <c:if test="${submitted eq true}">
                    <div class="alert alert-success d-flex align-items-center gap-2">
                        <i class="bi bi-check-circle-fill"></i>
                        <div>Thanks! Your message has been received (this demo does not send email or persist messages).</div>
                    </div>
                </c:if>
                <c:if test="${submitted eq false}">
                    <div class="alert alert-danger d-flex align-items-center gap-2">
                        <i class="bi bi-exclamation-triangle-fill"></i>
                        <div>Please fill in all fields before sending.</div>
                    </div>
                </c:if>

                <div class="card-volt p-4 p-md-5">
                    <form id="contactForm" class="needs-validation" novalidate method="post" action="<%= request.getContextPath() %>/contact">
                        <div class="mb-4">
                            <label for="name" class="form-label-volt">Your Name</label>
                            <input type="text" class="form-control form-control-volt" id="name" name="name" required maxlength="100">
                            <div class="invalid-feedback">Please enter your name.</div>
                        </div>
                        <div class="mb-4">
                            <label for="email" class="form-label-volt">Email Address</label>
                            <input type="email" class="form-control form-control-volt" id="email" name="email" required maxlength="150">
                            <div class="invalid-feedback">Please enter a valid email address.</div>
                        </div>
                        <div class="mb-4">
                            <label for="message" class="form-label-volt">Message</label>
                            <textarea class="form-control form-control-volt" id="message" name="message" rows="5" required maxlength="1000"></textarea>
                            <div class="invalid-feedback">Please enter a message.</div>
                        </div>
                        <button type="submit" class="btn btn-spark btn-lg w-100">
                            <i class="bi bi-send-fill me-2"></i>Send Message
                        </button>
                    </form>
                </div>

                <div class="row g-3 mt-4 text-center">
                    <div class="col-md-4">
                        <div class="card-volt p-3">
                            <i class="bi bi-envelope-fill" style="color:var(--volt-indigo);font-size:1.4rem;"></i>
                            <div class="small mt-2 text-muted-custom">support@voltage-demo.local</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card-volt p-3">
                            <i class="bi bi-telephone-fill" style="color:var(--volt-indigo);font-size:1.4rem;"></i>
                            <div class="small mt-2 text-muted-custom">+1 (555) 010-0100</div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card-volt p-3">
                            <i class="bi bi-geo-alt-fill" style="color:var(--volt-indigo);font-size:1.4rem;"></i>
                            <div class="small mt-2 text-muted-custom">Demo Project Only</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<jsp:include page="common/footer.jsp" />

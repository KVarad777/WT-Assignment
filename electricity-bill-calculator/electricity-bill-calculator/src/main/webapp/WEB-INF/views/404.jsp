<%@ page contentType="text/html;charset=UTF-8" language="java" isErrorPage="true" %>
<% request.setAttribute("activePage", ""); request.setAttribute("pageTitle", "Page Not Found"); %>
<jsp:include page="common/header.jsp" />

<section class="section-pad" style="min-height: 65vh; display:flex; align-items:center;">
    <div class="container text-center">
        <div class="error-code">404</div>
        <h2 class="mt-3 mb-2">This circuit doesn't connect anywhere.</h2>
        <p class="text-muted-custom mb-4">The page you're looking for has been disconnected, moved, or never existed.</p>
        <div class="d-flex justify-content-center gap-3 flex-wrap">
            <a href="<%= request.getContextPath() %>/" class="btn btn-volt btn-lg">
                <i class="bi bi-house-fill me-2"></i>Back to Home
            </a>
            <a href="<%= request.getContextPath() %>/calculator" class="btn btn-outline-volt btn-lg">
                <i class="bi bi-calculator me-2"></i>Go to Calculator
            </a>
        </div>
    </div>
</section>

<jsp:include page="common/footer.jsp" />

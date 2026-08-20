<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<jsp:include page="common/header.jsp">
    <jsp:param name="title" value="Notice — Energy Ledger" />
</jsp:include>
<jsp:include page="common/navbar.jsp" />

<main class="main-content">
    <div class="container" style="padding-top: 4rem; text-align: center;">
        
        <div class="card" style="max-width: 600px; margin: 0 auto; padding: 3rem 2rem;">
            <div style="font-size: 3.5rem; margin-bottom: 1rem;">⚠️</div>
            <h2 style="font-size: 1.75rem; margin-bottom: 0.75rem;">Something went wrong</h2>
            <p style="color: var(--text-muted); font-size: 1rem; margin-bottom: 2rem;">
                <c:choose>
                    <c:when test="${not empty errorMessage}">
                        <c:out value="${errorMessage}" />
                    </c:when>
                    <c:when test="${not empty pageContext.exception}">
                        <c:out value="${pageContext.exception.message}" />
                    </c:when>
                    <c:otherwise>
                        We encountered an unexpected condition while processing your request.
                    </c:otherwise>
                </c:choose>
            </p>

            <div style="display: flex; gap: 1rem; justify-content: center;">
                <a href="${pageContext.request.contextPath}/calculator" class="btn btn-primary">
                    Return to Calculator
                </a>
                <a href="${pageContext.request.contextPath}/home" class="btn btn-secondary">
                    Go to Home Dashboard
                </a>
            </div>
        </div>

    </div>
</main>

<jsp:include page="common/footer.jsp" />

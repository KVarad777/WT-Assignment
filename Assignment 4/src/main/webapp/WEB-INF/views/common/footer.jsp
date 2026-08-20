<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<footer class="footer">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-brand">
                <div class="brand-logo">
                    <div class="brand-icon-box">⚡</div>
                    <span>ENERGY LEDGER</span>
                </div>
                <p>Enterprise progressive electricity tariff calculation, bill management, and consumption analytics portal.</p>
            </div>
            <div class="footer-links">
                <h4>Navigation</h4>
                <ul>
                    <li><a href="${pageContext.request.contextPath}/home">Home Dashboard</a></li>
                    <li><a href="${pageContext.request.contextPath}/calculator">Bill Calculator</a></li>
                    <li><a href="${pageContext.request.contextPath}/history">Statements History</a></li>
                    <li><a href="${pageContext.request.contextPath}/tariff">Tariff Schedule</a></li>
                </ul>
            </div>
            <div class="footer-links">
                <h4>Tariff Slabs</h4>
                <ul>
                    <li><span style="color:var(--slab-1-color); font-weight:600;">● First 50u</span>: ₹3.50/unit</li>
                    <li><span style="color:var(--slab-2-color); font-weight:600;">● Next 100u</span>: ₹4.00/unit</li>
                    <li><span style="color:var(--slab-3-color); font-weight:600;">● Next 100u</span>: ₹5.20/unit</li>
                    <li><span style="color:var(--slab-4-color); font-weight:600;">● >250u</span>: ₹6.50/unit</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <div>&copy; 2026 Energy Ledger System. Developed by Varad Khedkar. Built with JSP, Servlets, JDBC, MySQL &amp; Apache Tomcat.</div>
            <div>Version 1.0.0 (LTS)</div>
        </div>
    </div>
</footer>

<!-- Global Scripts -->
<script src="${pageContext.request.contextPath}/js/app.js"></script>
</body>
</html>

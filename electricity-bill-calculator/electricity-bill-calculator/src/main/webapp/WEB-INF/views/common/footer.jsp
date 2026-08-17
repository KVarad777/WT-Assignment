<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String ctx2 = request.getContextPath();
%>
</main>

<!-- Footer -->
<footer class="footer-volt">
    <div class="container">
        <div class="row g-4">
            <div class="col-lg-4">
                <h6><i class="bi bi-lightning-charge-fill" style="color:#ffb800;"></i> Voltage</h6>
                <p class="small mb-0">A modern slab-wise electricity bill calculator, built with Java Servlets, JSP and a swappable in-memory data layer.</p>
            </div>
            <div class="col-lg-2 col-6">
                <h6>Navigate</h6>
                <ul class="list-unstyled small">
                    <li class="mb-2"><a href="<%= ctx2 %>/">Home</a></li>
                    <li class="mb-2"><a href="<%= ctx2 %>/calculator">Calculator</a></li>
                    <li class="mb-2"><a href="<%= ctx2 %>/history">History</a></li>
                </ul>
            </div>
            <div class="col-lg-2 col-6">
                <h6>Company</h6>
                <ul class="list-unstyled small">
                    <li class="mb-2"><a href="<%= ctx2 %>/about">About</a></li>
                    <li class="mb-2"><a href="<%= ctx2 %>/contact">Contact</a></li>
                </ul>
            </div>
            <div class="col-lg-4">
                <h6>Tariff Slabs</h6>
                <ul class="list-unstyled small mb-0">
                    <li>First 50 units — Rs. 3.50/unit</li>
                    <li>Next 100 units — Rs. 4.00/unit</li>
                    <li>Next 100 units — Rs. 5.20/unit</li>
                    <li>Above 250 units — Rs. 6.50/unit</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
            <span>&copy; <%= java.time.Year.now() %> Voltage Electricity Bill Calculator. All rights reserved.</span>
            <span class="text-muted-custom">Built with Java &bull; Servlets &bull; JSP &bull; Bootstrap 5</span>
        </div>
    </div>
</footer>

<!-- Bootstrap 5 JS Bundle -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<!-- App script -->
<script src="<%= ctx2 %>/js/script.js"></script>

</body>
</html>

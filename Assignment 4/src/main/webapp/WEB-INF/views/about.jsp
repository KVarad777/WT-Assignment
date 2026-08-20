<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<jsp:include page="common/header.jsp">
    <jsp:param name="title" value="About & Architecture — Energy Ledger" />
</jsp:include>
<jsp:include page="common/navbar.jsp" />

<main class="main-content">
    <div class="container" style="padding-top: 2.5rem;">
        
        <!-- Page Title -->
        <div style="margin-bottom: 2.5rem;">
            <span class="badge badge-amber">System Documentation</span>
            <h1 style="font-size: 2.25rem; margin-top: 0.5rem;">System Architecture &amp; Specification</h1>
            <p style="color: var(--text-muted); font-size: 1rem; max-width: 750px;">
                Comprehensive overview of the Energy Ledger web application architecture, progressive billing mathematics, database schema, and technology stack.
            </p>
        </div>

        <!-- Technology Stack Grid -->
        <div class="card" style="margin-bottom: 2.5rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 1.25rem;">Technology Stack Overview</h3>
            <div class="table-responsive">
                <table class="custom-table">
                    <thead>
                        <tr>
                            <th>Layer</th>
                            <th>Technology Component</th>
                            <th>Role &amp; Responsibility</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Presentation Layer</strong></td>
                            <td>JSP 2.3, JSTL 1.2, HTML5, Vanilla CSS3, JS</td>
                            <td>Dynamic server-side view rendering, responsive design system, and client-side reactive previews.</td>
                        </tr>
                        <tr>
                            <td><strong>Controller / Servlet Layer</strong></td>
                            <td>Java Servlets (Servlet 3.1 Standard)</td>
                            <td>Routing, request handling, input sanitization, error dispatching, and view redirection.</td>
                        </tr>
                        <tr>
                            <td><strong>Service / Business Layer</strong></td>
                            <td><code>ElectricityBillService</code>, <code>BillService</code></td>
                            <td>Progressive tariff slab computation with <code>BigDecimal</code> precision, consumption classification, and insights.</td>
                        </tr>
                        <tr>
                            <td><strong>Persistence / DAO Layer</strong></td>
                            <td>JDBC with <code>PreparedStatement</code></td>
                            <td>Safe, parameterized database access preventing SQL injection attacks.</td>
                        </tr>
                        <tr>
                            <td><strong>Database Engine</strong></td>
                            <td>MySQL / MariaDB (XAMPP Environment)</td>
                            <td>Relational schema storing customers, bill records, and configurable tariff slabs.</td>
                        </tr>
                        <tr>
                            <td><strong>Application Server</strong></td>
                            <td>Apache Tomcat 8.5+</td>
                            <td>Java EE servlet container managing request lifecycles and WAR deployment.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Mathematical Formula Section -->
        <div class="card" style="margin-bottom: 2.5rem;">
            <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">Progressive Tariff Mathematical Formula</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">
                Given total units consumed $U \ge 0$, the total energy charge $C(U)$ is computed as a piecewise linear function:
            </p>
            <div style="background: var(--bg-surface-elevated); padding: 1.5rem; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.8;">
                • If <strong>U &le; 50</strong>:<br>
                &nbsp;&nbsp;&nbsp;&nbsp;Charge = U &times; 3.50<br><br>
                • If <strong>50 &lt; U &le; 150</strong>:<br>
                &nbsp;&nbsp;&nbsp;&nbsp;Charge = (50 &times; 3.50) + ((U - 50) &times; 4.00)<br><br>
                • If <strong>150 &lt; U &le; 250</strong>:<br>
                &nbsp;&nbsp;&nbsp;&nbsp;Charge = (50 &times; 3.50) + (100 &times; 4.00) + ((U - 150) &times; 5.20)<br><br>
                • If <strong>U &gt; 250</strong>:<br>
                &nbsp;&nbsp;&nbsp;&nbsp;Charge = (50 &times; 3.50) + (100 &times; 4.00) + (100 &times; 5.20) + ((U - 250) &times; 6.50)<br>
            </div>
        </div>

        <!-- Database Schema Breakdown -->
        <div class="card">
            <h3 style="font-size: 1.25rem; margin-bottom: 1rem;">Database Schema &amp; Entities</h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.25rem;">
                The MySQL database <code>electricity_bill_db</code> enforces relational integrity and optimal indexing:
            </p>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
                <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md);">
                    <h4 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--accent-amber);">1. customers</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">
                        Stores consumer profiles (<code>id</code>, <code>customer_name</code>, <code>consumer_number [UNIQUE]</code>, <code>email</code>, <code>phone</code>, <code>address</code>, <code>created_at</code>).
                    </p>
                </div>
                <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md);">
                    <h4 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--accent-amber);">2. bills</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">
                        Stores generated statements (<code>id</code>, <code>customer_id [FK]</code>, <code>billing_month</code>, <code>previous_reading</code>, <code>current_reading</code>, <code>units_consumed</code>, <code>energy_charge</code>, <code>total_amount</code>, <code>created_at</code>).
                    </p>
                </div>
                <div style="background: var(--bg-surface-elevated); padding: 1.25rem; border-radius: var(--radius-md);">
                    <h4 style="font-size: 1rem; margin-bottom: 0.5rem; color: var(--accent-amber);">3. bill_slabs</h4>
                    <p style="font-size: 0.85rem; color: var(--text-muted);">
                        Stores multi-tier rate configuration (<code>id</code>, <code>slab_order</code>, <code>slab_name</code>, <code>min_units</code>, <code>max_units</code>, <code>rate</code>, <code>description</code>).
                    </p>
                </div>
            </div>
        </div>

    </div>
</main>

<jsp:include page="common/footer.jsp" />

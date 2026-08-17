<div id="analytics-tab" class="tab-panel <?= ($selected_customer_id) ? 'active' : '' ?>">
    <div class="card">
        <h2 style="margin-bottom: 1rem;">Customer Management & Analytics</h2>
        
        <!-- Filter Form -->
        <form action="" method="GET" style="margin-bottom: 1.5rem;">
            <div style="display:flex; gap:0.5rem;">
                <select name="customer_id" required>
                    <option value="">-- Select Customer Profile --</option>
                    <?php 
                    $all_customers->data_seek(0);
                    while($c = $all_customers->fetch_assoc()): 
                    ?>
                        <option value="<?= $c['id'] ?>" <?= ($selected_customer_id == $c['id']) ? 'selected' : '' ?>>
                            <?= htmlspecialchars($c['customer_name']) ?> (<?= $c['meter_number'] ?>)
                        </option>
                    <?php endwhile; ?>
                </select>
                <button type="submit" class="btn">Filter</button>
            </div>
        </form>

        <?php if ($selected_customer_id && $cust_analytics): ?>
            <!-- Individual KPI Cards -->
            <div style="background:var(--table-header); padding:1.25rem; border-radius:12px; margin-bottom:1.5rem; display:grid; grid-template-columns:repeat(3, 1fr); gap:1rem;">
                <div>
                    <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">TOTAL BILLS RECORDED</span>
                    <h4 style="font-size:1.25rem;"><?= $cust_analytics['total_bills'] ?> Months</h4>
                </div>
                <div>
                    <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">AVERAGE CONSUMPTION</span>
                    <h4 style="font-size:1.25rem; color:var(--brand-color);"><?= number_format($cust_analytics['avg_units'] ?? 0, 1) ?> kWh / month</h4>
                </div>
                <div>
                    <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">LIFETIME SPEND</span>
                    <h4 style="font-size:1.25rem; color:#10b981;">₹<?= number_format($cust_analytics['total_paid'] ?? 0, 2) ?></h4>
                </div>
            </div>

            <!-- Consumption Line Graph -->
            <div style="margin-bottom: 2rem; background: var(--panel-bg); padding:1rem; border-radius:12px; border:1px solid var(--border-color);">
                <h3>Monthly Usage Trend (kWh)</h3>
                <canvas id="usageChart" style="max-height: 300px; margin-top: 1rem;"></canvas>
            </div>

            <!-- Month-Wise Ledger Table -->
            <h3>Month-Wise Billing Ledger</h3>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Period</th>
                            <th>Units Used</th>
                            <th>Avg Comparison</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php 
                        $chart_labels = [];
                        $chart_data = [];

                        $records = $conn->query("SELECT * FROM bills WHERE customer_id = $selected_customer_id ORDER BY billing_year ASC, id ASC");
                        
                        while($r = $records->fetch_assoc()):
                            $chart_labels[] = $r['billing_month'] . ' ' . $r['billing_year'];
                            $chart_data[] = $r['units_consumed'];
                            
                            $diff = $r['units_consumed'] - $cust_analytics['avg_units'];
                            $diff_text = ($diff >= 0) ? "<span style='color:#ef4444;'>+".number_format($diff, 1)." kWh</span>" : "<span style='color:#10b981;'>".number_format($diff, 1)." kWh</span>";
                        ?>
                            <tr>
                                <td><strong><?= $r['billing_month'] ?> <?= $r['billing_year'] ?></strong></td>
                                <td><?= $r['units_consumed'] ?> kWh</td>
                                <td><?= $diff_text ?></td>
                                <td><strong>₹<?= number_format($r['total_amount'], 2) ?></strong></td>
                                <td>
                                    <!-- Status Toggle Form -->
                                    <form action="" method="POST" style="display:inline;">
                                        <input type="hidden" name="action" value="toggle_status">
                                        <input type="hidden" name="bill_id" value="<?= $r['id'] ?>">
                                        <input type="hidden" name="current_status" value="<?= $r['status'] ?>">
                                        <input type="hidden" name="customer_id" value="<?= $selected_customer_id ?>">
                                        <button type="submit" style="background:none; border:none; cursor:pointer;" title="Click to Toggle Status">
                                            <span class="badge badge-<?= strtolower($r['status']) ?>">
                                                <?= $r['status'] ?> 🔄
                                            </span>
                                        </button>
                                    </form>
                                </td>
                                <td>
                                    <a href="?customer_id=<?= $selected_customer_id ?>&view_bill_id=<?= $r['id'] ?>#invoice-section" class="btn btn-secondary btn-sm">
                                        📄 View Invoice
                                    </a>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    </tbody>
                </table>
            </div>

            <!-- Chart.js Script Injection -->
            <script>
            document.addEventListener("DOMContentLoaded", function() {
                const ctx = document.getElementById('usageChart').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: <?= json_encode($chart_labels) ?>,
                        datasets: [{
                            label: 'Electricity Usage (kWh)',
                            data: <?= json_encode($chart_data) ?>,
                            borderColor: '#2563eb',
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            fill: true,
                            tension: 0.3,
                            borderWidth: 3
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: { beginAtZero: true }
                        }
                    }
                });
            });
            </script>

            <!-- EMBEDDED INVOICE VIEW -->
            <?php if ($bill_detail): ?>
                <div id="invoice-section" class="printable-receipt">
                    <div class="invoice-header">
                        <div>
                            <h2>POWERPAY UTILITIES</h2>
                            <p style="color:#64748b;">Official Tax Invoice & Consumption Receipt</p>
                        </div>
                        <div style="text-align:right;">
                            <span class="badge badge-<?= strtolower($bill_detail['status']) ?>" style="font-size:1rem;"><?= $bill_detail['status'] ?></span>
                            <p style="font-size:0.85rem; margin-top:0.5rem; color:#64748b;">Invoice #INV-<?= $bill_detail['billing_year'] ?>-<?= $bill_detail['id'] ?></p>
                        </div>
                    </div>

                    <div class="invoice-meta">
                        <div>
                            <span style="font-size:0.75rem; color:#64748b; font-weight:700;">CUSTOMER</span>
                            <p><strong><?= htmlspecialchars($bill_detail['customer_name']) ?></strong></p>
                            <p style="font-size:0.85rem; color:#64748b;"><?= htmlspecialchars($bill_detail['address']) ?></p>
                        </div>
                        <div>
                            <span style="font-size:0.75rem; color:#64748b; font-weight:700;">METER NO</span>
                            <p><strong><?= htmlspecialchars($bill_detail['meter_number']) ?></strong></p>
                            <p style="font-size:0.85rem; color:#64748b;">Phone: <?= htmlspecialchars($bill_detail['phone']) ?></p>
                        </div>
                        <div>
                            <span style="font-size:0.75rem; color:#64748b; font-weight:700;">BILLING PERIOD</span>
                            <p><strong><?= $bill_detail['billing_month'] ?> <?= $bill_detail['billing_year'] ?></strong></p>
                            <p style="font-size:0.85rem; color:#64748b;">Due Date: <?= $bill_detail['due_date'] ?></p>
                        </div>
                    </div>

                    <h3>Cost Calculation Breakdown</h3>
                    <table class="table" style="margin-bottom:1.5rem;">
                        <thead>
                            <tr>
                                <th>Usage Slab</th>
                                <th>Rate</th>
                                <th>Units Applied</th>
                                <th>Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php
                            $calc = calculateElectricityBill($bill_detail['units_consumed']);
                            foreach($calc['breakdown'] as $row):
                            ?>
                                <tr>
                                    <td><?= $row['slab'] ?></td>
                                    <td>₹<?= number_format($row['rate'], 2) ?></td>
                                    <td><?= $row['units'] ?> kWh</td>
                                    <td>₹<?= number_format($row['cost'], 2) ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>

                    <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:1.25rem; border-radius:12px; color:#0f172a;">
                        <div>
                            <span>Total Units Consumed:</span>
                            <strong><?= $bill_detail['units_consumed'] ?> kWh</strong>
                        </div>
                        <div style="text-align:right;">
                            <span style="font-size:0.8rem; text-transform:uppercase; color:#64748b; font-weight:700;">Total Payable</span>
                            <h2 style="color:#2563eb; font-size:2rem;">₹<?= number_format($bill_detail['total_amount'], 2) ?></h2>
                        </div>
                    </div>

                    <div style="margin-top:2rem;" class="no-print">
                        <button onclick="window.print()" class="btn">🖨️ Print / Download PDF Invoice</button>
                    </div>
                </div>
            <?php endif; ?>

        <?php else: ?>
            <p style="color:var(--text-muted);">Please select a customer profile above to load their monthly usage line chart, payment records, and invoice receipts.</p>
        <?php endif; ?>
    </div>
</div>
<div id="receipt-tab" class="tab-panel <?= ($view_bill_id) ? 'active' : '' ?>">
    <?php if ($bill_detail): ?>
        <div class="card printable-receipt">
            <div class="invoice-header">
                <div>
                    <h2>POWERPAY UTILITIES</h2>
                    <p style="color:var(--text-muted);">Official Tax Invoice & Consumption Receipt</p>
                </div>
                <div style="text-align:right;">
                    <span class="badge badge-<?= strtolower($bill_detail['status']) ?>" style="font-size:1rem;"><?= $bill_detail['status'] ?></span>
                    <p style="font-size:0.85rem; margin-top:0.5rem; color:var(--text-muted);">Invoice #INV-<?= $bill_detail['billing_year'] ?>-<?= $bill_detail['id'] ?></p>
                </div>
            </div>

            <div class="invoice-meta">
                <div>
                    <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">CUSTOMER</span>
                    <p><strong><?= htmlspecialchars($bill_detail['customer_name']) ?></strong></p>
                    <p style="font-size:0.85rem; color:var(--text-muted);"><?= htmlspecialchars($bill_detail['address']) ?></p>
                </div>
                <div>
                    <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">METER NO</span>
                    <p><strong><?= htmlspecialchars($bill_detail['meter_number']) ?></strong></p>
                    <p style="font-size:0.85rem; color:var(--text-muted);">Phone: <?= htmlspecialchars($bill_detail['phone']) ?></p>
                </div>
                <div>
                    <span style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">BILLING PERIOD</span>
                    <p><strong><?= $bill_detail['billing_month'] ?> <?= $bill_detail['billing_year'] ?></strong></p>
                    <p style="font-size:0.85rem; color:var(--text-muted);">Due Date: <?= $bill_detail['due_date'] ?></p>
                </div>
            </div>

            <h3>Tiered Cost Breakdown</h3>
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

            <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:1.25rem; border-radius:12px;">
                <div>
                    <span>Total Units Consumed:</span>
                    <strong><?= $bill_detail['units_consumed'] ?> kWh</strong>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:0.8rem; text-transform:uppercase; color:var(--text-muted); font-weight:700;">Total Payable</span>
                    <h2 style="color:var(--brand-color); font-size:2rem;">₹<?= number_format($bill_detail['total_amount'], 2) ?></h2>
                </div>
            </div>

            <div style="margin-top:2rem;" class="no-print">
                <button onclick="window.print()" class="btn">🖨️ Print / Save PDF Invoice</button>
            </div>
        </div>
    <?php else: ?>
        <div class="card">
            <p style="color:var(--text-muted);">No invoice selected. Click "View Invoice" next to any entry in the Customer Records tab to view or print receipts.</p>
        </div>
    <?php endif; ?>
</div>
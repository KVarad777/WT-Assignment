<div id="generate-tab" class="tab-panel <?= (!$selected_customer_id && !$view_bill_id) ? 'active' : '' ?>">
    <div class="card">
        <h2 style="margin-bottom: 1.25rem;">Generate Month-Wise Electricity Bill</h2>
        <form action="" method="POST">
            <input type="hidden" name="action" value="generate_bill">
            <div class="grid-2">
                <div>
                    <div class="form-group">
                        <label>Select Customer</label>
                        <select name="customer_id" required>
                            <option value="">-- Choose Registered Meter --</option>
                            <?php 
                            $all_customers->data_seek(0);
                            while($c = $all_customers->fetch_assoc()): 
                            ?>
                                <option value="<?= $c['id'] ?>"><?= htmlspecialchars($c['customer_name']) ?> (Meter: <?= $c['meter_number'] ?>)</option>
                            <?php endwhile; ?>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Units Consumed (kWh)</label>
                        <input type="number" step="0.1" name="units" placeholder="e.g. 210" required>
                    </div>
                </div>

                <div>
                    <div class="form-group">
                        <label>Billing Month</label>
                        <select name="billing_month" required>
                            <?php 
                            $months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                            foreach($months as $m) {
                                $sel = ($m == date('F')) ? 'selected' : '';
                                echo "<option value='$m' $sel>$m</option>";
                            }
                            ?>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Billing Year</label>
                        <input type="number" name="billing_year" value="<?= date('Y') ?>" required>
                    </div>
                </div>
            </div>

            <button type="submit" class="btn">Calculate & Post Bill</button>
        </form>
    </div>
</div>
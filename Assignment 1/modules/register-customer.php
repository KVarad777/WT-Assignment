<div id="register-tab" class="tab-panel">
    <div class="card">
        <h2 style="margin-bottom:1rem;">Register New Account</h2>
        <form action="" method="POST">
            <input type="hidden" name="action" value="add_customer">
            <div class="grid-2">
                <div class="form-group">
                    <label>Customer Full Name</label>
                    <input type="text" name="customer_name" placeholder="e.g. Vikram Singh" required>
                </div>
                <div class="form-group">
                    <label>Meter Serial Number</label>
                    <input type="text" name="meter_number" placeholder="e.g. MTR-88401" required>
                </div>
                <div class="form-group">
                    <label>Phone Number</label>
                    <input type="text" name="phone" placeholder="e.g. 9811122334">
                </div>
                <div class="form-group">
                    <label>Billing Address</label>
                    <input type="text" name="address" placeholder="e.g. 12 Flat Hill Road">
                </div>
            </div>
            <button type="submit" class="btn">Register Account</button>
        </form>
    </div>
</div>
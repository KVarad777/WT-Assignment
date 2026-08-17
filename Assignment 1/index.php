<?php
require_once 'config/db.php';
require_once 'includes/functions.php';

$msg = '';
$selected_customer_id = isset($_GET['customer_id']) ? intval($_GET['customer_id']) : null;
$view_bill_id = isset($_GET['view_bill_id']) ? intval($_GET['view_bill_id']) : null;

// 1. REGISTER CUSTOMER
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_customer') {
    $name = trim($_POST['customer_name'] ?? '');
    $meter = trim($_POST['meter_number'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $address = trim($_POST['address'] ?? '42 Residential Sector, Power City');

    if (!empty($name) && !empty($meter)) {
        $stmt = $conn->prepare("INSERT INTO customers (customer_name, meter_number, phone, address) VALUES (?, ?, ?, ?)");
        if ($stmt) {
            $stmt->bind_param("ssss", $name, $meter, $phone, $address);
            if ($stmt->execute()) {
                $msg = "Customer registered successfully!";
            }
            $stmt->close();
        }
    }
}

// 2. GENERATE BILL
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'generate_bill') {
    $customer_id = intval($_POST['customer_id']);
    $units = floatval($_POST['units']);
    $month = $_POST['billing_month'] ?? date('F');
    $year = intval($_POST['billing_year'] ?? date('Y'));
    $due_date = date('Y-m-d', strtotime('+15 days'));

    if ($customer_id > 0 && $units >= 0) {
        $calc = calculateElectricityBill($units);
        $total_bill = $calc['total'];

        $stmt = $conn->prepare("INSERT INTO bills (customer_id, units_consumed, total_amount, billing_month, billing_year, due_date) VALUES (?, ?, ?, ?, ?, ?)");
        if ($stmt) {
            $stmt->bind_param("iddsis", $customer_id, $units, $total_bill, $month, $year, $due_date);
            if ($stmt->execute()) {
                $view_bill_id = $stmt->insert_id;
                $selected_customer_id = $customer_id;
                $msg = "Bill generated for $month $year successfully!";
            }
            $stmt->close();
        }
    }
}

// 3. TOGGLE PAID/UNPAID STATUS
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'toggle_status') {
    $bill_id = intval($_POST['bill_id']);
    $current_status = $_POST['current_status'];
    $new_status = ($current_status === 'PAID') ? 'UNPAID' : 'PAID';

    $stmt = $conn->prepare("UPDATE bills SET status = ? WHERE id = ?");
    if ($stmt) {
        $stmt->bind_param("si", $new_status, $bill_id);
        $stmt->execute();
        $stmt->close();
        $msg = "Bill status updated to $new_status!";
    }
}

// 4. ACCURATE GLOBAL METRICS (Fixed SQL Queries)
$total_cust = $conn->query("SELECT COUNT(*) as cnt FROM customers")->fetch_assoc()['cnt'];
$bill_stats = $conn->query("
    SELECT 
        COUNT(*) AS total_bills,
        COALESCE(SUM(total_amount), 0) AS total_revenue,
        COALESCE(SUM(CASE WHEN status = 'UNPAID' THEN total_amount ELSE 0 END), 0) AS pending_receivables
    FROM bills
")->fetch_assoc();
// 5. ACCURATE INDIVIDUAL METRICS (Fixed SQL Queries)
$cust_analytics = null;
if ($selected_customer_id) {
    $stmt = $conn->prepare("
        SELECT 
            COUNT(*) as total_bills, 
            COALESCE(ROUND(AVG(units_consumed), 1), 0) as avg_units, 
            COALESCE(SUM(CASE WHEN status = 'PAID' THEN total_amount ELSE 0 END), 0) as total_paid,
            COALESCE(SUM(total_amount), 0) as total_billed
        FROM bills 
        WHERE customer_id = ?
    ");
    $stmt->bind_param("i", $selected_customer_id);
    $stmt->execute();
    $cust_analytics = $stmt->get_result()->fetch_assoc();
    $stmt->close();
}

// 6. FETCH INVOICE RECEIPT DETAILS
$bill_detail = null;
if ($view_bill_id) {
    $q = $conn->query("SELECT b.*, c.customer_name, c.meter_number, c.phone, c.address FROM bills b JOIN customers c ON b.customer_id = c.id WHERE b.id = $view_bill_id");
    if ($q) $bill_detail = $q->fetch_assoc();
}

$all_customers = $conn->query("SELECT * FROM customers ORDER BY id DESC");

require_once 'includes/header.php';
?>

<!-- Main Content Wrapper -->
<div class="container">

    <!-- Global Bento Grid -->
    <div class="grid-3">
    <div class="stat-card">
        <span>Total Customers</span>
        <h3><?= number_format($total_cust) ?> Accounts</h3>
    </div>

    <div class="stat-card" style="border-top-color: #f59e0b;">
        <span>Pending Receivables</span>
        <h3>₹<?= number_format($bill_stats['pending_receivables'], 2) ?></h3>
    </div>

    <div class="stat-card" style="border-top-color: #8b5cf6;">
        <span>Total Billed Revenue</span>
        <h3>₹<?= number_format($bill_stats['total_revenue'], 2) ?></h3>
    </div>
</div>
    <!-- Alert Notification -->
    <?php if ($msg): ?>
        <div style="padding: 1rem 1.25rem; background: var(--success-bg); color: var(--success-color); border: 1px solid var(--success-color); border-radius: 12px; margin-bottom: 1.5rem; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
            ⚡ <?= htmlspecialchars($msg) ?>
        </div>
    <?php endif; ?>

    <!-- Tab Navigation Controls -->
    <div class="tabs no-print">
        <button class="tab-btn <?= (!$selected_customer_id && !$view_bill_id) ? 'active' : '' ?>" onclick="switchTab('generate-tab')">➕ Generate Bill</button>
        <button class="tab-btn <?= ($selected_customer_id) ? 'active' : '' ?>" onclick="switchTab('analytics-tab')">📊 Customer Analytics & Ledger</button>
        <?php if ($view_bill_id): ?>
            <button class="tab-btn active" onclick="switchTab('receipt-tab')">📄 Invoice Receipt</button>
        <?php endif; ?>
        <button class="tab-btn" onclick="switchTab('register-tab')">👤 New Customer</button>
    </div>

    <!-- Load Module Views -->
    <?php 
    require_once 'modules/generate-bill.php';
    require_once 'modules/customer-analytics.php';
    require_once 'modules/register-customer.php';

    if ($view_bill_id && file_exists('modules/receipt.php')) {
        require_once 'modules/receipt.php';
    }

    require_once 'includes/footer.php';
    ?>
</div>

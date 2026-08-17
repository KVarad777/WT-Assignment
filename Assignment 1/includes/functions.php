<?php
/**
 * Tiered electricity bill calculation engine
 */
function calculateElectricityBill($units) {
    $temp_units = $units;
    $total_bill = 0;
    $breakdown = [];

    // Tier 1: 0 - 50 @ 3.50
    if ($temp_units > 0) {
        $s1 = min($temp_units, 50);
        $cost1 = $s1 * 3.50;
        $total_bill += $cost1;
        $breakdown[] = ['slab' => 'First 50 Units', 'rate' => 3.50, 'units' => $s1, 'cost' => $cost1];
        $temp_units -= $s1;
    }

    // Tier 2: 51 - 150 @ 4.00
    if ($temp_units > 0) {
        $s2 = min($temp_units, 100);
        $cost2 = $s2 * 4.00;
        $total_bill += $cost2;
        $breakdown[] = ['slab' => 'Next 100 Units (51-150)', 'rate' => 4.00, 'units' => $s2, 'cost' => $cost2];
        $temp_units -= $s2;
    }

    // Tier 3: 151 - 250 @ 5.20
    if ($temp_units > 0) {
        $s3 = min($temp_units, 100);
        $cost3 = $s3 * 5.20;
        $total_bill += $cost3;
        $breakdown[] = ['slab' => 'Next 100 Units (151-250)', 'rate' => 5.20, 'units' => $s3, 'cost' => $cost3];
        $temp_units -= $s3;
    }

    // Tier 4: Above 250 @ 6.50
    if ($temp_units > 0) {
        $cost4 = $temp_units * 6.50;
        $total_bill += $cost4;
        $breakdown[] = ['slab' => 'Above 250 Units', 'rate' => 6.50, 'units' => $temp_units, 'cost' => $cost4];
    }

    return [
        'total' => $total_bill,
        'breakdown' => $breakdown
    ];
}
?>

package com.electricity.service;

import com.electricity.model.BillBreakdown;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.math.BigDecimal;
import java.math.RoundingMode;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Rigorous boundary and edge-case unit tests for Progressive Electricity Tariff Calculation.
 */
public class ElectricityBillServiceTest {

    private ElectricityBillService service;

    @BeforeEach
    public void setUp() {
        service = new ElectricityBillService();
    }

    @ParameterizedTest(name = "Consumption: {0} units => Expected Bill: ₹{1}")
    @CsvSource({
        "0, 0.00",
        "1, 3.50",
        "30, 105.00",
        "50, 175.00",
        "51, 179.00",
        "100, 375.00",
        "150, 575.00",
        "200, 835.00",
        "201, 840.20",
        "250, 1095.00",
        "251, 1101.50",
        "300, 1420.00",
        "500, 2720.00",
        "1000, 5970.00"
    })
    @DisplayName("Test Progressive Slab Boundaries and Examples")
    public void testProgressiveSlabCalculations(double units, double expectedAmount) {
        BillBreakdown breakdown = service.calculateBill(BigDecimal.valueOf(units));
        assertNotNull(breakdown);
        assertEquals(new BigDecimal(String.format("%.2f", expectedAmount)), breakdown.getTotalAmount(),
                "Mismatch for units: " + units);
        assertEquals(breakdown.getTotalAmount(), breakdown.getEnergyCharge());
    }

    @Test
    @DisplayName("Test 300 units full slab breakdown structure")
    public void test300UnitsDetailedBreakdown() {
        BillBreakdown breakdown = service.calculateBill(new BigDecimal("300.00"));
        assertEquals(new BigDecimal("1420.00"), breakdown.getTotalAmount());
        assertEquals(4, breakdown.getSlabItems().size());

        // Slab 1: 50 * 3.50 = 175.00
        assertEquals(new BigDecimal("50.00"), breakdown.getSlabItems().get(0).getUnitsInSlab());
        assertEquals(new BigDecimal("175.00"), breakdown.getSlabItems().get(0).getAmount());

        // Slab 2: 100 * 4.00 = 400.00
        assertEquals(new BigDecimal("100.00"), breakdown.getSlabItems().get(1).getUnitsInSlab());
        assertEquals(new BigDecimal("400.00"), breakdown.getSlabItems().get(1).getAmount());

        // Slab 3: 100 * 5.20 = 520.00
        assertEquals(new BigDecimal("100.00"), breakdown.getSlabItems().get(2).getUnitsInSlab());
        assertEquals(new BigDecimal("520.00"), breakdown.getSlabItems().get(2).getAmount());

        // Slab 4: 50 * 6.50 = 325.00
        assertEquals(new BigDecimal("50.00"), breakdown.getSlabItems().get(3).getUnitsInSlab());
        assertEquals(new BigDecimal("325.00"), breakdown.getSlabItems().get(3).getAmount());

        // Highest slab reached is 4
        assertEquals(4, breakdown.getHighestSlabReached());

        // Effective average rate: 1420 / 300 = 4.7333
        assertEquals(new BigDecimal("4.7333"), breakdown.getEffectiveAverageRate());
    }

    @Test
    @DisplayName("Test negative units consumption throws IllegalArgumentException")
    public void testNegativeUnitsException() {
        assertThrows(IllegalArgumentException.class, () -> {
            service.calculateBill(new BigDecimal("-10.00"));
        });
    }

    @Test
    @DisplayName("Test fractional units: 75.5 units")
    public void testFractionalUnits() {
        // 50 * 3.50 (175.00) + 25.5 * 4.00 (102.00) = 277.00
        BillBreakdown breakdown = service.calculateBill(new BigDecimal("75.50"));
        assertEquals(new BigDecimal("277.00"), breakdown.getTotalAmount());
    }
}

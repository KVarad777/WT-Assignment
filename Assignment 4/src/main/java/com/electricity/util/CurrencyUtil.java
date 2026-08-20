package com.electricity.util;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.Locale;

/**
 * Utility for formatting Indian Rupee currency and unit metrics.
 */
public class CurrencyUtil {

    private static final Locale INDIA_LOCALE = new Locale("en", "IN");

    /**
     * Formats a BigDecimal amount as Indian Rupee string (e.g., ₹1,420.00).
     */
    public static String formatINR(BigDecimal amount) {
        if (amount == null) {
            return "₹0.00";
        }
        DecimalFormat formatter = (DecimalFormat) NumberFormat.getCurrencyInstance(INDIA_LOCALE);
        formatter.setCurrency(java.util.Currency.getInstance("INR"));
        return formatter.format(amount.setScale(2, RoundingMode.HALF_UP));
    }

    /**
     * Formats a double amount as Indian Rupee string.
     */
    public static String formatINR(double amount) {
        return formatINR(BigDecimal.valueOf(amount));
    }

    /**
     * Formats units to two decimal places or integer when whole (e.g. "300 units" or "245.50 units").
     */
    public static String formatUnits(BigDecimal units) {
        if (units == null) {
            return "0.00";
        }
        if (units.stripTrailingZeros().scale() <= 0) {
            return units.setScale(0, RoundingMode.HALF_UP).toPlainString();
        }
        return units.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }

    /**
     * Formats rate per unit string (e.g., ₹3.50/unit).
     */
    public static String formatRate(BigDecimal rate) {
        if (rate == null) {
            return "₹0.00";
        }
        return "₹" + rate.setScale(2, RoundingMode.HALF_UP).toPlainString();
    }
}

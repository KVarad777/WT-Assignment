package com.electricity.util;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * Server-side input validation utility for electricity billing forms.
 */
public class ValidationUtil {

    private static final Pattern CONSUMER_NUM_PATTERN = Pattern.compile("^[A-Za-z0-9\\-_/]{3,30}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    public static class ValidationResult {
        private final List<String> errors = new ArrayList<>();

        public void addError(String message) {
            errors.add(message);
        }

        public boolean isValid() {
            return errors.isEmpty();
        }

        public List<String> getErrors() {
            return errors;
        }

        public String getFirstError() {
            return errors.isEmpty() ? "" : errors.get(0);
        }
    }

    /**
     * Validates customer information and consumption parameters.
     */
    public static ValidationResult validateBillInput(
            String customerName,
            String consumerNumber,
            String billingMonth,
            String prevReadingStr,
            String currReadingStr,
            String directUnitsStr,
            boolean isDirectUnits) {

        ValidationResult result = new ValidationResult();

        if (customerName == null || customerName.trim().isEmpty()) {
            result.addError("Customer name is required.");
        } else if (customerName.trim().length() < 2 || customerName.trim().length() > 100) {
            result.addError("Customer name must be between 2 and 100 characters.");
        }

        if (consumerNumber == null || consumerNumber.trim().isEmpty()) {
            result.addError("Consumer number is required.");
        } else if (!CONSUMER_NUM_PATTERN.matcher(consumerNumber.trim()).matches()) {
            result.addError("Consumer number must be 3-30 characters (letters, numbers, hyphens allowed).");
        }

        if (billingMonth == null || billingMonth.trim().isEmpty()) {
            result.addError("Billing month is required.");
        }

        if (isDirectUnits) {
            if (directUnitsStr == null || directUnitsStr.trim().isEmpty()) {
                result.addError("Units consumed must be specified.");
            } else {
                try {
                    BigDecimal units = new BigDecimal(directUnitsStr.trim());
                    if (units.compareTo(BigDecimal.ZERO) < 0) {
                        result.addError("Units consumed cannot be negative.");
                    }
                    if (units.compareTo(new BigDecimal("100000")) > 0) {
                        result.addError("Units consumed exceeds maximum realistic threshold (100,000 units).");
                    }
                } catch (NumberFormatException e) {
                    result.addError("Units consumed must be a valid numeric value.");
                }
            }
        } else {
            BigDecimal prev = BigDecimal.ZERO;
            BigDecimal curr = null;

            if (prevReadingStr != null && !prevReadingStr.trim().isEmpty()) {
                try {
                    prev = new BigDecimal(prevReadingStr.trim());
                    if (prev.compareTo(BigDecimal.ZERO) < 0) {
                        result.addError("Previous meter reading cannot be negative.");
                    }
                } catch (NumberFormatException e) {
                    result.addError("Previous meter reading must be a valid number.");
                }
            }

            if (currReadingStr == null || currReadingStr.trim().isEmpty()) {
                result.addError("Current meter reading is required.");
            } else {
                try {
                    curr = new BigDecimal(currReadingStr.trim());
                    if (curr.compareTo(BigDecimal.ZERO) < 0) {
                        result.addError("Current meter reading cannot be negative.");
                    }
                } catch (NumberFormatException e) {
                    result.addError("Current meter reading must be a valid number.");
                }
            }

            if (curr != null && prev.compareTo(BigDecimal.ZERO) >= 0) {
                if (curr.compareTo(prev) < 0) {
                    result.addError("Current meter reading (" + curr + ") cannot be lower than previous reading (" + prev + ").");
                }
            }
        }

        return result;
    }

    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return true; // Optional field
        }
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }
}

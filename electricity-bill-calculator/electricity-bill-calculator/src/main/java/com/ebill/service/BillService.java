package com.ebill.service;

import com.ebill.model.Bill;
import com.ebill.repository.BillRepository;
import com.ebill.util.BillCalculator;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service layer sitting between Controllers (Servlets) and the
 * {@link BillRepository}. Holds all business logic (slab calculation,
 * validation, search/sort) so Servlets stay thin and the repository stays a
 * pure data-access object.
 *
 * The repository is injected via the constructor (simple, framework-free
 * Dependency Injection) — see {@code AppContextListener}, which is the only
 * place a concrete repository implementation is instantiated.
 */
public class BillService {

    private final BillRepository billRepository;

    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    /**
     * Calculates slab-wise charges for the given units and persists a new
     * Bill for the given customer.
     */
    public Bill generateBill(String customerName, String customerNumber, int unitsConsumed) {
        BillCalculator.CalculationResult result = BillCalculator.calculate(unitsConsumed);

        Bill bill = new Bill(customerName, customerNumber, unitsConsumed);
        bill.setSlabDetails(result.getSlabDetails());
        bill.setTotalAmount(result.getTotalAmount());

        return billRepository.save(bill);
    }

    public Optional<Bill> getBillById(int id) {
        return billRepository.findById(id);
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    /**
     * Returns bills filtered by a free-text search across customer name and
     * customer number, and sorted according to the given sort key.
     *
     * @param query    search text, case-insensitive; null/blank = no filter
     * @param sortBy   one of: "date_desc" (default), "date_asc", "amount_desc",
     *                 "amount_asc", "name_asc", "name_desc"
     */
    public List<Bill> searchAndSort(String query, String sortBy) {
        List<Bill> bills = billRepository.findAll();

        if (query != null && !query.trim().isEmpty()) {
            String lower = query.trim().toLowerCase();
            bills = bills.stream()
                    .filter(b -> b.getCustomerName().toLowerCase().contains(lower)
                              || b.getCustomerNumber().toLowerCase().contains(lower)
                              || b.getBillNumber().toLowerCase().contains(lower))
                    .collect(Collectors.toList());
        }

        Comparator<Bill> comparator;
        if (sortBy == null) {
            sortBy = "date_desc";
        }
        switch (sortBy) {
            case "date_asc":
                comparator = Comparator.comparing(Bill::getId);
                break;
            case "amount_desc":
                comparator = Comparator.comparingDouble(Bill::getTotalAmount).reversed();
                break;
            case "amount_asc":
                comparator = Comparator.comparingDouble(Bill::getTotalAmount);
                break;
            case "name_asc":
                comparator = Comparator.comparing(Bill::getCustomerName, String.CASE_INSENSITIVE_ORDER);
                break;
            case "name_desc":
                comparator = Comparator.comparing(Bill::getCustomerName, String.CASE_INSENSITIVE_ORDER).reversed();
                break;
            case "date_desc":
            default:
                comparator = Comparator.comparing(Bill::getId).reversed();
                break;
        }

        return bills.stream().sorted(comparator).collect(Collectors.toList());
    }

    public boolean deleteBill(int id) {
        return billRepository.delete(id);
    }

    public void clearHistory() {
        billRepository.deleteAll();
    }
}

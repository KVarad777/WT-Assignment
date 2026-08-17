package com.ebill.repository;

import com.ebill.model.Bill;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * In-memory "dummy database" implementation of {@link BillRepository}.
 *
 * Backed by a {@link ConcurrentHashMap} so it is safe to use across the
 * multiple concurrent Servlet request threads Tomcat may spawn. Data lives
 * only for the lifetime of the application (it resets on redeploy/restart).
 *
 * This class is the ONLY place in the whole project that touches a
 * collection directly. Everything else (Servlets, BillService) depends on
 * the {@link BillRepository} interface, so this class can be replaced by
 * {@link MySQLBillRepository} later without touching any other file.
 */
public class InMemoryBillRepository implements BillRepository {

    private final Map<Integer, Bill> billStore = new ConcurrentHashMap<>();
    private final AtomicInteger idGenerator = new AtomicInteger(0);

    @Override
    public Bill save(Bill bill) {
        int newId = idGenerator.incrementAndGet();
        bill.setId(newId);
        billStore.put(newId, bill);
        return bill;
    }

    @Override
    public List<Bill> findAll() {
        List<Bill> bills = new ArrayList<>(billStore.values());
        // Most recently generated bill first
        bills.sort(Comparator.comparing(Bill::getId).reversed());
        return bills;
    }

    @Override
    public Optional<Bill> findById(int id) {
        return Optional.ofNullable(billStore.get(id));
    }

    @Override
    public boolean update(Bill bill) {
        if (!billStore.containsKey(bill.getId())) {
            return false;
        }
        billStore.put(bill.getId(), bill);
        return true;
    }

    @Override
    public boolean delete(int id) {
        return billStore.remove(id) != null;
    }

    @Override
    public void deleteAll() {
        billStore.clear();
    }
}

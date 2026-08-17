package com.ebill.repository;

import com.ebill.model.Bill;

import java.util.List;
import java.util.Optional;

/**
 * Data-access abstraction for {@link Bill} objects.
 *
 * ============================================================================
 *  WHY THIS INTERFACE EXISTS
 * ============================================================================
 *  Every other layer of this application (Servlets, BillService) talks ONLY
 *  to this interface — never directly to an ArrayList, a HashMap, or (later)
 *  JDBC/MySQL. That means the storage mechanism can be swapped by changing a
 *  single line of wiring code (see AppContextListener), with zero changes to
 *  controllers, services, or JSP views.
 *
 *  Current implementation : {@link InMemoryBillRepository}  (no database)
 *  Future implementation  : {@link MySQLBillRepository}     (placeholder, TODO)
 * ============================================================================
 */
public interface BillRepository {

    /**
     * Persist a new bill. The implementation is responsible for assigning a
     * unique id to the bill (e.g. via an AtomicInteger counter, or later, a
     * MySQL AUTO_INCREMENT column) and returning the saved instance.
     */
    Bill save(Bill bill);

    /** Return all bills currently stored, most recent first. */
    List<Bill> findAll();

    /** Look up a single bill by its id. */
    Optional<Bill> findById(int id);

    /** Update an existing bill. Returns true if a matching bill was found and updated. */
    boolean update(Bill bill);

    /** Delete a bill by id. Returns true if a bill was found and removed. */
    boolean delete(int id);

    /** Remove every stored bill (used by "Clear History"). */
    void deleteAll();
}

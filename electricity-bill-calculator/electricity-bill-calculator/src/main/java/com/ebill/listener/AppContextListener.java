package com.ebill.listener;

import com.ebill.repository.BillRepository;
import com.ebill.repository.InMemoryBillRepository;
import com.ebill.service.BillService;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;
import jakarta.servlet.annotation.WebListener;

/**
 * Application-wide composition root.
 *
 * This is the ONLY class in the entire project that decides which concrete
 * {@link BillRepository} implementation is used. Every Servlet retrieves the
 * already-constructed {@link BillService} (which wraps the repository) from
 * the ServletContext — nobody else ever calls "new InMemoryBillRepository()".
 *
 * ============================================================================
 *  TO SWITCH TO MYSQL LATER: change ONE line below.
 * ============================================================================
 *      BillRepository repository = new InMemoryBillRepository();
 *  becomes
 *      BillRepository repository = new MySQLBillRepository();
 *
 *  Nothing else in the project needs to change.
 * ============================================================================
 */
@WebListener
public class AppContextListener implements ServletContextListener {

    public static final String BILL_SERVICE_ATTR = "billService";

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // ------------------------------------------------------------------
        // Composition root: wire the repository implementation here.
        // ------------------------------------------------------------------
        BillRepository repository = new InMemoryBillRepository();
        // Future: BillRepository repository = new MySQLBillRepository();

        BillService billService = new BillService(repository);

        sce.getServletContext().setAttribute(BILL_SERVICE_ATTR, billService);
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        sce.getServletContext().removeAttribute(BILL_SERVICE_ATTR);
    }
}

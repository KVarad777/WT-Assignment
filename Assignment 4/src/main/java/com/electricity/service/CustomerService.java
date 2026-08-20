package com.electricity.service;

import com.electricity.dao.CustomerDAO;
import com.electricity.model.Customer;

import java.sql.SQLException;
import java.util.List;

/**
 * Service managing customer records.
 */
public class CustomerService {
    private final CustomerDAO customerDAO;

    public CustomerService() {
        this.customerDAO = new CustomerDAO();
    }

    public CustomerService(CustomerDAO customerDAO) {
        this.customerDAO = customerDAO;
    }

    public Customer getCustomerById(int id) throws SQLException {
        return customerDAO.findById(id);
    }

    public Customer getCustomerByConsumerNumber(String consumerNumber) throws SQLException {
        return customerDAO.findByConsumerNumber(consumerNumber);
    }

    public Customer registerOrUpdateCustomer(Customer customer) throws SQLException {
        return customerDAO.findOrCreateOrUpdate(customer);
    }

    public List<Customer> getAllCustomers() throws SQLException {
        return customerDAO.getAllCustomers();
    }
}

package com.electricity.model;

import java.io.Serializable;
import java.sql.Timestamp;

/**
 * Model representing a utility electricity customer.
 */
public class Customer implements Serializable {
    private static final long serialVersionUID = 1L;

    private int id;
    private String customerName;
    private String consumerNumber;
    private String email;
    private String phone;
    private String address;
    private Timestamp createdAt;

    public Customer() {
    }

    public Customer(String customerName, String consumerNumber, String email, String phone, String address) {
        this.customerName = customerName;
        this.consumerNumber = consumerNumber;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }

    public Customer(int id, String customerName, String consumerNumber, String email, String phone, String address, Timestamp createdAt) {
        this.id = id;
        this.customerName = customerName;
        this.consumerNumber = consumerNumber;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getConsumerNumber() {
        return consumerNumber;
    }

    public void setConsumerNumber(String consumerNumber) {
        this.consumerNumber = consumerNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", customerName='" + customerName + '\'' +
                ", consumerNumber='" + consumerNumber + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                '}';
    }
}

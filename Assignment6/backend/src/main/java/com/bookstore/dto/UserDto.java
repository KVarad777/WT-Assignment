package com.bookstore.dto;

import com.bookstore.model.Role;
import com.bookstore.model.User;

import java.time.Instant;
import java.util.Set;

public class UserDto {
    private String id;
    private String name;
    private String email;
    private Set<Role> roles;
    private Instant createdAt;

    public UserDto() {}

    public UserDto(String id, String name, String email, Set<Role> roles, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.roles = roles;
        this.createdAt = createdAt;
    }

    public static UserDto fromEntity(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRoles(),
                user.getCreatedAt()
        );
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

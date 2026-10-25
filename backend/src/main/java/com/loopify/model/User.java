package com.loopify.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(name = "password_hash", nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private Enums.UserRole role;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "account_status", nullable = false, length = 32)
    private String accountStatus = "ACTIVE";

    @Column(name = "avatar_url", length = 512)
    private String avatarUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public User() {}

    public User(String id, String fullName, String email, String password, Enums.UserRole role, Department department) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.department = department;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Enums.UserRole getRole() { return role; }
    public void setRole(Enums.UserRole role) { this.role = role; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

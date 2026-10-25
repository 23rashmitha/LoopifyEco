package com.loopify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true, length = 32)
    private String code;

    @Column(name = "contact_email", nullable = false)
    private String contactEmail;

    @Column(name = "storage_location", nullable = false)
    private String storageLocation;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Department() {}

    public Department(String id, String name, String code, String contactEmail, String storageLocation) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.contactEmail = contactEmail;
        this.storageLocation = storageLocation;
        this.active = true;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }
    public String getStorageLocation() { return storageLocation; }
    public void setStorageLocation(String storageLocation) { this.storageLocation = storageLocation; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

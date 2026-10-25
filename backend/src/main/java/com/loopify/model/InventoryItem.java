package com.loopify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
public class InventoryItem {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "category_id", nullable = false, length = 64)
    private String categoryId;

    @Column(name = "owner_department_id", nullable = false, length = 64)
    private String ownerDepartmentId;

    @Column(name = "storage_location", nullable = false)
    private String storageLocation;

    @Column(name = "total_quantity", nullable = false)
    private int totalQuantity;

    @Column(name = "usable_quantity", nullable = false)
    private int usableQuantity;

    @Column(name = "reserved_quantity", nullable = false)
    private int reservedQuantity = 0;

    @Column(name = "borrowed_quantity", nullable = false)
    private int borrowedQuantity = 0;

    @Column(name = "inspection_pending_quantity", nullable = false)
    private int inspectionPendingQuantity = 0;

    @Column(name = "under_repair_quantity", nullable = false)
    private int underRepairQuantity = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_condition", nullable = false, length = 32)
    private Enums.ItemCondition condition = Enums.ItemCondition.GOOD;

    @Enumerated(EnumType.STRING)
    @Column(name = "lifecycle_status", nullable = false, length = 32)
    private Enums.ItemLifecycleStatus lifecycleStatus = Enums.ItemLifecycleStatus.AVAILABLE;

    @Column(name = "qr_token", nullable = false, unique = true, length = 64)
    private String qrToken;

    @Column(name = "image_url", length = 512)
    private String imageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_updated")
    private LocalDateTime lastUpdated = LocalDateTime.now();

    public InventoryItem() {}

    public InventoryItem(String id, String name, String description, String categoryId, String ownerDepartmentId,
                         String storageLocation, int totalQuantity, int usableQuantity, String qrToken, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.categoryId = categoryId;
        this.ownerDepartmentId = ownerDepartmentId;
        this.storageLocation = storageLocation;
        this.totalQuantity = totalQuantity;
        this.usableQuantity = usableQuantity;
        this.qrToken = qrToken;
        this.imageUrl = imageUrl;
        this.condition = Enums.ItemCondition.GOOD;
        this.lifecycleStatus = Enums.ItemLifecycleStatus.AVAILABLE;
        this.createdAt = LocalDateTime.now();
        this.lastUpdated = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }
    public String getOwnerDepartmentId() { return ownerDepartmentId; }
    public void setOwnerDepartmentId(String ownerDepartmentId) { this.ownerDepartmentId = ownerDepartmentId; }
    public String getStorageLocation() { return storageLocation; }
    public void setStorageLocation(String storageLocation) { this.storageLocation = storageLocation; }
    public int getTotalQuantity() { return totalQuantity; }
    public void setTotalQuantity(int totalQuantity) { this.totalQuantity = totalQuantity; }
    public int getUsableQuantity() { return usableQuantity; }
    public void setUsableQuantity(int usableQuantity) { this.usableQuantity = usableQuantity; }
    public int getReservedQuantity() { return reservedQuantity; }
    public void setReservedQuantity(int reservedQuantity) { this.reservedQuantity = reservedQuantity; }
    public int getBorrowedQuantity() { return borrowedQuantity; }
    public void setBorrowedQuantity(int borrowedQuantity) { this.borrowedQuantity = borrowedQuantity; }
    public int getInspectionPendingQuantity() { return inspectionPendingQuantity; }
    public void setInspectionPendingQuantity(int inspectionPendingQuantity) { this.inspectionPendingQuantity = inspectionPendingQuantity; }
    public int getUnderRepairQuantity() { return underRepairQuantity; }
    public void setUnderRepairQuantity(int underRepairQuantity) { this.underRepairQuantity = underRepairQuantity; }
    public Enums.ItemCondition getCondition() { return condition; }
    public void setCondition(Enums.ItemCondition condition) { this.condition = condition; }
    public Enums.ItemLifecycleStatus getLifecycleStatus() { return lifecycleStatus; }
    public void setLifecycleStatus(Enums.ItemLifecycleStatus lifecycleStatus) { this.lifecycleStatus = lifecycleStatus; }
    public String getQrToken() { return qrToken; }
    public void setQrToken(String qrToken) { this.qrToken = qrToken; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}

package com.loopify.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "repair_records")
public class RepairRecord {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "inventory_item_id", nullable = false)
    private InventoryItem inventoryItem;

    @Column(name = "damage_description", nullable = false, columnDefinition = "TEXT")
    private String damageDescription;

    @Column(name = "assigned_to", nullable = false)
    private String assignedTo;

    @Column(nullable = false, length = 32)
    private String status = "REPORTED"; // REPORTED, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(name = "reported_date")
    private LocalDateTime reportedDate = LocalDateTime.now();

    @Column(name = "completed_date")
    private LocalDateTime completedDate;

    @Column(name = "repair_cost", precision = 10, scale = 2)
    private BigDecimal repairCost = BigDecimal.ZERO;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public RepairRecord() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public InventoryItem getInventoryItem() { return inventoryItem; }
    public void setInventoryItem(InventoryItem inventoryItem) { this.inventoryItem = inventoryItem; }

    public String getDamageDescription() { return damageDescription; }
    public void setDamageDescription(String damageDescription) { this.damageDescription = damageDescription; }

    public String getAssignedTo() { return assignedTo; }
    public void setAssignedTo(String assignedTo) { this.assignedTo = assignedTo; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getReportedDate() { return reportedDate; }
    public void setReportedDate(LocalDateTime reportedDate) { this.reportedDate = reportedDate; }

    public LocalDateTime getCompletedDate() { return completedDate; }
    public void setCompletedDate(LocalDateTime completedDate) { this.completedDate = completedDate; }

    public BigDecimal getRepairCost() { return repairCost; }
    public void setRepairCost(BigDecimal repairCost) { this.repairCost = repairCost; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

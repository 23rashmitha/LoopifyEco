package com.loopify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "handover_records")
public class HandoverRecord {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "reservation_id", nullable = false, length = 64)
    private String reservationId;

    @Column(name = "inventory_item_id", nullable = false, length = 64)
    private String inventoryItemId;

    @Column(name = "quantity_handed_over", nullable = false)
    private int quantityHandedOver;

    @Column(name = "released_by_user_id", nullable = false, length = 64)
    private String releasedByUserId;

    @Column(name = "received_by_user_id", nullable = false, length = 64)
    private String receivedByUserId;

    @Column(name = "handover_timestamp")
    private LocalDateTime handoverTimestamp = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_at_release", nullable = false, length = 32)
    private Enums.ItemCondition conditionAtRelease = Enums.ItemCondition.GOOD;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    public HandoverRecord() {}

    public HandoverRecord(String id, String reservationId, String inventoryItemId, int quantityHandedOver,
                          String releasedByUserId, String receivedByUserId, Enums.ItemCondition conditionAtRelease, String notes) {
        this.id = id;
        this.reservationId = reservationId;
        this.inventoryItemId = inventoryItemId;
        this.quantityHandedOver = quantityHandedOver;
        this.releasedByUserId = releasedByUserId;
        this.receivedByUserId = receivedByUserId;
        this.conditionAtRelease = conditionAtRelease;
        this.notes = notes;
        this.handoverTimestamp = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getReservationId() { return reservationId; }
    public void setReservationId(String reservationId) { this.reservationId = reservationId; }
    public String getInventoryItemId() { return inventoryItemId; }
    public void setInventoryItemId(String inventoryItemId) { this.inventoryItemId = inventoryItemId; }
    public int getQuantityHandedOver() { return quantityHandedOver; }
    public void setQuantityHandedOver(int quantityHandedOver) { this.quantityHandedOver = quantityHandedOver; }
    public String getReleasedByUserId() { return releasedByUserId; }
    public void setReleasedByUserId(String releasedByUserId) { this.releasedByUserId = releasedByUserId; }
    public String getReceivedByUserId() { return receivedByUserId; }
    public void setReceivedByUserId(String receivedByUserId) { this.receivedByUserId = receivedByUserId; }
    public LocalDateTime getHandoverTimestamp() { return handoverTimestamp; }
    public void setHandoverTimestamp(LocalDateTime handoverTimestamp) { this.handoverTimestamp = handoverTimestamp; }
    public Enums.ItemCondition getConditionAtRelease() { return conditionAtRelease; }
    public void setConditionAtRelease(Enums.ItemCondition conditionAtRelease) { this.conditionAtRelease = conditionAtRelease; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}

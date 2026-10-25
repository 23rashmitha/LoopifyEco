package com.loopify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "return_records")
public class ReturnRecord {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "handover_id", nullable = false, length = 64)
    private String handoverId;

    @Column(name = "inventory_item_id", nullable = false, length = 64)
    private String inventoryItemId;

    @Column(name = "quantity_returned", nullable = false)
    private int quantityReturned;

    @Column(name = "received_by_user_id", nullable = false, length = 64)
    private String receivedByUserId;

    @Column(name = "returned_by_user_id", nullable = false, length = 64)
    private String returnedByUserId;

    @Column(name = "return_timestamp")
    private LocalDateTime returnTimestamp = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_at_return", nullable = false, length = 32)
    private Enums.ItemCondition conditionAtReturn = Enums.ItemCondition.GOOD;

    @Column(name = "damage_reported", nullable = false)
    private boolean damageReported = false;

    @Column(name = "damage_description", columnDefinition = "TEXT")
    private String damageDescription;

    @Column(name = "verification_notes", columnDefinition = "TEXT")
    private String verificationNotes;

    public ReturnRecord() {}

    public ReturnRecord(String id, String handoverId, String inventoryItemId, int quantityReturned,
                        String receivedByUserId, String returnedByUserId, Enums.ItemCondition conditionAtReturn,
                        boolean damageReported, String damageDescription, String verificationNotes) {
        this.id = id;
        this.handoverId = handoverId;
        this.inventoryItemId = inventoryItemId;
        this.quantityReturned = quantityReturned;
        this.receivedByUserId = receivedByUserId;
        this.returnedByUserId = returnedByUserId;
        this.conditionAtReturn = conditionAtReturn;
        this.damageReported = damageReported;
        this.damageDescription = damageDescription;
        this.verificationNotes = verificationNotes;
        this.returnTimestamp = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getHandoverId() { return handoverId; }
    public void setHandoverId(String handoverId) { this.handoverId = handoverId; }
    public String getInventoryItemId() { return inventoryItemId; }
    public void setInventoryItemId(String inventoryItemId) { this.inventoryItemId = inventoryItemId; }
    public int getQuantityReturned() { return quantityReturned; }
    public void setQuantityReturned(int quantityReturned) { this.quantityReturned = quantityReturned; }
    public String getReceivedByUserId() { return receivedByUserId; }
    public void setReceivedByUserId(String receivedByUserId) { this.receivedByUserId = receivedByUserId; }
    public String getReturnedByUserId() { return returnedByUserId; }
    public void setReturnedByUserId(String returnedByUserId) { this.returnedByUserId = returnedByUserId; }
    public LocalDateTime getReturnTimestamp() { return returnTimestamp; }
    public void setReturnTimestamp(LocalDateTime returnTimestamp) { this.returnTimestamp = returnTimestamp; }
    public Enums.ItemCondition getConditionAtReturn() { return conditionAtReturn; }
    public void setConditionAtReturn(Enums.ItemCondition conditionAtReturn) { this.conditionAtReturn = conditionAtReturn; }
    public boolean isDamageReported() { return damageReported; }
    public void setDamageReported(boolean damageReported) { this.damageReported = damageReported; }
    public String getDamageDescription() { return damageDescription; }
    public void setDamageDescription(String damageDescription) { this.damageDescription = damageDescription; }
    public String getVerificationNotes() { return verificationNotes; }
    public void setVerificationNotes(String verificationNotes) { this.verificationNotes = verificationNotes; }
}

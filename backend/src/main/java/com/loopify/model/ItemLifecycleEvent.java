package com.loopify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "item_lifecycle_events")
public class ItemLifecycleEvent {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "inventory_item_id", nullable = false, length = 64)
    private String inventoryItemId;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false, length = 64)
    private Enums.LifecycleEventType eventType;

    @Column(name = "actor_user_id", nullable = false, length = 64)
    private String actorUserId;

    @Column(name = "actor_name", nullable = false)
    private String actorName;

    @Column(name = "actor_role", nullable = false)
    private String actorRole;

    @Column(name = "timestamp")
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(name = "event_description", nullable = false, columnDefinition = "TEXT")
    private String eventDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition_observed", length = 32)
    private Enums.ItemCondition conditionObserved;

    public ItemLifecycleEvent() {}

    public ItemLifecycleEvent(String id, String inventoryItemId, Enums.LifecycleEventType eventType,
                              String actorUserId, String actorName, String actorRole,
                              String eventDescription, Enums.ItemCondition conditionObserved) {
        this.id = id;
        this.inventoryItemId = inventoryItemId;
        this.eventType = eventType;
        this.actorUserId = actorUserId;
        this.actorName = actorName;
        this.actorRole = actorRole;
        this.eventDescription = eventDescription;
        this.conditionObserved = conditionObserved;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getInventoryItemId() { return inventoryItemId; }
    public void setInventoryItemId(String inventoryItemId) { this.inventoryItemId = inventoryItemId; }
    public Enums.LifecycleEventType getEventType() { return eventType; }
    public void setEventType(Enums.LifecycleEventType eventType) { this.eventType = eventType; }
    public String getActorUserId() { return actorUserId; }
    public void setActorUserId(String actorUserId) { this.actorUserId = actorUserId; }
    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }
    public String getActorRole() { return actorRole; }
    public void setActorRole(String actorRole) { this.actorRole = actorRole; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    public String getEventDescription() { return eventDescription; }
    public void setEventDescription(String eventDescription) { this.eventDescription = eventDescription; }
    public Enums.ItemCondition getConditionObserved() { return conditionObserved; }
    public void setConditionObserved(Enums.ItemCondition conditionObserved) { this.conditionObserved = conditionObserved; }
}

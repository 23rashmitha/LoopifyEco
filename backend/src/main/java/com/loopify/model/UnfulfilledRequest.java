package com.loopify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "unfulfilled_requests")
public class UnfulfilledRequest {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private CampusEvent event;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private ItemCategory category;

    @Column(name = "requested_quantity", nullable = false)
    private int requestedQuantity;

    @Column(name = "fulfilled_quantity", nullable = false)
    private int fulfilledQuantity = 0;

    @Column(name = "shortage_quantity", nullable = false)
    private int shortageQuantity;

    @Column(name = "shortage_reason", nullable = false, columnDefinition = "TEXT")
    private String shortageReason;

    @Column(name = "recorded_date")
    private LocalDateTime recordedDate = LocalDateTime.now();

    public UnfulfilledRequest() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public CampusEvent getEvent() { return event; }
    public void setEvent(CampusEvent event) { this.event = event; }

    public ItemCategory getCategory() { return category; }
    public void setCategory(ItemCategory category) { this.category = category; }

    public int getRequestedQuantity() { return requestedQuantity; }
    public void setRequestedQuantity(int requestedQuantity) { this.requestedQuantity = requestedQuantity; }

    public int getFulfilledQuantity() { return fulfilledQuantity; }
    public void setFulfilledQuantity(int fulfilledQuantity) { this.fulfilledQuantity = fulfilledQuantity; }

    public int getShortageQuantity() { return shortageQuantity; }
    public void setShortageQuantity(int shortageQuantity) { this.shortageQuantity = shortageQuantity; }

    public String getShortageReason() { return shortageReason; }
    public void setShortageReason(String shortageReason) { this.shortageReason = shortageReason; }

    public LocalDateTime getRecordedDate() { return recordedDate; }
    public void setRecordedDate(LocalDateTime recordedDate) { this.recordedDate = recordedDate; }
}

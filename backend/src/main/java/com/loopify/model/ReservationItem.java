package com.loopify.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "reservation_items")
public class ReservationItem {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id", nullable = false)
    @JsonIgnore
    private Reservation reservation;

    @Column(name = "inventory_item_id", nullable = false, length = 64)
    private String inventoryItemId;

    @Column(name = "quantity_requested", nullable = false)
    private int quantityRequested;

    @Column(name = "quantity_allocated", nullable = false)
    private int quantityAllocated = 0;

    public ReservationItem() {}

    public ReservationItem(String id, String inventoryItemId, int quantityRequested) {
        this.id = id;
        this.inventoryItemId = inventoryItemId;
        this.quantityRequested = quantityRequested;
        this.quantityAllocated = quantityRequested;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Reservation getReservation() { return reservation; }
    public void setReservation(Reservation reservation) { this.reservation = reservation; }
    public String getInventoryItemId() { return inventoryItemId; }
    public void setInventoryItemId(String inventoryItemId) { this.inventoryItemId = inventoryItemId; }
    public int getQuantityRequested() { return quantityRequested; }
    public void setQuantityRequested(int quantityRequested) { this.quantityRequested = quantityRequested; }
    public int getQuantityAllocated() { return quantityAllocated; }
    public void setQuantityAllocated(int quantityAllocated) { this.quantityAllocated = quantityAllocated; }
}

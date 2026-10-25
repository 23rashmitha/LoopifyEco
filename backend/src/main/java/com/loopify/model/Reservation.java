package com.loopify.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "event_id", nullable = false, length = 64)
    private String eventId;

    @Column(name = "requester_user_id", nullable = false, length = 64)
    private String requesterUserId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private Enums.ReservationStatus status = Enums.ReservationStatus.PENDING;

    @Column(name = "reviewer_user_id", length = 64)
    private String reviewerUserId;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "reviewer_notes", columnDefinition = "TEXT")
    private String reviewerNotes;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "reservation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<ReservationItem> items = new ArrayList<>();

    public Reservation() {}

    public Reservation(String id, String eventId, String requesterUserId) {
        this.id = id;
        this.eventId = eventId;
        this.requesterUserId = requesterUserId;
        this.status = Enums.ReservationStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }

    public void addItem(ReservationItem item) {
        items.add(item);
        item.setReservation(this);
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getRequesterUserId() { return requesterUserId; }
    public void setRequesterUserId(String requesterUserId) { this.requesterUserId = requesterUserId; }
    public Enums.ReservationStatus getStatus() { return status; }
    public void setStatus(Enums.ReservationStatus status) { this.status = status; }
    public String getReviewerUserId() { return reviewerUserId; }
    public void setReviewerUserId(String reviewerUserId) { this.reviewerUserId = reviewerUserId; }
    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    public String getReviewerNotes() { return reviewerNotes; }
    public void setReviewerNotes(String reviewerNotes) { this.reviewerNotes = reviewerNotes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public List<ReservationItem> getItems() { return items; }
    public void setItems(List<ReservationItem> items) { this.items = items; }
}

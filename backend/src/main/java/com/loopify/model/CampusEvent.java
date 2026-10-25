package com.loopify.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "campus_events")
public class CampusEvent {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "organizer_user_id", nullable = false, length = 64)
    private String organizerUserId;

    @Column(name = "organizer_name", nullable = false)
    private String organizerName;

    @Column(name = "department_id", nullable = false, length = 64)
    private String departmentId;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(nullable = false)
    private String venue;

    @Column(name = "expected_attendees")
    private int expectedAttendees = 100;

    @Column(nullable = false, length = 32)
    private String status = "PLANNING";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public CampusEvent() {}

    public CampusEvent(String id, String name, String description, String organizerUserId, String organizerName,
                       String departmentId, LocalDate startDate, LocalDate endDate, String venue, int expectedAttendees) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.organizerUserId = organizerUserId;
        this.organizerName = organizerName;
        this.departmentId = departmentId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.venue = venue;
        this.expectedAttendees = expectedAttendees;
        this.status = "PLANNING";
        this.createdAt = LocalDateTime.now();
    }

    // Getters and setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getOrganizerUserId() { return organizerUserId; }
    public void setOrganizerUserId(String organizerUserId) { this.organizerUserId = organizerUserId; }
    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }
    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public int getExpectedAttendees() { return expectedAttendees; }
    public void setExpectedAttendees(int expectedAttendees) { this.expectedAttendees = expectedAttendees; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

package com.loopify.controller;

import com.loopify.model.Reservation;
import com.loopify.model.ReservationItem;
import com.loopify.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/reservations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @GetMapping
    public List<Reservation> getAll() {
        return service.getAllReservations();
    }

    public static class CreateReservationRequest {
        public String eventId;
        public String requesterUserId;
        public List<ReservationItem> items;
    }

    @PostMapping
    public ResponseEntity<Reservation> create(@RequestBody CreateReservationRequest request) {
        Reservation reservation = service.createReservation(
                request.eventId,
                request.requesterUserId != null ? request.requesterUserId : "usr_org_01",
                request.items
        );
        return ResponseEntity.ok(reservation);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable String id, @RequestBody(required = false) Map<String, String> payload) {
        try {
            String reviewerUserId = payload != null && payload.containsKey("reviewerUserId")
                    ? payload.get("reviewerUserId") : "usr_admin_01";
            String notes = payload != null && payload.containsKey("notes")
                    ? payload.get("notes") : "Approved by coordinator.";

            Reservation approved = service.approveReservation(id, reviewerUserId, notes);
            return ResponseEntity.ok(approved);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable String id, @RequestBody(required = false) Map<String, String> payload) {
        String reviewerUserId = payload != null && payload.containsKey("reviewerUserId")
                ? payload.get("reviewerUserId") : "usr_admin_01";
        String reason = payload != null && payload.containsKey("reason")
                ? payload.get("reason") : "Allocation rejected due to conflicting priority event.";

        Reservation rejected = service.rejectReservation(id, reviewerUserId, reason);
        return ResponseEntity.ok(rejected);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(@PathVariable String id, @RequestBody(required = false) Map<String, String> payload) {
        String userId = payload != null && payload.containsKey("userId")
                ? payload.get("userId") : "usr_org_01";

        Reservation cancelled = service.cancelReservation(id, userId);
        return ResponseEntity.ok(cancelled);
    }
}

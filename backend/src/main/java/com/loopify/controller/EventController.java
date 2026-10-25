package com.loopify.controller;

import com.loopify.model.CampusEvent;
import com.loopify.repository.CampusEventRepository;
import com.loopify.service.ReadinessCalculatorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/events")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class EventController {

    private final CampusEventRepository repository;
    private final ReadinessCalculatorService readinessService;

    public EventController(CampusEventRepository repository, ReadinessCalculatorService readinessService) {
        this.repository = repository;
        this.readinessService = readinessService;
    }

    @GetMapping
    public List<CampusEvent> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampusEvent> getById(@PathVariable String id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public CampusEvent create(@RequestBody CampusEvent event) {
        if (event.getId() == null || event.getId().isEmpty()) {
            event.setId("EVT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (event.getCreatedAt() == null) {
            event.setCreatedAt(LocalDateTime.now());
        }
        return repository.save(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CampusEvent> update(@PathVariable String id, @RequestBody CampusEvent updates) {
        return repository.findById(id)
                .map(existing -> {
                    if (updates.getName() != null) existing.setName(updates.getName());
                    if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
                    if (updates.getVenue() != null) existing.setVenue(updates.getVenue());
                    if (updates.getStartDate() != null) existing.setStartDate(updates.getStartDate());
                    if (updates.getEndDate() != null) existing.setEndDate(updates.getEndDate());
                    if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
                    if (updates.getEstimatedAttendance() > 0) existing.setEstimatedAttendance(updates.getEstimatedAttendance());
                    return ResponseEntity.ok(repository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    /**
     * Signature Innovation 1 API Endpoint:
     * Calculates deterministic readiness percentage and itemized breakdown
     */
    @GetMapping("/{id}/readiness")
    public ResponseEntity<ReadinessCalculatorService.EventReadinessReport> getReadiness(@PathVariable String id) {
        try {
            return ResponseEntity.ok(readinessService.calculateForEvent(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}

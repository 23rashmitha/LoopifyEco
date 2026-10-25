package com.loopify.controller;

import com.loopify.model.InventoryItem;
import com.loopify.repository.InventoryItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping({"/api/v1/inventory", "/api/v1/items"})
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class InventoryController {

    private final InventoryItemRepository repository;

    public InventoryController(InventoryItemRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<InventoryItem> getAll() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryItem> getById(@PathVariable String id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public InventoryItem create(@RequestBody InventoryItem item) {
        if (item.getId() == null || item.getId().isEmpty()) {
            item.setId("INV-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }
        if (item.getQrToken() == null || item.getQrToken().isEmpty()) {
            item.setQrToken("LPF-" + item.getId());
        }
        if (item.getCreatedAt() == null) {
            item.setCreatedAt(LocalDateTime.now());
        }
        item.setLastUpdated(LocalDateTime.now());
        return repository.save(item);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItem> update(@PathVariable String id, @RequestBody InventoryItem updates) {
        return repository.findById(id)
                .map(existing -> {
                    if (updates.getName() != null) existing.setName(updates.getName());
                    if (updates.getDescription() != null) existing.setDescription(updates.getDescription());
                    if (updates.getStorageLocation() != null) existing.setStorageLocation(updates.getStorageLocation());
                    if (updates.getCondition() != null) existing.setCondition(updates.getCondition());
                    if (updates.getLifecycleStatus() != null) existing.setLifecycleStatus(updates.getLifecycleStatus());
                    if (updates.getTotalQuantity() > 0) existing.setTotalQuantity(updates.getTotalQuantity());
                    if (updates.getUsableQuantity() >= 0) existing.setUsableQuantity(updates.getUsableQuantity());
                    if (updates.getReservedQuantity() >= 0) existing.setReservedQuantity(updates.getReservedQuantity());
                    if (updates.getBorrowedQuantity() >= 0) existing.setBorrowedQuantity(updates.getBorrowedQuantity());
                    if (updates.getUnderRepairQuantity() >= 0) existing.setUnderRepairQuantity(updates.getUnderRepairQuantity());
                    if (updates.getInspectionPendingQuantity() >= 0) existing.setInspectionPendingQuantity(updates.getInspectionPendingQuantity());
                    if (updates.getImageUrl() != null) existing.setImageUrl(updates.getImageUrl());
                    existing.setLastUpdated(LocalDateTime.now());
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
}

package com.loopify.controller;

import com.loopify.model.RepairRecord;
import com.loopify.service.InspectionRepairService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/repairs")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class RepairController {

    private final InspectionRepairService service;

    public RepairController(InspectionRepairService service) {
        this.service = service;
    }

    @GetMapping
    public List<RepairRecord> getAll() {
        return service.getAllRepairs();
    }

    @PutMapping("/{id}")
    public ResponseEntity<RepairRecord> updateRepair(@PathVariable String id, @RequestBody Map<String, Object> body) {
        String status = (String) body.getOrDefault("status", "IN_PROGRESS");
        String notes = (String) body.get("notes");
        BigDecimal cost = null;
        if (body.containsKey("repairCost")) {
            cost = new BigDecimal(body.get("repairCost").toString());
        }

        RepairRecord record = service.updateRepair(id, status, cost, notes);
        return ResponseEntity.ok(record);
    }
}

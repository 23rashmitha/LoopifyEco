package com.loopify.controller;

import com.loopify.model.ConditionInspection;
import com.loopify.model.Enums;
import com.loopify.service.InspectionRepairService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inspections")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class InspectionController {

    private final InspectionRepairService service;

    public InspectionController(InspectionRepairService service) {
        this.service = service;
    }

    @GetMapping
    public List<ConditionInspection> getAll() {
        return service.getAllInspections();
    }

    public static class InspectionRequest {
        public String itemId;
        public String inspectorId;
        public String inspectorName;
        public String assessedCondition;
        public String recommendedStatus;
        public String notes;
        public boolean componentsIntact = true;
    }

    @PostMapping
    public ResponseEntity<ConditionInspection> recordInspection(@RequestBody InspectionRequest req) {
        Enums.ItemCondition cond = req.assessedCondition != null
                ? Enums.ItemCondition.valueOf(req.assessedCondition)
                : Enums.ItemCondition.GOOD;
        Enums.ItemLifecycleStatus status = req.recommendedStatus != null
                ? Enums.ItemLifecycleStatus.valueOf(req.recommendedStatus)
                : Enums.ItemLifecycleStatus.AVAILABLE;

        ConditionInspection inspection = service.recordInspection(
                req.itemId,
                req.inspectorId != null ? req.inspectorId : "usr_coord_01",
                req.inspectorName != null ? req.inspectorName : "Store Coordinator",
                cond, status, req.notes, req.componentsIntact
        );

        return ResponseEntity.ok(inspection);
    }
}

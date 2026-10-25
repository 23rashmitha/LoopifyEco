package com.loopify.controller;

import com.loopify.model.Enums;
import com.loopify.model.HandoverRecord;
import com.loopify.model.ReturnRecord;
import com.loopify.service.HandoverReturnService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000"})
public class HandoverReturnController {

    private final HandoverReturnService service;

    public HandoverReturnController(HandoverReturnService service) {
        this.service = service;
    }

    public static class HandoverRequest {
        public String reservationId;
        public String itemId;
        public int quantity;
        public String releasedByUserId;
        public String receivedByUserId;
        public String condition;
        public String notes;
    }

    @PostMapping("/handovers")
    public ResponseEntity<HandoverRecord> recordHandover(@RequestBody HandoverRequest req) {
        Enums.ItemCondition cond = req.condition != null ? Enums.ItemCondition.valueOf(req.condition) : Enums.ItemCondition.GOOD;
        HandoverRecord record = service.recordHandover(
                req.reservationId, req.itemId, req.quantity,
                req.releasedByUserId != null ? req.releasedByUserId : "usr_admin_01",
                req.receivedByUserId != null ? req.receivedByUserId : "usr_org_01",
                cond, req.notes
        );
        return ResponseEntity.ok(record);
    }

    public static class ReturnRequest {
        public String handoverId;
        public String itemId;
        public int quantity;
        public String receivedByUserId;
        public String returnedByUserId;
        public String condition;
        public boolean damageReported;
        public String damageDescription;
        public String verificationNotes;
    }

    @PostMapping("/returns")
    public ResponseEntity<ReturnRecord> recordReturn(@RequestBody ReturnRequest req) {
        Enums.ItemCondition cond = req.condition != null ? Enums.ItemCondition.valueOf(req.condition) : Enums.ItemCondition.GOOD;
        ReturnRecord record = service.recordReturn(
                req.handoverId, req.itemId, req.quantity,
                req.receivedByUserId != null ? req.receivedByUserId : "usr_admin_01",
                req.returnedByUserId != null ? req.returnedByUserId : "usr_org_01",
                cond, req.damageReported, req.damageDescription, req.verificationNotes
        );
        return ResponseEntity.ok(record);
    }
}

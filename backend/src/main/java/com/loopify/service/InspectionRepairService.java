package com.loopify.service;

import com.loopify.model.*;
import com.loopify.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class InspectionRepairService {

    private final ConditionInspectionRepository inspectionRepository;
    private final RepairRecordRepository repairRepository;
    private final InventoryItemRepository inventoryRepository;
    private final ItemLifecycleEventRepository lifecycleRepository;

    public InspectionRepairService(ConditionInspectionRepository inspectionRepository,
                                   RepairRecordRepository repairRepository,
                                   InventoryItemRepository inventoryRepository,
                                   ItemLifecycleEventRepository lifecycleRepository) {
        this.inspectionRepository = inspectionRepository;
        this.repairRepository = repairRepository;
        this.inventoryRepository = inventoryRepository;
        this.lifecycleRepository = lifecycleRepository;
    }

    public List<ConditionInspection> getAllInspections() {
        return inspectionRepository.findAll();
    }

    public List<RepairRecord> getAllRepairs() {
        return repairRepository.findAll();
    }

    @Transactional
    public ConditionInspection recordInspection(String itemId, String inspectorId, String inspectorName,
                                                Enums.ItemCondition assessedCondition,
                                                Enums.ItemLifecycleStatus recommendedStatus,
                                                String notes, boolean componentsIntact) {
        InventoryItem item = inventoryRepository.findByIdForUpdate(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found: " + itemId));

        Enums.ItemCondition prevCondition = item.getCondition();
        item.setCondition(assessedCondition);

        if (recommendedStatus == Enums.ItemLifecycleStatus.AVAILABLE) {
            // Restore from inspection pending to usable
            if (item.getInspectionPendingQuantity() > 0) {
                int qty = item.getInspectionPendingQuantity();
                item.setInspectionPendingQuantity(0);
                item.setUsableQuantity(item.getUsableQuantity() + qty);
            }
            item.setLifecycleStatus(Enums.ItemLifecycleStatus.AVAILABLE);
        } else if (recommendedStatus == Enums.ItemLifecycleStatus.UNDER_REPAIR) {
            int triageQty = Math.max(1, item.getInspectionPendingQuantity());
            item.setInspectionPendingQuantity(Math.max(0, item.getInspectionPendingQuantity() - triageQty));
            item.setUnderRepairQuantity(item.getUnderRepairQuantity() + triageQty);
            item.setLifecycleStatus(Enums.ItemLifecycleStatus.UNDER_REPAIR);

            // Automatically queue a repair record for Central Workshop
            RepairRecord autoRepair = new RepairRecord();
            autoRepair.setId("REP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            autoRepair.setInventoryItem(item);
            autoRepair.setDamageDescription("Inspection sign-off triage: " + notes);
            autoRepair.setAssignedTo("Central Electronics Workshop");
            autoRepair.setStatus("REPORTED");
            autoRepair.setReportedDate(LocalDateTime.now());
            repairRepository.save(autoRepair);
        } else if (recommendedStatus == Enums.ItemLifecycleStatus.RETIRED) {
            item.setLifecycleStatus(Enums.ItemLifecycleStatus.RETIRED);
            item.setUsableQuantity(0);
        }

        item.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(item);

        ConditionInspection inspection = new ConditionInspection();
        inspection.setId("INSP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        inspection.setInventoryItem(item);
        inspection.setInspectorId(inspectorId);
        inspection.setInspectorName(inspectorName != null ? inspectorName : "Coordinator");
        inspection.setPreviousCondition(prevCondition);
        inspection.setAssessedCondition(assessedCondition);
        inspection.setRecommendedStatus(recommendedStatus);
        inspection.setNotes(notes);
        inspection.setComponentsIntact(componentsIntact);
        inspection.setInspectionDate(LocalDateTime.now());
        inspectionRepository.save(inspection);

        // Immutable audit log
        ItemLifecycleEvent event = new ItemLifecycleEvent(
                "LE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                itemId,
                Enums.LifecycleEventType.INSPECTION_COMPLETED,
                inspectorId,
                inspectorName != null ? inspectorName : "Coordinator",
                "ITEM_COORDINATOR",
                "Condition assessed as " + assessedCondition + ". Recommended status: " + recommendedStatus + ". Notes: " + notes,
                assessedCondition
        );
        lifecycleRepository.save(event);

        return inspection;
    }

    @Transactional
    public RepairRecord updateRepair(String repairId, String status, BigDecimal repairCost, String notes) {
        RepairRecord record = repairRepository.findById(repairId)
                .orElseThrow(() -> new IllegalArgumentException("Repair record not found: " + repairId));

        record.setStatus(status);
        if (repairCost != null) {
            record.setRepairCost(repairCost);
        }
        if (notes != null) {
            record.setNotes(notes);
        }

        // BR-08: When repair is marked COMPLETED, move stock to INSPECTION_PENDING (not directly to AVAILABLE)
        if ("COMPLETED".equalsIgnoreCase(status)) {
            record.setCompletedDate(LocalDateTime.now());
            InventoryItem item = record.getInventoryItem();
            if (item != null) {
                InventoryItem lockedItem = inventoryRepository.findByIdForUpdate(item.getId()).orElse(item);
                if (lockedItem.getUnderRepairQuantity() > 0) {
                    lockedItem.setUnderRepairQuantity(lockedItem.getUnderRepairQuantity() - 1);
                    lockedItem.setInspectionPendingQuantity(lockedItem.getInspectionPendingQuantity() + 1);
                    lockedItem.setLifecycleStatus(Enums.ItemLifecycleStatus.INSPECTION_PENDING);
                    lockedItem.setLastUpdated(LocalDateTime.now());
                    inventoryRepository.save(lockedItem);
                }

                ItemLifecycleEvent event = new ItemLifecycleEvent(
                        "LE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                        lockedItem.getId(),
                        Enums.LifecycleEventType.REPAIR_VERIFIED,
                        record.getAssignedTo(),
                        "Central Workshop Technician",
                        "WORKSHOP_STAFF",
                        "Workshop repair marked completed. Item queued for post-repair condition sign-off. Cost: ₹" + (repairCost != null ? repairCost : "0"),
                        lockedItem.getCondition()
                );
                lifecycleRepository.save(event);
            }
        }

        return repairRepository.save(record);
    }
}

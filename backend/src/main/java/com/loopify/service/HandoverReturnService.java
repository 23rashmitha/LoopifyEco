package com.loopify.service;

import com.loopify.model.*;
import com.loopify.repository.HandoverRecordRepository;
import com.loopify.repository.InventoryItemRepository;
import com.loopify.repository.ItemLifecycleEventRepository;
import com.loopify.repository.ReturnRecordRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class HandoverReturnService {

    private final HandoverRecordRepository handoverRepository;
    private final ReturnRecordRepository returnRepository;
    private final InventoryItemRepository inventoryRepository;
    private final ItemLifecycleEventRepository lifecycleEventRepository;

    public HandoverReturnService(HandoverRecordRepository handoverRepository,
                                 ReturnRecordRepository returnRepository,
                                 InventoryItemRepository inventoryRepository,
                                 ItemLifecycleEventRepository lifecycleEventRepository) {
        this.handoverRepository = handoverRepository;
        this.returnRepository = returnRepository;
        this.inventoryRepository = inventoryRepository;
        this.lifecycleEventRepository = lifecycleEventRepository;
    }

    @Transactional
    public HandoverRecord recordHandover(String reservationId, String itemId, int quantity,
                                         String releasedByUserId, String receivedByUserId,
                                         Enums.ItemCondition condition, String notes) {
        InventoryItem item = inventoryRepository.findByIdForUpdate(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found: " + itemId));

        // Deduct from reserved and add to borrowed
        item.setReservedQuantity(Math.max(0, item.getReservedQuantity() - quantity));
        item.setBorrowedQuantity(item.getBorrowedQuantity() + quantity);
        item.setLifecycleStatus(Enums.ItemLifecycleStatus.BORROWED);
        item.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(item);

        String handoverId = "HO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        HandoverRecord record = new HandoverRecord(
                handoverId, reservationId, itemId, quantity,
                releasedByUserId, receivedByUserId, condition, notes
        );
        handoverRepository.save(record);

        ItemLifecycleEvent event = new ItemLifecycleEvent(
                "LE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                itemId,
                Enums.LifecycleEventType.HANDED_OVER,
                releasedByUserId,
                "Store Coordinator",
                "ITEM_COORDINATOR",
                "Physically handed over " + quantity + " units to " + receivedByUserId + ". Condition: " + condition,
                condition
        );
        lifecycleEventRepository.save(event);

        return record;
    }

    @Transactional
    public ReturnRecord recordReturn(String handoverId, String itemId, int quantity,
                                     String receivedByUserId, String returnedByUserId,
                                     Enums.ItemCondition condition, boolean damageReported,
                                     String damageDescription, String verificationNotes) {
        InventoryItem item = inventoryRepository.findByIdForUpdate(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found: " + itemId));

        item.setBorrowedQuantity(Math.max(0, item.getBorrowedQuantity() - quantity));

        // DAMAGE TRIAGE LOGIC
        if (damageReported || condition == Enums.ItemCondition.DAMAGED_REPAIRABLE || condition == Enums.ItemCondition.UNUSABLE) {
            // Divert directly to repair backlog, do not add to usable stock!
            item.setUnderRepairQuantity(item.getUnderRepairQuantity() + quantity);
            item.setLifecycleStatus(Enums.ItemLifecycleStatus.UNDER_REPAIR);
            item.setCondition(condition);
        } else {
            // Restore to usable stock
            item.setUsableQuantity(item.getUsableQuantity() + quantity);
            item.setLifecycleStatus(Enums.ItemLifecycleStatus.AVAILABLE);
            item.setCondition(condition);
        }

        item.setLastUpdated(LocalDateTime.now());
        inventoryRepository.save(item);

        String returnId = "RET-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        ReturnRecord record = new ReturnRecord(
                returnId, handoverId, itemId, quantity,
                receivedByUserId, returnedByUserId, condition,
                damageReported, damageDescription, verificationNotes
        );
        returnRepository.save(record);

        ItemLifecycleEvent event = new ItemLifecycleEvent(
                "LE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                itemId,
                damageReported ? Enums.LifecycleEventType.DAMAGE_REPORTED : Enums.LifecycleEventType.RETURNED,
                receivedByUserId,
                "Store Inspector",
                "ITEM_COORDINATOR",
                "Verified physical return of " + quantity + " units. Condition: " + condition +
                        (damageReported ? ". Triaged to repair workshop: " + damageDescription : ". Restored to usable stock."),
                condition
        );
        lifecycleEventRepository.save(event);

        return record;
    }
}

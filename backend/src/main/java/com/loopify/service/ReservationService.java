package com.loopify.service;

import com.loopify.model.*;
import com.loopify.repository.InventoryItemRepository;
import com.loopify.repository.ItemLifecycleEventRepository;
import com.loopify.repository.ReservationRepository;
import com.loopify.repository.UnfulfilledRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final InventoryItemRepository inventoryRepository;
    private final ItemLifecycleEventRepository lifecycleEventRepository;
    private final UnfulfilledRequestRepository unfulfilledRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              InventoryItemRepository inventoryRepository,
                              ItemLifecycleEventRepository lifecycleEventRepository,
                              UnfulfilledRequestRepository unfulfilledRepository) {
        this.reservationRepository = reservationRepository;
        this.inventoryRepository = inventoryRepository;
        this.lifecycleEventRepository = lifecycleEventRepository;
        this.unfulfilledRepository = unfulfilledRepository;
    }

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Transactional
    public Reservation createReservation(String eventId, String requesterUserId, List<ReservationItem> items) {
        String resId = "RES-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Reservation reservation = new Reservation(resId, eventId, requesterUserId);

        for (ReservationItem item : items) {
            String itemId = "RI-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            item.setId(itemId);
            reservation.addItem(item);
        }

        return reservationRepository.save(reservation);
    }

    /**
     * Approves a reservation with Enterprise Pessimistic Write Locking to prevent double bookings.
     */
    @Transactional
    public Reservation approveReservation(String reservationId, String reviewerUserId, String notes) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found: " + reservationId));

        if (reservation.getStatus() != Enums.ReservationStatus.PENDING) {
            throw new IllegalStateException("Reservation cannot be approved in status: " + reservation.getStatus());
        }

        // Validate each item with pessimistic lock
        for (ReservationItem rItem : reservation.getItems()) {
            InventoryItem item = inventoryRepository.findByIdForUpdate(rItem.getInventoryItemId())
                    .orElseThrow(() -> new IllegalArgumentException("Inventory item not found: " + rItem.getInventoryItemId()));

            if (item.getUsableQuantity() < rItem.getQuantityRequested()) {
                // Track unfulfilled request / lost opportunity
                int shortage = rItem.getQuantityRequested() - item.getUsableQuantity();
                UnfulfilledRequest unfulfilled = new UnfulfilledRequest();
                unfulfilled.setId("UNF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                unfulfilled.setEvent(reservation.getEvent());
                unfulfilled.setCategory(item.getCategory());
                unfulfilled.setRequestedQuantity(rItem.getQuantityRequested());
                unfulfilled.setFulfilledQuantity(item.getUsableQuantity());
                unfulfilled.setShortageQuantity(shortage);
                unfulfilled.setShortageReason("Insufficient stock at approval: Requested " + rItem.getQuantityRequested() + ", available " + item.getUsableQuantity());
                unfulfilled.setRecordedDate(LocalDateTime.now());
                unfulfilledRepository.save(unfulfilled);

                throw new IllegalStateException("Insufficient usable units for " + item.getName() +
                        ". Requested: " + rItem.getQuantityRequested() + ", Usable: " + item.getUsableQuantity());
            }

            // Deduct usable and increment reserved
            item.setUsableQuantity(item.getUsableQuantity() - rItem.getQuantityRequested());
            item.setReservedQuantity(item.getReservedQuantity() + rItem.getQuantityRequested());
            item.setLastUpdated(LocalDateTime.now());
            inventoryRepository.save(item);

            // Log lifecycle event
            ItemLifecycleEvent event = new ItemLifecycleEvent(
                    "LE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                    item.getId(),
                    Enums.LifecycleEventType.RESERVED,
                    reviewerUserId,
                    "Store Coordinator",
                    "ITEM_COORDINATOR",
                    "Approved reservation " + reservation.getId() + " for " + rItem.getQuantityRequested() + " units.",
                    item.getCondition()
            );
            lifecycleEventRepository.save(event);
        }

        reservation.setStatus(Enums.ReservationStatus.APPROVED);
        reservation.setReviewerUserId(reviewerUserId);
        reservation.setReviewedAt(LocalDateTime.now());
        reservation.setReviewerNotes(notes);

        return reservationRepository.save(reservation);
    }

    /**
     * BR-06: Rejected and cancelled reservations release stock immediately.
     */
    @Transactional
    public Reservation rejectReservation(String reservationId, String reviewerUserId, String reason) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found: " + reservationId));

        if (reservation.getStatus() == Enums.ReservationStatus.APPROVED) {
            // Release reserved stock back to usable
            releaseReservedStock(reservation);
        }

        reservation.setStatus(Enums.ReservationStatus.REJECTED);
        reservation.setReviewerUserId(reviewerUserId);
        reservation.setReviewedAt(LocalDateTime.now());
        reservation.setReviewerNotes(reason != null ? reason : "Rejected by coordinator");

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation cancelReservation(String reservationId, String userId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found: " + reservationId));

        if (reservation.getStatus() == Enums.ReservationStatus.APPROVED) {
            releaseReservedStock(reservation);
        }

        reservation.setStatus(Enums.ReservationStatus.CANCELLED);
        reservation.setReviewerNotes("Cancelled by user: " + userId);

        return reservationRepository.save(reservation);
    }

    private void releaseReservedStock(Reservation reservation) {
        for (ReservationItem rItem : reservation.getItems()) {
            inventoryRepository.findByIdForUpdate(rItem.getInventoryItemId()).ifPresent(item -> {
                int releaseQty = Math.min(item.getReservedQuantity(), rItem.getQuantityRequested());
                item.setReservedQuantity(item.getReservedQuantity() - releaseQty);
                item.setUsableQuantity(item.getUsableQuantity() + releaseQty);
                item.setLastUpdated(LocalDateTime.now());
                inventoryRepository.save(item);
            });
        }
    }
}

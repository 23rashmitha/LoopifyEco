package com.loopify.repository;

import com.loopify.model.Enums;
import com.loopify.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, String> {
    List<Reservation> findByEventId(String eventId);
    List<Reservation> findByStatus(Enums.ReservationStatus status);

    /**
     * Finds active overlapping reservations for an item to calculate physical availability
     */
    @Query("SELECT r FROM Reservation r JOIN r.items item WHERE item.inventoryItemId = :itemId AND r.status IN ('PENDING', 'APPROVED')")
    List<Reservation> findActiveReservationsForItem(@Param("itemId") String itemId);
}

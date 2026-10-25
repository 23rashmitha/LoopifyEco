package com.loopify.repository;

import com.loopify.model.HandoverRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HandoverRecordRepository extends JpaRepository<HandoverRecord, String> {
    List<HandoverRecord> findByReservationId(String reservationId);
    List<HandoverRecord> findByInventoryItemId(String inventoryItemId);
}

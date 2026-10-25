package com.loopify.repository;

import com.loopify.model.ReturnRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReturnRecordRepository extends JpaRepository<ReturnRecord, String> {
    List<ReturnRecord> findByInventoryItemId(String inventoryItemId);
}

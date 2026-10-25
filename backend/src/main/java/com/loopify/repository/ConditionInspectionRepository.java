package com.loopify.repository;

import com.loopify.model.ConditionInspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConditionInspectionRepository extends JpaRepository<ConditionInspection, String> {
    List<ConditionInspection> findByInventoryItemId(String inventoryItemId);
}

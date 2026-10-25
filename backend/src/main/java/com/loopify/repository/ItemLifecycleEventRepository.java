package com.loopify.repository;

import com.loopify.model.ItemLifecycleEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemLifecycleEventRepository extends JpaRepository<ItemLifecycleEvent, String> {
    List<ItemLifecycleEvent> findByInventoryItemIdOrderByTimestampDesc(String inventoryItemId);
    List<ItemLifecycleEvent> findTop20ByOrderByTimestampDesc();
}

package com.loopify.repository;

import com.loopify.model.InventoryItem;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, String> {

    Optional<InventoryItem> findByQrToken(String qrToken);

    List<InventoryItem> findByCategoryId(String categoryId);

    List<InventoryItem> findByOwnerDepartmentId(String departmentId);

    /**
     * Enterprise Pessimistic Locking query:
     * Prevents race condition double-bookings by executing SELECT ... FOR UPDATE
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT i FROM InventoryItem i WHERE i.id = :id")
    Optional<InventoryItem> findByIdForUpdate(@Param("id") String id);
}

package com.loopify.repository;

import com.loopify.model.UnfulfilledRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnfulfilledRequestRepository extends JpaRepository<UnfulfilledRequest, String> {
    List<UnfulfilledRequest> findByEventId(String eventId);
    List<UnfulfilledRequest> findByCategoryId(String categoryId);
}

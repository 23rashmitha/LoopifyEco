package com.loopify.repository;

import com.loopify.model.CampusEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CampusEventRepository extends JpaRepository<CampusEvent, String> {
    List<CampusEvent> findByDepartmentId(String departmentId);
    List<CampusEvent> findByStartDateBetween(LocalDate start, LocalDate end);
}

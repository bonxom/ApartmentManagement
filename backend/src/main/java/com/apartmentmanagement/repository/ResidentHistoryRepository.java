package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.ResidentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResidentHistoryRepository extends JpaRepository<ResidentHistory, String> {
    Optional<ResidentHistory> findByHouseholdId(String householdId);
}

package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.ResidentHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResidentHistoryRepository extends MongoRepository<ResidentHistory, String> {
    Optional<ResidentHistory> findByHouseHoldId(String householdId);
}

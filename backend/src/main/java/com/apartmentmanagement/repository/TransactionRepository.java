package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findByFeeId(String feeId);
    List<Transaction> findByHouseholdId(String householdId);
    List<Transaction> findByFeeIdAndHouseholdId(String feeId, String householdId);
    long countByFeeId(String feeId);
}

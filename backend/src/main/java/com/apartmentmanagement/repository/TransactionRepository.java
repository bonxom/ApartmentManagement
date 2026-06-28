package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByFee(String feeId);
    List<Transaction> findByHousehold(String householdId);
    List<Transaction> findByFeeAndHousehold(String feeId, String householdId);
    long countByFee(String feeId);
}

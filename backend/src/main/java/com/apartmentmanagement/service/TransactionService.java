package com.apartmentmanagement.service;

import com.apartmentmanagement.entity.Fee;
import com.apartmentmanagement.entity.Household;
import com.apartmentmanagement.entity.Transaction;
import com.apartmentmanagement.enums.FeeStatus;
import com.apartmentmanagement.exception.BusinessException;
import com.apartmentmanagement.exception.ResourceNotFoundException;
import com.apartmentmanagement.repository.FeeRepository;
import com.apartmentmanagement.repository.HouseholdRepository;
import com.apartmentmanagement.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final FeeRepository feeRepository;
    private final HouseholdRepository householdRepository;

    @Transactional
    public Transaction createTransaction(String feeId, String householdId, Double amount, String note) {
        if (amount == null || amount <= 0) {
            throw new BusinessException("Amount must be greater than 0");
        }

        Fee fee = feeRepository.findById(feeId)
                .orElseThrow(() -> new ResourceNotFoundException("Fee not found"));
        if (fee.getStatus() == FeeStatus.COMPLETED) {
            throw new BusinessException("This fee collection is closed");
        }

        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        Transaction transaction = Transaction.builder()
                .fee(fee)
                .household(household)
                .payer(household.getLeader())
                .amount(amount)
                .note(note)
                .build();

        return transactionRepository.save(transaction);
    }

    @Transactional(readOnly = true)
    public List<Transaction> getTransactions(String feeId, String householdId) {
        List<Transaction> transactions;
        if (feeId != null && householdId != null) {
            transactions = transactionRepository.findByFeeIdAndHouseholdId(feeId, householdId);
        } else if (feeId != null) {
            transactions = transactionRepository.findByFeeId(feeId);
        } else if (householdId != null) {
            transactions = transactionRepository.findByHouseholdId(householdId);
        } else {
            transactions = StreamSupport.stream(transactionRepository.findAll().spliterator(), false)
                    .collect(Collectors.toList());
        }
        transactions.sort(Comparator.comparing(Transaction::getCreatedAt).reversed());
        return transactions;
    }

    @Transactional
    public Transaction updateTransaction(String id, Double amount, String note) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        if (amount != null) {
            if (amount <= 0) throw new BusinessException("Amount must be greater than 0");
            transaction.setAmount(amount);
        }
        if (note != null) {
            transaction.setNote(note);
        }

        return transactionRepository.save(transaction);
    }

    @Transactional
    public void deleteTransaction(String id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transactionRepository.delete(transaction);
    }
}

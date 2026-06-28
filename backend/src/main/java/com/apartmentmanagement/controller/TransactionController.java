package com.apartmentmanagement.controller;

import com.apartmentmanagement.dto.request.CreateTransactionRequest;
import com.apartmentmanagement.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<?> createTransaction(@RequestBody CreateTransactionRequest request) {
        var tx = transactionService.createTransaction(
                request.getFeeId(), request.getHouseholdId(),
                request.getAmount(), request.getNote());
        return ResponseEntity.status(201).body(tx);
    }

    @GetMapping
    public ResponseEntity<?> getTransactions(
            @RequestParam(required = false) String feeId,
            @RequestParam(required = false) String householdId) {
        return ResponseEntity.ok(transactionService.getTransactions(feeId, householdId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTransaction(@PathVariable String id, @RequestBody Map<String, Object> body) {
        Double amount = body.get("amount") != null ? ((Number) body.get("amount")).doubleValue() : null;
        String note = (String) body.get("note");
        return ResponseEntity.ok(transactionService.updateTransaction(id, amount, note));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTransaction(@PathVariable String id) {
        transactionService.deleteTransaction(id);
        return ResponseEntity.ok(Map.of("message", "Đã xóa giao dịch thành công"));
    }
}

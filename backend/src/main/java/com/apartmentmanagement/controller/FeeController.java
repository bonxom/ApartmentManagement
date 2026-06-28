package com.apartmentmanagement.controller;

import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.dto.request.CreateFeeRequest;
import com.apartmentmanagement.service.FeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/fees")
@RequiredArgsConstructor
public class FeeController {

    private final FeeService feeService;

    @PostMapping
    public ResponseEntity<?> createFee(@RequestBody CreateFeeRequest request) {
        var fee = feeService.createFee(request.getName(), request.getType(),
                request.getDescription(), request.getUnitPrice());
        return ResponseEntity.status(201).body(fee);
    }

    @GetMapping
    public ResponseEntity<?> getAllFees() {
        return ResponseEntity.ok(feeService.getAllFees());
    }

    @GetMapping("/my-household")
    public ResponseEntity<?> getMyHouseholdFees() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(feeService.getMyHouseholdFees(currentUser));
    }

    @GetMapping("/household/{householdId}")
    public ResponseEntity<?> getHouseholdFeesByAdmin(@PathVariable String householdId) {
        return ResponseEntity.ok(feeService.getHouseholdFeesByAdmin(householdId));
    }

    @GetMapping("/{feeId}/statistics")
    public ResponseEntity<?> getFeeStatistics(@PathVariable String feeId) {
        return ResponseEntity.ok(feeService.getFeeStatistics(feeId));
    }

    @PutMapping("/{feeId}")
    public ResponseEntity<?> updateFee(@PathVariable String feeId, @RequestBody Map<String, Object> body) {
        String name = (String) body.get("name");
        String description = (String) body.get("description");
        String status = (String) body.get("status");
        Double unitPrice = body.get("unitPrice") != null ? ((Number) body.get("unitPrice")).doubleValue() : null;
        return ResponseEntity.ok(feeService.updateFee(feeId, name, description, status, unitPrice));
    }

    @DeleteMapping("/{feeId}")
    public ResponseEntity<?> deleteFee(@PathVariable String feeId) {
        feeService.deleteFee(feeId);
        return ResponseEntity.ok(Map.of("message", "Đã xóa khoản thu thành công"));
    }
}

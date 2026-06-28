package com.apartmentmanagement.controller;

import com.apartmentmanagement.service.StubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final StubService stubService;

    @PostMapping("/update-info")
    public ResponseEntity<?> createUpdateRequest(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @PostMapping("/payment")
    public ResponseEntity<?> createPaymentRequest(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @PostMapping("/temporary-residence")
    public ResponseEntity<?> createTemporaryResidence(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @PostMapping("/temporary-absence")
    public ResponseEntity<?> createTemporaryAbsence(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @PostMapping("/birth")
    public ResponseEntity<?> createBirthReport(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @PostMapping("/death")
    public ResponseEntity<?> createDeathReport(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @GetMapping
    public ResponseEntity<?> getAllRequests() {
        return ResponseEntity.ok(stubService.getStubListResponse());
    }

    @GetMapping("/my-household")
    public ResponseEntity<?> getMyHouseholdRequests() {
        return ResponseEntity.ok(stubService.getStubListResponse());
    }

    @GetMapping("/my-household/payments")
    public ResponseEntity<?> getMyHouseholdPaymentRequests() {
        return ResponseEntity.ok(stubService.getStubListResponse());
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<?> reviewRequest(@PathVariable String id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }
}

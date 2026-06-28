package com.apartmentmanagement.controller;

import com.apartmentmanagement.service.StubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final StubService stubService;

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(stubService.getStubListResponse());
    }

    @PostMapping
    public ResponseEntity<?> create() {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id) {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }
}

package com.apartmentmanagement.controller;

import com.apartmentmanagement.service.StubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

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

    @GetMapping("/{id}/permissions")
    public ResponseEntity<?> getPermissions(@PathVariable String id) {
        return ResponseEntity.ok(stubService.getStubListResponse());
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<?> updatePermissions(@PathVariable String id) {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }
}

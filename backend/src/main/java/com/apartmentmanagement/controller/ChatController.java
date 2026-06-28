package com.apartmentmanagement.controller;

import com.apartmentmanagement.service.StubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final StubService stubService;

    @GetMapping("/messages")
    public ResponseEntity<?> getMessages() {
        return ResponseEntity.ok(stubService.getStubListResponse());
    }

    @PostMapping("/messages")
    public ResponseEntity<?> sendMessage() {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @DeleteMapping("/messages/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable String id) {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @GetMapping("/participants")
    public ResponseEntity<?> getParticipants() {
        return ResponseEntity.ok(stubService.getStubListResponse());
    }

    @PutMapping("/status")
    public ResponseEntity<?> updateStatus() {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @PostMapping("/initialize")
    public ResponseEntity<?> initialize() {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @PostMapping("/sync-all")
    public ResponseEntity<?> syncAll() {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @PostMapping("/add-me")
    public ResponseEntity<?> addMe() {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }
}

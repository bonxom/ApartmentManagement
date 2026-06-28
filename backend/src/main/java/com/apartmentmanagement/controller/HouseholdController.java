package com.apartmentmanagement.controller;

import com.apartmentmanagement.dto.request.CreateHouseholdRequest;
import com.apartmentmanagement.service.HouseholdService;
import com.apartmentmanagement.service.StubService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/households")
@RequiredArgsConstructor
public class HouseholdController {

    private final HouseholdService householdService;
    private final StubService stubService;

    @GetMapping
    public ResponseEntity<?> getAllHouseholds() {
        return ResponseEntity.ok(householdService.getAllHouseholds());
    }

    @PostMapping
    public ResponseEntity<?> createHousehold(@RequestBody CreateHouseholdRequest request) {
        return ResponseEntity.status(201).body(householdService.createHousehold(
                request.getHouseHoldID(), request.getAddress(), request.getLeaderId()));
    }

    @PostMapping("/split")
    public ResponseEntity<?> splitHousehold(@RequestBody Map<String, Object> body) {
        String userId = (String) body.get("userId");
        String newHouseHoldID = (String) body.get("newHouseHoldID");
        String newAddress = (String) body.get("newAddress");
        return ResponseEntity.status(201).body(householdService.splitHousehold(userId, newHouseHoldID, newAddress));
    }

    @PostMapping("/move")
    public ResponseEntity<?> moveMember(@RequestBody Map<String, Object> body) {
        String userId = (String) body.get("userId");
        String targetHouseholdId = (String) body.get("targetHouseholdId");
        String relationship = (String) body.get("relationship");
        return ResponseEntity.ok(householdService.moveMember(userId, targetHouseholdId, relationship));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHouseholdById(@PathVariable String id) {
        return ResponseEntity.ok(householdService.getHouseholdById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHousehold(@PathVariable String id, @RequestBody Map<String, Object> body) {
        String houseHoldID = (String) body.get("houseHoldID");
        String address = (String) body.get("address");
        String leaderId = (String) body.get("leaderId");
        return ResponseEntity.ok(householdService.updateHousehold(id, houseHoldID, address, leaderId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHousehold(@PathVariable String id) {
        householdService.deleteHousehold(id);
        return ResponseEntity.ok(Map.of("message", "Household deleted"));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<?> getHouseholdResidents(@PathVariable String id) {
        return ResponseEntity.ok(householdService.getHouseholdResidents(id));
    }

    @GetMapping("/{id}/members-info")
    public ResponseEntity<?> getMemberSummaries(@PathVariable String id) {
        return ResponseEntity.ok(householdService.getMemberSummaries(id));
    }

    @GetMapping("/{householdId}/member/{userId}")
    public ResponseEntity<?> getMemberById(@PathVariable String householdId, @PathVariable String userId) {
        return ResponseEntity.ok(householdService.getMemberById(householdId, userId));
    }

    @PostMapping("/{id}/members")
    public ResponseEntity<?> addMember(@PathVariable String id, @RequestBody Map<String, String> body) {
        String userId = body.get("userId");
        String relationship = body.get("relationship");
        return ResponseEntity.ok(householdService.addMember(id, userId, relationship));
    }

    @DeleteMapping("/{householdId}/members/{memberId}")
    public ResponseEntity<?> removeMember(@PathVariable String householdId, @PathVariable String memberId) {
        return ResponseEntity.ok(householdService.removeMember(householdId, memberId));
    }

    @GetMapping("/{householdId}/resident-history")
    public ResponseEntity<?> getResidentHistory(@PathVariable String householdId) {
        return ResponseEntity.ok(householdService.getResidentHistory(householdId));
    }

    @GetMapping("/{householdId}/changes")
    public ResponseEntity<?> getHouseholdChanges(@PathVariable String householdId) {
        return ResponseEntity.ok(householdService.getHouseholdChanges(householdId));
    }

    @PostMapping("/{householdId}/temporary-residents")
    public ResponseEntity<?> addTemporaryResident(@PathVariable String householdId, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(stubService.getStubDetailResponse());
    }

    @PutMapping("/{householdId}/resident-history")
    public ResponseEntity<?> updateResidentHistory(@PathVariable String householdId, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(householdService.updateResidentHistory(householdId, body));
    }

    @PutMapping("/{householdId}/resident-history/complete")
    public ResponseEntity<?> completeResidentHistory(@PathVariable String householdId, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(householdService.completeResidentHistory(householdId, body));
    }
}

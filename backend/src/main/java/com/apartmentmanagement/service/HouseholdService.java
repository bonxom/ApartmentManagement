package com.apartmentmanagement.service;

import com.apartmentmanagement.entity.Household;
import com.apartmentmanagement.entity.ResidentHistory;
import com.apartmentmanagement.entity.Role;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.exception.BusinessException;
import com.apartmentmanagement.exception.ResourceNotFoundException;
import com.apartmentmanagement.repository.HouseholdRepository;
import com.apartmentmanagement.repository.ResidentHistoryRepository;
import com.apartmentmanagement.repository.RoleRepository;
import com.apartmentmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HouseholdService {

    private final HouseholdRepository householdRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ResidentHistoryRepository residentHistoryRepository;

    // Helper: Convert user to safe map (no password)
    private Map<String, Object> userToMap(User user) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("_id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("userCardID", user.getUserCardID());
        map.put("sex", user.getSex());
        map.put("dob", user.getDob());
        map.put("phoneNumber", user.getPhoneNumber());
        map.put("job", user.getJob());
        map.put("relationshipWithHead", user.getRelationshipWithHead());
        map.put("birthLocation", user.getBirthLocation());
        map.put("ethnic", user.getEthnic());
        return map;
    }

    private Role getRole(String name) {
        return roleRepository.findByRole_name(name)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + name));
    }

    @Transactional(readOnly = true)
    public List<Household> getAllHouseholds() {
        return householdRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Household getHouseholdById(String id) {
        return householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getHouseholdResidents(String householdId) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
        if (household.getMembers() == null) return Collections.emptyList();
        return household.getMembers().stream().map(this::userToMap).collect(Collectors.toList());
    }

    @Transactional
    public Household createHousehold(String houseHoldID, String address, String leaderId) {
        if (householdRepository.findByHouseHoldID(houseHoldID).isPresent()) {
            throw new BusinessException("Household ID already exists");
        }
        User leader = userRepository.findById(leaderId)
                .orElseThrow(() -> new ResourceNotFoundException("Leader user not found"));
        if (leader.getHousehold() != null) {
            throw new BusinessException("Leader already belongs to another household");
        }

        Household household = Household.builder()
                .houseHoldID(houseHoldID)
                .address(address)
                .leader(leader)
                .members(new ArrayList<>(List.of(leader)))
                .build();
        household = householdRepository.save(household);

        Role houseMemberRole = getRole("HOUSE MEMBER");
        leader.setHousehold(household);
        leader.setRelationshipWithHead("Chủ hộ");
        leader.setRole(houseMemberRole);
        userRepository.save(leader);

        return household;
    }

    @Transactional
    public Household updateHousehold(String id, String houseHoldID, String address, String leaderId) {
        Household household = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        if (houseHoldID != null && !houseHoldID.equals(household.getHouseHoldID())) {
            if (householdRepository.findByHouseHoldID(houseHoldID).isPresent()) {
                throw new BusinessException("Duplicate Household ID");
            }
            household.setHouseHoldID(houseHoldID);
        }
        if (address != null) household.setAddress(address);

        if (leaderId != null && !leaderId.equals(household.getLeader().getId())) {
            User newLeader = userRepository.findById(leaderId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            if (newLeader.getHousehold() != null && !newLeader.getHousehold().getId().equals(id)) {
                throw new BusinessException("New leader belongs to another household");
            }

            User oldLeader = household.getLeader();
            oldLeader.setRelationshipWithHead("Thành viên");
            userRepository.save(oldLeader);

            household.setLeader(newLeader);
            if (household.getMembers() == null) household.setMembers(new ArrayList<>());
            if (household.getMembers().stream().noneMatch(m -> m.getId().equals(leaderId))) {
                household.getMembers().add(newLeader);
            }
            newLeader.setHousehold(household);
            newLeader.setRelationshipWithHead("Chủ hộ");
            userRepository.save(newLeader);
        }

        return householdRepository.save(household);
    }

    @Transactional
    public void deleteHousehold(String id) {
        Household household = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
        Role memberRole = getRole("MEMBER");

        if (household.getMembers() != null) {
            for (User member : household.getMembers()) {
                member.setHousehold(null);
                member.setRelationshipWithHead(null);
                member.setRole(memberRole);
                userRepository.save(member);
            }
        }
        householdRepository.delete(household);
    }

    @Transactional
    public Household addMember(String householdId, String userId, String relationship) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getHousehold() != null && !user.getHousehold().getId().equals(householdId)) {
            throw new BusinessException("This user is already in another household");
        }
        if (household.getMembers() != null && household.getMembers().stream().anyMatch(m -> m.getId().equals(userId))) {
            throw new BusinessException("User is already a household member");
        }

        if (household.getMembers() == null) household.setMembers(new ArrayList<>());
        household.getMembers().add(user);
        household = householdRepository.save(household);

        user.setHousehold(household);
        user.setRelationshipWithHead(relationship != null ? relationship : "Thành viên");
        user.setRole(getRole("HOUSE MEMBER"));
        userRepository.save(user);

        return household;
    }

    @Transactional
    public Map<String, Object> removeMember(String householdId, String memberId) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        boolean isLeader = household.getLeader() != null && household.getLeader().getId().equals(memberId);
        int memberCount = household.getMembers() != null ? household.getMembers().size() : 0;

        if (isLeader && memberCount == 1) {
            // Delete household
            Role memberRole = getRole("MEMBER");
            User leader = household.getLeader();
            leader.setHousehold(null);
            leader.setRelationshipWithHead(null);
            leader.setRole(memberRole);
            userRepository.save(leader);
            householdRepository.delete(household);
            return Map.of("message", "Household deleted because the last member was removed");
        }

        if (isLeader) {
            throw new BusinessException("Cannot remove the household leader. Please assign a new leader first.");
        }

        household.getMembers().removeIf(m -> m.getId().equals(memberId));
        householdRepository.save(household);

        User member = userRepository.findById(memberId).orElse(null);
        if (member != null) {
            member.setHousehold(null);
            member.setRelationshipWithHead(null);
            member.setRole(getRole("MEMBER"));
            userRepository.save(member);
        }

        return Map.of("message", "Member removed");
    }

    @Transactional
    public Map<String, Object> splitHousehold(String userId, String newHouseHoldID, String newAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getHousehold() == null) throw new BusinessException("This user doesn't have any household");

        Household oldHousehold = householdRepository.findById(user.getHousehold().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Old household not found"));

        if (oldHousehold.getLeader().getId().equals(userId)) {
            throw new BusinessException("Can't split household for the household owner");
        }
        if (householdRepository.findByHouseHoldID(newHouseHoldID).isPresent()) {
            throw new BusinessException("New household ID has existed");
        }

        oldHousehold.getMembers().removeIf(m -> m.getId().equals(userId));
        householdRepository.save(oldHousehold);

        Household newHousehold = Household.builder()
                .houseHoldID(newHouseHoldID)
                .address(newAddress)
                .leader(user)
                .members(new ArrayList<>(List.of(user)))
                .build();
        newHousehold = householdRepository.save(newHousehold);

        user.setHousehold(newHousehold);
        user.setRelationshipWithHead("Chủ hộ");
        user.setRole(getRole("HOUSE MEMBER"));
        userRepository.save(user);

        return Map.of("message", "Split success", "newHousehold", newHousehold);
    }

    @Transactional
    public Map<String, Object> moveMember(String userId, String targetHouseholdId, String relationship) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (user.getHousehold() == null) throw new BusinessException("Can't find user's household");

        Household oldHousehold = householdRepository.findById(user.getHousehold().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Old household not found"));
        Household targetHousehold = householdRepository.findById(targetHouseholdId)
                .orElseThrow(() -> new ResourceNotFoundException("Target household not found"));

        if (oldHousehold.getId().equals(targetHouseholdId)) {
            throw new BusinessException("This user is already in target household");
        }

        if (oldHousehold.getLeader().getId().equals(userId)) {
            if (oldHousehold.getMembers().size() == 1) {
                householdRepository.delete(oldHousehold);
            } else {
                throw new BusinessException("Please assign another resident to be household owner");
            }
        } else {
            oldHousehold.getMembers().removeIf(m -> m.getId().equals(userId));
            householdRepository.save(oldHousehold);
        }

        if (targetHousehold.getMembers() == null) targetHousehold.setMembers(new ArrayList<>());
        if (targetHousehold.getMembers().stream().noneMatch(m -> m.getId().equals(userId))) {
            targetHousehold.getMembers().add(user);
        }
        householdRepository.save(targetHousehold);

        user.setHousehold(targetHousehold);
        user.setRelationshipWithHead(relationship);
        user.setRole(getRole("HOUSE MEMBER"));
        userRepository.save(user);

        return Map.of("message", "Move success");
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMemberSummaries(String householdId) {
        return getHouseholdResidents(householdId);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getMemberById(String householdId, String userId) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
        User member = household.getMembers().stream()
                .filter(m -> m.getId().equals(userId)).findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("User is not a member of this household"));
        return userToMap(member);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getHouseholdChanges(String householdId) {
        Household household = householdRepository.findById(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));
        ResidentHistory history = residentHistoryRepository.findByHouseHoldId(householdId).orElse(null);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("temporaryHistory", history);
        response.put("majorChanges", Collections.emptyList());
        return response;
    }

    @Transactional(readOnly = true)
    public ResidentHistory getResidentHistory(String householdId) {
        return residentHistoryRepository.findByHouseHoldId(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Resident history not found"));
    }

    @Transactional
    public ResidentHistory updateResidentHistory(String householdId, Map<String, Object> body) {
        ResidentHistory history = residentHistoryRepository.findByHouseHoldId(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Resident history not found"));
        // Basic update - full implementation would parse the body
        return residentHistoryRepository.save(history);
    }

    @Transactional
    public ResidentHistory completeResidentHistory(String householdId, Map<String, Object> body) {
        ResidentHistory history = residentHistoryRepository.findByHouseHoldId(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Resident history not found"));
        // Mark as completed
        return residentHistoryRepository.save(history);
    }
}

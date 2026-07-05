package com.apartmentmanagement.service;

import com.apartmentmanagement.entity.Household;
import com.apartmentmanagement.entity.Role;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.dto.request.ChangePasswordRequest;
import com.apartmentmanagement.dto.request.CreateUserRequest;
import com.apartmentmanagement.dto.response.UserResponse;
import com.apartmentmanagement.enums.UserStatus;
import com.apartmentmanagement.exception.BusinessException;
import com.apartmentmanagement.exception.ResourceNotFoundException;
import com.apartmentmanagement.exception.UnauthorizedException;
import com.apartmentmanagement.repository.HouseholdRepository;
import com.apartmentmanagement.repository.RoleRepository;
import com.apartmentmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final HouseholdRepository householdRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::fromUser)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.fromUser(user);
    }

    @Transactional
    public Map<String, Object> createUser(CreateUserRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new BusinessException("Email has existed");
        }
        if (userRepository.findByUserCardID(request.getUserCardID()).isPresent()) {
            throw new BusinessException("userCardID has existed");
        }

        Role role;
        if (request.getRoleId() != null) {
            role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        } else if (request.getRoleName() != null) {
            role = roleRepository.findByRole_name(request.getRoleName())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
        } else {
            role = roleRepository.findByRole_name("MEMBER")
                    .orElseThrow(() -> new ResourceNotFoundException("Default role MEMBER not found"));
        }

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .userCardID(request.getUserCardID())
                .sex(request.getSex())
                .phoneNumber(request.getPhoneNumber())
                .job(request.getJob())
                .ethnic(request.getEthnic())
                .birthLocation(request.getBirthLocation())
                .status(request.getStatus() != null ? UserStatus.valueOf(request.getStatus()) : UserStatus.VERIFIED)
                .role(role)
                .build();

        user = userRepository.save(user);
        return UserResponse.fromUser(user);
    }

    @Transactional
    public Map<String, Object> updateUser(String id, Map<String, Object> updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (updates.containsKey("email") && updates.get("email") != null) {
            String newEmail = ((String) updates.get("email")).toLowerCase().trim();
            if (!newEmail.equals(user.getEmail()) && userRepository.findByEmail(newEmail).isPresent()) {
                throw new BusinessException("Email has existed");
            }
            user.setEmail(newEmail);
        }
        if (updates.containsKey("name") && updates.get("name") != null) {
            user.setName((String) updates.get("name"));
        }
        if (updates.containsKey("sex") && updates.get("sex") != null) {
            user.setSex((String) updates.get("sex"));
        }
        if (updates.containsKey("phoneNumber") && updates.get("phoneNumber") != null) {
            user.setPhoneNumber((String) updates.get("phoneNumber"));
        }
        if (updates.containsKey("job") && updates.get("job") != null) {
            user.setJob((String) updates.get("job"));
        }
        if (updates.containsKey("ethnic") && updates.get("ethnic") != null) {
            user.setEthnic((String) updates.get("ethnic"));
        }
        if (updates.containsKey("birthLocation") && updates.get("birthLocation") != null) {
            user.setBirthLocation((String) updates.get("birthLocation"));
        }
        if (updates.containsKey("relationshipWithHead") && updates.get("relationshipWithHead") != null) {
            user.setRelationshipWithHead((String) updates.get("relationshipWithHead"));
        }
        if (updates.containsKey("roleId") || updates.containsKey("role")) {
            String roleId = (String) updates.getOrDefault("roleId", updates.get("role"));
            if (roleId != null) {
                Role role = roleRepository.findById(roleId)
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found"));
                user.setRole(role);
            }
        }

        user = userRepository.save(user);
        return UserResponse.fromUser(user);
    }

    @Transactional
    public void deleteUser(String id, String currentUserId) {
        if (id.equals(currentUserId)) {
            throw new BusinessException("Cannot delete yourself");
        }

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if user is a household leader
        if (user.getHousehold() != null) {
            Household household = householdRepository.findById(user.getHousehold().getId()).orElse(null);
            if (household != null && household.getLeader() != null && household.getLeader().getId().equals(id)) {
                throw new BusinessException("This user is the owner of a household. Remove the owner role first.");
            }
            // Remove user from household by clearing FK
            if (household != null) {
                user.setHousehold(null);
                user.setRelationshipWithHead(null);
            }
        }

        userRepository.delete(user);
    }

    @Transactional
    public void changePassword(String userId, ChangePasswordRequest request, boolean isSelfChange) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (isSelfChange) {
            if (request.getOldPassword() == null || request.getOldPassword().isEmpty()) {
                throw new BusinessException("Old password is required");
            }
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new UnauthorizedException("Current password is incorrect");
            }
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getMyHousehold(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getHousehold() == null) {
            throw new BusinessException("User does not belong to any household");
        }

        Household household = householdRepository.findById(user.getHousehold().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Household not found"));

        Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("_id", household.getId());
        result.put("houseHoldID", household.getHouseHoldID());
        result.put("address", household.getAddress());

        if (household.getLeader() != null) {
            Map<String, Object> leaderMap = new java.util.LinkedHashMap<>();
            leaderMap.put("_id", household.getLeader().getId());
            leaderMap.put("name", household.getLeader().getName());
            leaderMap.put("email", household.getLeader().getEmail());
            leaderMap.put("userCardID", household.getLeader().getUserCardID());
            result.put("leader", leaderMap);
        }

        List<User> members = userRepository.findByHouseholdId(household.getId());
        if (!members.isEmpty()) {
            result.put("members", members.stream().map(m -> {
                Map<String, Object> mMap = new java.util.LinkedHashMap<>();
                mMap.put("_id", m.getId());
                mMap.put("name", m.getName());
                mMap.put("email", m.getEmail());
                mMap.put("userCardID", m.getUserCardID());
                return mMap;
            }).collect(java.util.stream.Collectors.toList()));
        }

        return result;
    }
}

package com.apartmentmanagement.dto.response;

import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.entity.Permission;

import java.util.*;
import java.util.stream.Collectors;

public class UserResponse {

    public static Map<String, Object> fromUser(User user) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("_id", user.getId());
        map.put("email", user.getEmail());
        map.put("name", user.getName());
        map.put("userCardID", user.getUserCardID());
        map.put("sex", user.getSex());
        map.put("dob", user.getDob());
        map.put("birthLocation", user.getBirthLocation());
        map.put("ethnic", user.getEthnic());
        map.put("phoneNumber", user.getPhoneNumber());
        map.put("job", user.getJob());
        map.put("relationshipWithHead", user.getRelationshipWithHead());
        map.put("status", user.getStatus() != null ? user.getStatus().toString() : null);

        // Populate role with permissions
        if (user.getRole() != null) {
            Map<String, Object> roleMap = new LinkedHashMap<>();
            roleMap.put("_id", user.getRole().getId());
            roleMap.put("role_name", user.getRole().getRole_name());
            if (user.getRole().getPermissions() != null) {
                roleMap.put("permissions", user.getRole().getPermissions().stream()
                        .map(p -> {
                            Map<String, Object> permMap = new LinkedHashMap<>();
                            permMap.put("_id", p.getId());
                            permMap.put("permission_name", p.getPermission_name());
                            return permMap;
                        })
                        .collect(Collectors.toList()));
            }
            map.put("role", roleMap);
        }

        // Populate household if present
        if (user.getHousehold() != null) {
            Map<String, Object> hhMap = new LinkedHashMap<>();
            hhMap.put("_id", user.getHousehold().getId());
            hhMap.put("houseHoldID", user.getHousehold().getHouseHoldID());
            hhMap.put("address", user.getHousehold().getAddress());
            map.put("household", hhMap);
        }

        return map;
    }
}

package com.apartmentmanagement.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    private String email;
    private Long userCardID;
    private String name;
    private String sex;
    private String dob;
    private String birthLocation;
    private String ethnic;
    private String phoneNumber;
    private String job;
    private String relationshipWithHead;
    private String status;
    private String roleId;
    private String roleName;
}

package com.apartmentmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "UserCardID is required")
    private Long userCardID;

    private String sex;
    private String dob;
    private String phoneNumber;
    private String job;
    private String ethnic;
    private String birthLocation;
    private String status;
    private String roleId;
    private String roleName;
}

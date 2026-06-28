package com.apartmentmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateHouseholdRequest {
    @NotBlank(message = "Household ID is required")
    private String houseHoldID;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "Leader ID is required")
    private String leaderId;
}

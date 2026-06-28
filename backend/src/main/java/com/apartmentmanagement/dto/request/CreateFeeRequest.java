package com.apartmentmanagement.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateFeeRequest {
    @NotBlank(message = "Fee name is required")
    private String name;

    @NotBlank(message = "Fee type is required")
    private String type;

    private String description;
    private Double unitPrice;
}

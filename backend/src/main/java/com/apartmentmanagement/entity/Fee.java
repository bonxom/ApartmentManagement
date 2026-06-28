package com.apartmentmanagement.entity;

import com.apartmentmanagement.enums.FeeType;
import com.apartmentmanagement.enums.FeeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "fees")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Fee {

    @Id
    private String id;

    private String name;
    private FeeType type;
    private String description;

    @Builder.Default
    private Double unitPrice = 0.0;

    @Builder.Default
    private FeeStatus status = FeeStatus.ACTIVE;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

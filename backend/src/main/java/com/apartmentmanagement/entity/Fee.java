package com.apartmentmanagement.entity;

import com.apartmentmanagement.enums.FeeStatus;
import com.apartmentmanagement.enums.FeeType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "fees")
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Fee {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private String id;

    private String name;

    @Enumerated(EnumType.STRING)
    private FeeType type;

    private String description;

    @Builder.Default
    @Column(name = "unit_price")
    private Double unitPrice = 0.0;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private FeeStatus status = FeeStatus.ACTIVE;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

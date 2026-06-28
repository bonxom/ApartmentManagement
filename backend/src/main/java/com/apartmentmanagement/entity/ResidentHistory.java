package com.apartmentmanagement.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Document(collection = "residenthistories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResidentHistory {

    @Id
    private String id;

    @DBRef
    private Household houseHoldId;

    @Builder.Default
    private List<TemporaryResident> temporaryResidents = new ArrayList<>();

    @Builder.Default
    private List<TemporaryAbsent> temporaryAbsent = new ArrayList<>();

    @Builder.Default
    private List<BirthRecord> births = new ArrayList<>();

    @Builder.Default
    private List<DeathRecord> deaths = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TemporaryResident {
        private String name;
        private String userCardID;
        private Date dob;
        private String sex;
        private String birthLocation;
        private String ethnic;
        private String phoneNumber;
        private String job;
        private String permanentAddress;
        private String reason;
        private Date startDate;
        private Date endDate;
        @Builder.Default
        private Boolean isActive = true;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TemporaryAbsent {
        @DBRef
        private User user;
        private Date startDate;
        private Date endDate;
        private String reason;
        private String temporaryAddress;
        @Builder.Default
        private Boolean isActive = true;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BirthRecord {
        private String name;
        private String sex;
        private Date dob;
        private String birthLocation;
        private String birthCertificateNumber;
        private String relationshipWithHead;
        private String ethnic;
        @Builder.Default
        private Date createdAt = new Date();
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeathRecord {
        @DBRef
        private User user;
        private String name;
        private String userCardID;
        private Date dateOfDeath;
        private String reason;
        private String deathCertificateUrl;
        @Builder.Default
        private Date createdAt = new Date();
    }
}

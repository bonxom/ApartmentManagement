package com.apartmentmanagement.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "resident_histories")
@EntityListeners(AuditingEntityListener.class)
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResidentHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(updatable = false, nullable = false)
    private String id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id")
    private Household household;

    @OneToMany(mappedBy = "residentHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TemporaryResident> temporaryResidents = new ArrayList<>();

    @OneToMany(mappedBy = "residentHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TemporaryAbsent> temporaryAbsent = new ArrayList<>();

    @OneToMany(mappedBy = "residentHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<BirthRecord> births = new ArrayList<>();

    @OneToMany(mappedBy = "residentHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DeathRecord> deaths = new ArrayList<>();

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    // --- Inner classes kept as static for backward compatibility,
    //     but instantiated as separate @Entity classes below ---

    @Entity
    @Table(name = "temporary_residents")
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TemporaryResident {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        @Column(updatable = false, nullable = false)
        private String id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "resident_history_id")
        private ResidentHistory residentHistory;

        private String name;
        private String userCardID;

        @Temporal(TemporalType.DATE)
        private Date dob;

        private String sex;
        private String birthLocation;
        private String ethnic;
        private String phoneNumber;
        private String job;
        private String permanentAddress;
        private String reason;

        @Temporal(TemporalType.DATE)
        private Date startDate;

        @Temporal(TemporalType.DATE)
        private Date endDate;

        @Builder.Default
        private Boolean isActive = true;
    }

    @Entity
    @Table(name = "temporary_absents")
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TemporaryAbsent {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        @Column(updatable = false, nullable = false)
        private String id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "resident_history_id")
        private ResidentHistory residentHistory;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id")
        private User user;

        @Temporal(TemporalType.DATE)
        private Date startDate;

        @Temporal(TemporalType.DATE)
        private Date endDate;

        private String reason;
        private String temporaryAddress;

        @Builder.Default
        private Boolean isActive = true;
    }

    @Entity
    @Table(name = "birth_records")
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BirthRecord {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        @Column(updatable = false, nullable = false)
        private String id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "resident_history_id")
        private ResidentHistory residentHistory;

        private String name;
        private String sex;

        @Temporal(TemporalType.DATE)
        private Date dob;

        private String birthLocation;
        private String birthCertificateNumber;
        private String relationshipWithHead;
        private String ethnic;

        @Builder.Default
        @Temporal(TemporalType.DATE)
        private Date createdAt = new Date();
    }

    @Entity
    @Table(name = "death_records")
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeathRecord {

        @Id
        @GeneratedValue(strategy = GenerationType.UUID)
        @Column(updatable = false, nullable = false)
        private String id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "resident_history_id")
        private ResidentHistory residentHistory;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id")
        private User user;

        private String name;
        private String userCardID;

        @Temporal(TemporalType.DATE)
        private Date dateOfDeath;

        private String reason;
        private String deathCertificateUrl;

        @Builder.Default
        @Temporal(TemporalType.DATE)
        private Date createdAt = new Date();
    }
}

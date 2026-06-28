package com.apartmentmanagement.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "households")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Household {

    @Id
    private String id;

    @Indexed(unique = true)
    private String houseHoldID;

    private String address;

    @DBRef
    private User leader;

    @DBRef
    @Builder.Default
    private List<User> members = new ArrayList<>();

    @DBRef
    private ResidentHistory historyID;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

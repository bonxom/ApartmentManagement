package com.apartmentmanagement.entity;

import com.apartmentmanagement.enums.RoleEnum;
import com.apartmentmanagement.enums.UserStatus;
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
import java.util.Date;

@Document(collection = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;

    @Indexed(unique = true)
    private Long userCardID;

    private String name;
    private String sex;
    private Date dob;
    private String birthLocation;
    private String ethnic;
    private String phoneNumber;
    private String job;
    private String relationshipWithHead;

    private UserStatus status;

    @DBRef
    private Role role;

    @DBRef
    private Household household;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

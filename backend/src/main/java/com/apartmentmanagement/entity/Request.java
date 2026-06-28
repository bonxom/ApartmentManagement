package com.apartmentmanagement.entity;

import com.apartmentmanagement.enums.RequestStatus;
import com.apartmentmanagement.enums.RequestType;
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
import java.util.HashMap;
import java.util.Map;

@Document(collection = "requests")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Request {

    @Id
    private String id;

    @DBRef
    private User requester;

    private RequestType type;

    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    @Builder.Default
    private Map<String, Object> requestData = new HashMap<>();

    @Builder.Default
    private String leaderComment = "";

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}

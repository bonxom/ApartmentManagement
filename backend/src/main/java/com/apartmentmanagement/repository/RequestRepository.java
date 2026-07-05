package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.Request;
import com.apartmentmanagement.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, String> {
    List<Request> findByRequesterId(String requesterId);
    long countByRequesterIdAndStatus(String requesterId, RequestStatus status);
}

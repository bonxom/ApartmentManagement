package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.Request;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RequestRepository extends MongoRepository<Request, String> {
    List<Request> findByRequester(String requesterId);
    long countByRequesterAndStatus(String requesterId, String status);
}

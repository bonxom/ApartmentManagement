package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUserCardID(Long userCardID);
    boolean existsByEmail(String email);
    boolean existsByUserCardID(Long userCardID);
    long countByStatus(String status);
    long countBySex(String sex);
}

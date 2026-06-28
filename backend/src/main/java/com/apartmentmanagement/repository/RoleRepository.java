package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends MongoRepository<Role, String> {
    @Query("{ 'role_name': ?0 }")
    Optional<Role> findByRole_name(String roleName);
}

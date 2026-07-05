package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.enums.UserStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {

    @EntityGraph(attributePaths = {"role", "role.permissions"})
    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = {"role", "role.permissions"})
    Optional<User> findById(String id);

    Optional<User> findByUserCardID(Long userCardID);
    boolean existsByEmail(String email);
    boolean existsByUserCardID(Long userCardID);
    long countByStatus(UserStatus status);
    long countBySex(String sex);

    // Replaces household.getMembers() denormalization
    List<User> findByHouseholdId(String householdId);
    long countByHouseholdId(String householdId);
    Optional<User> findByIdAndHouseholdId(String userId, String householdId);
}

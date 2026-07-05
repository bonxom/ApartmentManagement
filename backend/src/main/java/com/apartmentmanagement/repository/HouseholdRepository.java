package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HouseholdRepository extends JpaRepository<Household, String> {
    Optional<Household> findByHouseHoldID(String houseHoldID);
    boolean existsByHouseHoldID(String houseHoldID);
}

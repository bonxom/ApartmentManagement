package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.Fee;
import com.apartmentmanagement.enums.FeeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeeRepository extends JpaRepository<Fee, String> {
    List<Fee> findByStatus(FeeStatus status);
    Optional<Fee> findByName(String name);
}

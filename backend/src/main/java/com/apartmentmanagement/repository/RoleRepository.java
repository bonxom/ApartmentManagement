package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
    @Query("select r from Role r where r.role_name = :roleName")
    Optional<Role> findByRole_name(@Param("roleName") String roleName);
}

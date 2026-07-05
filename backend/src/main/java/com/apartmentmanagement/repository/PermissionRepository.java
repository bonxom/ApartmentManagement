package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, String> {
    @Query("select p from Permission p where p.permission_name = :permissionName")
    Optional<Permission> findByPermission_name(@Param("permissionName") String permissionName);

    @Query("select p from Permission p where p.permission_name in :names")
    List<Permission> findByPermission_nameIn(@Param("names") List<String> names);
}

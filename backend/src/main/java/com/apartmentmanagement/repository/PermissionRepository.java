package com.apartmentmanagement.repository;

import com.apartmentmanagement.entity.Permission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends MongoRepository<Permission, String> {
    @Query("{ 'permission_name': ?0 }")
    Optional<Permission> findByPermission_name(String permissionName);

    @Query("{ 'permission_name': { $in: ?0 } }")
    List<Permission> findByPermission_nameIn(List<String> names);
}

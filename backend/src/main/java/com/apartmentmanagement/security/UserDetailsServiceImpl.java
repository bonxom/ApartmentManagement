package com.apartmentmanagement.security;

import com.apartmentmanagement.entity.Permission;
import com.apartmentmanagement.entity.Role;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl {

    private final UserRepository userRepository;

    public User loadUserById(String userId) {
        return userRepository.findById(userId).orElse(null);
    }

    public Collection<? extends GrantedAuthority> getAuthorities(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        Role role = user.getRole();
        if (role != null) {
            // Add role as authority
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getRole_name()));

            // Add permissions as authorities
            if (role.getPermissions() != null) {
                authorities.addAll(role.getPermissions().stream()
                        .map(p -> new SimpleGrantedAuthority(p.getPermission_name()))
                        .collect(Collectors.toList()));
            }
        }

        return authorities;
    }
}

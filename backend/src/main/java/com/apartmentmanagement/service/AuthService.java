package com.apartmentmanagement.service;

import com.apartmentmanagement.entity.Role;
import com.apartmentmanagement.entity.User;
import com.apartmentmanagement.dto.request.LoginRequest;
import com.apartmentmanagement.dto.request.RegisterRequest;
import com.apartmentmanagement.dto.response.LoginResponse;
import com.apartmentmanagement.dto.response.UserResponse;
import com.apartmentmanagement.enums.UserStatus;
import com.apartmentmanagement.exception.BusinessException;
import com.apartmentmanagement.exception.ResourceNotFoundException;
import com.apartmentmanagement.exception.UnauthorizedException;
import com.apartmentmanagement.repository.RoleRepository;
import com.apartmentmanagement.repository.UserRepository;
import com.apartmentmanagement.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UnauthorizedException("Email/password not correct"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Email/password not correct");
        }

        if (user.getStatus() == UserStatus.PENDING) {
            throw new BusinessException("Your account has not been verified");
        }
        if (user.getStatus() == UserStatus.LOCKED) {
            throw new BusinessException("Your account has been suspended");
        }

        String token = jwtTokenProvider.generateToken(user.getId());

        return LoginResponse.builder()
                .message("Login successful")
                .token(token)
                .user(UserResponse.fromUser(user))
                .build();
    }

    @Transactional
    public Map<String, Object> register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        if (userRepository.findByEmail(email).isPresent()) {
            throw new BusinessException("Email has existed");
        }

        if (request.getUserCardID() != null && userRepository.findByUserCardID(request.getUserCardID()).isPresent()) {
            throw new BusinessException("userCardID has existed");
        }

        Role memberRole = roleRepository.findByRole_name("MEMBER")
                .orElseThrow(() -> new ResourceNotFoundException("Default role MEMBER not found"));

        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .userCardID(request.getUserCardID())
                .sex(request.getSex())
                .phoneNumber(request.getPhoneNumber())
                .job(request.getJob())
                .ethnic(request.getEthnic())
                .birthLocation(request.getBirthLocation())
                .status(UserStatus.PENDING)
                .role(memberRole)
                .build();

        user = userRepository.save(user);

        return Map.of(
                "message", "Registration in process. Please wait for approval",
                "user", UserResponse.fromUser(user)
        );
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getMe(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return UserResponse.fromUser(user);
    }
}

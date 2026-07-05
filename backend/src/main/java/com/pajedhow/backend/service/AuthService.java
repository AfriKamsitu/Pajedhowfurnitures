package com.pajedhow.backend.service;

import com.pajedhow.backend.dto.AuthDtos.*;
import com.pajedhow.backend.entity.Role;
import com.pajedhow.backend.entity.User;
import com.pajedhow.backend.entity.enums.Enums.AccountStatus;
import com.pajedhow.backend.exception.BadRequestException;
import com.pajedhow.backend.mapper.Mappers;
import com.pajedhow.backend.repository.UserRepository;
import com.pajedhow.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Emails starting with "admin@" become SUPER_ADMIN so the demo works without
     * a manual role table, matching the frontend's provisioning rule.
     */
    private Role roleForEmail(String email) {
        return email.trim().toLowerCase().startsWith("admin@") ? Role.SUPER_ADMIN : Role.CUSTOMER;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmailIgnoreCase(req.email())) {
            throw new BadRequestException("An account with this email already exists.");
        }
        User user = User.builder()
                .name(req.name())
                .email(req.email().trim().toLowerCase())
                .password(passwordEncoder.encode(req.password()))
                .role(roleForEmail(req.email()))
                .status(AccountStatus.ACTIVE)
                .build();
        user = userRepository.save(user);
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest req) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.email().trim().toLowerCase(), req.password()));
        User user = userRepository.findByEmailIgnoreCase(req.email())
                .orElseThrow(() -> new BadRequestException("Invalid email or password."));
        user.setLastActiveAt(Instant.now());
        userRepository.save(user);
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse refresh(String refreshToken) {
        String userId = jwtService.extractUserId(refreshToken);
        if (userId == null || !jwtService.isTokenValid(refreshToken, userId)) {
            throw new BadRequestException("Invalid or expired refresh token.");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("Account no longer exists."));
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String access = jwtService.generateAccessToken(user);
        String refresh = jwtService.generateRefreshToken(user);
        return new AuthResponse(access, refresh, "Bearer",
                jwtService.getAccessTokenExpirationMs(), Mappers.toUser(user));
    }
}

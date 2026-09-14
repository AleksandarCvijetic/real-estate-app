package com.realestate.user_service.service;

import com.realestate.user_service.dto.AuthResponse;
import com.realestate.user_service.dto.LoginRequest;
import com.realestate.user_service.dto.RegisterRequest;
import com.realestate.user_service.entity.RefreshToken;
import com.realestate.user_service.entity.User;
import com.realestate.user_service.repository.RefreshTokenRepository;
import com.realestate.user_service.repository.UserRepository;
import com.realestate.user_service.security.JwtService;
import com.realestate.user_service.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .accountType(request.getAccountType())
                .role(com.realestate.user_service.entity.enums.Role.USER)
                .createdAt(LocalDateTime.now())
                .enabled(true) // bez email verifikacije za sada
                .build();

        userRepository.save(user);

        UserPrincipal userPrincipal = new UserPrincipal(user);
        return generateAuthResponse(userPrincipal);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalStateException("User not found after authentication"));

        UserPrincipal userPrincipal = new UserPrincipal(user);
        return generateAuthResponse(userPrincipal);
    }

    @Transactional
    public AuthResponse refresh(String refreshTokenValue) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        if (storedToken.isExpired()) {
            refreshTokenRepository.delete(storedToken);
            throw new IllegalArgumentException("Refresh token expired, please login again");
        }

        User user = storedToken.getUser();
        UserPrincipal userPrincipal = new UserPrincipal(user);

        String newAccessToken = jwtService.generateAccessToken(userPrincipal);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshTokenValue) // isti refresh token, ne generisemo novi
                .build();
    }

    private AuthResponse generateAuthResponse(UserPrincipal userPrincipal) {
        String accessToken = jwtService.generateAccessToken(userPrincipal);
        String refreshTokenValue = UUID.randomUUID().toString();

        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenValue)
                .user(userPrincipal.getUser())
                .expiryDate(LocalDateTime.now().plusDays(7))
                .build();

        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .build();
    }

    @Transactional
    public void logout(String refreshTokenValue) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new IllegalArgumentException("Invalid refresh token"));

        refreshTokenRepository.delete(storedToken);
    }
}
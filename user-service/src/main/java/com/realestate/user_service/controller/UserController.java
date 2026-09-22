package com.realestate.user_service.controller;

import com.realestate.user_service.dto.UserResponse;
import com.realestate.user_service.entity.User;
import com.realestate.user_service.repository.UserRepository;
import com.realestate.user_service.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        UserResponse response = UserResponse.builder()
                .id(principal.getId())
                .email(principal.getUsername())
                .firstName(principal.getUser().getFirstName())
                .lastName(principal.getUser().getLastName())
                .role(principal.getUser().getRole())
                .accountType(principal.getUser().getAccountType())
                .build();

        return ResponseEntity.ok(response);
    }

    // Interni poziv drugih servisa (npr. notification-service za email primaoca poruke),
    // zato bez autentifikacije
    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        UserResponse response = UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .accountType(user.getAccountType())
                .build();

        return ResponseEntity.ok(response);
    }
}
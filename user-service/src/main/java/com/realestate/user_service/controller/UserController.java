package com.realestate.user_service.controller;

import com.realestate.user_service.dto.UserResponse;
import com.realestate.user_service.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

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
}
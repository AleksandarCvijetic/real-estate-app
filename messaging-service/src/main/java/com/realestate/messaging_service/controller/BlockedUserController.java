package com.realestate.messaging_service.controller;

import com.realestate.messaging_service.dto.BlockedUserResponse;
import com.realestate.messaging_service.security.SecurityUtils;
import com.realestate.messaging_service.service.BlockedUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messagings/blocked")
@RequiredArgsConstructor
public class BlockedUserController {

    private final BlockedUserService blockedUserService;

    @PostMapping("/{userId}")
    public ResponseEntity<BlockedUserResponse> block(@PathVariable Long userId) {
        BlockedUserResponse response = blockedUserService.block(userId, SecurityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> unblock(@PathVariable Long userId) {
        blockedUserService.unblock(userId, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<BlockedUserResponse>> getMyBlockedUsers() {
        return ResponseEntity.ok(blockedUserService.getMyBlockedUsers(SecurityUtils.getCurrentUserId()));
    }
}
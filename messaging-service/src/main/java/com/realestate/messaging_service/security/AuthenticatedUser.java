package com.realestate.messaging_service.security;

public record AuthenticatedUser(Long userId, String role) {
}
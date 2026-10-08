package com.realestate.listing_service.security;

public record AuthenticatedUser(Long userId, String role) {
}
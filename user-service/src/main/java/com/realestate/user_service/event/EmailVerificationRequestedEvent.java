package com.realestate.user_service.event;

public record EmailVerificationRequestedEvent(
        Long userId,
        String email,
        String firstName,
        String token
) {}

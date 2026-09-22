package com.realestate.notification_service.client;

// Minimalna kopija odgovora sa GET /api/users/{id} u User servisu - uzimamo samo ono sto nam treba za mejl.
public record UserResponse(Long id, String email, String firstName) {
}

package com.realestate.notification_service.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.Optional;

/**
 * Klijent za User servis. Adresa "http://user-service" se razresava preko Eureka
 * (zahvaljujuci @LoadBalanced RestClient.Builder-u).
 */
@Slf4j
@Component
public class UserServiceClient {

    private final RestClient restClient;

    public UserServiceClient(@LoadBalanced RestClient.Builder builder,
                              @Value("${app.user-service.url:http://user-service}") String baseUrl) {
        this.restClient = builder.baseUrl(baseUrl).build();
    }

    public Optional<UserResponse> getUser(Long userId) {
        try {
            return Optional.ofNullable(
                    restClient.get()
                            .uri("/api/users/{id}", userId)
                            .retrieve()
                            .body(UserResponse.class)
            );
        } catch (RestClientException e) {
            log.error("Poziv User servisa za korisnika {} nije uspeo", userId, e);
            return Optional.empty();
        }
    }
}

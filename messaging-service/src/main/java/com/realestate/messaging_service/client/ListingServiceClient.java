package com.realestate.messaging_service.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

/**
 * Klijent za Listing servis. Razgovor se vezuje za oglas, pa se vlasnik oglasa
 * (primalac prve poruke) uzima odavde, a ne od klijenta.
 * GET /api/listings/{id} je javan, pa poziv ne salje token.
 */
@Slf4j
@Component
public class ListingServiceClient {

    private final RestClient restClient;

    public ListingServiceClient(@LoadBalanced RestClient.Builder builder,
                                @Value("${app.listing-service.url:http://listing-service}") String baseUrl) {
        this.restClient = builder.baseUrl(baseUrl).build();
    }

    public Long getOwnerId(Long listingId) {
        try {
            ListingSummary listing = restClient.get()
                    .uri("/api/listings/{id}", listingId)
                    .retrieve()
                    .body(ListingSummary.class);

            if (listing == null || listing.ownerId() == null) {
                throw new IllegalArgumentException("Listing not found with id: " + listingId);
            }
            return listing.ownerId();
        } catch (HttpClientErrorException e) {
            // Listing servis vraca 400 za nepostojeci oglas.
            throw new IllegalArgumentException("Listing not found with id: " + listingId);
        } catch (RestClientException | IllegalStateException e) {
            log.error("Poziv Listing servisa nije uspeo", e);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Listing service is currently unavailable");
        }
    }

    private record ListingSummary(Long id, Long ownerId) {
    }
}

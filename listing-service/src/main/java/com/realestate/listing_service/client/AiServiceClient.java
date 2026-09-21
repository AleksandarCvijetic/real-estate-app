package com.realestate.listing_service.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Klijent za AI servis. Adresa "http://ai-service" se razresava preko Eureka
 * (zahvaljujuci @LoadBalanced RestClient.Builder-u), pa Listing servis ne mora
 * da zna na kom portu i hostu AI servis radi.
 */
@Slf4j
@Component
public class AiServiceClient {

    private final RestClient restClient;

    public AiServiceClient(@LoadBalanced RestClient.Builder builder,
                           @Value("${app.ai-service.url:http://ai-service}") String baseUrl) {
        this.restClient = builder.baseUrl(baseUrl).build();
    }

    public List<AiSearchResult> search(String query, int topK) {
        try {
            AiSearchResponse response = restClient.post()
                    .uri("/search")
                    .body(new AiSearchRequest(query, topK))
                    .retrieve()
                    .body(AiSearchResponse.class);

            return response == null || response.results() == null ? List.of() : response.results();
        } catch (RestClientException e) {
            log.error("Poziv AI servisa nije uspeo", e);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "Semanticka pretraga trenutno nije dostupna");
        }
    }
}
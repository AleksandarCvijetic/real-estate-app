package com.realestate.listing_service.client;

import java.util.List;

/** Odgovor AI servisa: rezultati su vec sortirani od najslicnijeg. */
public record AiSearchResponse(String query, List<AiSearchResult> results) {
}
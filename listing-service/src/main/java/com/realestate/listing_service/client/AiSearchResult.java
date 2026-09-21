package com.realestate.listing_service.client;

/** Jedan rezultat AI servisa: ID oglasa i slicnost sa upitom (veci broj = slicniji). */
public record AiSearchResult(Long listingId, Double score) {
}
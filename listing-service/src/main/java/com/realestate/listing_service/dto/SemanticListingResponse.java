package com.realestate.listing_service.dto;

/** Oglas iz semanticke pretrage, zajedno sa slicnoscu sa upitom. */
public record SemanticListingResponse(ListingResponse listing, Double score) {
}
package com.realestate.listing_service.client;

/** Telo zahteva ka AI servisu: POST /search */
public record AiSearchRequest(String query, Integer topK) {
}
package com.realestate.listing_service.event;

import com.realestate.listing_service.entity.Listing;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Event koji Listing servis salje na Kafka topic "listing-events".
 * Nosi kompletno stanje oglasa (event-carried state transfer), pa AI servis
 * ne mora da zove Listing servis nazad. Enum-i se salju kao String (.name()),
 * jer je to jednostavan ugovor koji Python strana razume bez Java klasa.
 */
public record ListingEvent(
        ListingEventType eventType,
        Long listingId,
        String title,
        String description,
        String location,
        String listingType,
        String propertyType,
        Double area,
        Double numberOfRooms,
        Integer floor,
        String furnishingStatus,
        String heatingType,
        Boolean parking,
        Boolean petFriendly,
        BigDecimal price,
        String status,
        Instant occurredAt
) {

    /** CREATED ili UPDATED - puni podaci o oglasu. */
    public static ListingEvent of(ListingEventType type, Listing l) {
        return new ListingEvent(
                type,
                l.getId(),
                l.getTitle(),
                l.getDescription(),
                l.getLocation(),
                name(l.getListingType()),
                name(l.getPropertyType()),
                l.getArea(),
                l.getNumberOfRooms(),
                l.getFloor(),
                name(l.getFurnishingStatus()),
                name(l.getHeatingType()),
                l.isParking(),
                l.isPetFriendly(),
                l.getPrice(),
                name(l.getStatus()),
                Instant.now()
        );
    }

    /** DELETED - dovoljan je samo ID oglasa. */
    public static ListingEvent deleted(Long listingId) {
        return new ListingEvent(
                ListingEventType.DELETED, listingId,
                null, null, null, null, null, null, null,
                null, null, null, null, null, null, null,
                Instant.now()
        );
    }

    private static String name(Enum<?> e) {
        return e == null ? null : e.name();
    }
}
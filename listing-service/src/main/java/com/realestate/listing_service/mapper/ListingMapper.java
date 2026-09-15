package com.realestate.listing_service.mapper;

import com.realestate.listing_service.dto.ListingResponse;
import com.realestate.listing_service.entity.Listing;

public class ListingMapper {

    public static ListingResponse toResponse(Listing listing) {
        return ListingResponse.builder()
                .id(listing.getId())
                .ownerId(listing.getOwnerId())
                .title(listing.getTitle())
                .description(listing.getDescription())
                .price(listing.getPrice())
                .area(listing.getArea())
                .location(listing.getLocation())
                .listingType(listing.getListingType())
                .numberOfRooms(listing.getNumberOfRooms())
                .propertyType(listing.getPropertyType())
                .floor(listing.getFloor())
                .furnishingStatus(listing.getFurnishingStatus())
                .heatingType(listing.getHeatingType())
                .parking(listing.isParking())
                .createdAt(listing.getCreatedAt())
                .status(listing.getStatus())
                .petFriendly(listing.isPetFriendly())
                .build();
    }
}
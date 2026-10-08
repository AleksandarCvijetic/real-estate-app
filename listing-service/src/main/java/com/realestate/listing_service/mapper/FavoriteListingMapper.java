package com.realestate.listing_service.mapper;

import com.realestate.listing_service.dto.FavoriteListingResponse;
import com.realestate.listing_service.entity.FavoriteListing;

public class FavoriteListingMapper {

    private FavoriteListingMapper() {}

    public static FavoriteListingResponse toResponse(FavoriteListing favorite) {
        return FavoriteListingResponse.builder()
                .id(favorite.getId())
                .listingId(favorite.getListing().getId())
                .createdAt(favorite.getCreatedAt())
                .build();
    }
}
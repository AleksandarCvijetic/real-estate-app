package com.realestate.listing_service.mapper;

import com.realestate.listing_service.dto.ListingImageResponse;
import com.realestate.listing_service.entity.ListingImage;

public class ListingImageMapper {

    public static ListingImageResponse toResponse(ListingImage image) {
        return ListingImageResponse.builder()
                .id(image.getId())
                .url("/listings/" + image.getListing().getId() + "/images/" + image.getId())
                .displayOrder(image.getDisplayOrder())
                .build();
    }
}

package com.realestate.listing_service.dto;

import com.realestate.listing_service.entity.enums.*;
import jakarta.validation.constraints.Positive;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListingUpdateRequest {

    private String title;
    private String description;

    @Positive
    private BigDecimal price;

    @Positive
    private Double area;

    private String location;
    private ListingType listingType;

    @Positive
    private Double numberOfRooms;

    private PropertyType propertyType;
    private Integer floor;
    private FurnishingStatus furnishingStatus;
    private HeatingType heatingType;
    private Boolean parking;
    private Boolean petFriendly;
    private ListingStatus status;
}
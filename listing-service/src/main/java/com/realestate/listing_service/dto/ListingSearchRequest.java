package com.realestate.listing_service.dto;

import com.realestate.listing_service.entity.enums.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListingSearchRequest {

    private String location;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
    private Double minArea;
    private Double maxArea;
    private ListingType listingType;
    private PropertyType propertyType;
    private Double minRooms;
    private Boolean parking;
    private Boolean petFriendly;
}
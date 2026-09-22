package com.realestate.listing_service.dto;

import com.realestate.listing_service.entity.enums.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListingResponse {

    private Long id;
    private Long ownerId;
    private String title;
    private String description;
    private BigDecimal price;
    private Double area;
    private String location;
    private String phoneNumber;
    private ListingType listingType;
    private Double numberOfRooms;
    private PropertyType propertyType;
    private Integer floor;
    private FurnishingStatus furnishingStatus;
    private HeatingType heatingType;
    private boolean parking;
    private LocalDateTime createdAt;
    private ListingStatus status;
    private boolean petFriendly;
}
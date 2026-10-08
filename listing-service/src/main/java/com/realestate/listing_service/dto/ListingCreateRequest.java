package com.realestate.listing_service.dto;

import com.realestate.listing_service.entity.enums.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListingCreateRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    @Positive
    private BigDecimal price;

    @NotNull
    @Positive
    private Double area;

    @NotBlank
    private String location;

    @NotBlank
    private String phoneNumber;

    @NotNull
    private ListingType listingType;

    @NotNull
    @Positive
    private Double numberOfRooms;

    @NotNull
    private PropertyType propertyType;

    private Integer floor; // opciono, kuce nemaju sprat

    @NotNull
    private FurnishingStatus furnishingStatus;

    @NotNull
    private HeatingType heatingType;

    private boolean parking;

    private boolean petFriendly;
}
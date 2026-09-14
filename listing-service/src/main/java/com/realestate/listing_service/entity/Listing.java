package com.realestate.listing_service.entity;

import com.realestate.listing_service.entity.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "listings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long ownerId;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Double area;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingType listingType;

    @Column(nullable = false)
    private Double numberOfRooms;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PropertyType propertyType;

    private Integer floor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FurnishingStatus furnishingStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private HeatingType heatingType;

    @Column(nullable = false)
    private boolean parking;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ListingStatus status;

    @Column(nullable = false)
    private boolean petFriendly;
}
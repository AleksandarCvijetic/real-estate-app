package com.realestate.listing_service.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FavoriteListingResponse {

    private Long id;
    private Long listingId;
    private LocalDateTime createdAt;
}
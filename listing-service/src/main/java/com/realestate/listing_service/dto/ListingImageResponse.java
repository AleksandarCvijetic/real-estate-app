package com.realestate.listing_service.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ListingImageResponse {

    private Long id;
    private String url;
    private Integer displayOrder;
}

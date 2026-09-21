package com.realestate.listing_service.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

/**
 * Zahtev za semanticku pretragu: upit prirodnim jezikom
 * i opcioni klasicni filteri (isti kao kod obicne pretrage).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SemanticSearchRequest {

    @NotBlank
    private String query;

    /** Opcioni filteri: cena, lokacija, tip... Moze biti null. */
    private ListingSearchRequest filters;

    /** Koliko rezultata vratiti (podrazumevano 20). */
    @Min(1)
    @Max(50)
    private Integer limit;
}
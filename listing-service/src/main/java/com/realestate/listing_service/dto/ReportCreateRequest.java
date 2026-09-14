package com.realestate.listing_service.dto;

import com.realestate.listing_service.entity.enums.ReportReason;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportCreateRequest {

    @NotNull
    private Long listingId;

    @NotNull
    private ReportReason reason;
}
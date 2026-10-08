package com.realestate.listing_service.dto;

import com.realestate.listing_service.entity.enums.ReportStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportStatusUpdateRequest {

    @NotNull
    private ReportStatus status;
}
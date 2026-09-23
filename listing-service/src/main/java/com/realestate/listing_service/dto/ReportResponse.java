package com.realestate.listing_service.dto;

import com.realestate.listing_service.entity.enums.ReportReason;
import com.realestate.listing_service.entity.enums.ReportStatus;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponse {

    private Long id;
    private Long listingId;
    private String listingTitle;
    private String listingLocation;
    private Long listingOwnerId;
    private Long reportingUserId;
    private ReportReason reason;
    private ReportStatus status;
    private LocalDateTime createdAt;
}
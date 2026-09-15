package com.realestate.listing_service.mapper;

import com.realestate.listing_service.dto.ReportResponse;
import com.realestate.listing_service.entity.Report;

public class ReportMapper {

    private ReportMapper() {}

    public static ReportResponse toResponse(Report report) {
        return ReportResponse.builder()
                .id(report.getId())
                .listingId(report.getListing().getId())
                .reportingUserId(report.getReportingUserId())
                .reason(report.getReason())
                .status(report.getStatus())
                .createdAt(report.getCreatedAt())
                .build();
    }
}
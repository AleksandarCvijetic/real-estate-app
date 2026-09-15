package com.realestate.listing_service.service;

import com.realestate.listing_service.dto.ReportCreateRequest;
import com.realestate.listing_service.dto.ReportResponse;
import com.realestate.listing_service.dto.ReportStatusUpdateRequest;
import com.realestate.listing_service.entity.Listing;
import com.realestate.listing_service.entity.Report;
import com.realestate.listing_service.entity.enums.ReportStatus;
import com.realestate.listing_service.mapper.ReportMapper;
import com.realestate.listing_service.repository.ListingRepository;
import com.realestate.listing_service.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final ListingRepository listingRepository;

    @Transactional
    public ReportResponse create(ReportCreateRequest request, Long reportingUserId) {
        Listing listing = listingRepository.findById(request.getListingId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "Listing not found with id: " + request.getListingId()));

        Report report = Report.builder()
                .listing(listing)
                .reportingUserId(reportingUserId)
                .reason(request.getReason())
                .status(ReportStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        return ReportMapper.toResponse(reportRepository.save(report));
    }

    public List<ReportResponse> getAll() {
        return reportRepository.findAll().stream()
                .map(ReportMapper::toResponse)
                .toList();
    }

    public List<ReportResponse> getByListing(Long listingId) {
        return reportRepository.findByListing_Id(listingId).stream()
                .map(ReportMapper::toResponse)
                .toList();
    }

    @Transactional
    public ReportResponse updateStatus(Long id, ReportStatusUpdateRequest request) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Report not found with id: " + id));

        report.setStatus(request.getStatus());
        return ReportMapper.toResponse(reportRepository.save(report));
    }
}
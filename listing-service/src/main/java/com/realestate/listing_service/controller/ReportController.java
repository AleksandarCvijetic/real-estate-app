package com.realestate.listing_service.controller;

import com.realestate.listing_service.dto.ReportCreateRequest;
import com.realestate.listing_service.dto.ReportResponse;
import com.realestate.listing_service.dto.ReportStatusUpdateRequest;
import com.realestate.listing_service.security.SecurityUtils;
import com.realestate.listing_service.service.ReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping
    public ResponseEntity<ReportResponse> create(@Valid @RequestBody ReportCreateRequest request) {
        ReportResponse response = reportService.create(request, SecurityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ReportResponse>> getAll() {
        return ResponseEntity.ok(reportService.getAll());
    }

    @GetMapping("/listing/{listingId}")
    public ResponseEntity<List<ReportResponse>> getByListing(@PathVariable Long listingId) {
        return ResponseEntity.ok(reportService.getByListing(listingId));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ReportResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReportStatusUpdateRequest request
    ) {
        return ResponseEntity.ok(reportService.updateStatus(id, request));
    }
}
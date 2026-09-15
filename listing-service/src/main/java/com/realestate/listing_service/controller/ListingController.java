package com.realestate.listing_service.controller;

import com.realestate.listing_service.dto.*;
import com.realestate.listing_service.security.SecurityUtils;
import com.realestate.listing_service.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService listingService;

    @PostMapping
    public ResponseEntity<ListingResponse> create(@Valid @RequestBody ListingCreateRequest request) {
        ListingResponse response = listingService.create(request, SecurityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(listingService.getById(id));
    }

    @PostMapping("/search")
    public ResponseEntity<Page<ListingResponse>> search(
            @RequestBody ListingSearchRequest request,
            @PageableDefault(size = 20) Pageable pageable
    ) {
        return ResponseEntity.ok(listingService.search(request, pageable));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ListingResponse>> getMyListings() {
        return ResponseEntity.ok(listingService.getByOwner(SecurityUtils.getCurrentUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingResponse> update(
            @PathVariable Long id,
            @Valid @RequestBody ListingUpdateRequest request
    ) {
        ListingResponse response = listingService.update(id, request, SecurityUtils.getCurrentUserId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        listingService.delete(id, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }
}
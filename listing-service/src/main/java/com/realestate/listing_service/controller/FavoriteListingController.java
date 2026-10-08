package com.realestate.listing_service.controller;

import com.realestate.listing_service.dto.FavoriteListingResponse;
import com.realestate.listing_service.security.SecurityUtils;
import com.realestate.listing_service.service.FavoriteListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings/favorite")
@RequiredArgsConstructor
public class FavoriteListingController {

    private final FavoriteListingService favoriteListingService;

    @PostMapping("/{listingId}")
    public ResponseEntity<FavoriteListingResponse> add(@PathVariable Long listingId) {
        FavoriteListingResponse response = favoriteListingService.add(listingId, SecurityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{listingId}")
    public ResponseEntity<Void> remove(@PathVariable Long listingId) {
        favoriteListingService.remove(listingId, SecurityUtils.getCurrentUserId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my")
    public ResponseEntity<List<FavoriteListingResponse>> getMyFavorites() {
        return ResponseEntity.ok(favoriteListingService.getMyFavorites(SecurityUtils.getCurrentUserId()));
    }
}
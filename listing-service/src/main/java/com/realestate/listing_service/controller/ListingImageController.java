package com.realestate.listing_service.controller;

import com.realestate.listing_service.dto.ListingImageResponse;
import com.realestate.listing_service.security.SecurityUtils;
import com.realestate.listing_service.service.ListingImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/listings/{listingId}/images")
@RequiredArgsConstructor
public class ListingImageController {

    private final ListingImageService listingImageService;

    @PostMapping
    public ResponseEntity<List<ListingImageResponse>> upload(
            @PathVariable Long listingId,
            @RequestParam("files") List<MultipartFile> files
    ) {
        List<ListingImageResponse> response =
                listingImageService.upload(listingId, files, SecurityUtils.getCurrentUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{imageId}")
    public ResponseEntity<Resource> getImage(@PathVariable Long listingId, @PathVariable Long imageId) {
        ListingImageService.ListingImageFile file = listingImageService.getFile(listingId, imageId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.contentType()))
                .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS).cachePublic())
                .body(file.resource());
    }
}

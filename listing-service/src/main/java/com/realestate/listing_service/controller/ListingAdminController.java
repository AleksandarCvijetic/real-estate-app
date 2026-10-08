package com.realestate.listing_service.controller;

import com.realestate.listing_service.service.ListingReindexService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/listings/admin")
@RequiredArgsConstructor
public class ListingAdminController {

    private final ListingReindexService reindexService;

    @PostMapping("/reindex")
    public ResponseEntity<Map<String, Integer>> reindex() {
        int count = reindexService.reindexAll();
        return ResponseEntity.accepted().body(Map.of("eventsSent", count));
    }
}
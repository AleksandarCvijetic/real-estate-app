package com.realestate.listing_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/listings")
public class HealthController {
    @GetMapping("/health")
    public String health() {
        return "Listing service is running";
    }
}
package com.realestate.listing_service.service;

import com.realestate.listing_service.entity.Listing;
import com.realestate.listing_service.event.ListingEvent;
import com.realestate.listing_service.event.ListingEventPublisher;
import com.realestate.listing_service.event.ListingEventType;
import com.realestate.listing_service.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Salje UPDATED event za svaki postojeci oglas.
 * Koristi se jednom (za oglase nastale pre AI servisa) ili kad god
 * treba ponovo izracunati sve embeddinge (npr. posle promene modela).
 */
@Service
@RequiredArgsConstructor
public class ListingReindexService {

    private final ListingRepository listingRepository;
    private final ListingEventPublisher eventPublisher;

    @Transactional(readOnly = true)
    public int reindexAll() {
        List<Listing> listings = listingRepository.findAll();
        listings.forEach(l -> eventPublisher.send(ListingEvent.of(ListingEventType.UPDATED, l)));
        return listings.size();
    }
}
package com.realestate.listing_service.service;

import com.realestate.listing_service.dto.*;
import com.realestate.listing_service.entity.Listing;
import com.realestate.listing_service.entity.enums.ListingStatus;
import com.realestate.listing_service.event.ListingEvent;
import com.realestate.listing_service.event.ListingEventType;
import com.realestate.listing_service.mapper.ListingMapper;
import com.realestate.listing_service.repository.FavoriteListingRepository;
import com.realestate.listing_service.repository.ListingRepository;
import com.realestate.listing_service.repository.ReportRepository;
import com.realestate.listing_service.repository.ListingSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final ListingImageService listingImageService;
    private final FavoriteListingRepository favoriteListingRepository;
    private final ReportRepository reportRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public ListingResponse create(ListingCreateRequest request, Long ownerId) {
        Listing listing = Listing.builder()
                .ownerId(ownerId)
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .area(request.getArea())
                .location(request.getLocation())
                .phoneNumber(request.getPhoneNumber())
                .listingType(request.getListingType())
                .numberOfRooms(request.getNumberOfRooms())
                .propertyType(request.getPropertyType())
                .floor(request.getFloor())
                .furnishingStatus(request.getFurnishingStatus())
                .heatingType(request.getHeatingType())
                .parking(request.isParking())
                .petFriendly(request.isPetFriendly())
                .status(ListingStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .build();

        Listing saved = listingRepository.save(listing);
        eventPublisher.publishEvent(ListingEvent.of(ListingEventType.CREATED, saved));

        return ListingMapper.toResponse(saved, List.of());
    }

    public ListingResponse getById(Long id) {
        Listing listing = findListingOrThrow(id);
        return ListingMapper.toResponse(listing, listingImageService.getImagesForListing(id));
    }

    public Page<ListingResponse> search(ListingSearchRequest request, Pageable pageable) {
        Page<Listing> page = listingRepository.findAll(ListingSpecification.withFilters(request), pageable);
        Map<Long, List<ListingImageResponse>> imagesByListing =
                listingImageService.getImagesForListings(page.getContent().stream().map(Listing::getId).toList());
        return page.map(listing -> ListingMapper.toResponse(
                listing, imagesByListing.getOrDefault(listing.getId(), List.of())));
    }

    public List<ListingResponse> getByOwner(Long ownerId) {
        List<Listing> listings = listingRepository.findByOwnerId(ownerId);
        Map<Long, List<ListingImageResponse>> imagesByListing =
                listingImageService.getImagesForListings(listings.stream().map(Listing::getId).toList());
        return listings.stream()
                .map(listing -> ListingMapper.toResponse(
                        listing, imagesByListing.getOrDefault(listing.getId(), List.of())))
                .toList();
    }

    @Transactional
    public ListingResponse update(Long id, ListingUpdateRequest request, Long currentUserId) {
        Listing listing = findListingOrThrow(id);
        checkOwnership(listing, currentUserId);

        if (request.getTitle() != null) listing.setTitle(request.getTitle());
        if (request.getDescription() != null) listing.setDescription(request.getDescription());
        if (request.getPrice() != null) listing.setPrice(request.getPrice());
        if (request.getArea() != null) listing.setArea(request.getArea());
        if (request.getLocation() != null) listing.setLocation(request.getLocation());
        if (request.getPhoneNumber() != null) listing.setPhoneNumber(request.getPhoneNumber());
        if (request.getListingType() != null) listing.setListingType(request.getListingType());
        if (request.getNumberOfRooms() != null) listing.setNumberOfRooms(request.getNumberOfRooms());
        if (request.getPropertyType() != null) listing.setPropertyType(request.getPropertyType());
        if (request.getFloor() != null) listing.setFloor(request.getFloor());
        if (request.getFurnishingStatus() != null) listing.setFurnishingStatus(request.getFurnishingStatus());
        if (request.getHeatingType() != null) listing.setHeatingType(request.getHeatingType());
        if (request.getParking() != null) listing.setParking(request.getParking());
        if (request.getPetFriendly() != null) listing.setPetFriendly(request.getPetFriendly());
        if (request.getStatus() != null) listing.setStatus(request.getStatus());

        Listing saved = listingRepository.save(listing);
        eventPublisher.publishEvent(ListingEvent.of(ListingEventType.UPDATED, saved));

        return ListingMapper.toResponse(saved, listingImageService.getImagesForListing(saved.getId()));
    }

    @Transactional
    public void delete(Long id, Long currentUserId) {
        Listing listing = findListingOrThrow(id);
        checkOwnership(listing, currentUserId);
        deleteListing(listing);
    }

    // Omiljeni i prijave imaju strani kljuc na oglas, pa se brisu pre njega.
    @Transactional
    public void deleteListing(Listing listing) {
        Long listingId = listing.getId();
        favoriteListingRepository.deleteByListing_Id(listingId);
        reportRepository.deleteByListing_Id(listingId);
        listingImageService.deleteAllForListing(listingId);
        listingRepository.delete(listing);
        eventPublisher.publishEvent(ListingEvent.deleted(listingId));
    }

    private Listing findListingOrThrow(Long id) {
        return listingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with id: " + id));
    }

    private void checkOwnership(Listing listing, Long currentUserId) {
        if (!listing.getOwnerId().equals(currentUserId)) {
            throw new AccessDeniedException("You are not the owner of this listing");
        }
    }
}
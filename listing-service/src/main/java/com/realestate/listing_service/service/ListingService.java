package com.realestate.listing_service.service;

import com.realestate.listing_service.dto.*;
import com.realestate.listing_service.entity.Listing;
import com.realestate.listing_service.entity.enums.ListingStatus;
import com.realestate.listing_service.mapper.ListingMapper;
import com.realestate.listing_service.repository.ListingRepository;
import com.realestate.listing_service.repository.ListingSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;

    @Transactional
    public ListingResponse create(ListingCreateRequest request, Long ownerId) {
        Listing listing = Listing.builder()
                .ownerId(ownerId)
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .area(request.getArea())
                .location(request.getLocation())
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

        return ListingMapper.toResponse(listingRepository.save(listing));
    }

    public ListingResponse getById(Long id) {
        return ListingMapper.toResponse(findListingOrThrow(id));
    }

    public Page<ListingResponse> search(ListingSearchRequest request, Pageable pageable) {
        return listingRepository
                .findAll(ListingSpecification.withFilters(request), pageable)
                .map(ListingMapper::toResponse);
    }

    public List<ListingResponse> getByOwner(Long ownerId) {
        return listingRepository.findByOwnerId(ownerId).stream()
                .map(ListingMapper::toResponse)
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
        if (request.getListingType() != null) listing.setListingType(request.getListingType());
        if (request.getNumberOfRooms() != null) listing.setNumberOfRooms(request.getNumberOfRooms());
        if (request.getPropertyType() != null) listing.setPropertyType(request.getPropertyType());
        if (request.getFloor() != null) listing.setFloor(request.getFloor());
        if (request.getFurnishingStatus() != null) listing.setFurnishingStatus(request.getFurnishingStatus());
        if (request.getHeatingType() != null) listing.setHeatingType(request.getHeatingType());
        if (request.getParking() != null) listing.setParking(request.getParking());
        if (request.getPetFriendly() != null) listing.setPetFriendly(request.getPetFriendly());
        if (request.getStatus() != null) listing.setStatus(request.getStatus());

        return ListingMapper.toResponse(listingRepository.save(listing));
    }

    @Transactional
    public void delete(Long id, Long currentUserId) {
        Listing listing = findListingOrThrow(id);
        checkOwnership(listing, currentUserId);
        listingRepository.delete(listing);
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
package com.realestate.listing_service.service;

import com.realestate.listing_service.dto.FavoriteListingResponse;
import com.realestate.listing_service.entity.FavoriteListing;
import com.realestate.listing_service.entity.Listing;
import com.realestate.listing_service.mapper.FavoriteListingMapper;
import com.realestate.listing_service.repository.FavoriteListingRepository;
import com.realestate.listing_service.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteListingService {

    private final FavoriteListingRepository favoriteListingRepository;
    private final ListingRepository listingRepository;

    @Transactional
    public FavoriteListingResponse add(Long listingId, Long userId) {
        if (favoriteListingRepository.existsByUserIdAndListing_Id(userId, listingId)) {
            throw new IllegalStateException("Listing is already in favorites");
        }

        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with id: " + listingId));

        FavoriteListing favorite = FavoriteListing.builder()
                .listing(listing)
                .userId(userId)
                .createdAt(LocalDateTime.now())
                .build();

        return FavoriteListingMapper.toResponse(favoriteListingRepository.save(favorite));
    }

    @Transactional
    public void remove(Long listingId, Long userId) {
        FavoriteListing favorite = favoriteListingRepository.findByUserIdAndListing_Id(userId, listingId)
                .orElseThrow(() -> new IllegalArgumentException("Favorite not found for this listing"));

        favoriteListingRepository.delete(favorite);
    }

    public List<FavoriteListingResponse> getMyFavorites(Long userId) {
        return favoriteListingRepository.findByUserId(userId).stream()
                .map(FavoriteListingMapper::toResponse)
                .toList();
    }
}
package com.realestate.listing_service.repository;

import com.realestate.listing_service.entity.FavoriteListing;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteListingRepository extends JpaRepository<FavoriteListing, Long> {

    List<FavoriteListing> findByUserId(Long userId);

    Optional<FavoriteListing> findByUserIdAndListing_Id(Long userId, Long listingId);

    void deleteByListingIdAndUserId(Long listingId, Long userId);
    
    boolean existsByUserIdAndListing_Id(Long userId, Long listingId);

}
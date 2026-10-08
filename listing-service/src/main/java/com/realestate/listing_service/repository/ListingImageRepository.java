package com.realestate.listing_service.repository;

import com.realestate.listing_service.entity.ListingImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ListingImageRepository extends JpaRepository<ListingImage, Long> {

    List<ListingImage> findByListing_IdOrderByDisplayOrderAsc(Long listingId);

    List<ListingImage> findByListing_IdInOrderByDisplayOrderAsc(List<Long> listingIds);

    Optional<ListingImage> findByIdAndListing_Id(Long id, Long listingId);

    int countByListing_Id(Long listingId);

    void deleteByListing_Id(Long listingId);
}

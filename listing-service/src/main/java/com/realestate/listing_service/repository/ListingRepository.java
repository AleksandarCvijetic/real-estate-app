package com.realestate.listing_service.repository;

import com.realestate.listing_service.entity.Listing;
import com.realestate.listing_service.entity.enums.ListingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ListingRepository extends JpaRepository<Listing, Long>, JpaSpecificationExecutor<Listing> {

    List<Listing> findByOwnerId(Long ownerId);

    List<Listing> findByStatus(ListingStatus status);
}
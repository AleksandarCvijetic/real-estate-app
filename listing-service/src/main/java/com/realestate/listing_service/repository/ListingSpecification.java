package com.realestate.listing_service.repository;

import com.realestate.listing_service.dto.ListingSearchRequest;
import com.realestate.listing_service.entity.Listing;
import com.realestate.listing_service.entity.enums.ListingStatus;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ListingSpecification {

    public static Specification<Listing> withFilters(ListingSearchRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // samo aktivni oglasi se prikazuju
            predicates.add(cb.equal(root.get("status"), ListingStatus.ACTIVE));

            if (request.getLocation() != null && !request.getLocation().isBlank()) {
                predicates.add(cb.like(
                        cb.lower(root.get("location")),
                        "%" + request.getLocation().toLowerCase() + "%"
                ));
            }
            if (request.getMinPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), request.getMinPrice()));
            }
            if (request.getMaxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), request.getMaxPrice()));
            }
            if (request.getMinArea() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("area"), request.getMinArea()));
            }
            if (request.getMaxArea() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("area"), request.getMaxArea()));
            }
            if (request.getListingType() != null) {
                predicates.add(cb.equal(root.get("listingType"), request.getListingType()));
            }
            if (request.getPropertyType() != null) {
                predicates.add(cb.equal(root.get("propertyType"), request.getPropertyType()));
            }
            if (request.getMinRooms() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("numberOfRooms"), request.getMinRooms()));
            }
            if (request.getParking() != null) {
                predicates.add(cb.equal(root.get("parking"), request.getParking()));
            }
            if (request.getPetFriendly() != null) {
                predicates.add(cb.equal(root.get("petFriendly"), request.getPetFriendly()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
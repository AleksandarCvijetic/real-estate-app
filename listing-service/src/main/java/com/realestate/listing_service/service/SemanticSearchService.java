package com.realestate.listing_service.service;

import com.realestate.listing_service.client.AiSearchResult;
import com.realestate.listing_service.client.AiServiceClient;
import com.realestate.listing_service.dto.ListingImageResponse;
import com.realestate.listing_service.dto.ListingSearchRequest;
import com.realestate.listing_service.dto.SemanticListingResponse;
import com.realestate.listing_service.dto.SemanticSearchRequest;
import com.realestate.listing_service.entity.Listing;
import com.realestate.listing_service.entity.enums.ListingStatus;
import com.realestate.listing_service.mapper.ListingMapper;
import com.realestate.listing_service.repository.ListingRepository;
import com.realestate.listing_service.repository.ListingSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Semanticka pretraga = AI servis (rangiranje po znacenju) + klasicni filteri.
 *
 * 1. AI servis vraca do AI_TOP_K ID-jeva oglasa, sortiranih po slicnosti sa upitom.
 * 2. Na te oglase primenjuju se postojeci filteri i status ACTIVE.
 * 3. Rezultat se vraca u redosledu iz AI servisa.
 *
 * AI servis vraca siri skup (50) od onoga sto se prikazuje (20), jer filteri
 * mogu da odseku deo rezultata.
 */
@Service
@RequiredArgsConstructor
public class SemanticSearchService {

    private static final int AI_TOP_K = 50;
    private static final int DEFAULT_LIMIT = 20;

    private final AiServiceClient aiServiceClient;
    private final ListingRepository listingRepository;
    private final ListingImageService listingImageService;

    @Transactional(readOnly = true)
    public List<SemanticListingResponse> search(SemanticSearchRequest request) {
        List<AiSearchResult> aiResults = aiServiceClient.search(request.getQuery(), AI_TOP_K);
        if (aiResults.isEmpty()) {
            return List.of();
        }

        // listingId -> score, uz ocuvan redosled iz AI servisa
        Map<Long, Double> scores = new LinkedHashMap<>();
        aiResults.forEach(r -> scores.put(r.listingId(), r.score()));

        ListingSearchRequest filters = request.getFilters() != null
                ? request.getFilters()
                : new ListingSearchRequest();

        Specification<Listing> spec = ListingSpecification.withFilters(filters)
                .and((root, query, cb) -> root.get("id").in(scores.keySet()))
                .and((root, query, cb) -> cb.equal(root.get("status"), ListingStatus.ACTIVE));

        Map<Long, Listing> listingsById = listingRepository.findAll(spec).stream()
                .collect(Collectors.toMap(Listing::getId, Function.identity()));

        Map<Long, List<ListingImageResponse>> imagesByListing =
                listingImageService.getImagesForListings(listingsById.keySet().stream().toList());

        int limit = request.getLimit() != null ? request.getLimit() : DEFAULT_LIMIT;

        return scores.entrySet().stream()
                .filter(e -> listingsById.containsKey(e.getKey()))
                .limit(limit)
                .map(e -> new SemanticListingResponse(
                        ListingMapper.toResponse(
                                listingsById.get(e.getKey()),
                                imagesByListing.getOrDefault(e.getKey(), List.of())),
                        e.getValue()))
                .toList();
    }
}
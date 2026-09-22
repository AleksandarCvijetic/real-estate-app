package com.realestate.listing_service.service;

import com.realestate.listing_service.dto.ListingImageResponse;
import com.realestate.listing_service.entity.Listing;
import com.realestate.listing_service.entity.ListingImage;
import com.realestate.listing_service.mapper.ListingImageMapper;
import com.realestate.listing_service.repository.ListingImageRepository;
import com.realestate.listing_service.repository.ListingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ListingImageService {

    private static final int MAX_IMAGES_PER_LISTING = 5;
    private static final Map<String, String> ALLOWED_CONTENT_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    private final ListingImageRepository listingImageRepository;
    private final ListingRepository listingRepository;
    private final ListingImageStorageService storageService;

    @Transactional
    public List<ListingImageResponse> upload(Long listingId, List<MultipartFile> files, Long currentUserId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with id: " + listingId));

        if (!listing.getOwnerId().equals(currentUserId)) {
            throw new AccessDeniedException("You are not the owner of this listing");
        }

        if (files == null || files.isEmpty()) {
            throw new IllegalArgumentException("No files provided");
        }

        int existingCount = listingImageRepository.countByListing_Id(listingId);
        if (existingCount + files.size() > MAX_IMAGES_PER_LISTING) {
            throw new IllegalArgumentException("A listing can have at most " + MAX_IMAGES_PER_LISTING + " images");
        }

        List<ListingImage> saved = new ArrayList<>();
        int nextOrder = existingCount;

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                throw new IllegalArgumentException("Uploaded file is empty");
            }

            String extension = ALLOWED_CONTENT_TYPES.get(file.getContentType());
            if (extension == null) {
                throw new IllegalArgumentException("Unsupported image type: " + file.getContentType());
            }

            String storedFilename = storageService.store(file, extension);

            ListingImage image = ListingImage.builder()
                    .listing(listing)
                    .storedFilename(storedFilename)
                    .contentType(file.getContentType())
                    .displayOrder(nextOrder++)
                    .createdAt(LocalDateTime.now())
                    .build();

            saved.add(listingImageRepository.save(image));
        }

        return saved.stream().map(ListingImageMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ListingImageResponse> getImagesForListing(Long listingId) {
        return listingImageRepository.findByListing_IdOrderByDisplayOrderAsc(listingId).stream()
                .map(ListingImageMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Map<Long, List<ListingImageResponse>> getImagesForListings(List<Long> listingIds) {
        if (listingIds.isEmpty()) {
            return Map.of();
        }

        Map<Long, List<ListingImageResponse>> imagesByListing = new LinkedHashMap<>();
        for (ListingImage image : listingImageRepository.findByListing_IdInOrderByDisplayOrderAsc(listingIds)) {
            imagesByListing
                    .computeIfAbsent(image.getListing().getId(), id -> new ArrayList<>())
                    .add(ListingImageMapper.toResponse(image));
        }
        return imagesByListing;
    }

    @Transactional(readOnly = true)
    public ListingImageFile getFile(Long listingId, Long imageId) {
        ListingImage image = listingImageRepository.findByIdAndListing_Id(imageId, listingId)
                .orElseThrow(() -> new IllegalArgumentException("Image not found"));
        Resource resource = storageService.load(image.getStoredFilename());
        return new ListingImageFile(resource, image.getContentType());
    }

    @Transactional
    public void deleteAllForListing(Long listingId) {
        List<ListingImage> images = listingImageRepository.findByListing_IdOrderByDisplayOrderAsc(listingId);
        images.forEach(image -> storageService.delete(image.getStoredFilename()));
        listingImageRepository.deleteByListing_Id(listingId);
    }

    public record ListingImageFile(Resource resource, String contentType) {
    }
}

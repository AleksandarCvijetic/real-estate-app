package com.realestate.listing_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ListingImageStorageService {

    private final Path rootDir;

    public ListingImageStorageService(@Value("${app.upload.dir:uploads/listings}") String uploadDir) {
        this.rootDir = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(rootDir);
        } catch (IOException e) {
            throw new UncheckedIOException("Could not initialize upload directory: " + rootDir, e);
        }
    }

    public String store(MultipartFile file, String extension) {
        String storedFilename = UUID.randomUUID() + extension;
        Path target = rootDir.resolve(storedFilename);
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to store image", e);
        }
        return storedFilename;
    }

    public Resource load(String storedFilename) {
        Path file = rootDir.resolve(storedFilename);
        try {
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new IllegalArgumentException("Image file not found: " + storedFilename);
            }
            return resource;
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException("Invalid image reference: " + storedFilename, e);
        }
    }

    public void delete(String storedFilename) {
        try {
            Files.deleteIfExists(rootDir.resolve(storedFilename));
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to delete image", e);
        }
    }
}

package com.realestate.listing_service.repository;

import com.realestate.listing_service.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByListingId(Long listingId);

    List<Report> findByReportingUserId(Long reportingUserId);
}
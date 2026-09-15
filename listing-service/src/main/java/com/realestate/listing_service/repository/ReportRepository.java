package com.realestate.listing_service.repository;

import com.realestate.listing_service.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import com.realestate.listing_service.entity.enums.ReportStatus;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByListing_Id(Long listingId);

    List<Report> findByReportingUserId(Long reportingUserId);

    List<Report> findByStatus(ReportStatus status);
}
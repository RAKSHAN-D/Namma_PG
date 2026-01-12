package com.nammapg.backend.controller;

import com.nammapg.backend.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/owner")
@PreAuthorize("hasRole('PG_OWNER')")
public class OwnerController {

    @Autowired
    private OwnerService ownerService;

    // Dashboard Summary
    @GetMapping("/dashboard/summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary(
            @RequestParam(defaultValue = "30d") String period) {
        return ResponseEntity.ok(ownerService.getDashboardSummary(period));
    }

    // Get all PGs for owner
    @GetMapping("/pgs")
    public ResponseEntity<?> getAllPGs() {
        return ResponseEntity.ok(ownerService.getOwnerPGs());
    }

    // Get performance graphs data
    @GetMapping("/dashboard/graphs")
    public ResponseEntity<Map<String, Object>> getPerformanceGraphs(
            @RequestParam(defaultValue = "30d") String period) {
        return ResponseEntity.ok(ownerService.getPerformanceGraphs(period));
    }

    // Get single PG details
    @GetMapping("/pgs/{id}")
    public ResponseEntity<?> getPGById(@PathVariable Long id) {
        return ResponseEntity.ok(ownerService.getPGById(id));
    }

    // Get PG residents
    @GetMapping("/pgs/{pgId}/residents")
    public ResponseEntity<?> getPGResidents(@PathVariable Long pgId) {
        return ResponseEntity.ok(ownerService.getPGResidents(pgId));
    }

    // Get PG issues
    @GetMapping("/pgs/{pgId}/issues")
    public ResponseEntity<?> getPGIssues(
            @PathVariable Long pgId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority) {
        return ResponseEntity.ok(ownerService.getPGIssues(pgId, status, priority));
    }

    // Update issue status
    @PutMapping("/issues/{issueId}/status")
    public ResponseEntity<?> updateIssueStatus(
            @PathVariable Long issueId,
            @RequestBody Map<String, String> request) {
        String status = request.get("status");
        String comment = request.get("comment");
        return ResponseEntity.ok(ownerService.updateIssueStatus(issueId, status, comment));
    }

    // Get PG reviews
    @GetMapping("/pgs/{pgId}/reviews")
    public ResponseEntity<?> getPGReviews(
            @PathVariable Long pgId,
            @RequestParam(defaultValue = "recent") String sort,
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(ownerService.getPGReviews(pgId, sort, limit));
    }

    // Reply to review
    @PostMapping("/reviews/{reviewId}/reply")
    public ResponseEntity<?> replyToReview(
            @PathVariable Long reviewId,
            @RequestBody Map<String, String> request) {
        String replyText = request.get("replyText");
        return ResponseEntity.ok(ownerService.replyToReview(reviewId, replyText));
    }

    // Analytics - PG Comparison
    @GetMapping("/analytics/comparison")
    public ResponseEntity<?> getPGComparison(
            @RequestParam(defaultValue = "30d") String period) {
        return ResponseEntity.ok(ownerService.getPGComparison(period));
    }

    // Analytics - Insights
    @GetMapping("/analytics/insights")
    public ResponseEntity<Map<String, Object>> getInsights() {
        return ResponseEntity.ok(ownerService.getInsights());
    }

    // Owner Profile
    @GetMapping("/profile")
    public ResponseEntity<?> getOwnerProfile() {
        return ResponseEntity.ok(ownerService.getOwnerProfile());
    }

    // Update Owner Profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateOwnerProfile(@RequestBody Map<String, Object> profileData) {
        return ResponseEntity.ok(ownerService.updateOwnerProfile(profileData));
    }
}

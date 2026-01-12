package com.nammapg.backend.service;

import java.util.List;
import java.util.Map;

public interface OwnerService {

    // Dashboard
    Map<String, Object> getDashboardSummary(String period);

    List<Map<String, Object>> getOwnerPGs();

    Map<String, Object> getPerformanceGraphs(String period);

    // PG Details
    Map<String, Object> getPGById(Long pgId);

    List<Map<String, Object>> getPGResidents(Long pgId);

    List<Map<String, Object>> getPGIssues(Long pgId, String status, String priority);

    Map<String, Object> updateIssueStatus(Long issueId, String status, String comment);

    List<Map<String, Object>> getPGReviews(Long pgId, String sort, int limit);

    Map<String, Object> replyToReview(Long reviewId, String replyText);

    // Analytics
    List<Map<String, Object>> getPGComparison(String period);

    Map<String, Object> getInsights();

    // Profile
    Map<String, Object> getOwnerProfile();

    Map<String, Object> updateOwnerProfile(Map<String, Object> profileData);
}

package com.nammapg.backend.service.impl;

import com.nammapg.backend.entity.Issue;
import com.nammapg.backend.entity.Pg;
import com.nammapg.backend.entity.User;
import com.nammapg.backend.repository.IssueRepository;
import com.nammapg.backend.repository.PgRepository;
import com.nammapg.backend.repository.UserRepository;
import com.nammapg.backend.service.OwnerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class OwnerServiceImpl implements OwnerService {

    @Autowired
    private PgRepository pgRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private UserRepository userRepository;

    // Helper method to get current owner
    private User getCurrentOwner() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email;
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }
        return userRepository.findByEmail(email).orElse(null);
    }

    // Helper method to calculate date based on period
    private LocalDateTime getStartDate(String period) {
        LocalDateTime now = LocalDateTime.now();
        switch (period) {
            case "7d":
                return now.minusDays(7);
            case "30d":
                return now.minusDays(30);
            case "6m":
                return now.minusMonths(6);
            case "12m":
                return now.minusMonths(12);
            case "all":
            default:
                return LocalDateTime.of(2000, 1, 1, 0, 0);
        }
    }

    // Helper method to get period label
    private String getPeriodLabel(String period) {
        switch (period) {
            case "7d":
                return "Last 7 Days";
            case "30d":
                return "Last 30 Days";
            case "6m":
                return "Last 6 Months";
            case "12m":
                return "Last 12 Months";
            case "all":
                return "All Time";
            default:
                return "Last 30 Days";
        }
    }

    @Override
    public Map<String, Object> getDashboardSummary(String period) {
        User owner = getCurrentOwner();

        Map<String, Object> summary = new HashMap<>();

        // Get PGs owned by this user
        List<Pg> pgs = pgRepository.findByOwnerId(owner.getId());

        int totalPGs = pgs.size();
        int totalRooms = 0;
        double totalRating = 0;
        int ratingCount = 0;

        for (Pg pg : pgs) {
            totalRooms += pg.getTotalRooms();
            if (pg.getRating() > 0) {
                totalRating += pg.getRating();
                ratingCount++;
            }
        }

        // Estimate residents as 2 beds per room (mock)
        int estimatedResidents = totalRooms * 2;
        int occupancyRate = 82; // Mock percentage
        double averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;

        // Count active issues
        long activeIssues = 0;
        for (Pg pg : pgs) {
            List<Issue> issues = issueRepository.findByPgId(pg.getId());
            activeIssues += issues.stream().filter(i -> "OPEN".equals(i.getStatus()) || "Open".equals(i.getStatus()))
                    .count();
        }

        summary.put("totalPGs", totalPGs);
        summary.put("totalResidents", estimatedResidents);
        summary.put("overallOccupancy", occupancyRate);
        summary.put("activeIssues", activeIssues);
        summary.put("averageRating", Math.round(averageRating * 10.0) / 10.0);
        summary.put("newResidents30d", 0);
        summary.put("period", getPeriodLabel(period));

        Map<String, String> changes = new HashMap<>();
        changes.put("pgs", "+0");
        changes.put("residents", "+0");
        changes.put("occupancy", "+0%");
        changes.put("issues", activeIssues > 0 ? activeIssues + " open" : "0 issues");
        changes.put("rating", "+0.0");
        summary.put("changes", changes);

        return summary;
    }

    @Override
    public List<Map<String, Object>> getOwnerPGs() {
        User owner = getCurrentOwner();
        List<Pg> pgs = pgRepository.findByOwnerId(owner.getId());

        List<Map<String, Object>> result = new ArrayList<>();

        for (Pg pg : pgs) {
            Map<String, Object> pgData = new HashMap<>();
            pgData.put("id", pg.getId());
            pgData.put("name", pg.getName());
            pgData.put("area", pg.getArea());
            pgData.put("city", pg.getCity());
            pgData.put("totalBeds", pg.getTotalRooms() * 2);
            pgData.put("occupiedBeds", (int) (pg.getTotalRooms() * 1.6));
            pgData.put("occupancyRate", 80);
            pgData.put("rating", pg.getRating());
            pgData.put("pgType", pg.getGender());
            pgData.put("status", pg.isActive() ? "Active" : "Inactive");

            List<Issue> issues = issueRepository.findByPgId(pg.getId());
            long issuesCount = issues.stream().filter(i -> "OPEN".equals(i.getStatus()) || "Open".equals(i.getStatus()))
                    .count();
            pgData.put("issuesCount", issuesCount);
            pgData.put("urgentIssuesCount", 0);
            pgData.put("newResidents30d", 0);

            result.add(pgData);
        }

        return result;
    }

    @Override
    public Map<String, Object> getPerformanceGraphs(String period) {
        Map<String, Object> graphs = new HashMap<>();

        List<Map<String, Object>> residentGrowth = new ArrayList<>();
        List<Map<String, Object>> occupancyTrend = new ArrayList<>();
        List<Map<String, Object>> issuesTrend = new ArrayList<>();
        List<Map<String, Object>> ratingsTrend = new ArrayList<>();

        int dataPoints = getDataPointsForPeriod(period);
        String[] labels = getLabelsForPeriod(period);

        Random random = new Random(42);
        int baseResidents = 100;
        int baseOccupancy = 70;

        for (int i = 0; i < dataPoints && i < labels.length; i++) {
            Map<String, Object> rg = new HashMap<>();
            rg.put("month", labels[i]);
            rg.put("residents", baseResidents + (i * 5) + random.nextInt(10));
            residentGrowth.add(rg);

            Map<String, Object> ot = new HashMap<>();
            ot.put("week", labels[i]);
            ot.put("occupancy", Math.min(95, baseOccupancy + (i * 2) + random.nextInt(5)));
            occupancyTrend.add(ot);

            Map<String, Object> it = new HashMap<>();
            it.put("month", labels[i]);
            it.put("raised", 5 + random.nextInt(10));
            it.put("resolved", 4 + random.nextInt(8));
            issuesTrend.add(it);

            Map<String, Object> rt = new HashMap<>();
            rt.put("month", labels[i]);
            rt.put("rating", 3.8 + (random.nextDouble() * 0.8));
            ratingsTrend.add(rt);
        }

        graphs.put("residentGrowth", residentGrowth);
        graphs.put("occupancyTrend", occupancyTrend);
        graphs.put("issuesTrend", issuesTrend);
        graphs.put("ratingsTrend", ratingsTrend);
        graphs.put("period", getPeriodLabel(period));

        return graphs;
    }

    private int getDataPointsForPeriod(String period) {
        switch (period) {
            case "7d":
                return 7;
            case "30d":
                return 6;
            case "6m":
                return 6;
            case "12m":
                return 12;
            case "all":
                return 12;
            default:
                return 6;
        }
    }

    private String[] getLabelsForPeriod(String period) {
        switch (period) {
            case "7d":
                return new String[] { "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" };
            case "30d":
                return new String[] { "Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6" };
            case "6m":
                return new String[] { "Aug", "Sep", "Oct", "Nov", "Dec", "Jan" };
            case "12m":
                return new String[] { "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
                        "Jan" };
            case "all":
                return new String[] { "2023 Q1", "2023 Q2", "2023 Q3", "2023 Q4", "2024 Q1", "2024 Q2", "2024 Q3",
                        "2024 Q4", "2025 Q1", "2025 Q2", "2025 Q3", "2025 Q4" };
            default:
                return new String[] { "Aug", "Sep", "Oct", "Nov", "Dec", "Jan" };
        }
    }

    @Override
    public Map<String, Object> getPGById(Long pgId) {
        Pg pg = pgRepository.findById(pgId).orElse(null);
        if (pg == null) {
            return Map.of("error", "PG not found");
        }

        Map<String, Object> pgData = new HashMap<>();
        pgData.put("id", pg.getId());
        pgData.put("name", pg.getName());
        pgData.put("area", pg.getArea());
        pgData.put("city", pg.getCity());
        pgData.put("fullAddress", pg.getArea() + ", " + pg.getCity());
        pgData.put("pgType", pg.getGender());
        pgData.put("status", pg.isActive() ? "Active" : "Inactive");
        pgData.put("totalBeds", pg.getTotalRooms() * 2);
        pgData.put("occupiedBeds", (int) (pg.getTotalRooms() * 1.6));
        pgData.put("rating", pg.getRating());
        pgData.put("reviewCount", 0);
        pgData.put("updatedAt", "2 days ago");
        pgData.put("singleRooms", 5);
        pgData.put("doubleRooms", 8);
        pgData.put("tripleRooms", 2);
        pgData.put("facilities", Arrays.asList("Food", "Wi-Fi", "Laundry", "Parking", "AC"));
        pgData.put("revenue", 84000);
        pgData.put("newResidents30d", 5);

        return pgData;
    }

    @Override
    public List<Map<String, Object>> getPGResidents(Long pgId) {
        List<Map<String, Object>> residents = new ArrayList<>();

        Map<String, Object> r1 = new HashMap<>();
        r1.put("id", 1);
        r1.put("fullName", "Amit Kumar");
        r1.put("email", "amit@example.com");
        r1.put("phone", "9876543210");
        r1.put("roomNumber", 5);
        r1.put("bedNumber", 1);
        r1.put("joinDate", "2024-01-01");
        r1.put("status", "Active");
        r1.put("daysStayed", 15);
        residents.add(r1);

        Map<String, Object> r2 = new HashMap<>();
        r2.put("id", 2);
        r2.put("fullName", "Ravi Shah");
        r2.put("email", "ravi@example.com");
        r2.put("phone", "9123456789");
        r2.put("roomNumber", 5);
        r2.put("bedNumber", 2);
        r2.put("joinDate", "2023-12-15");
        r2.put("status", "Active");
        r2.put("daysStayed", 31);
        residents.add(r2);

        return residents;
    }

    @Override
    public List<Map<String, Object>> getPGIssues(Long pgId, String status, String priority) {
        List<Issue> issues = issueRepository.findByPgId(pgId);

        if (status != null && !status.isEmpty()) {
            issues = issues.stream()
                    .filter(i -> status.equalsIgnoreCase(i.getStatus()))
                    .toList();
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Issue issue : issues) {
            Map<String, Object> issueData = new HashMap<>();
            issueData.put("id", issue.getId());
            issueData.put("title", issue.getTitle());
            issueData.put("description", issue.getDescription());
            issueData.put("category", issue.getIssueType());
            issueData.put("priority", issue.getPriority());
            issueData.put("status", issue.getStatus());
            issueData.put("reportedBy", issue.getUser() != null ? issue.getUser().getFullName() : "Anonymous");
            issueData.put("reportedAt",
                    issue.getReportedAt() != null
                            ? issue.getReportedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"))
                            : "");
            issueData.put("ownerComment", null);
            result.add(issueData);
        }

        return result;
    }

    @Override
    public Map<String, Object> updateIssueStatus(Long issueId, String status, String comment) {
        Issue issue = issueRepository.findById(issueId).orElse(null);
        if (issue == null) {
            return Map.of("error", "Issue not found");
        }

        issue.setStatus(status);
        if ("Resolved".equals(status) || "RESOLVED".equals(status)) {
            issue.setResolvedAt(LocalDateTime.now());
        }
        issueRepository.save(issue);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Issue status updated to " + status);
        result.put("issueId", issueId);

        return result;
    }

    @Override
    public List<Map<String, Object>> getPGReviews(Long pgId, String sort, int limit) {
        List<Map<String, Object>> reviews = new ArrayList<>();

        Map<String, Object> review1 = new HashMap<>();
        review1.put("id", 1);
        review1.put("overallRating", 5);
        review1.put("reviewText", "Excellent PG with all facilities. Food is great!");
        review1.put("reviewerName", "Amit K.");
        review1.put("createdAt", "2024-01-10");
        review1.put("ownerReply", null);
        reviews.add(review1);

        Map<String, Object> review2 = new HashMap<>();
        review2.put("id", 2);
        review2.put("overallRating", 4);
        review2.put("reviewText", "Good place but Wi-Fi could be faster");
        review2.put("reviewerName", "Ravi S.");
        review2.put("createdAt", "2024-01-08");
        review2.put("ownerReply", "We're upgrading the Wi-Fi this week!");
        reviews.add(review2);

        return reviews;
    }

    @Override
    public Map<String, Object> replyToReview(Long reviewId, String replyText) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Reply added successfully");
        result.put("reviewId", reviewId);
        result.put("replyText", replyText);
        return result;
    }

    @Override
    public List<Map<String, Object>> getPGComparison(String period) {
        User owner = getCurrentOwner();
        List<Pg> pgs = pgRepository.findByOwnerId(owner.getId());

        List<Map<String, Object>> comparison = new ArrayList<>();
        Random random = new Random(42);

        for (Pg pg : pgs) {
            Map<String, Object> pgData = new HashMap<>();
            pgData.put("pgId", pg.getId());
            pgData.put("pgName", pg.getName());
            pgData.put("occupancy", 80 + random.nextInt(15));
            pgData.put("occupancyChange", random.nextInt(10) - 3);
            pgData.put("rating", pg.getRating());

            List<Issue> issues = issueRepository.findByPgId(pg.getId());
            long issuesCount = issues.stream().filter(i -> "OPEN".equals(i.getStatus()) || "Open".equals(i.getStatus()))
                    .count();
            pgData.put("issuesCount", issuesCount);
            pgData.put("revenue", 60000 + random.nextInt(30000));
            pgData.put("growth", random.nextInt(6));

            comparison.add(pgData);
        }

        return comparison;
    }

    @Override
    public Map<String, Object> getInsights() {
        User owner = getCurrentOwner();
        List<Pg> pgs = pgRepository.findByOwnerId(owner.getId());

        Map<String, Object> insights = new HashMap<>();

        if (pgs.isEmpty()) {
            return insights;
        }

        Pg bestPG = pgs.stream()
                .max(Comparator.comparingDouble(Pg::getRating))
                .orElse(pgs.get(0));

        Map<String, Object> bestPerformer = new HashMap<>();
        bestPerformer.put("pgName", bestPG.getName());
        bestPerformer.put("occupancy", 93);
        bestPerformer.put("rating", bestPG.getRating());
        insights.put("bestPerformer", bestPerformer);

        Pg worstPG = pgs.stream()
                .min(Comparator.comparingDouble(Pg::getRating))
                .orElse(pgs.get(0));

        Map<String, Object> needsAttention = new HashMap<>();
        needsAttention.put("pgName", worstPG.getName());
        needsAttention.put("occupancy", 75);
        needsAttention.put("change", -5);
        insights.put("needsAttention", needsAttention);

        Map<String, Object> highComplaints = new HashMap<>();
        highComplaints.put("pgName", pgs.get(0).getName());
        highComplaints.put("issuesCount", 3);
        highComplaints.put("details", "water and Wi-Fi issues");
        insights.put("highComplaints", highComplaints);

        Map<String, Object> highestGrowth = new HashMap<>();
        highestGrowth.put("pgName", bestPG.getName());
        highestGrowth.put("newResidents", 5);
        insights.put("highestGrowth", highestGrowth);

        Map<String, Object> ratingDrop = new HashMap<>();
        ratingDrop.put("pgName", worstPG.getName());
        ratingDrop.put("oldRating", 4.5);
        ratingDrop.put("newRating", 4.3);
        ratingDrop.put("change", -0.2);
        insights.put("ratingDrop", ratingDrop);

        return insights;
    }

    @Override
    public Map<String, Object> getOwnerProfile() {
        User owner = getCurrentOwner();

        Map<String, Object> profile = new HashMap<>();
        profile.put("fullName", owner.getFullName());
        profile.put("email", owner.getEmail());
        profile.put("phone", "");
        profile.put("altPhone", "");
        profile.put("companyName", "");
        profile.put("gstNumber", "");
        profile.put("pan", "");

        return profile;
    }

    @Override
    public Map<String, Object> updateOwnerProfile(Map<String, Object> profileData) {
        User owner = getCurrentOwner();

        if (profileData.containsKey("fullName")) {
            owner.setFullName((String) profileData.get("fullName"));
        }

        userRepository.save(owner);

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("message", "Profile updated successfully");

        return result;
    }
}

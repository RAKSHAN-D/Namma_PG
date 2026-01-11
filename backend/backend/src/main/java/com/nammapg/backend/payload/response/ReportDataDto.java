package com.nammapg.backend.payload.response;

import java.util.List;

public class ReportDataDto {
    private UserGrowthReport userGrowth;
    private PgStatusReport pgStatus;
    private IssueAnalyticsReport issueAnalytics;
    private List<LocationDistribution> locationDistribution;

    public static class UserGrowthReport {
        private List<TimeSeriesData> data;
        private long totalUsers;
        private long totalOwners;

        public UserGrowthReport() {
        }

        public UserGrowthReport(List<TimeSeriesData> data, long totalUsers, long totalOwners) {
            this.data = data;
            this.totalUsers = totalUsers;
            this.totalOwners = totalOwners;
        }

        public List<TimeSeriesData> getData() {
            return data;
        }

        public void setData(List<TimeSeriesData> data) {
            this.data = data;
        }

        public long getTotalUsers() {
            return totalUsers;
        }

        public void setTotalUsers(long totalUsers) {
            this.totalUsers = totalUsers;
        }

        public long getTotalOwners() {
            return totalOwners;
        }

        public void setTotalOwners(long totalOwners) {
            this.totalOwners = totalOwners;
        }
    }

    public static class TimeSeriesData {
        private String date;
        private long users;
        private long owners;

        public TimeSeriesData() {
        }

        public TimeSeriesData(String date, long users, long owners) {
            this.date = date;
            this.users = users;
            this.owners = owners;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public long getUsers() {
            return users;
        }

        public void setUsers(long users) {
            this.users = users;
        }

        public long getOwners() {
            return owners;
        }

        public void setOwners(long owners) {
            this.owners = owners;
        }
    }

    public static class PgStatusReport {
        private long approved;
        private long pending;
        private long total;

        public PgStatusReport() {
        }

        public PgStatusReport(long approved, long pending, long total) {
            this.approved = approved;
            this.pending = pending;
            this.total = total;
        }

        public long getApproved() {
            return approved;
        }

        public void setApproved(long approved) {
            this.approved = approved;
        }

        public long getPending() {
            return pending;
        }

        public void setPending(long pending) {
            this.pending = pending;
        }

        public long getTotal() {
            return total;
        }

        public void setTotal(long total) {
            this.total = total;
        }
    }

    public static class IssueAnalyticsReport {
        private long open;
        private long inProgress;
        private long resolved;
        private long total;

        public IssueAnalyticsReport() {
        }

        public IssueAnalyticsReport(long open, long inProgress, long resolved, long total) {
            this.open = open;
            this.inProgress = inProgress;
            this.resolved = resolved;
            this.total = total;
        }

        public long getOpen() {
            return open;
        }

        public void setOpen(long open) {
            this.open = open;
        }

        public long getInProgress() {
            return inProgress;
        }

        public void setInProgress(long inProgress) {
            this.inProgress = inProgress;
        }

        public long getResolved() {
            return resolved;
        }

        public void setResolved(long resolved) {
            this.resolved = resolved;
        }

        public long getTotal() {
            return total;
        }

        public void setTotal(long total) {
            this.total = total;
        }
    }

    public static class LocationDistribution {
        private String location;
        private long count;

        public LocationDistribution() {
        }

        public LocationDistribution(String location, long count) {
            this.location = location;
            this.count = count;
        }

        public String getLocation() {
            return location;
        }

        public void setLocation(String location) {
            this.location = location;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    public ReportDataDto() {
    }

    public UserGrowthReport getUserGrowth() {
        return userGrowth;
    }

    public void setUserGrowth(UserGrowthReport userGrowth) {
        this.userGrowth = userGrowth;
    }

    public PgStatusReport getPgStatus() {
        return pgStatus;
    }

    public void setPgStatus(PgStatusReport pgStatus) {
        this.pgStatus = pgStatus;
    }

    public IssueAnalyticsReport getIssueAnalytics() {
        return issueAnalytics;
    }

    public void setIssueAnalytics(IssueAnalyticsReport issueAnalytics) {
        this.issueAnalytics = issueAnalytics;
    }

    public List<LocationDistribution> getLocationDistribution() {
        return locationDistribution;
    }

    public void setLocationDistribution(List<LocationDistribution> locationDistribution) {
        this.locationDistribution = locationDistribution;
    }
}

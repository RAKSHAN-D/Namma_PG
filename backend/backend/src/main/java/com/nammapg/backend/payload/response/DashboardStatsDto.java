package com.nammapg.backend.payload.response;

public class DashboardStatsDto {
    private long totalPGs;
    private long activeOwners;
    private long activeUsers;
    private long pendingApprovals;

    public DashboardStatsDto(long totalPGs, long activeOwners, long activeUsers, long pendingApprovals) {
        this.totalPGs = totalPGs;
        this.activeOwners = activeOwners;
        this.activeUsers = activeUsers;
        this.pendingApprovals = pendingApprovals;
    }

    // Getters and Setters
    public long getTotalPGs() {
        return totalPGs;
    }

    public void setTotalPGs(long totalPGs) {
        this.totalPGs = totalPGs;
    }

    public long getActiveOwners() {
        return activeOwners;
    }

    public void setActiveOwners(long activeOwners) {
        this.activeOwners = activeOwners;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public long getPendingApprovals() {
        return pendingApprovals;
    }

    public void setPendingApprovals(long pendingApprovals) {
        this.pendingApprovals = pendingApprovals;
    }
}

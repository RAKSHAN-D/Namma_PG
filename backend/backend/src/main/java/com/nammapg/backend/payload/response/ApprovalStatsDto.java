package com.nammapg.backend.payload.response;

public class ApprovalStatsDto {
    private long approvedPgs;
    private long pendingPgs;
    private long approvedUsers;
    private long pendingUsers;
    private long approvedOwners;
    private long pendingOwners;

    public ApprovalStatsDto() {
    }

    public ApprovalStatsDto(long approvedPgs, long pendingPgs, long approvedUsers, long pendingUsers,
            long approvedOwners, long pendingOwners) {
        this.approvedPgs = approvedPgs;
        this.pendingPgs = pendingPgs;
        this.approvedUsers = approvedUsers;
        this.pendingUsers = pendingUsers;
        this.approvedOwners = approvedOwners;
        this.pendingOwners = pendingOwners;
    }

    // Getters and Setters
    public long getApprovedPgs() {
        return approvedPgs;
    }

    public void setApprovedPgs(long approvedPgs) {
        this.approvedPgs = approvedPgs;
    }

    public long getPendingPgs() {
        return pendingPgs;
    }

    public void setPendingPgs(long pendingPgs) {
        this.pendingPgs = pendingPgs;
    }

    public long getApprovedUsers() {
        return approvedUsers;
    }

    public void setApprovedUsers(long approvedUsers) {
        this.approvedUsers = approvedUsers;
    }

    public long getPendingUsers() {
        return pendingUsers;
    }

    public void setPendingUsers(long pendingUsers) {
        this.pendingUsers = pendingUsers;
    }

    public long getApprovedOwners() {
        return approvedOwners;
    }

    public void setApprovedOwners(long approvedOwners) {
        this.approvedOwners = approvedOwners;
    }

    public long getPendingOwners() {
        return pendingOwners;
    }

    public void setPendingOwners(long pendingOwners) {
        this.pendingOwners = pendingOwners;
    }
}

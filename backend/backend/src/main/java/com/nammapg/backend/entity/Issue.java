package com.nammapg.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "issues")
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /*
     * =====================
     * RELATIONSHIPS
     * =====================
     */

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "roles", "password" })
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pg_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "owner", "food", "facilities", "rooms" })
    private Pg pg;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Rooms room; // optional

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Booking booking; // optional but powerful

    /*
     * =====================
     * ISSUE DETAILS
     * =====================
     */

    @Column(nullable = false)
    private String issueType;
    // WATER, ELECTRICITY, FOOD, WIFI, CLEANLINESS, OTHER

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    /*
     * =====================
     * STATUS & PRIORITY
     * =====================
     */

    @Column(nullable = false)
    private String status;
    // OPEN, IN_PROGRESS, RESOLVED, CLOSED

    private String priority;
    // LOW, MEDIUM, HIGH

    /*
     * =====================
     * ASSIGNMENT
     * =====================
     */

    private String assignedTo;
    // admin / owner / volunteer (future mapping)

    /*
     * =====================
     * RESOLUTION
     * =====================
     */

    @Column(columnDefinition = "TEXT")
    private String resolutionNotes;

    private Boolean userSatisfied;

    /*
     * =====================
     * TIMESTAMPS
     * =====================
     */

    private LocalDateTime reportedAt;

    private LocalDateTime resolvedAt;

    private LocalDateTime closedAt;

    /*
     * =====================
     * AUDIT
     * =====================
     */

    private boolean active = true;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public Issue() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Pg getPg() {
        return pg;
    }

    public void setPg(Pg pg) {
        this.pg = pg;
    }

    public Rooms getRoom() {
        return room;
    }

    public void setRoom(Rooms room) {
        this.room = room;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public String getIssueType() {
        return issueType;
    }

    public void setIssueType(String issueType) {
        this.issueType = issueType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(String assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public Boolean getUserSatisfied() {
        return userSatisfied;
    }

    public void setUserSatisfied(Boolean userSatisfied) {
        this.userSatisfied = userSatisfied;
    }

    public LocalDateTime getReportedAt() {
        return reportedAt;
    }

    public void setReportedAt(LocalDateTime reportedAt) {
        this.reportedAt = reportedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

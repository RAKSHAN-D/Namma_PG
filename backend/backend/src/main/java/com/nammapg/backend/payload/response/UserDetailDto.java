package com.nammapg.backend.payload.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class UserDetailDto {
    // Basic Info
    private Long id;
    private String fullName;
    private String username;
    private String email;
    private boolean active;
    private LocalDateTime createdAt;

    // Roles
    private Set<String> roles;

    // Bookings
    private List<UserBookingDto> bookings;

    // Issues
    private List<UserIssueDto> issues;

    // Statistics
    private int totalBookings;
    private int activeBookings;
    private int totalIssues;
    private int openIssues;

    public UserDetailDto() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

    public List<UserBookingDto> getBookings() {
        return bookings;
    }

    public void setBookings(List<UserBookingDto> bookings) {
        this.bookings = bookings;
    }

    public List<UserIssueDto> getIssues() {
        return issues;
    }

    public void setIssues(List<UserIssueDto> issues) {
        this.issues = issues;
    }

    public int getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(int totalBookings) {
        this.totalBookings = totalBookings;
    }

    public int getActiveBookings() {
        return activeBookings;
    }

    public void setActiveBookings(int activeBookings) {
        this.activeBookings = activeBookings;
    }

    public int getTotalIssues() {
        return totalIssues;
    }

    public void setTotalIssues(int totalIssues) {
        this.totalIssues = totalIssues;
    }

    public int getOpenIssues() {
        return openIssues;
    }

    public void setOpenIssues(int openIssues) {
        this.openIssues = openIssues;
    }
}

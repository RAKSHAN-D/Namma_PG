package com.nammapg.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "platform_settings")
public class PlatformSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Platform Information
    @Column(name = "platform_name")
    private String platformName;

    @Column(name = "platform_email")
    private String platformEmail;

    @Column(name = "platform_phone")
    private String platformPhone;

    @Column(name = "support_email")
    private String supportEmail;

    // Approval Settings
    @Column(name = "auto_approve_pgs")
    private Boolean autoApprovePgs = false;

    @Column(name = "auto_approve_owners")
    private Boolean autoApproveOwners = false;

    @Column(name = "auto_approve_users")
    private Boolean autoApproveUsers = true;

    // Notification Settings
    @Column(name = "notify_new_pg")
    private Boolean notifyNewPg = true;

    @Column(name = "notify_new_owner")
    private Boolean notifyNewOwner = true;

    @Column(name = "notify_high_priority_issue")
    private Boolean notifyHighPriorityIssue = true;

    @Column(name = "notify_daily_summary")
    private Boolean notifyDailySummary = false;

    // Maintenance Mode
    @Column(name = "maintenance_mode")
    private Boolean maintenanceMode = false;

    @Column(name = "maintenance_message")
    private String maintenanceMessage;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "updated_by")
    private String updatedBy;

    // Constructors
    public PlatformSettings() {
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlatformName() {
        return platformName;
    }

    public void setPlatformName(String platformName) {
        this.platformName = platformName;
    }

    public String getPlatformEmail() {
        return platformEmail;
    }

    public void setPlatformEmail(String platformEmail) {
        this.platformEmail = platformEmail;
    }

    public String getPlatformPhone() {
        return platformPhone;
    }

    public void setPlatformPhone(String platformPhone) {
        this.platformPhone = platformPhone;
    }

    public String getSupportEmail() {
        return supportEmail;
    }

    public void setSupportEmail(String supportEmail) {
        this.supportEmail = supportEmail;
    }

    public Boolean getAutoApprovePgs() {
        return autoApprovePgs;
    }

    public void setAutoApprovePgs(Boolean autoApprovePgs) {
        this.autoApprovePgs = autoApprovePgs;
    }

    public Boolean getAutoApproveOwners() {
        return autoApproveOwners;
    }

    public void setAutoApproveOwners(Boolean autoApproveOwners) {
        this.autoApproveOwners = autoApproveOwners;
    }

    public Boolean getAutoApproveUsers() {
        return autoApproveUsers;
    }

    public void setAutoApproveUsers(Boolean autoApproveUsers) {
        this.autoApproveUsers = autoApproveUsers;
    }

    public Boolean getNotifyNewPg() {
        return notifyNewPg;
    }

    public void setNotifyNewPg(Boolean notifyNewPg) {
        this.notifyNewPg = notifyNewPg;
    }

    public Boolean getNotifyNewOwner() {
        return notifyNewOwner;
    }

    public void setNotifyNewOwner(Boolean notifyNewOwner) {
        this.notifyNewOwner = notifyNewOwner;
    }

    public Boolean getNotifyHighPriorityIssue() {
        return notifyHighPriorityIssue;
    }

    public void setNotifyHighPriorityIssue(Boolean notifyHighPriorityIssue) {
        this.notifyHighPriorityIssue = notifyHighPriorityIssue;
    }

    public Boolean getNotifyDailySummary() {
        return notifyDailySummary;
    }

    public void setNotifyDailySummary(Boolean notifyDailySummary) {
        this.notifyDailySummary = notifyDailySummary;
    }

    public Boolean getMaintenanceMode() {
        return maintenanceMode;
    }

    public void setMaintenanceMode(Boolean maintenanceMode) {
        this.maintenanceMode = maintenanceMode;
    }

    public String getMaintenanceMessage() {
        return maintenanceMessage;
    }

    public void setMaintenanceMessage(String maintenanceMessage) {
        this.maintenanceMessage = maintenanceMessage;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
}

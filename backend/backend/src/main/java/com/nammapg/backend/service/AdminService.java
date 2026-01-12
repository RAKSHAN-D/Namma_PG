package com.nammapg.backend.service;

import com.nammapg.backend.entity.Issue;
import com.nammapg.backend.entity.User;
import com.nammapg.backend.payload.response.DashboardStatsDto;
import com.nammapg.backend.payload.response.PgResponseDto;

import java.util.List;
import java.util.Map;

public interface AdminService {
    DashboardStatsDto getDashboardStats();

    PgResponseDto updatePgStatus(Long id, boolean active);

    com.nammapg.backend.payload.response.PgDetailDto getPgDetails(Long id);

    List<PgResponseDto> getAllPgs();

    List<User> getAllUsers();

    List<User> getAllOwners();

    List<Map<String, Object>> getOnboardingTrend();

    List<Issue> getAllIssues();

    User updateUserStatus(Long userId, boolean active);

    com.nammapg.backend.payload.response.UserDetailDto getUserDetails(Long userId);

    com.nammapg.backend.payload.response.OwnerDetailDto getOwnerDetails(Long ownerId);

    com.nammapg.backend.payload.response.ApprovalStatsDto getApprovalStats();

    com.nammapg.backend.payload.response.ReportDataDto getReportData();

    com.nammapg.backend.entity.PlatformSettings getSettings();

    com.nammapg.backend.entity.PlatformSettings updateSettings(com.nammapg.backend.entity.PlatformSettings settings);
}

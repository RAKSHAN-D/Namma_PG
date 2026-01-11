package com.nammapg.backend.controller;

import com.nammapg.backend.entity.Issue;
import com.nammapg.backend.entity.User;
import com.nammapg.backend.payload.response.DashboardStatsDto;
import com.nammapg.backend.payload.response.PgDetailDto;
import com.nammapg.backend.payload.response.PgResponseDto;
import com.nammapg.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/pgs")
    public ResponseEntity<List<PgResponseDto>> getAllPgs() {
        return ResponseEntity.ok(adminService.getAllPgs());
    }

    @GetMapping("/pgs/{id}")
    public ResponseEntity<PgDetailDto> getPgDetails(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getPgDetails(id));
    }

    @PutMapping("/pgs/{id}/status")
    public ResponseEntity<PgResponseDto> updatePgStatus(@PathVariable Long id, @RequestParam boolean active) {
        return ResponseEntity.ok(adminService.updatePgStatus(id, active));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/owners")
    public ResponseEntity<List<User>> getAllOwners() {
        return ResponseEntity.ok(adminService.getAllOwners());
    }

    @GetMapping("/onboarding-trend")
    public ResponseEntity<List<Map<String, Object>>> getOnboardingTrend() {
        return ResponseEntity.ok(adminService.getOnboardingTrend());
    }

    @GetMapping("/issues")
    public ResponseEntity<List<Issue>> getAllIssues() {
        return ResponseEntity.ok(adminService.getAllIssues());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<User> updateUserStatus(@PathVariable Long id, @RequestParam boolean active) {
        return ResponseEntity.ok(adminService.updateUserStatus(id, active));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<com.nammapg.backend.payload.response.UserDetailDto> getUserDetails(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserDetails(id));
    }

    @GetMapping("/owners/{id}")
    public ResponseEntity<com.nammapg.backend.payload.response.OwnerDetailDto> getOwnerDetails(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getOwnerDetails(id));
    }

    @GetMapping("/approvals/stats")
    public ResponseEntity<com.nammapg.backend.payload.response.ApprovalStatsDto> getApprovalStats() {
        return ResponseEntity.ok(adminService.getApprovalStats());
    }
}

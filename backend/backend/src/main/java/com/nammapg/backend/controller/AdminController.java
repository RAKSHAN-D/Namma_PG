package com.nammapg.backend.controller;

import com.nammapg.backend.entity.Issue;
import com.nammapg.backend.entity.Pg;
import com.nammapg.backend.entity.User;
import com.nammapg.backend.payload.response.DashboardStatsDto;
import com.nammapg.backend.repository.IssueRepository;
import com.nammapg.backend.repository.PgRepository;
import com.nammapg.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PgRepository pgRepository;

    @Autowired
    private IssueRepository issueRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        long totalPGs = pgRepository.count();

        List<User> allUsers = userRepository.findAll();

        long activeOwners = allUsers.stream()
                .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_PG_OWNER")))
                .count();

        long activeUsers = allUsers.stream()
                .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_PG_USER")))
                .count();

        // Assuming inactive/false PGs are "Pending" for now
        long pendingApprovals = pgRepository.findAll().stream()
                .filter(pg -> !pg.isActive())
                .count();

        return ResponseEntity.ok(new DashboardStatsDto(totalPGs, activeOwners, activeUsers, pendingApprovals));
    }

    @GetMapping("/pgs")
    public ResponseEntity<List<Pg>> getAllPgs() {
        return ResponseEntity.ok(pgRepository.findAll());
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_PG_USER")))
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/owners")
    public ResponseEntity<List<User>> getAllOwners() {
        List<User> owners = userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_PG_OWNER")))
                .collect(Collectors.toList());
        return ResponseEntity.ok(owners);
    }

    @GetMapping("/issues")
    public ResponseEntity<List<Issue>> getAllIssues() {
        return ResponseEntity.ok(issueRepository.findAll());
    }
}

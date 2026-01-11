package com.nammapg.backend.service.impl;

import com.nammapg.backend.entity.Booking;
import com.nammapg.backend.entity.Food;
import com.nammapg.backend.entity.Issue;
import com.nammapg.backend.entity.Pg;
import com.nammapg.backend.entity.User;
import com.nammapg.backend.payload.response.*;
import com.nammapg.backend.repository.BookingRepository;
import com.nammapg.backend.repository.IssueRepository;
import com.nammapg.backend.repository.PgRepository;
import com.nammapg.backend.repository.UserRepository;
import com.nammapg.backend.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PgRepository pgRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public DashboardStatsDto getDashboardStats() {
        long totalPGs = pgRepository.count();

        // Using optimized DB Queries instead of Stream Filtering
        long activeOwners = userRepository.countByActiveTrueAndRoles_Name("ROLE_PG_OWNER");
        long activeUsers = userRepository.countByActiveTrueAndRoles_Name("ROLE_PG_USER");

        long pendingIssues = issueRepository.countByStatusIn(Arrays.asList("OPEN", "IN_PROGRESS"));

        return new DashboardStatsDto(totalPGs, activeOwners, activeUsers, pendingIssues);
    }

    @Override
    public PgDetailDto getPgDetails(Long id) {
        Pg pg = pgRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Error: PG not found."));

        PgDetailDto dto = new PgDetailDto();
        // Basic fields from PgResponseDto
        dto.setId(pg.getId());
        dto.setName(pg.getName());
        dto.setArea(pg.getArea());
        dto.setCity(pg.getCity());
        dto.setGender(pg.getGender());
        dto.setActive(pg.isActive());
        dto.setTotalRooms(pg.getTotalRooms());

        // Detail fields
        dto.setDescription(pg.getDescription());
        dto.setTotalFloors(pg.getTotalFloors());
        dto.setRating(pg.getRating());
        dto.setCreatedAt(pg.getCreatedAt());
        dto.setUpdatedAt(pg.getUpdatedAt());

        if (pg.getOwner() != null) {
            dto.setOwnerName(pg.getOwner().getFullName());
            dto.setOwnerEmail(pg.getOwner().getEmail());
            dto.setOwnerUsername(pg.getOwner().getUsername());
            dto.setOwnerJoinedAt(pg.getOwner().getCreatedAt());
        }

        if (pg.getFacilities() != null) {
            dto.setFacilities(pg.getFacilities().stream()
                    .map(f -> new FacilityDto(f.getId(), f.getName(), f.getDescription()))
                    .collect(Collectors.toList()));
        }

        if (pg.getFood() != null) {
            Food f = pg.getFood();
            FoodDto fDto = new FoodDto();
            fDto.setId(f.getId());
            fDto.setEggsProvided(f.isEggsProvided());
            fDto.setBreakfast(f.isBreakfast());
            fDto.setBreakfastStartTime(f.getBreakfastStartTime());
            fDto.setBreakfastEndTime(f.getBreakfastEndTime());
            fDto.setLunch(f.isLunch());
            fDto.setLunchStartTime(f.getLunchStartTime());
            fDto.setLunchEndTime(f.getLunchEndTime());
            fDto.setDinner(f.isDinner());
            fDto.setDinnerStartTime(f.getDinnerStartTime());
            fDto.setDinnerEndTime(f.getDinnerEndTime());
            fDto.setSundaySpecial(f.isSundaySpecial());
            fDto.setSundaySpecialItem(f.getSundaySpecialItem());
            fDto.setWeeklySweetProvided(f.isWeeklySweetProvided());
            fDto.setWeeklySweetDay(f.getWeeklySweetDay());
            fDto.setWeeklySweetItem(f.getWeeklySweetItem());
            fDto.setWeeklyKitchenClosed(f.isWeeklyKitchenClosed());
            fDto.setKitchenClosedDay(f.getKitchenClosedDay());
            fDto.setIncludedInRent(f.isIncludedInRent());
            fDto.setRemarks(f.getRemarks());
            dto.setFood(fDto);
        }

        return dto;
    }

    @Override
    public List<PgResponseDto> getAllPgs() {
        return pgRepository.findAllWithOwners().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private PgResponseDto mapToDto(Pg pg) {
        PgResponseDto dto = new PgResponseDto();
        dto.setId(pg.getId());
        dto.setName(pg.getName());
        dto.setArea(pg.getArea());
        dto.setCity(pg.getCity());
        dto.setGender(pg.getGender());
        dto.setActive(pg.isActive());
        dto.setTotalRooms(pg.getTotalRooms());

        if (pg.getOwner() != null) {
            dto.setOwnerName(pg.getOwner().getFullName());
            dto.setOwnerEmail(pg.getOwner().getEmail());
        } else {
            dto.setOwnerName("Unknown");
            dto.setOwnerEmail("");
        }
        return dto;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findByRoles_Name("ROLE_PG_USER");
    }

    @Override
    public List<User> getAllOwners() {
        return userRepository.findByRoles_Name("ROLE_PG_OWNER");
    }

    @Override
    public List<Map<String, Object>> getOnboardingTrend() {
        List<User> users = userRepository.findAll();

        Map<String, Map<String, Long>> grouped = users.stream()
                .filter(u -> u.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        u -> u.getCreatedAt().getMonth().toString().substring(0, 3),
                        Collectors.groupingBy(
                                u -> u.getRoles().stream().anyMatch(r -> r.getName().equals("ROLE_PG_OWNER")) ? "owners"
                                        : "users",
                                Collectors.counting())));

        String[] months = { "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC" };
        List<Map<String, Object>> result = new ArrayList<>();

        for (String m : months) {
            Map<String, Object> entry = new HashMap<>();
            String titleCase = m.charAt(0) + m.substring(1).toLowerCase();
            entry.put("month", titleCase);

            Map<String, Long> monthData = grouped.getOrDefault(m, new HashMap<>());
            entry.put("users", monthData.getOrDefault("users", 0L));
            entry.put("owners", monthData.getOrDefault("owners", 0L));
            result.add(entry);
        }

        return result;
    }

    @Override
    public List<Issue> getAllIssues() {
        return issueRepository.findAllWithDetails();
    }

    @Override
    public PgResponseDto updatePgStatus(Long pgId, boolean active) {
        Pg pg = pgRepository.findById(pgId)
                .orElseThrow(() -> new RuntimeException("Error: PG not found."));
        pg.setActive(active);
        Pg updatedPg = pgRepository.save(pg);
        return mapToDto(updatedPg);
    }

    @Override
    public User updateUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));
        user.setActive(active);
        return userRepository.save(user);
    }

    @Override
    public UserDetailDto getUserDetails(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found."));

        UserDetailDto dto = new UserDetailDto();

        // Basic Info
        dto.setId(user.getId());
        dto.setFullName(user.getFullName());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setActive(user.isActive());
        dto.setCreatedAt(user.getCreatedAt());

        // Roles
        Set<String> roleNames = user.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet());
        dto.setRoles(roleNames);

        // Bookings
        List<Booking> bookings = bookingRepository.findByUser_Id(userId);
        List<UserBookingDto> bookingDtos = bookings.stream().map(booking -> {
            UserBookingDto bookingDto = new UserBookingDto();
            bookingDto.setId(booking.getId());
            if (booking.getPg() != null) {
                bookingDto.setPgName(booking.getPg().getName());
                bookingDto.setPgArea(booking.getPg().getArea());
                bookingDto.setPgCity(booking.getPg().getCity());
            }
            bookingDto.setCheckInDate(booking.getCheckInDate());
            bookingDto.setCheckOutDate(booking.getCheckOutDate());
            bookingDto.setBookingStatus(booking.getBookingStatus());
            bookingDto.setPaymentStatus(booking.getPaymentStatus());
            bookingDto.setTotalAmount(booking.getTotalAmount());
            bookingDto.setBookingDate(booking.getBookingDate());
            bookingDto.setRoomSharingType(booking.getRoomSharingType());
            return bookingDto;
        }).collect(Collectors.toList());
        dto.setBookings(bookingDtos);

        // Issues
        List<Issue> issues = issueRepository.findByUserId(userId);
        List<UserIssueDto> issueDtos = issues.stream().map(issue -> {
            UserIssueDto issueDto = new UserIssueDto();
            issueDto.setId(issue.getId());
            if (issue.getPg() != null) {
                issueDto.setPgName(issue.getPg().getName());
            }
            issueDto.setIssueType(issue.getIssueType());
            issueDto.setTitle(issue.getTitle());
            issueDto.setDescription(issue.getDescription());
            issueDto.setStatus(issue.getStatus());
            issueDto.setPriority(issue.getPriority());
            issueDto.setReportedAt(issue.getReportedAt());
            issueDto.setResolvedAt(issue.getResolvedAt());
            return issueDto;
        }).collect(Collectors.toList());
        dto.setIssues(issueDtos);

        // Statistics
        dto.setTotalBookings(bookings.size());
        dto.setActiveBookings((int) bookings.stream()
                .filter(b -> "CONFIRMED".equals(b.getBookingStatus()) || "CHECKED_IN".equals(b.getBookingStatus()))
                .count());
        dto.setTotalIssues(issues.size());
        dto.setOpenIssues((int) issues.stream()
                .filter(i -> "OPEN".equals(i.getStatus()) || "IN_PROGRESS".equals(i.getStatus()))
                .count());

        return dto;
    }

    @Override
    public OwnerDetailDto getOwnerDetails(Long ownerId) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("Error: Owner not found."));

        OwnerDetailDto dto = new OwnerDetailDto();

        // Basic Info
        dto.setId(owner.getId());
        dto.setFullName(owner.getFullName());
        dto.setUsername(owner.getUsername());
        dto.setEmail(owner.getEmail());
        dto.setActive(owner.isActive());
        dto.setCreatedAt(owner.getCreatedAt());

        // Roles
        Set<String> roleNames = owner.getRoles().stream()
                .map(role -> role.getName())
                .collect(Collectors.toSet());
        dto.setRoles(roleNames);

        // PGs owned
        List<Pg> pgs = pgRepository.findByOwnerId(ownerId);
        List<OwnerPgDto> pgDtos = pgs.stream().map(pg -> {
            OwnerPgDto pgDto = new OwnerPgDto();
            pgDto.setId(pg.getId());
            pgDto.setName(pg.getName());
            pgDto.setArea(pg.getArea());
            pgDto.setCity(pg.getCity());
            pgDto.setGender(pg.getGender());
            pgDto.setActive(pg.isActive());
            pgDto.setTotalRooms(pg.getTotalRooms());
            pgDto.setTotalFloors(pg.getTotalFloors());
            pgDto.setRating(pg.getRating());
            pgDto.setCreatedAt(pg.getCreatedAt());
            return pgDto;
        }).collect(Collectors.toList());
        dto.setPgs(pgDtos);

        // Issues
        List<Issue> issues = issueRepository.findByUserId(ownerId);
        List<UserIssueDto> issueDtos = issues.stream().map(issue -> {
            UserIssueDto issueDto = new UserIssueDto();
            issueDto.setId(issue.getId());
            if (issue.getPg() != null) {
                issueDto.setPgName(issue.getPg().getName());
            }
            issueDto.setIssueType(issue.getIssueType());
            issueDto.setTitle(issue.getTitle());
            issueDto.setDescription(issue.getDescription());
            issueDto.setStatus(issue.getStatus());
            issueDto.setPriority(issue.getPriority());
            issueDto.setReportedAt(issue.getReportedAt());
            issueDto.setResolvedAt(issue.getResolvedAt());
            return issueDto;
        }).collect(Collectors.toList());
        dto.setIssues(issueDtos);

        // Statistics
        dto.setTotalPgs(pgs.size());
        dto.setActivePgs((int) pgs.stream().filter(Pg::isActive).count());
        dto.setTotalIssues(issues.size());
        dto.setOpenIssues((int) issues.stream()
                .filter(i -> "OPEN".equals(i.getStatus()) || "IN_PROGRESS".equals(i.getStatus()))
                .count());

        return dto;
    }

    @Override
    public ApprovalStatsDto getApprovalStats() {
        // Count approved (active) and pending (inactive) PGs
        long approvedPgs = pgRepository.countByActiveTrue();
        long totalPgs = pgRepository.count();
        long pendingPgs = totalPgs - approvedPgs;

        // Count approved (active) and pending (inactive) Users with PG_USER role
        List<User> allUsers = userRepository.findByRoles_Name("ROLE_PG_USER");
        long approvedUsers = allUsers.stream().filter(User::isActive).count();
        long pendingUsers = allUsers.size() - approvedUsers;

        // Count approved (active) and pending (inactive) Owners with PG_OWNER role
        List<User> allOwners = userRepository.findByRoles_Name("ROLE_PG_OWNER");
        long approvedOwners = allOwners.stream().filter(User::isActive).count();
        long pendingOwners = allOwners.size() - approvedOwners;

        return new ApprovalStatsDto(approvedPgs, pendingPgs, approvedUsers, pendingUsers, approvedOwners,
                pendingOwners);
    }
}

package com.nammapg.backend.config;

import com.nammapg.backend.entity.*;
import com.nammapg.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;
import org.springframework.transaction.support.TransactionTemplate;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PgRepository pgRepository;

    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private org.springframework.transaction.PlatformTransactionManager transactionManager;

    private TransactionTemplate transactionTemplate;

    @Override
    public void run(String... args) throws Exception {
        this.transactionTemplate = new TransactionTemplate(transactionManager);
        System.out.println("🌱 Starting Data Seeding...");

        // 1. Ensure Roles Exist
        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        Role ownerRole = roleRepository.findByName("ROLE_PG_OWNER")
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        Role userRole = roleRepository.findByName("ROLE_PG_USER")
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

        // 2. Seed Users
        if (!userRepository.existsByUsername("admin")) {
            createUser("admin", "admin@namma.com", "password123", adminRole);
            System.out.println("✅ Created Admin User");
        }

        User owner1 = null;
        if (!userRepository.existsByUsername("ramesh_owner")) {
            owner1 = createUser("ramesh_owner", "ramesh@owner.com", "password123", ownerRole);
            System.out.println("✅ Created Owner: Ramesh");
        } else {
            owner1 = userRepository.findByUsername("ramesh_owner").orElse(null);
        }

        User owner2 = null;
        if (!userRepository.existsByUsername("suresh_owner")) {
            owner2 = createUser("suresh_owner", "suresh@owner.com", "password123", ownerRole);
            System.out.println("✅ Created Owner: Suresh");
        } else {
            owner2 = userRepository.findByUsername("suresh_owner").orElse(null);
        }

        User user1 = null;
        if (!userRepository.existsByUsername("rahul_user")) {
            user1 = createUser("rahul_user", "rahul@user.com", "password123", userRole);
            System.out.println("✅ Created User: Rahul");
        } else {
            user1 = userRepository.findByUsername("rahul_user").orElse(null);
        }

        User user2 = null;
        if (!userRepository.existsByUsername("anita_user")) {
            user2 = createUser("anita_user", "anita@user.com", "password123", userRole);
            System.out.println("✅ Created User: Anita");
        } else {
            user2 = userRepository.findByUsername("anita_user").orElse(null);
        }

        // 3. Seed PGs
        long pgCount = pgRepository.count();
        if (pgCount < 10 && owner1 != null && owner2 != null) {
            System.out.println("🌱 Seeding PGs (Current count: " + pgCount + ")...");

            String[] areas = { "Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Bellandur", "Jayanagar" };
            String[] cities = { "Bangalore" };
            String[] genders = { "BOYS", "GIRLS", "COLIVING" };

            // Create global facilities first to reuse or check
            // For simplicity, create fresh ones for each PG to avoid detaching/merging
            // issues in simple seed
            String[] facilityNames = { "WiFi", "TV", "Washing Machine", "Power Backup", "CCTV", "Lift", "Gym" };

            for (int i = 0; i < (10 - pgCount); i++) {
                Pg pg = new Pg();
                pg.setName("Seeded PG " + (pgCount + i + 1) + " - " + areas[i % areas.length]);
                pg.setDescription("A nice stay in " + areas[i % areas.length]);
                pg.setGender(genders[i % genders.length]);
                pg.setTotalFloors(2 + (i % 4));
                pg.setTotalRooms(10 + (i * 2));
                pg.setCity(cities[0]);
                pg.setArea(areas[i % areas.length]);

                pg.setOwner((i % 2 == 0) ? owner1 : owner2);
                pg.setRating(3.5 + (Math.random() * 1.5));
                pg.setActive(i % 3 != 0);
                pg.setCreatedAt(LocalDateTime.now().minusDays((long) (Math.random() * 100)));

                Pg savedPg = pgRepository.save(pg);

                // Seed Food
                Food food = new Food();
                food.setPg(savedPg);
                boolean isVeg = Math.random() > 0.5;
                food.setFoodType(isVeg ? "VEG" : "BOTH");
                food.setBreakfast(true);
                food.setBreakfastStartTime(LocalTime.of(7, 30));
                food.setBreakfastEndTime(LocalTime.of(9, 30));
                food.setLunch(true);
                food.setLunchStartTime(LocalTime.of(12, 30));
                food.setLunchEndTime(LocalTime.of(14, 30));
                food.setDinner(true);
                food.setDinnerStartTime(LocalTime.of(19, 30));
                food.setDinnerEndTime(LocalTime.of(21, 30));
                food.setEggsProvided(!isVeg && Math.random() > 0.3);
                food.setSundaySpecial(true);
                food.setSundaySpecialItem(
                        isVeg ? "Paneer Butter Masala / Mushroom Curry" : "Chicken Biryani / Mutton Curry");
                food.setWeeklySweetProvided(true);
                food.setWeeklySweetItem("Gulab Jamun");
                food.setWeeklySweetDay("Friday");
                // IMPORTANT: set active
                food.setActive(true);
                foodRepository.save(food);

                // Seed Facilities
                Set<Facility> facilities = new HashSet<>();
                for (String name : facilityNames) {
                    if (Math.random() > 0.4) {
                        Facility fac = facilityRepository.findByName(name)
                                .orElseGet(() -> {
                                    Facility newFac = new Facility();
                                    newFac.setName(name);
                                    newFac.setDescription("Standard " + name);
                                    return facilityRepository.save(newFac);
                                });
                        facilities.add(fac);
                    }
                }
                savedPg.setFacilities(facilities);
                pgRepository.save(savedPg);
            }
            System.out.println("✅ Seeded PGs to reach target of 10.");
        }

        // 4. Seed Issues
        if (issueRepository.count() == 0 && user1 != null) {
            Pg issuePg = pgRepository.findAll().stream().findFirst().orElse(null);
            if (issuePg != null) {
                Issue issue1 = new Issue();
                issue1.setTitle("Water leakage in bathroom");
                issue1.setDescription("Room 101 bathroom tap is leaking continuously.");
                issue1.setIssueType("WATER");
                issue1.setPriority("HIGH");
                issue1.setStatus("OPEN");
                issue1.setReportedAt(LocalDateTime.now().minusDays(1));
                issue1.setUser(user1);
                issue1.setPg(issuePg);
                issueRepository.save(issue1);

                Issue issue2 = new Issue();
                issue2.setTitle("WiFi not working");
                issue2.setDescription("Internet speed is very slow since yesterday.");
                issue2.setIssueType("WIFI");
                issue2.setPriority("MEDIUM");
                issue2.setStatus("IN_PROGRESS");
                issue2.setReportedAt(LocalDateTime.now().minusDays(2));
                issue2.setUser(user1);
                issue2.setPg(issuePg);
                issueRepository.save(issue2);
                System.out.println("✅ Seeded 2 Issues");
            }
        }

        // try {
        // backfillPgDetails();
        // } catch (Exception e) {
        // System.err.println("❌ Error during Backfill PG Details: " + e.getMessage());
        // e.printStackTrace();
        // }
        backfillUserDates();
    }

    public void backfillPgDetails() {
        System.out.println("🌱 Backfilling PG Details (Food/Facilities)...");
        String[] facilityNames = { "WiFi", "TV", "Washing Machine", "Power Backup", "CCTV", "Lift", "Gym" };

        pgRepository.findAll().forEach(pgStub -> {
            try {
                transactionTemplate.execute(status -> {
                    // Reload PG to attach to current transaction context
                    Pg pg = pgRepository.findById(pgStub.getId()).orElse(null);
                    if (pg == null)
                        return null;

                    boolean updated = false;

                    // Safer check using repository
                    if (foodRepository.findByPg(pg).isEmpty()) {
                        Food food = new Food();
                        food.setPg(pg);
                        boolean isVeg = Math.random() > 0.5;
                        food.setFoodType(isVeg ? "VEG" : "BOTH");
                        food.setBreakfast(true);
                        food.setBreakfastStartTime(LocalTime.of(7, 30));
                        food.setBreakfastEndTime(LocalTime.of(9, 30));
                        food.setLunch(true);
                        food.setLunchStartTime(LocalTime.of(12, 30));
                        food.setLunchEndTime(LocalTime.of(14, 30));
                        food.setDinner(true);
                        food.setDinnerStartTime(LocalTime.of(19, 30));
                        food.setDinnerEndTime(LocalTime.of(21, 30));
                        food.setEggsProvided(!isVeg && Math.random() > 0.3);
                        food.setSundaySpecial(true);
                        food.setSundaySpecialItem(
                                isVeg ? "Paneer Butter Masala / Mushroom Curry" : "Chicken Biryani / Mutton Curry");
                        food.setWeeklySweetProvided(true);
                        food.setWeeklySweetItem("Gulab Jamun");
                        food.setWeeklySweetDay("Friday");
                        // IMPORTANT: set active
                        food.setActive(true);
                        foodRepository.save(food);
                        System.out.println("   -> Added Food for PG: " + pg.getName());
                    }

                    // Backfill Facilities if empty
                    if (pg.getFacilities() == null || pg.getFacilities().isEmpty()) {
                        Set<Facility> facilities = new HashSet<>();
                        for (String name : facilityNames) {
                            if (Math.random() > 0.4) {
                                Facility fac = facilityRepository.findByName(name)
                                        .orElseGet(() -> {
                                            Facility newFac = new Facility();
                                            newFac.setName(name);
                                            newFac.setDescription("Standard " + name);
                                            return facilityRepository.save(newFac);
                                        });
                                facilities.add(fac);
                            }
                        }
                        pg.setFacilities(facilities);
                        updated = true;
                        System.out.println("   -> Added Facilities for PG: " + pg.getName());
                    }

                    if (updated) {
                        pgRepository.save(pg);
                    }
                    return null;
                });
            } catch (Exception e) {
                System.err.println("❌ Failed to backfill PG: " + pgStub.getName() + " Error: " + e.getMessage());
                // Continue to next PG
            }
        });
    }

    private void backfillUserDates() {
        userRepository.findAll().forEach(u -> {
            if (u.getCreatedAt() == null) {
                u.setCreatedAt(LocalDateTime.now().minusDays((long) (Math.random() * 180)));
                userRepository.save(u);
            }
        });
    }

    private User createUser(String username, String email, String password, Role role) {
        User user = new User();
        user.setUsername(username);
        user.setFullName(username);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setCreatedAt(LocalDateTime.now());
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);
        return userRepository.save(user);
    }
}

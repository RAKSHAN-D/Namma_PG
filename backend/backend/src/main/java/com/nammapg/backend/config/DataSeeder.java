package com.nammapg.backend.config;

import com.nammapg.backend.entity.*;
import com.nammapg.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🌱 Starting Data Seeding...");

        // 1. Ensure Roles Exist (Managed by RoleInitializer, but safely fetching them
        // here)
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
        if (pgRepository.count() == 0 && owner1 != null && owner2 != null) {
            // PG 1 (Approved)
            Pg pg1 = new Pg();
            pg1.setName("Sunrise Luxury PG");
            pg1.setDescription("A premium PG with all amenities in Koramangala.");
            pg1.setGender("BOYS");
            pg1.setTotalFloors(4);
            pg1.setTotalRooms(20);
            pg1.setCity("Bangalore");
            pg1.setArea("Koramangala");
            pg1.setOwner(owner1);
            pg1.setRating(4.5);
            pg1.setActive(true); // Treat as Approved/Active
            pg1.setCreatedAt(LocalDateTime.now().minusMonths(2));
            pgRepository.save(pg1);

            Pg pg2 = new Pg();
            pg2.setName("Green View Stay");
            pg2.setDescription("Affordable stay near Indiranagar metro.");
            pg2.setGender("GIRLS");
            pg2.setTotalFloors(2);
            pg2.setTotalRooms(10);
            pg2.setCity("Bangalore");
            pg2.setArea("Indiranagar");
            pg2.setOwner(owner1);
            pg2.setRating(0.0);
            pg2.setActive(false); // Pending/Inactive
            pg2.setCreatedAt(LocalDateTime.now().minusDays(5));
            pgRepository.save(pg2);

            // PG 3
            Pg pg3 = new Pg();
            pg3.setName("Elite Mens PG");
            pg3.setDescription("High class stay for professionals.");
            pg3.setGender("BOYS");
            pg3.setTotalFloors(5);
            pg3.setTotalRooms(25);
            pg3.setCity("Bangalore");
            pg3.setArea("HSR Layout");
            pg3.setOwner(owner2);
            pg3.setRating(4.8);
            pg3.setActive(true);
            pg3.setCreatedAt(LocalDateTime.now().minusMonths(5));
            pgRepository.save(pg3);

            System.out.println("✅ Seeded 3 PGs");

            // 4. Seed Issues
            if (issueRepository.count() == 0 && user1 != null) {
                Issue issue1 = new Issue();
                issue1.setTitle("Water leakage in bathroom");
                issue1.setDescription("Room 101 bathroom tap is leaking continuously.");
                issue1.setIssueType("WATER");
                issue1.setPriority("HIGH");
                issue1.setStatus("OPEN");
                issue1.setReportedAt(LocalDateTime.now().minusDays(1));
                issue1.setUser(user1);
                issue1.setPg(pg1);
                issueRepository.save(issue1);

                Issue issue2 = new Issue();
                issue2.setTitle("WiFi not working");
                issue2.setDescription("Internet speed is very slow since yesterday.");
                issue2.setIssueType("WIFI");
                issue2.setPriority("MEDIUM");
                issue2.setStatus("IN_PROGRESS");
                issue2.setReportedAt(LocalDateTime.now().minusDays(2));
                issue2.setUser(user1);
                issue2.setPg(pg1);
                issueRepository.save(issue2);

                System.out.println("✅ Seeded 2 Issues");
            }
        }
    }

    private User createUser(String username, String email, String password, Role role) {
        User user = new User();
        user.setUsername(username);
        user.setFullName(username);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);
        return userRepository.save(user);
    }
}

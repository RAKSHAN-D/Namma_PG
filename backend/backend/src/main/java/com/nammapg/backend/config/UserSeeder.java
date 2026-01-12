package com.nammapg.backend.config;

import com.nammapg.backend.entity.Role;
import com.nammapg.backend.entity.User;
import com.nammapg.backend.repository.RoleRepository;
import com.nammapg.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;

@Configuration
@Order(2) // Run after RoleInitializer
public class UserSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default PG Owner if not exists
        if (!userRepository.existsByEmail("owner@nammapg.com")) {
            User owner = new User();
            owner.setUsername("pgowner");
            owner.setFullName("Rajesh Kumar");
            owner.setEmail("owner@nammapg.com");
            owner.setPassword(passwordEncoder.encode("password123"));

            Role ownerRole = roleRepository.findByName("ROLE_PG_OWNER")
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

            Set<Role> roles = new HashSet<>();
            roles.add(ownerRole);
            owner.setRoles(roles);

            userRepository.save(owner);
            System.out.println("✅ Default PG Owner created: owner@nammapg.com / password123");
        }

        // Create default Admin if not exists
        if (!userRepository.existsByEmail("admin@nammapg.com")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setFullName("Admin User");
            admin.setEmail("admin@nammapg.com");
            admin.setPassword(passwordEncoder.encode("admin123"));

            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("✅ Default Admin created: admin@nammapg.com / admin123");
        }

        // Create default User if not exists
        if (!userRepository.existsByEmail("user@nammapg.com")) {
            User user = new User();
            user.setUsername("pguser");
            user.setFullName("Test User");
            user.setEmail("user@nammapg.com");
            user.setPassword(passwordEncoder.encode("user123"));

            Role userRole = roleRepository.findByName("ROLE_PG_USER")
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

            Set<Role> roles = new HashSet<>();
            roles.add(userRole);
            user.setRoles(roles);

            userRepository.save(user);
            System.out.println("✅ Default User created: user@nammapg.com / user123");
        }
    }
}

package com.nammapg.backend.config;

import com.nammapg.backend.entity.Role;
import com.nammapg.backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.HashSet;

@Configuration
public class RoleInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findByName("ROLE_PG_USER").isEmpty()) {
            roleRepository.save(new Role(null, "ROLE_PG_USER", new HashSet<>()));
        }

        if (roleRepository.findByName("ROLE_PG_OWNER").isEmpty()) {
            roleRepository.save(new Role(null, "ROLE_PG_OWNER", new HashSet<>()));
        }

        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            roleRepository.save(new Role(null, "ROLE_ADMIN", new HashSet<>()));
        }
    }
}

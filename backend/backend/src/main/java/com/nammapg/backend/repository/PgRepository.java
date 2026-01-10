package com.nammapg.backend.repository;

import com.nammapg.backend.entity.Pg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PgRepository extends JpaRepository<Pg, Long> {
    List<Pg> findByOwnerId(Long ownerId);
    // Add more custom queries if needed later
}

package com.nammapg.backend.repository;

import com.nammapg.backend.entity.Pg;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface PgRepository extends JpaRepository<Pg, Long> {
    List<Pg> findByOwnerId(Long ownerId);

    @Query("SELECT p FROM Pg p JOIN FETCH p.owner")
    List<Pg> findAllWithOwners();

    @Query("SELECT p FROM Pg p LEFT JOIN FETCH p.owner LEFT JOIN FETCH p.food LEFT JOIN FETCH p.facilities WHERE p.id = :id")
    java.util.Optional<Pg> findByIdWithDetails(@Param("id") Long id);

    long countByActiveTrue();
}

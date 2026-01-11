package com.nammapg.backend.repository;

import com.nammapg.backend.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.nammapg.backend.entity.Pg;
import java.util.Optional;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    Optional<Food> findByPg(Pg pg);
}

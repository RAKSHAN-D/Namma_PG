package com.nammapg.backend.repository;

import com.nammapg.backend.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByPgId(Long pgId);

    List<Issue> findByUserId(Long userId);
}

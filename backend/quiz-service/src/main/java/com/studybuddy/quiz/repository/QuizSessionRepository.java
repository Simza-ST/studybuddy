package com.studybuddy.quiz.repository;

import com.studybuddy.quiz.entity.QuizSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface QuizSessionRepository extends JpaRepository<QuizSession, UUID> {
    List<QuizSession> findByUserId(Long userId);
    List<QuizSession> findByMaterialId(UUID materialId);
    Optional<QuizSession> findByIdAndUserId(UUID id, Long userId);
}

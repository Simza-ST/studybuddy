package com.studybuddy.upload.repository;

import com.studybuddy.upload.entity.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MaterialRepository extends JpaRepository<Material, UUID> {
    List<Material> findByUserId(Long userId);
    List<Material> findByUserIdOrderByUploadedAtDesc(Long userId);
}

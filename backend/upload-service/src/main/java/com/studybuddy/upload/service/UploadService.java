package com.studybuddy.upload.service;

import com.studybuddy.upload.entity.Material;
import com.studybuddy.upload.repository.MaterialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UploadService {
    private final MaterialRepository materialRepository;
    private final StorageService storageService;
    private final Tika tika;

    @Value("${minio.bucket:materials}")
    private String bucket;

    /**
     * Upload material and extract text
     */
    public Material uploadMaterial(Long userId, String title, MultipartFile file) {
        try {
            // Detect file type
            String mimeType = tika.detect(file.getInputStream());
            String fileType = detectFileType(mimeType);

            // Upload to MinIO/S3
            String fileKey = UUID.randomUUID().toString();
            String fileUrl = storageService.uploadFile(bucket, fileKey, file);

            // Extract text using Tika
            String extractedText = extractText(file);
            int textLength = extractedText.length();
            int chunkCount = calculateChunks(textLength);

            // TODO: Send to RabbitMQ for async processing
            // Queue for Gemini question generation

            // Save material metadata
            Material material = Material.builder()
                    .userId(userId)
                    .title(title)
                    .type(fileType)
                    .url(fileUrl)
                    .textLength(textLength)
                    .chunkCount(chunkCount)
                    .build();

            return materialRepository.save(material);
        } catch (IOException e) {
            log.error("Error processing file: {}", e.getMessage());
            throw new RuntimeException("File processing failed: " + e.getMessage());
        }
    }

    /**
     * Get user's materials
     */
    public List<Material> getUserMaterials(Long userId) {
        return materialRepository.findByUserIdOrderByUploadedAtDesc(userId);
    }

    /**
     * Extract text from file using Tika
     */
    private String extractText(MultipartFile file) {
        try {
            return tika.parseToString(file.getInputStream());
        } catch (IOException | org.apache.tika.exception.TikaException e) {
            log.error("Tika parsing error: {}", e.getMessage());
            return "";
        }
    }

    /**
     * Detect file type from MIME type
     */
    private String detectFileType(String mimeType) {
        if (mimeType.contains("pdf")) return "pdf";
        if (mimeType.contains("word") || mimeType.contains("wordprocessingml")) return "docx";
        if (mimeType.contains("image")) return "image";
        return "text";
    }

    /**
     * Calculate number of chunks (approx 800 tokens each)
     */
    private int calculateChunks(int textLength) {
        // Approximate: 1 token ≈ 4 characters
        int tokens = textLength / 4;
        return Math.max(1, tokens / 800);
    }
}

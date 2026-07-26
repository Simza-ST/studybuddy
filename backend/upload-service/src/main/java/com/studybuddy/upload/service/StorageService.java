package com.studybuddy.upload.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Abstraction for object storage (MinIO or AWS S3)
 */
public interface StorageService {
    /**
     * Upload file to storage
     * @return URL of uploaded file
     */
    String uploadFile(String bucket, String key, MultipartFile file);

    /**
     * Download file from storage
     */
    byte[] downloadFile(String bucket, String key);

    /**
     * Delete file from storage
     */
    void deleteFile(String bucket, String key);

    /**
     * Check if file exists
     */
    boolean fileExists(String bucket, String key);
}

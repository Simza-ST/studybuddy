package com.studybuddy.upload.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UploadController {

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Upload service is running");
    }

    @PostMapping("/materials")
    public ResponseEntity<Object> uploadMaterial() {
        // TODO: Implement file upload with Tika parsing
        return ResponseEntity.ok(new Object() {
            public String status = "upload endpoint ready";
        });
    }
}

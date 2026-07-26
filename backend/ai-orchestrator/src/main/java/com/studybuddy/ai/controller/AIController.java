package com.studybuddy.ai.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AIController {

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("AI Orchestrator is running");
    }

    @PostMapping("/generate-questions")
    public ResponseEntity<Object> generateQuestions() {
        // TODO: Implement Gemini API integration for quiz generation
        return ResponseEntity.ok(new Object() {
            public String status = "ai endpoint ready";
        });
    }
}

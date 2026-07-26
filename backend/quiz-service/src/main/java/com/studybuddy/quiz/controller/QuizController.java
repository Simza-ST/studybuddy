package com.studybuddy.quiz.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/quiz")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class QuizController {

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Quiz service is running");
    }

    @PostMapping("/start")
    public ResponseEntity<Object> startQuiz() {
        // TODO: Implement quiz session creation
        return ResponseEntity.ok(new Object() {
            public String status = "quiz endpoint ready";
        });
    }
}

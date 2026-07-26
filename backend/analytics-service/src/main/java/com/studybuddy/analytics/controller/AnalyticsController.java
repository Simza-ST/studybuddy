package com.studybuddy.analytics.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/analytics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AnalyticsController {

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Analytics service is running");
    }

    @GetMapping("/summary")
    public ResponseEntity<Object> getAnalyticsSummary() {
        // TODO: Implement analytics aggregation
        return ResponseEntity.ok(new Object() {
            public String status = "analytics endpoint ready";
        });
    }
}

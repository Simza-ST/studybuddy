package com.studybuddy.ai.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Service to interact with Gemini 1.5 Flash API
 * TODO: Implement when google-generativeai SDK is available
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiService {
    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String model;

    /**
     * Generate quiz questions from material text
     */
    public String generateQuestions(String materialText, int numQuestions) {
        if (apiKey == null || apiKey.isBlank()) {
            log.info("Gemini API key is not set; using mock question generator");
            return generateMockQuestions(numQuestions);
        }

        try {
            // TODO: Implement Gemini API call
            // Using google-generativeai library when available
            
            String prompt = buildPrompt(materialText, numQuestions);
            log.info("Generating {} questions from material (length: {})", numQuestions, materialText.length());
            
            // Call Gemini API
            // GenerativeModel model = new GenerativeModel(this.model, apiKey);
            // Content response = model.generateContent(prompt);
            
            return generateMockQuestions(numQuestions);
        } catch (Exception e) {
            log.error("Error generating questions with Gemini: {}", e.getMessage());
            return generateMockQuestions(numQuestions);
        }
    }

    /**
     * Build prompt for Gemini
     */
    private String buildPrompt(String materialText, int numQuestions) {
        return String.format("""
            Analyze the following study material and generate exactly %d quiz questions in JSON format.
            Include a mix of: MCQ (50%%), short-answer (30%%), long-answer (20%%).
            
            For each question, provide:
            - type: "mcq", "short-answer", or "long-answer"
            - text: the question
            - options: [array of 4 options] (for MCQ only)
            - correctAnswer: the correct answer
            - difficulty: "easy", "medium", or "hard"
            - topic: the topic area
            - explanation: detailed explanation of the correct answer
            
            Return as a valid JSON array with key "questions".
            
            Material:
            %s
            """, numQuestions, materialText);
    }

    /**
     * Mock question generator for testing (before Gemini API integration)
     */
    private String generateMockQuestions(int count) {
        StringBuilder json = new StringBuilder("{\"questions\": [");
        
        for (int i = 0; i < count; i++) {
            if (i > 0) json.append(",");
            
            String type = i % 5 == 0 ? "mcq" : (i % 3 == 0 ? "long-answer" : "short-answer");
            
            json.append(String.format("""
                {
                  "type": "%s",
                  "text": "Sample question %d?",
                  "options": %s,
                  "correctAnswer": "Answer",
                  "difficulty": "%s",
                  "topic": "Topic",
                  "explanation": "This is a sample question for testing."
                }
                """, 
                type, 
                i + 1,
                type.equals("mcq") ? "[\"A\", \"B\", \"C\", \"D\"]" : "null",
                i % 3 == 0 ? "hard" : (i % 2 == 0 ? "medium" : "easy")
            ));
        }
        
        json.append("]}");
        return json.toString();
    }
}

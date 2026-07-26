package com.studybuddy.quiz.service;

import com.studybuddy.quiz.entity.Question;
import com.studybuddy.quiz.entity.QuizSession;
import com.studybuddy.quiz.repository.QuestionRepository;
import com.studybuddy.quiz.repository.QuizSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class QuizService {
    private final QuizSessionRepository sessionRepository;
    private final QuestionRepository questionRepository;

    /**
     * Start a new quiz session
     */
    public QuizSession startQuiz(Long userId, UUID materialId) {
        long questionCount = questionRepository.countByMaterialId(materialId);
        
        if (questionCount == 0) {
            throw new RuntimeException("No questions available for this material. Wait for question generation to complete.");
        }

        QuizSession session = QuizSession.builder()
                .userId(userId)
                .materialId(materialId)
                .totalQuestions((int) questionCount)
                .score(0)
                .build();

        return sessionRepository.save(session);
    }

    /**
     * Get quiz questions for a session
     */
    public List<Question> getSessionQuestions(UUID sessionId, Long userId) {
        QuizSession session = sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new RuntimeException("Quiz session not found"));
        
        return questionRepository.findByMaterialId(session.getMaterialId());
    }

    /**
     * Grade an answer and return result
     */
    public boolean gradeAnswer(UUID sessionId, UUID questionId, String userAnswer) {
        Question question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        // For MCQ and short-answer: exact/fuzzy match
        // For long-answer: would use Gemini semantic grading
        boolean isCorrect = compareAnswers(userAnswer, question.getCorrectAnswer(), question.getType());
        
        log.info("Answer graded: question={}, correct={}", questionId, isCorrect);
        return isCorrect;
    }

    /**
     * Complete quiz session
     */
    public QuizSession completeQuiz(UUID sessionId, Long userId, Integer score) {
        QuizSession session = sessionRepository.findByIdAndUserId(sessionId, userId)
                .orElseThrow(() -> new RuntimeException("Quiz session not found"));

        session.setScore(score);
        session.setCompletedAt(LocalDateTime.now());
        
        return sessionRepository.save(session);
    }

    /**
     * Get user's quiz history
     */
    public List<QuizSession> getUserHistory(Long userId) {
        return sessionRepository.findByUserId(userId);
    }

    /**
     * Compare user answer with correct answer
     */
    private boolean compareAnswers(String userAnswer, String correctAnswer, String questionType) {
        if (userAnswer == null || correctAnswer == null) return false;

        String user = userAnswer.trim().toLowerCase();
        String correct = correctAnswer.trim().toLowerCase();

        if ("mcq".equals(questionType)) {
            return user.equals(correct);
        } else if ("short-answer".equals(questionType)) {
            // Fuzzy matching (Levenshtein distance)
            int distance = levenshteinDistance(user, correct);
            int maxLength = Math.max(user.length(), correct.length());
            return distance <= Math.ceil(maxLength * 0.1); // Allow 10% error
        }

        // Long-answer: will be graded by Gemini
        return false;
    }

    /**
     * Calculate Levenshtein distance for fuzzy matching
     */
    private int levenshteinDistance(String s1, String s2) {
        int[][] dp = new int[s1.length() + 1][s2.length() + 1];

        for (int i = 0; i <= s1.length(); i++) dp[i][0] = i;
        for (int j = 0; j <= s2.length(); j++) dp[0][j] = j;

        for (int i = 1; i <= s1.length(); i++) {
            for (int j = 1; j <= s2.length(); j++) {
                if (s1.charAt(i - 1) == s2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
                }
            }
        }

        return dp[s1.length()][s2.length()];
    }
}

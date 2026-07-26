import { useEffect, useState } from 'react';
import { useQuizStore } from '../../store/quiz';
import { apiClient } from '../../api/client';

const DIFFICULTY_BADGE: Record<string, string> = {
  easy: 'badge-green',
  medium: 'badge-orange',
  hard: 'badge-red',
};

const TYPE_BADGE: Record<string, string> = {
  mcq: 'badge-blue',
  'short-answer': 'badge-purple',
  'long-answer': 'badge-slate',
};

export default function QuizPage() {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    currentSession, currentQuestions, currentQuestionIndex,
    recordAnswer, answers, nextQuestion, previousQuestion,
    resetQuiz, startSession,
  } = useQuizStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.getMaterials();
        setMaterials(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleStartQuiz = async (materialId: string) => {
    try {
      const response = await apiClient.startQuiz(materialId);
      if (response?.session && response?.questions) {
        startSession(response.session, response.questions);
      } else {
        window.alert('Quiz session could not be created. Please try again.');
      }
    } catch {
      window.alert('Error starting quiz. Please try again.');
    }
  };

  const handleFinishQuiz = async () => {
    if (!currentSession) return;
    try {
      await apiClient.completeQuiz(currentSession.id);
      resetQuiz();
      window.alert('Quiz completed! Your results have been saved.');
    } catch {
      window.alert('Could not complete the quiz. Please try again.');
    }
  };

  /* ── Active quiz view ── */
  if (currentSession && currentQuestions.length > 0) {
    const question = currentQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    const answered = answers[question.id];

    return (
      <div className="max-w-2xl mx-auto space-y-6 fade-up">
        {/* Header */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                Question {currentQuestionIndex + 1} of {currentQuestions.length}
              </p>
              <h2 className="mt-1 text-lg font-bold text-slate-900">{question.topic}</h2>
            </div>
            <button
              type="button"
              onClick={resetQuiz}
              className="btn-muted px-4 py-2 rounded-xl text-sm"
            >
              Exit
            </button>
          </div>
          {/* Progress */}
          <div className="progress-track">
            <div className="progress-fill bg-blue-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-slate-400">{currentQuestionIndex + 1} answered</span>
            <span className="text-xs text-slate-400">{currentQuestions.length - currentQuestionIndex - 1} remaining</span>
          </div>
        </div>

        {/* Question */}
        <div className="card p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`badge ${DIFFICULTY_BADGE[question.difficulty] ?? 'badge-slate'}`}>
              {question.difficulty}
            </span>
            <span className={`badge ${TYPE_BADGE[question.type] ?? 'badge-slate'}`}>
              {question.type}
            </span>
          </div>
          <p className="text-lg font-semibold text-slate-900 leading-relaxed">{question.text}</p>
        </div>

        {/* MCQ options */}
        {question.type === 'mcq' && (
          <div className="space-y-3">
            {question.options?.map((option: string, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => recordAnswer(question.id, option)}
                className={`w-full rounded-xl border-2 p-4 text-left text-sm font-medium transition ${
                  answered === option
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50/40'
                }`}
              >
                <span className="inline-flex w-7 h-7 rounded-full border-2 border-current items-center justify-center text-xs font-bold mr-3">
                  {String.fromCharCode(65 + i)}
                </span>
                {option}
              </button>
            ))}
          </div>
        )}

        {/* Short / long answer */}
        {(question.type === 'short-answer' || question.type === 'long-answer') && (
          <div className="card p-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Your Answer</label>
            <textarea
              rows={question.type === 'long-answer' ? 6 : 3}
              className="input-field resize-none"
              placeholder="Type your answer here…"
              value={answered ?? ''}
              onChange={(e) => recordAnswer(question.id, e.target.value)}
            />
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {currentQuestionIndex > 0 && (
            <button
              type="button"
              onClick={previousQuestion}
              className="btn-secondary flex-1 py-3 rounded-xl text-sm font-semibold"
            >
              ← Previous
            </button>
          )}
          <button
            type="button"
            onClick={currentQuestionIndex === currentQuestions.length - 1 ? handleFinishQuiz : nextQuestion}
            className="btn-primary flex-1 py-3 rounded-xl text-sm font-semibold"
          >
            {currentQuestionIndex === currentQuestions.length - 1 ? '🏁 Finish Quiz' : 'Next →'}
          </button>
        </div>
      </div>
    );
  }

  /* ── Material selection view ── */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 p-8 text-white fade-up">
        <p className="text-blue-300 text-sm font-medium">Quiz Center</p>
        <h2 className="mt-1 text-2xl font-bold">Start a New Quiz</h2>
        <p className="mt-2 text-slate-300 text-sm max-w-lg">
          Select a study material below to generate an AI-powered quiz session. Questions are tailored to your uploaded content.
        </p>
      </div>

      {/* Materials grid */}
      <div className="card p-6 fade-up">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-slate-900">Your Study Materials</h3>
          <span className="badge badge-slate">{materials.length} available</span>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}
          </div>
        ) : materials.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {materials.map((m: any) => (
              <div
                key={m.id}
                className="card card-hover rounded-2xl p-5 flex flex-col gap-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{m.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(m.uploadedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="badge badge-slate flex-shrink-0">{m.type?.toUpperCase()}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartQuiz(m.id)}
                  className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold"
                >
                  🎯 Start Quiz
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <p className="text-4xl">📭</p>
            <p className="mt-3 text-sm font-medium text-slate-500">No materials available</p>
            <p className="text-xs text-slate-400 mt-1">Upload a study document first to create a quiz</p>
          </div>
        )}
      </div>
    </div>
  );
}

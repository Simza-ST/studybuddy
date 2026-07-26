import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { apiClient } from '../../api/client';

const FILE_TYPE_COLORS: Record<string, string> = {
  pdf: 'badge-red',
  docx: 'badge-blue',
  text: 'badge-slate',
  image: 'badge-purple',
};

const FILE_TYPE_ICONS: Record<string, string> = {
  pdf: '📄',
  docx: '📝',
  text: '📃',
  image: '🖼️',
};

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="card p-6 fade-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-lg ${accent}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user } = useAuthStore();
  const [materials, setMaterials] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [matRes, anaRes] = await Promise.allSettled([
          apiClient.getMaterials(),
          apiClient.getAnalytics(),
        ]);
        if (matRes.status === 'fulfilled') setMaterials(matRes.value.data || []);
        if (anaRes.status === 'fulfilled') setAnalytics(anaRes.value.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const stats = [
    {
      label: 'Quizzes Completed',
      value: analytics?.quizzesCompleted ?? '—',
      sub: 'All time',
      accent: 'bg-blue-500 shadow-blue-200',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: 'Average Score',
      value: analytics ? `${analytics.averageScore?.toFixed(0) ?? 0}%` : '—',
      sub: 'Across all quizzes',
      accent: 'bg-emerald-500 shadow-emerald-200',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: 'Study Streak',
      value: analytics ? `${analytics.streakDays ?? 0}d` : '—',
      sub: 'Keep it going!',
      accent: 'bg-orange-500 shadow-orange-200',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
    },
    {
      label: 'Materials Uploaded',
      value: loading ? '—' : materials.length,
      sub: 'Study documents',
      accent: 'bg-violet-500 shadow-violet-200',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
  ];

  const quickActions = [
    { label: 'Start a Quiz', to: '/quiz', color: 'btn-primary', icon: '🎯' },
    { label: 'Upload Material', to: '/upload', color: 'btn-secondary', icon: '📤' },
    { label: 'View Analytics', to: '/analytics', color: 'btn-secondary', icon: '📊' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 p-8 text-white shadow-xl fade-up">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-blue-300 text-sm font-medium">Welcome back 👋</p>
            <h2 className="mt-1 text-2xl font-bold">{user?.name ?? 'Student'}</h2>
            <p className="mt-2 text-slate-300 text-sm max-w-md">
              You're on track. Keep uploading materials and completing quizzes to strengthen your knowledge.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className={`${a.color} inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold`}
              >
                <span>{a.icon}</span>
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Recent materials + activity */}
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Recent materials */}
        <div className="card p-6 fade-up">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Recent Materials</h2>
              <p className="text-xs text-slate-400 mt-0.5">Your latest uploaded study documents</p>
            </div>
            <Link to="/upload" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              + Upload new
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-16 w-full" />
              ))}
            </div>
          ) : materials.length > 0 ? (
            <div className="space-y-3">
              {materials.slice(0, 6).map((m: any) => (
                <div
                  key={m.id}
                  className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 hover:bg-slate-100 transition"
                >
                  <span className="text-2xl">{FILE_TYPE_ICONS[m.type] ?? '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{m.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(m.uploadedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`badge ${FILE_TYPE_COLORS[m.type] ?? 'badge-slate'}`}>
                    {m.type?.toUpperCase() ?? 'FILE'}
                  </span>
                  <Link
                    to="/quiz"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
                  >
                    Quiz →
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-14 text-center">
              <p className="text-4xl">📚</p>
              <p className="mt-3 text-sm font-medium text-slate-500">No materials yet</p>
              <p className="text-xs text-slate-400 mt-1">Upload a PDF, DOCX, or image to get started</p>
              <Link
                to="/upload"
                className="btn-primary inline-flex mt-4 px-5 py-2 rounded-xl text-sm font-semibold"
              >
                Upload now
              </Link>
            </div>
          )}
        </div>

        {/* Activity panel */}
        <div className="space-y-5">
          {/* Score ring */}
          <div className="card p-6 fade-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Overall Score</p>
            <div className="relative inline-flex items-center justify-center w-28 h-28 mx-auto">
              <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="#3b82f6" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - (analytics?.averageScore ?? 0) / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <span className="absolute text-2xl font-bold text-slate-900">
                {analytics?.averageScore?.toFixed(0) ?? 0}%
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500">Average quiz performance</p>
          </div>

          {/* Tips */}
          <div className="card p-6 fade-up">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Study Tips</p>
            <ul className="space-y-3">
              {[
                { icon: '⏱️', tip: 'Study in 25-min focused blocks (Pomodoro).' },
                { icon: '🔁', tip: 'Revisit weak topics after each quiz.' },
                { icon: '📅', tip: 'Upload new material at least 3× per week.' },
              ].map((t) => (
                <li key={t.tip} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="text-base mt-0.5">{t.icon}</span>
                  {t.tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

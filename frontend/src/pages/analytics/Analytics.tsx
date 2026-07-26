import { useEffect, useState } from 'react';
import { apiClient } from '../../api/client';

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function KpiCard({
  label,
  value,
  icon,
  accent,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
  sub?: string;
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

function strengthColor(v: number) {
  if (v >= 70) return '#22c55e';
  if (v >= 40) return '#f97316';
  return '#ef4444';
}

function strengthBadge(v: number) {
  if (v >= 70) return 'badge-green';
  if (v >= 40) return 'badge-orange';
  return 'badge-red';
}

function strengthLabel(v: number) {
  if (v >= 70) return 'Strong';
  if (v >= 40) return 'Moderate';
  return 'Needs work';
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [aRes, tRes] = await Promise.allSettled([
          apiClient.getAnalytics(),
          apiClient.getTopicStrength(),
        ]);
        if (aRes.status === 'fulfilled') setAnalytics(aRes.value.data);
        if (tRes.status === 'fulfilled') setTopics(tRes.value.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  const kpis = [
    {
      label: 'Average Score',
      value: `${analytics?.averageScore?.toFixed(1) ?? 0}%`,
      sub: 'All quizzes',
      accent: 'bg-blue-500 shadow-blue-200',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      label: 'Quizzes Done',
      value: analytics?.quizzesCompleted ?? 0,
      sub: 'Total sessions',
      accent: 'bg-emerald-500 shadow-emerald-200',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Study Streak',
      value: `${analytics?.streakDays ?? 0} days`,
      sub: 'Current streak',
      accent: 'bg-orange-500 shadow-orange-200',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
    },
    {
      label: 'Time Studied',
      value: `${analytics?.totalTimeSpent ?? 0}h`,
      sub: 'Total hours',
      accent: 'bg-violet-500 shadow-violet-200',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  // Mock weekly activity bars (replace with real data when available)
  const weekActivity = WEEK_DAYS.map((d) => ({
    day: d,
    value: Math.floor(Math.random() * 90) + 10,
  }));

  return (
    <div className="space-y-8">
      {/* KPI row */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Left column */}
        <div className="space-y-6">
          {/* Weekly activity */}
          <div className="card p-6 fade-up">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Weekly Activity</h2>
                <p className="text-xs text-slate-400 mt-0.5">Quiz sessions this week</p>
              </div>
              <span className="badge badge-blue">This week</span>
            </div>
            <div className="flex items-end gap-3 h-36">
              {weekActivity.map(({ day, value }) => (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-blue-500 opacity-80 hover:opacity-100 transition"
                    style={{ height: `${value}%` }}
                    title={`${value}%`}
                  />
                  <span className="text-xs text-slate-400 font-medium">{day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Topic strength */}
          <div className="card p-6 fade-up">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Topic Strength</h2>
                <p className="text-xs text-slate-400 mt-0.5">Performance breakdown by subject</p>
              </div>
            </div>

            {topics.length > 0 ? (
              <div className="space-y-5">
                {topics.map((topic: any, i: number) => {
                  const pct = topic.strength ?? 0;
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700">{topic.name}</span>
                        <div className="flex items-center gap-2">
                          <span className={`badge ${strengthBadge(pct)}`}>{strengthLabel(pct)}</span>
                          <span className="text-sm font-bold text-slate-900">{pct.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${pct}%`, backgroundColor: strengthColor(pct) }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
                <p className="text-4xl">📈</p>
                <p className="mt-3 text-sm font-medium text-slate-500">No topic data yet</p>
                <p className="text-xs text-slate-400 mt-1">Complete more quizzes to see your strengths</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Score ring */}
          <div className="card p-6 fade-up text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Overall Score</p>
            <div className="relative inline-flex items-center justify-center w-32 h-32 mx-auto">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="38" fill="none"
                  stroke="#3b82f6" strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 38}`}
                  strokeDashoffset={`${2 * Math.PI * 38 * (1 - (analytics?.averageScore ?? 0) / 100)}`}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <span className="absolute text-2xl font-bold text-slate-900">
                {analytics?.averageScore?.toFixed(0) ?? 0}%
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-500">Average quiz performance</p>
          </div>

          {/* Leaderboard placeholder */}
          <div className="card p-6 fade-up">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Top Performers</p>
            <div className="space-y-3">
              {[
                { rank: 1, name: 'You', score: analytics?.averageScore?.toFixed(0) ?? 0, medal: '🥇' },
                { rank: 2, name: 'Jordan M.', score: 88, medal: '🥈' },
                { rank: 3, name: 'Samira K.', score: 82, medal: '🥉' },
              ].map((p) => (
                <div key={p.rank} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-lg">{p.medal}</span>
                  <span className="flex-1 text-sm font-medium text-slate-700">{p.name}</span>
                  <span className="text-sm font-bold text-slate-900">{p.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insight card */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-900 to-blue-900 p-6 text-white fade-up">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-300 mb-3">AI Insight</p>
            <p className="text-sm leading-relaxed text-slate-200">
              {topics.length > 0
                ? `Your strongest topic is <strong>${topics.sort((a, b) => b.strength - a.strength)[0]?.name}</strong>. Focus on weaker areas to boost your overall score.`
                : 'Complete more quizzes to unlock personalised AI-powered study insights.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Navigation from './components/Navigation';
import HomePage from './pages/home/Home';
import QuizPage from './pages/quiz/Quiz';
import UploadPage from './pages/upload/Upload';
import AnalyticsPage from './pages/analytics/Analytics';
import LandingPage from './pages/landing/Landing';
import './index.css';

const PAGE_TITLES: Record<string, string> = {
  '/home': 'Dashboard',
  '/upload': 'Upload Material',
  '/quiz': 'Quiz Center',
  '/analytics': 'Analytics',
};

function TopBar() {
  const location = useLocation();
  const { user } = useAuthStore();
  const title = PAGE_TITLES[location.pathname] ?? 'StudyBuddy';
  const now = new Date();
  const greeting =
    now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="topbar">
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">{greeting}</p>
        <h1 className="text-lg font-semibold text-slate-900 leading-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="relative w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-sm"
        >
          <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 border-2 border-white" />
        </button>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {user?.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'SB'}
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="app-shell">
      {isAuthenticated && <Navigation />}
      <div className="main-content">
        {isAuthenticated && <TopBar />}
        <div className="page-body">
          <Routes>
            <Route path="/login"     element={isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage initialMode="login" />} />
            <Route path="/signup"    element={isAuthenticated ? <Navigate to="/home" replace /> : <LandingPage initialMode="signup" />} />
            <Route path="/landing"   element={<LandingPage />} />
            <Route path="/"          element={<Navigate to={isAuthenticated ? '/home' : '/landing'} replace />} />
            <Route path="/home"      element={isAuthenticated ? <HomePage />      : <Navigate to="/landing" replace />} />
            <Route path="/quiz"      element={isAuthenticated ? <QuizPage />      : <Navigate to="/login" replace />} />
            <Route path="/upload"    element={isAuthenticated ? <UploadPage />    : <Navigate to="/login" replace />} />
            <Route path="/analytics" element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" replace />} />
            <Route path="*"          element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

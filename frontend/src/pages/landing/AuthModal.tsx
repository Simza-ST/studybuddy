import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

interface AuthModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onSwitch: (mode: 'login' | 'signup') => void;
}

export default function AuthModal({ mode, onClose, onSwitch }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>(mode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setAuthMode(mode);
    setError('');
  }, [mode]);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const hasEmailError = email.length > 0 && !emailPattern.test(email);
  const hasPasswordError = password.length > 0 && password.length < 8;
  const hasConfirmPasswordError = authMode === 'signup' && confirmPassword.length > 0 && password !== confirmPassword;
  const hasNameError = authMode === 'signup' && nameTouched && name.trim().length === 0;

  const isLoginDisabled = !email || !password || hasEmailError || hasPasswordError;
  const isSignupDisabled =
    !name || !email || !password || !confirmPassword || hasNameError || hasEmailError || hasPasswordError || hasConfirmPasswordError;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/home');
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      await signup(email, password, name);
      navigate('/home');
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Unable to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = (nextMode: 'login' | 'signup') => {
    setAuthMode(nextMode);
    onSwitch(nextMode);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 py-6 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        className="relative w-full max-w-2xl overflow-hidden rounded-[32px] border border-slate-200/80 bg-white shadow-[0_40px_120px_rgba(15,23,42,0.18)] ring-1 ring-slate-200/70 transition-transform duration-200 ease-out hover:-translate-y-0.5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative bg-gradient-to-r from-slate-950 via-indigo-700 to-cyan-600 px-8 pr-16 py-7 sm:px-10 sm:pr-24 sm:py-8 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-200">StudyBuddy</p>
              <h2 id="auth-modal-title" className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {authMode === 'login' ? 'Welcome back' : 'Create your student account'}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-cyan-100/90 sm:text-base">
                {authMode === 'login'
                  ? 'Access your dashboard, continue your study sessions, and keep track of progress.'
                  : 'Join a learning workspace built for fast uploads, smart quizzes, and clear analytics.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white shadow-lg transition hover:bg-white/20"
            aria-label="Close modal"
          >
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <div className="bg-slate-50 px-8 py-8 sm:px-10 sm:py-10">
          {error && (
            <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700 shadow-sm">
              {error}
            </div>
          )}

          {authMode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Email</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onBlur={() => setEmailTouched(true)}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError('');
                    }}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                  {hasEmailError && (
                    <p className="mt-2 text-sm text-red-600">Enter a valid email address before continuing.</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Password</label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onBlur={() => setPasswordTouched(true)}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError('');
                    }}
                    className="input-field"
                    placeholder="Enter your password"
                  />
                  {hasPasswordError && (
                    <p className="mt-2 text-sm text-red-600">Use at least 8 characters to keep your account secure.</p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-950 px-5 py-4 text-base font-semibold text-white transition duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                disabled={isLoading || isLoginDisabled}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
              <p className="text-center text-sm text-slate-600">
                Don’t have an account?{' '}
                <button type="button" className="font-semibold text-slate-950 transition hover:text-cyan-600" onClick={() => toggleMode('signup')}>
                  Sign up
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Full Name</label>
                  <input
                    type="text"
                    autoComplete="name"
                    value={name}
                    onBlur={() => setNameTouched(true)}
                    onChange={(event) => {
                      setName(event.target.value);
                      setError('');
                    }}
                    className="input-field"
                    placeholder="Your full name"
                  />
                  {hasNameError && (
                    <p className="mt-2 text-sm text-red-600">Your name helps personalize your dashboard.</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Email</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onBlur={() => setEmailTouched(true)}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      setError('');
                    }}
                    className="input-field"
                    placeholder="you@example.com"
                  />
                  {hasEmailError && (
                    <p className="mt-2 text-sm text-red-600">Enter a valid email so we can keep your account secure.</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onBlur={() => setPasswordTouched(true)}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError('');
                    }}
                    className="input-field"
                    placeholder="Create a password"
                  />
                  {hasPasswordError && (
                    <p className="mt-2 text-sm text-red-600">Use at least 8 characters for a stronger password.</p>
                  )}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-800">Confirm Password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onBlur={() => setConfirmPasswordTouched(true)}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setConfirmPasswordTouched(true);
                      setError('');
                    }}
                    className={`input-field ${hasConfirmPasswordError ? 'border-red-300 ring-1 ring-red-100' : ''}`}
                    placeholder="Repeat your password"
                  />
                  {hasConfirmPasswordError && (
                    <p className="mt-2 text-sm text-red-600">Passwords do not match yet. Please correct them before continuing.</p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-950 px-5 py-4 text-base font-semibold text-white transition duration-200 hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
                disabled={isLoading || isSignupDisabled}
              >
                {isLoading ? 'Creating account...' : 'Sign up'}
              </button>
              <p className="text-center text-sm text-slate-600">
                Already have an account?{' '}
                <button type="button" className="font-semibold text-slate-950 transition hover:text-cyan-600" onClick={() => toggleMode('login')}>
                  Login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

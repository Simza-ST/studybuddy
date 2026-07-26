import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

const features = [
  {
    title: 'Instant quiz creation',
    description: 'Generate practice quizzes from your study materials in seconds.',
  },
  {
    title: 'Track your progress',
    description: 'Visualize your performance and focus on the topics that matter.',
  },
  {
    title: 'Upload study materials',
    description: 'Add PDFs, docs, and notes to build smarter learning sessions.',
  },
];

const testimonials = [
  {
    name: 'Jordan M.',
    role: 'Biology student',
    quote: 'StudyBuddy made it easy to turn notes into quizzes. My review sessions feel sharper and I’m more confident for exams.',
  },
  {
    name: 'Samira K.',
    role: 'Computer science sophomore',
    quote: 'The dashboard helps me see what I need to practice most. It feels polished, calm, and designed for students.',
  },
  {
    name: 'Isaac D.',
    role: 'High school learner',
    quote: 'I love how fast I can upload my notes and start practicing. This is the most useful study tool I’ve tried.',
  },
];

const team = [
  { name: 'Ava Mensah', role: 'Product Lead' },
  { name: 'Nico Patel', role: 'Data Science' },
  { name: 'Sofia Kim', role: 'Customer Success' },
];

export default function LandingPage({ initialMode }: { initialMode?: 'login' | 'signup' }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [modalMode, setModalMode] = useState<'login' | 'signup' | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const headerLinks = useMemo(
    () => [
      { label: 'About', href: '#about' },
      { label: 'Features', href: '#features' },
      { label: 'Contact', href: '#contact' },
    ],
    []
  );

  useEffect(() => {
    if (initialMode) {
      setModalMode(initialMode);
      return;
    }

    if (location.pathname === '/login') {
      setModalMode('login');
    } else if (location.pathname === '/signup') {
      setModalMode('signup');
    } else {
      setModalMode(null);
    }
  }, [initialMode, location.pathname]);

  return (
    <div className="relative overflow-hidden bg-cyan-50 text-slate-900">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm shadow-slate-200/10 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-900">StudyBuddy</p>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-600">Smart study for every student</p>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            {headerLinks.map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setModalMode('login')} className="hidden rounded-full border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 md:inline-flex">
              Login
            </button>
            <button onClick={() => setModalMode('signup')} className="hidden rounded-full bg-cyan-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-cyan-500 md:inline-flex">
              Sign up
            </button>
            <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-100 md:hidden">
              <span className="sr-only">Toggle menu</span>
              {mobileMenuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="menu-slide-down border-t border-slate-200 bg-white px-4 py-4 shadow-lg shadow-slate-200/10 md:hidden">
            <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div className="text-sm font-semibold text-slate-900">Menu</div>
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-slate-100">
                <span className="sr-only">Close menu</span>
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {headerLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  {link.label}
                </a>
              ))}
              <button onClick={() => { setModalMode('login'); setMobileMenuOpen(false); }} className="rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200">
                Login
              </button>
              <button onClick={() => { setModalMode('signup'); setMobileMenuOpen(false); }} className="rounded-full bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-500">
                Sign up
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="space-y-24 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
        <section className="mx-auto max-w-6xl rounded-[36px] bg-indigo-950 px-6 py-16 text-white shadow-[0_40px_120px_rgba(15,23,42,0.35)] sm:px-10 lg:px-14">
          <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full bg-cyan-500/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-200">
                The student productivity hub
              </span>
              <h1 className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
                Learn with clarity, practice with confidence, and stay ahead of every deadline.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                StudyBuddy helps you upload notes, build practice quizzes, and monitor your improvement with beautiful analytics. It’s designed to make focused study feel effortless for students.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button onClick={() => setModalMode('signup')} className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-8 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-400">
                  Start free
                </button>
                <button onClick={() => setModalMode('login')} className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/20">
                  Login
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-[440px] overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl">
                <img src="" alt="StudyBuddy demo interface" className="h-[360px] w-full rounded-[28px] object-cover shadow-2xl transition duration-500 ease-out motion-safe:hover:-translate-y-2" />
                <div className="mt-6 rounded-[28px] bg-indigo-950/90 p-6 text-sm text-slate-200 ring-1 ring-white/10">
                  <p className="font-semibold text-white">Classroom-ready support</p>
                  <p className="mt-2 text-slate-300">Fast uploads, AI-powered quiz prep, and study analytics all inside one clean student dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl relative overflow-hidden rounded-[36px] border border-cyan-200/40 bg-white/90 px-6 py-8 shadow-[0_30px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:px-10 lg:px-14 floating-cta">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-600">Ready to boost your study routine?</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900 sm:text-4xl">A faster path to smarter practice, better focus, and stronger results.</h2>
              <p className="mt-4 max-w-2xl text-slate-600">
                Start your first quiz session, upload notes, or try the dashboard — all in one polished student workspace.
              </p>
            </div>
            <div className="flex justify-start lg:justify-end">
              <button onClick={() => setModalMode('signup')} className="inline-flex items-center justify-center rounded-full bg-cyan-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:bg-cyan-500">
                Start free today
              </button>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-10 top-1/2 hidden h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl lg:block" />
        </section>

        <section id="features" className="section-offset mx-auto max-w-6xl space-y-12">
          <div className="grid gap-6 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="card rounded-[30px] border border-slate-200 p-8 shadow-sm transition-all duration-500 ease-out motion-safe:hover:-translate-y-2 motion-safe:hover:scale-[1.01] hover:shadow-lg">
                <div className="mb-4 inline-flex rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
                  Feature
                </div>
                <h2 className="text-2xl font-semibold text-slate-900">{feature.title}</h2>
                <p className="mt-4 leading-7 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="about" className="section-offset mx-auto max-w-6xl rounded-[36px] bg-white px-8 py-14 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-600">About us</p>
              <h2 className="mt-4 text-4xl font-semibold text-slate-900">A student-first platform built for real learning habits.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                We create tools that help students reduce friction, practice with purpose, and stay motivated through progress tracking. StudyBuddy is designed to make learning more organized and study time more productive.
              </p>
            </div>
            <div className="grid gap-6 rounded-[28px] bg-indigo-950 p-8 text-white shadow-lg">
              <div>
                <h3 className="text-xl font-semibold">Our mission</h3>
                <p className="mt-3 text-cyan-200">Help students move from busywork to meaningful review with automated quiz generation and progress-focused analytics.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">What we value</h3>
                <p className="mt-3 text-cyan-200">Clarity, consistency, and growth. Every feature is built to remove distraction and keep learning goals visible.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Who it’s for</h3>
                <p className="mt-3 text-cyan-200">High school and college students who want more control over their study routine and better outcomes from every review session.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="mx-auto max-w-6xl space-y-10 px-4 sm:px-0">
          <div className="rounded-[28px] bg-white p-10 shadow-lg">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-600">Testimonials</p>
            <h2 className="mt-4 text-4xl font-semibold text-slate-900">What students love about StudyBuddy</h2>
            <p className="mt-4 max-w-2xl text-slate-600 leading-8">
              From fast quiz prep to thoughtful analytics, these stories show how StudyBuddy helps students feel more confident and prepared.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded-[28px] bg-indigo-900 p-8 text-white shadow-lg">
                <p className="text-lg leading-8 text-slate-200">“{testimonial.quote}”</p>
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-cyan-200">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-10 px-4 sm:px-0">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_0.95fr]">
            <div className="rounded-[28px] bg-slate-50 p-10 shadow-lg">
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Student success</p>
              <h2 className="mt-4 text-3xl font-semibold text-slate-900">Go beyond basic review with measurable progress.</h2>
              <p className="mt-6 leading-8 text-slate-600">
                Build confidence through repeated quiz practice, then use analytics to pinpoint weak topics. StudyBuddy turns notes into action, so you can study smarter instead of harder.
              </p>
            </div>
            <div className="grid gap-6 rounded-[28px] border border-slate-200 bg-white p-10 shadow-sm">
              {team.map((member) => (
                <div key={member.name} className="rounded-3xl bg-indigo-950 p-6 text-white">
                  <p className="text-xl font-semibold">{member.name}</p>
                  <p className="mt-2 text-cyan-200">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section-offset mx-auto max-w-6xl rounded-[36px] bg-indigo-950 px-8 py-14 text-white shadow-[0_24px_80px_rgba(15,23,42,0.22)] sm:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">Contact</p>
              <h2 className="mt-4 text-4xl font-semibold">Let’s make learning easier together.</h2>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                Whether you want help with onboarding or have product feedback, our team is ready to support you every step of the way.
              </p>
              <div className="mt-8 space-y-4 text-sm text-slate-300">
                <p>📧 support@studybuddy.com</p>
                <p>📍 120 Learning Lane, Cape Town, ZA</p>
                <p>⏱️ Mon–Fri, 8:00 AM – 6:00 PM</p>
              </div>
            </div>
            <div className="rounded-[28px] bg-white p-8 text-slate-900 shadow-lg">
              <h3 className="text-2xl font-semibold">Get in touch</h3>
              <p className="mt-4 leading-7 text-slate-600">Send us a note and we’ll get back to you within one business day.</p>
              <div className="mt-8 space-y-5 text-sm leading-7 text-slate-700">
                <p className="rounded-3xl bg-slate-50 p-5">Need onboarding help? We can guide your first quiz creation.</p>
                <p className="rounded-3xl bg-slate-50 p-5">Want to request a campus package? Reach out and we’ll connect you with a specialist.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 text-slate-500 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">StudyBuddy</p>
            <p className="text-sm">Student study platform · Better quizzes · Better focus</p>
          </div>
          <p className="text-sm">© 2026 StudyBuddy. All rights reserved.</p>
        </div>
      </footer>

      {modalMode && <AuthModal mode={modalMode} onClose={() => { setModalMode(null); navigate('/landing'); }} onSwitch={setModalMode} />}
    </div>
  );
}

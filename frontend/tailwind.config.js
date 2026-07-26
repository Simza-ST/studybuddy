/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E40AF',
        accent: '#0EA5E9',
        success: '#14B8A6',
        warning: '#F97316',
        danger: '#EF4444',
        surface: '#ffffff',
        card: '#f8fafc',
        muted: '#64748B',
      },
      boxShadow: {
        soft: '0 20px 50px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

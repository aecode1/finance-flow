/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{tsx,ts}', './index.html'],
  theme: {
    extend: {
      colors: {
        base:    '#080C16',
        surface: '#0F1623',
        elevated:'#1A2235',
        border:  '#1E2D45',
        accent:  '#6366F1',
        income:  '#10B981',
        expense: '#F43F5E',
        gold:    '#F59E0B',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      boxShadow: {
        card:   '0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(30,45,69,0.8)',
        glow:   '0 0 24px rgba(99,102,241,0.2)',
        income: '0 0 20px rgba(16,185,129,0.15)',
        expense:'0 0 20px rgba(244,63,94,0.15)',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'tg': {
          'bg': 'var(--tg-theme-bg-color)',
          'text': 'var(--tg-theme-text-color)',
          'hint': 'var(--tg-theme-hint-color)',
          'link': 'var(--tg-theme-link-color)',
          'button': 'var(--tg-theme-button-color)',
          'button-text': 'var(--tg-theme-button-text-color)',
          'secondary-bg': 'var(--tg-theme-secondary-bg-color)',
        }
      }
    },
  },
  plugins: [],
}
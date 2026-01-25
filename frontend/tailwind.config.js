/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 24px -4px rgba(249, 115, 22, 0.4), 0 0 48px -12px rgba(245, 158, 11, 0.25)',
        'card': '0 4px 20px -4px rgba(0,0,0,0.08), 0 2px 8px -2px rgba(0,0,0,0.04)',
        'card-hover': '0 12px 40px -8px rgba(249, 115, 22, 0.15), 0 4px 16px -4px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

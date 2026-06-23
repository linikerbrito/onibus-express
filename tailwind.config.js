/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        success: '#16a34a',
        error: '#dc2626',
      },
      backgroundImage: {
        'gradient-banner': 'linear-gradient(to right, rgba(0,0,0,0.55), rgba(0,0,0,0.15))',
      },
    },
  },
  plugins: [],
};

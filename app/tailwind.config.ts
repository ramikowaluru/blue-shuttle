import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D7A2E',
          dark: '#1F5620',
          light: '#4A9D4B',
        },
        danger: {
          DEFAULT: '#DC2626',
          dark: '#B91C1C',
          light: '#EF4444',
        },
        neutral: {
          bg: '#F5F5F0',
          card: '#FFFFFF',
          border: '#E5E5E0',
        },
      },
    },
  },
  plugins: [],
};

export default config;

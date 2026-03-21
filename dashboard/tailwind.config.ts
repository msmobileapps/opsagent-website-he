import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          50: '#f3f0ff',
          100: '#e9e2ff',
          200: '#d4c7ff',
          300: '#b49dff',
          400: '#9165fd',
          500: '#6C3AED',
          600: '#5b24e0',
          700: '#4c19c4',
          800: '#3f16a0',
          900: '#351483',
          950: '#200a5c',
        },
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        surface: {
          DEFAULT: '#0f0f1a',
          raised: '#1a1a2e',
          overlay: '#252540',
          border: '#2d2d4a',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;

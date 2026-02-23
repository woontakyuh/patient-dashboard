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
        navy: {
          50: '#E8EDF3',
          100: '#C5D0E0',
          200: '#9AAFC8',
          300: '#6F8EB0',
          400: '#4A6D98',
          500: '#1B3A5C',
          600: '#152D48',
          700: '#102236',
          800: '#0B1724',
          900: '#060C13',
        },
        teal: {
          50: '#E6F3F8',
          100: '#C0E1EE',
          200: '#8EC8DE',
          300: '#5CAFCE',
          400: '#3A9ABF',
          500: '#2E86AB',
          600: '#256F8F',
          700: '#1C5873',
          800: '#134157',
          900: '#0A2A3B',
        },
      },
    },
  },
  plugins: [],
};
export default config;

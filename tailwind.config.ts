import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          moss: '#1F3A2E',
          sage: '#82967B',
          cream: '#F4F1E8',
          petal: '#E9D5C9',
          charcoal: '#1A1F1C',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(26, 31, 28, 0.12)',
      },
      backgroundImage: {
        'brand-radial': 'radial-gradient(circle at top right, rgba(233, 213, 201, 0.4), transparent 60%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;

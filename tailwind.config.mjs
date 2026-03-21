/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fef7f4',
          100: '#fdeee8',
          200: '#fad5c7',
          300: '#f5b49a',
          400: '#e88a63',
          500: '#C75B39',
          600: '#a84a2e',
          700: '#8a3c26',
          800: '#6d3020',
          900: '#5a291b',
        },
        umber: {
          50: '#f8f5f3',
          100: '#efe9e4',
          200: '#ddd1c6',
          300: '#c5b1a0',
          400: '#a68a73',
          500: '#8a6e58',
          600: '#6e5645',
          700: '#574438',
          800: '#3B2316',
          900: '#2a1a10',
        },
        cream: {
          50: '#FFFCF9',
          100: '#FAF6F1',
          200: '#F0E6DA',
          300: '#E8DDD3',
          400: '#D4C4B2',
          500: '#B8A48E',
        },
        turmeric: {
          50: '#fdf9ef',
          100: '#faf0d4',
          200: '#f3dfa6',
          300: '#eacc72',
          400: '#D4A843',
          500: '#c49530',
          600: '#a47726',
          700: '#855c21',
          800: '#6c4a20',
          900: '#5a3e1f',
        },
        clay: {
          50: '#FAF6F1',
          100: '#F0E6DA',
          200: '#E8DDD3',
          300: '#D4C4B2',
        },
        charcoal: {
          700: '#2A201A',
          800: '#221A14',
          900: '#1C1614',
          950: '#140F0C',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': theme('colors.umber.800'),
            '--tw-prose-headings': theme('colors.umber.800'),
            '--tw-prose-links': theme('colors.saffron.500'),
            '--tw-prose-bold': theme('colors.umber.800'),
            '--tw-prose-code': theme('colors.saffron.700'),
            '--tw-prose-quotes': theme('colors.umber.600'),
            '--tw-prose-quote-borders': theme('colors.saffron.300'),
            maxWidth: '65ch',
            lineHeight: '1.75',
            a: {
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              '&:hover': {
                color: theme('colors.saffron.600'),
              },
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': theme('colors.cream.300'),
            '--tw-prose-headings': theme('colors.cream.200'),
            '--tw-prose-links': theme('colors.saffron.400'),
            '--tw-prose-bold': theme('colors.cream.200'),
            '--tw-prose-code': theme('colors.saffron.300'),
            '--tw-prose-quotes': theme('colors.cream.400'),
            '--tw-prose-quote-borders': theme('colors.saffron.500'),
          },
        },
      }),
      boxShadow: {
        'warm-sm': '0 1px 3px 0 rgba(59, 35, 22, 0.08), 0 1px 2px -1px rgba(59, 35, 22, 0.08)',
        'warm': '0 4px 12px -1px rgba(59, 35, 22, 0.08), 0 2px 6px -2px rgba(59, 35, 22, 0.06)',
        'warm-lg': '0 10px 25px -3px rgba(59, 35, 22, 0.1), 0 4px 10px -4px rgba(59, 35, 22, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
  content: ['./app/**/*.{ts,tsx}', './content/**/*.mdx', './public/**/*.svg'],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: "#191516",
        light: "#E6E8E6",
        primary: "#512888",
        secondary: "#062A77",
        tertiary: "#B11225"
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        typewriter: {
          from: { width: '0' },
          to: { width: '24em' }
        },
        caret: {
          '50%': { borderColor: 'transparent' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 1s ease-in-out',
        // caret: 'caret 2s steps(1) infinite',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
        'poppins': ['Poppins']

      },
      
      typography: {
        quoteless: {
          css: {
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:first-of-type::after': { content: 'none' },
          },
        },
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    typography,
    function ({ addUtilities }) {
      const newUtilities = {
        '.flashing-caret': {
          'border-right': '1.5px solid',
          'padding-right': '2px',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
} satisfies Config;

import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

export default {
	content: ['./app/**/*.{ts,tsx}', './content/**/*.mdx', './public/**/*.svg'],
	darkMode: ["class", 'class'],
	theme: {
		extend: {
			colors: {
				dark: '#191516',
				light: '#E6E8E6',
				navy: '#355070',
				purple: '#6D597A',
				plum: '#B56576',
				brightRed: '#E56B6F',
				peach: '#EAAC8B',
			},
			keyframes: {
				fadeIn: {
					'0%': {
						opacity: '0'
					},
					'100%': {
						opacity: '1'
					}
				},
				typewriter: {
					from: {
						width: '0'
					},
					to: {
						width: '24em'
					}
				},
				caret: {
					'50%': {
						borderColor: 'transparent'
					}
				}
			},
			animation: {
				fadeIn: 'fadeIn 1s ease-in-out',
			},
			fontFamily: {
				sans: ['var(--font-geist-sans)'],
				mono: ['var(--font-geist-mono)'],
				poppins: ['Poppins']
			},
			typography: {
				quoteless: {
					css: {
						'blockquote p:first-of-type::before': {
							content: 'none'
						},
						'blockquote p:first-of-type::after': {
							content: 'none'
						}
					}
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
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
		},
	],
} satisfies Config;


import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				coach: {
					purple: '#9b87f5',
					'light-purple': '#E5DEFF',
					'dark-purple': '#6E59A5',
					accent: '#FEC6A1',
					'soft-green': '#F2FCE2',
					'soft-blue': '#D3E4FD'
				},
				'bridge-it': {
				  blue: '#0035ff',
				  pink: '#ff3366',
				  white: '#ffffff',
				  yellow: '#ffcc00',
				  'blue-light': '#4d79ff',
				  'pink-light': '#ff6b91',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' }
				},
				'bounce-in': {
					'0%': { 
						transform: 'scale(0.8)', 
						opacity: '0' 
					},
					'70%': { 
						transform: 'scale(1.05)', 
						opacity: '1' 
					},
					'100%': { 
						transform: 'scale(1)', 
						opacity: '1' 
					}
				},
				'twinkle': {
					'0%': { opacity: '0.3' },
					'50%': { opacity: '1' },
					'100%': { opacity: '0.3' }
				},
				'flash-single': {
					'0%': { opacity: '0' },
					'20%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'flash-double': {
					'0%': { opacity: '0' },
					'20%': { opacity: '1' },
					'40%': { opacity: '0' },
					'60%': { opacity: '1' },
					'100%': { opacity: '0' }
				},
				'flash-pulse': {
					'0%': { opacity: '0' },
					'10%': { opacity: '0.8' },
					'20%': { opacity: '0.4' },
					'30%': { opacity: '0.8' },
					'40%': { opacity: '0.4' },
					'50%': { opacity: '0.8' },
					'60%': { opacity: '0.4' },
					'100%': { opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out forwards',
				'bounce-in': 'bounce-in 0.5s ease-out forwards',
				'twinkle': 'twinkle 2s infinite',
				'flash-single': 'flash-single 0.5s ease-out forwards',
				'flash-double': 'flash-double 1s ease-out forwards',
				'flash-pulse': 'flash-pulse 1.5s ease-out forwards'
			},
			fontFamily: {
				'bridge-it': ['Arial', 'sans-serif']
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Premium Deep Graphite Base
                surface: {
                    primary: '#0D0F14',
                    secondary: '#141820',
                    tertiary: '#1A1F2A',
                    elevated: '#1E2432',
                },
                // Electric Blue-Violet Energy Accent
                energy: {
                    DEFAULT: '#6366F1',
                    light: '#818CF8',
                    dark: '#4F46E5',
                    glow: 'rgba(99, 102, 241, 0.4)',
                },
                // Soft Emerald/Teal Sustainability
                eco: {
                    DEFAULT: '#10B981',
                    light: '#34D399',
                    dark: '#059669',
                    glow: 'rgba(16, 185, 129, 0.4)',
                },
                // Warm Amber (Warnings Only)
                caution: {
                    DEFAULT: '#F59E0B',
                    light: '#FBBF24',
                    dark: '#D97706',
                },
                // Premium Text Colors
                text: {
                    primary: '#F1F5F9',
                    secondary: '#94A3B8',
                    tertiary: '#64748B',
                    muted: '#475569',
                },
                // Glass borders
                border: {
                    subtle: 'rgba(255, 255, 255, 0.06)',
                    DEFAULT: 'rgba(255, 255, 255, 0.1)',
                    strong: 'rgba(255, 255, 255, 0.15)',
                },
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
                heading: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
                mono: ['SF Mono', 'JetBrains Mono', 'Consolas', 'monospace'],
            },
            fontSize: {
                'display': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '600' }],
                'headline': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
                'title': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
                'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
                'caption': ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
                'micro': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.02em', fontWeight: '600' }],
            },
            backdropBlur: {
                xs: '2px',
                glass: '20px',
                heavy: '40px',
            },
            boxShadow: {
                'glow-energy': '0 0 40px rgba(99, 102, 241, 0.15)',
                'glow-eco': '0 0 40px rgba(16, 185, 129, 0.15)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
                'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
                'elevated': '0 12px 48px rgba(0, 0, 0, 0.5)',
            },
            borderRadius: {
                'card': '16px',
                'button': '10px',
                'input': '8px',
            },
            animation: {
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'count-up': 'countUp 1s ease-out forwards',
                'pulse-subtle': 'pulseSubtle 4s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                pulseSubtle: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
            },
            transitionTimingFunction: {
                'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'smooth': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
            },
        },
    },
    plugins: [],
}

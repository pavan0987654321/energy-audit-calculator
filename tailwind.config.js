/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Primary (Renewable Green)
                primary: {
                    DEFAULT: '#0F766E',
                    dark: '#0d5f58',
                    light: '#14b8a6',
                },
                // Secondary (Electric Blue)
                secondary: {
                    DEFAULT: '#2563EB',
                    dark: '#1d4ed8',
                    light: '#3b82f6',
                },
                // Accent (Warnings)
                accent: {
                    DEFAULT: '#F59E0B',
                    dark: '#d97706',
                    light: '#fbbf24',
                },
                // Dark theme backgrounds
                'dark-bg': '#0B1220',
                'dark-card': 'rgba(255, 255, 255, 0.08)',
                'dark-border': 'rgba(255, 255, 255, 0.12)',
                // Text colors
                'text-primary': '#E5E7EB',
                'text-secondary': '#9CA3AF',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Poppins', 'system-ui', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'glow-primary': '0 0 20px rgba(15, 118, 110, 0.3)',
                'glow-secondary': '0 0 20px rgba(37, 99, 235, 0.3)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            borderRadius: {
                'card': '16px',
                'button': '12px',
            },
        },
    },
    plugins: [],
}

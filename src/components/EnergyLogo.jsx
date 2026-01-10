import React from 'react';

/**
 * EnergyLogo - Premium Abstract Energy Symbol
 * 
 * Symbolism:
 * - Hexagonal shape: Efficiency, structure, molecular precision
 * - Internal flow lines: Energy pathways, optimization
 * - Gradient: Energy transition from consumption to savings
 * 
 * @param {Object} props
 * @param {'light'|'dark'|'auto'} props.variant - Color variant
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.size - Size in pixels (default: 32)
 */
const EnergyLogo = ({ variant = 'auto', className = '', size = 32 }) => {
    const colors = {
        light: {
            primary: '#0D0F14',
            secondary: '#1A1F2A',
            accent: '#6366F1',
        },
        dark: {
            primary: '#F1F5F9',
            secondary: '#94A3B8',
            accent: '#818CF8',
        },
        auto: {
            primary: '#F1F5F9',
            secondary: '#94A3B8',
            accent: '#6366F1',
        },
    };

    const c = colors[variant] || colors.auto;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Energy Intelligence Platform Logo"
        >
            <defs>
                {/* Main gradient */}
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={c.accent} />
                    <stop offset="100%" stopColor="#10B981" />
                </linearGradient>

                {/* Subtle inner glow */}
                <radialGradient id="innerGlow" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>

                {/* Shadow filter */}
                <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor={c.accent} floodOpacity="0.3" />
                </filter>
            </defs>

            {/* Outer hexagon - clean geometry */}
            <path
                d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
                fill="url(#logoGradient)"
                filter="url(#logoShadow)"
            />

            {/* Inner shine */}
            <path
                d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
                fill="url(#innerGlow)"
            />

            {/* Energy flow symbol - abstract bolt */}
            <path
                d="M26 12L18 24H24L22 36L30 24H24L26 12Z"
                fill="white"
                fillOpacity="0.95"
            />

            {/* Subtle circuit lines */}
            <path
                d="M12 18L18 21M36 18L30 21M12 30L18 27M36 30L30 27"
                stroke="white"
                strokeOpacity="0.4"
                strokeWidth="1"
                strokeLinecap="round"
            />
        </svg>
    );
};

/**
 * Animated version of the logo with subtle hover effects
 */
export const EnergyLogoAnimated = ({ size = 40, className = '' }) => {
    return (
        <div
            className={`group relative cursor-pointer ${className}`}
            style={{ width: size, height: size }}
        >
            {/* Glow ring on hover */}
            <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
                    transform: 'scale(1.5)',
                }}
            />

            {/* Logo with subtle scale */}
            <div className="relative transition-transform duration-300 group-hover:scale-105">
                <EnergyLogo size={size} />
            </div>
        </div>
    );
};

export default EnergyLogo;

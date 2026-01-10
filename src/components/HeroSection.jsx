import React from 'react';
import { motion } from 'framer-motion';
import EnergyFlowScene from './three/EnergyFlowScene';

/**
 * Enterprise Status Badge
 */
const StatusBadge = React.memo(() => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-5"
        style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
        }}
    >
        <div className="flex items-center gap-2">
            <motion.span
                className="w-2 h-2 rounded-full"
                style={{ background: '#10B981' }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#10B981' }}>
                Live Analysis
            </span>
        </div>
        <div className="w-px h-3" style={{ background: 'rgba(255,255,255,0.2)' }} />
        <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>
            Enterprise Platform
        </span>
    </motion.div>
));

/**
 * Feature Card
 */
const FeatureCard = React.memo(({ icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        whileHover={{ y: -2, scale: 1.02 }}
        className="flex items-center gap-3 px-4 py-3 rounded-xl"
        style={{
            background: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(71, 85, 105, 0.3)',
        }}
    >
        <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
            style={{ background: `${color}15` }}
        >
            {icon}
        </div>
        <div>
            <div className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#64748B' }}>
                {label}
            </div>
            <div className="text-sm font-semibold" style={{ color: '#E2E8F0' }}>
                {value}
            </div>
        </div>
    </motion.div>
));

/**
 * Enterprise Hero Section - Clean & Readable
 */
const HeroSection = React.memo(() => {
    const features = [
        { icon: '📊', label: 'Capital Analytics', value: 'Real-time ROI', color: '#6366F1' },
        { icon: '⚡', label: 'Energy Delta', value: 'Precision Tracking', color: '#10B981' },
        { icon: '🎯', label: 'Payback Analysis', value: 'Benchmark Ready', color: '#8B5CF6' },
        { icon: '🌍', label: 'Carbon Impact', value: 'Verified Metrics', color: '#14B8A6' },
    ];

    return (
        <section
            className="relative min-h-[70vh] flex items-center overflow-hidden"
            style={{ background: '#0D0F14' }}
        >
            {/* 3D Visualization - positioned to the right */}
            <EnergyFlowScene />

            {/* Content Layer - Left aligned */}
            <div className="relative z-10 container mx-auto px-6 lg:px-12">
                <div className="max-w-2xl">
                    {/* Status Badge */}
                    <StatusBadge />

                    {/* Main Title - High contrast */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                            color: '#FFFFFF',
                            letterSpacing: '-0.02em',
                            lineHeight: '1.2',
                        }}
                    >
                        Investment-Grade
                        <br />
                        <span
                            style={{
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #14B8A6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Energy Decision Platform
                        </span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.35 }}
                        className="text-base md:text-lg mb-8"
                        style={{ color: '#94A3B8', lineHeight: '1.6', maxWidth: '500px' }}
                    >
                        Calculate ROI, payback periods, and carbon savings for your energy investments with enterprise-grade accuracy.
                    </motion.p>

                    {/* Feature Cards Grid */}
                    <motion.div
                        className="grid grid-cols-2 gap-3 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        {features.map((feature, index) => (
                            <FeatureCard
                                key={feature.label}
                                {...feature}
                                delay={0.55 + index * 0.08}
                            />
                        ))}
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => document.getElementById('system-config')?.scrollIntoView({ behavior: 'smooth' })}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm"
                            style={{
                                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                color: '#FFFFFF',
                                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                            }}
                        >
                            Start Analysis
                            <span>→</span>
                        </motion.button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
});

export default HeroSection;

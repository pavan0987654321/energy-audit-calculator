import React from 'react';
import { motion } from 'framer-motion';

/**
 * Enterprise Footer - Trust Signals & Credibility
 */
const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mt-16"
        >
            {/* Top border with gradient */}
            <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                    background: 'linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), rgba(16, 185, 129, 0.3), transparent)',
                }}
            />

            <div
                className="py-8 px-6"
                style={{
                    background: 'linear-gradient(180deg, rgba(13, 15, 20, 0.6) 0%, rgba(13, 15, 20, 0.9) 100%)',
                }}
            >
                <div className="container mx-auto max-w-5xl">
                    {/* Main Footer Content */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        {/* Brand & Tagline */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span
                                    className="text-lg font-bold"
                                    style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        color: '#F1F5F9',
                                    }}
                                >
                                    EnergyROI
                                </span>
                                <span
                                    className="text-lg font-bold"
                                    style={{
                                        background: 'linear-gradient(135deg, #6366F1, #10B981)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Pro
                                </span>
                            </div>
                            <p className="text-xs" style={{ color: '#64748B' }}>
                                Energy Intelligence for Confident Decisions
                            </p>
                        </div>

                        {/* Enterprise Trust Badge */}
                        <motion.div
                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                            style={{
                                background: 'rgba(99, 102, 241, 0.06)',
                                border: '1px solid rgba(99, 102, 241, 0.12)',
                            }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <svg className="w-5 h-5" style={{ color: '#6366F1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <div>
                                <div className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>
                                    Platform Status
                                </div>
                                <div className="text-xs font-semibold" style={{ color: '#A5B4FC' }}>
                                    Enterprise-Grade Security
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Trust Signals Row */}
                    <div
                        className="flex flex-wrap justify-center gap-6 py-6 mb-6"
                        style={{ borderTop: '1px solid rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    >
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#64748B' }}>
                            <svg className="w-4 h-4" style={{ color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Industry-Standard Calculations</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#64748B' }}>
                            <svg className="w-4 h-4" style={{ color: '#6366F1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Real-Time Analysis Engine</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs" style={{ color: '#64748B' }}>
                            <svg className="w-4 h-4" style={{ color: '#14B8A6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Grid EF: 0.82 kgCO₂/kWh (India)</span>
                        </div>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        {/* Copyright */}
                        <div className="text-xs" style={{ color: '#475569' }}>
                            © {currentYear} EnergyROI Pro. All rights reserved.
                        </div>

                        {/* Version & Enterprise Tag */}
                        <div className="flex items-center gap-4">
                            <span
                                className="px-2.5 py-1 rounded-md text-[10px] font-medium"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    color: '#475569',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                }}
                            >
                                v2.1.0
                            </span>
                            <span className="text-xs font-medium" style={{ color: '#64748B' }}>
                                Designed for enterprise-scale decisions
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
};

export default Footer;

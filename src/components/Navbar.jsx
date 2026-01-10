import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Premium Logo with Hover Glow
 */
const PremiumLogo = () => {
    return (
        <motion.div
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
            {/* Glow effect behind logo */}
            <div
                className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
                    transform: 'scale(2)',
                }}
            />

            <svg
                className="w-9 h-9 relative"
                viewBox="0 0 40 40"
                fill="none"
            >
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="50%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#10B981" />
                    </linearGradient>
                    <linearGradient id="logoGradientHover" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#818CF8" />
                        <stop offset="50%" stopColor="#A78BFA" />
                        <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                </defs>

                {/* Outer ring */}
                <circle
                    cx="20"
                    cy="20"
                    r="17"
                    stroke="url(#logoGradient)"
                    strokeWidth="2"
                    fill="none"
                    className="group-hover:stroke-[url(#logoGradientHover)]"
                />

                {/* Inner energy symbol */}
                <path
                    d="M23 12L15 21H19L17 28L25 19H21L23 12Z"
                    fill="url(#logoGradient)"
                    className="group-hover:fill-[url(#logoGradientHover)]"
                />

                {/* Orbital dots */}
                <circle cx="20" cy="5" r="1.5" fill="#6366F1" opacity="0.6" />
                <circle cx="35" cy="20" r="1.5" fill="#10B981" opacity="0.6" />
                <circle cx="20" cy="35" r="1.5" fill="#8B5CF6" opacity="0.6" />
            </svg>
        </motion.div>
    );
};

/**
 * Navigation Link
 */
const NavLink = ({ href, children, isActive }) => (
    <motion.a
        href={href}
        className="relative px-3 py-2 text-sm font-medium transition-colors"
        style={{ color: isActive ? '#F1F5F9' : '#94A3B8' }}
        whileHover={{ color: '#F1F5F9' }}
    >
        {children}
        {isActive && (
            <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                style={{ background: 'linear-gradient(90deg, #6366F1, #10B981)' }}
            />
        )}
    </motion.a>
);

/**
 * Enterprise Navbar - Premium Navigation
 */
const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { id: 'dashboard', label: 'Dashboard', href: '#' },
        { id: 'analysis', label: 'Analysis', href: '#analysis' },
        { id: 'reports', label: 'Reports', href: '#reports' },
    ];

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                background: scrolled
                    ? 'rgba(13, 15, 20, 0.85)'
                    : 'rgba(13, 15, 20, 0.4)',
                backdropFilter: `blur(${scrolled ? 20 : 8}px)`,
                borderBottom: scrolled
                    ? '1px solid rgba(255, 255, 255, 0.06)'
                    : '1px solid transparent',
            }}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-4">
                        <PremiumLogo />

                        <div className="hidden md:block">
                            <div className="flex items-center gap-1.5">
                                <span
                                    className="text-base font-bold"
                                    style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        color: '#F1F5F9',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    EnergyROI
                                </span>
                                <span
                                    className="text-base font-bold"
                                    style={{
                                        fontFamily: "'Poppins', sans-serif",
                                        background: 'linear-gradient(135deg, #6366F1, #10B981)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    Pro
                                </span>
                            </div>
                            <div className="text-[9px] uppercase tracking-widest mt-0.5" style={{ color: '#64748B' }}>
                                Energy Intelligence
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map(link => (
                            <NavLink
                                key={link.id}
                                href={link.href}
                                isActive={activeTab === link.id}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-3">
                        <motion.div
                            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
                            style={{
                                background: 'rgba(16, 185, 129, 0.08)',
                                border: '1px solid rgba(16, 185, 129, 0.15)',
                            }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <motion.span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: '#10B981' }}
                                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#10B981' }}>
                                System Online
                            </span>
                        </motion.div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            className="md:hidden p-2 rounded-lg"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                            }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <svg className="w-5 h-5" style={{ color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden overflow-hidden"
                        style={{
                            background: 'rgba(13, 15, 20, 0.95)',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                    >
                        <div className="container mx-auto px-4 py-4 space-y-2">
                            {navLinks.map(link => (
                                <a
                                    key={link.id}
                                    href={link.href}
                                    className="block px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                                    style={{
                                        color: activeTab === link.id ? '#F1F5F9' : '#94A3B8',
                                        background: activeTab === link.id ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                                    }}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}

                            {/* Mobile status */}
                            <div className="pt-3 mt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                <div className="flex items-center gap-2 px-4">
                                    <motion.span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ background: '#10B981' }}
                                        animate={{ scale: [1, 1.3, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                    <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#10B981' }}>
                                        System Online
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;

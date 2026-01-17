import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Toast notification types configuration
 */
const TOAST_TYPES = {
    success: {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
        ),
        bgColor: 'rgba(16, 185, 129, 0.12)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        iconBg: 'rgba(16, 185, 129, 0.2)',
        iconColor: '#10B981',
        textColor: '#10B981',
    },
    error: {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        ),
        bgColor: 'rgba(239, 68, 68, 0.12)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        iconBg: 'rgba(239, 68, 68, 0.2)',
        iconColor: '#EF4444',
        textColor: '#EF4444',
    },
    info: {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        bgColor: 'rgba(99, 102, 241, 0.12)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        iconBg: 'rgba(99, 102, 241, 0.2)',
        iconColor: '#6366F1',
        textColor: '#818CF8',
    },
    warning: {
        icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        bgColor: 'rgba(245, 158, 11, 0.12)',
        borderColor: 'rgba(245, 158, 11, 0.3)',
        iconBg: 'rgba(245, 158, 11, 0.2)',
        iconColor: '#F59E0B',
        textColor: '#FBBF24',
    },
};

/**
 * Individual Toast Component
 */
const Toast = ({ id, type = 'success', message, onDismiss, duration = 3000 }) => {
    const config = TOAST_TYPES[type] || TOAST_TYPES.info;

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onDismiss(id);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [id, duration, onDismiss]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md min-w-[280px] max-w-[380px]"
            style={{
                background: config.bgColor,
                border: `1px solid ${config.borderColor}`,
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            }}
        >
            {/* Icon */}
            <div
                className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                    background: config.iconBg,
                    color: config.iconColor,
                }}
            >
                {config.icon}
            </div>

            {/* Message */}
            <span
                className="flex-1 text-sm font-medium"
                style={{ color: config.textColor }}
            >
                {message}
            </span>

            {/* Dismiss Button */}
            <button
                onClick={() => onDismiss(id)}
                className="flex-shrink-0 p-1 rounded-lg transition-all hover:bg-white/10"
                style={{ color: config.textColor }}
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Auto-dismiss progress bar */}
            {duration > 0 && (
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 rounded-b-xl"
                    style={{ background: config.iconColor }}
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ duration: duration / 1000, ease: 'linear' }}
                />
            )}
        </motion.div>
    );
};

/**
 * Toast Container Component - Manages multiple toasts
 */
const ToastContainer = ({ toasts, onDismiss }) => {
    return (
        <div className="fixed top-20 right-4 z-50 flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        type={toast.type}
                        message={toast.message}
                        duration={toast.duration}
                        onDismiss={onDismiss}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

/**
 * Custom Hook for Toast Management
 * @returns {Object} Toast state and methods
 */
export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message, duration = 3000) => {
        const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setToasts((prev) => [...prev, { id, type, message, duration }]);
        return id;
    }, []);

    const dismissToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);

    // Convenience methods
    const success = useCallback((message, duration) => addToast('success', message, duration), [addToast]);
    const error = useCallback((message, duration) => addToast('error', message, duration), [addToast]);
    const info = useCallback((message, duration) => addToast('info', message, duration), [addToast]);
    const warning = useCallback((message, duration) => addToast('warning', message, duration), [addToast]);

    return {
        toasts,
        addToast,
        dismissToast,
        clearAllToasts,
        success,
        error,
        info,
        warning,
    };
};

export { ToastContainer, Toast };
export default ToastContainer;

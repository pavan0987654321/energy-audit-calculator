import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Unsaved Changes Modal
 * Shows warning when user tries to navigate away with unsaved form data
 */
const UnsavedChangesModal = ({ isOpen, onDiscard, onKeepEditing }) => {
    // Handle Escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onKeepEditing();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onKeepEditing]);

    // Prevent body scroll when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    style={{ background: 'rgba(0, 0, 0, 0.7)' }}
                    onClick={onKeepEditing}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-md rounded-2xl p-6 relative"
                        style={{
                            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.98) 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Warning Icon */}
                        <div className="flex justify-center mb-4">
                            <div
                                className="w-14 h-14 rounded-full flex items-center justify-center"
                                style={{
                                    background: 'rgba(245, 158, 11, 0.15)',
                                    border: '1px solid rgba(245, 158, 11, 0.3)',
                                }}
                            >
                                <svg
                                    className="w-7 h-7"
                                    style={{ color: '#FBBF24' }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <h3
                            className="text-xl font-bold text-center mb-2"
                            style={{ color: '#F1F5F9', fontFamily: "'Poppins', sans-serif" }}
                        >
                            Unsaved Changes
                        </h3>

                        {/* Message */}
                        <p className="text-center text-sm mb-6" style={{ color: '#94A3B8' }}>
                            You have unsaved changes in your analysis form. Do you want to leave without saving?
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <motion.button
                                onClick={onDiscard}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
                                style={{
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                    color: '#EF4444',
                                }}
                            >
                                Discard Changes
                            </motion.button>
                            <motion.button
                                onClick={onKeepEditing}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
                                style={{
                                    background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
                                    color: 'white',
                                }}
                            >
                                Keep Editing
                            </motion.button>
                        </div>

                        {/* Hint */}
                        <p className="text-center text-xs mt-4" style={{ color: '#64748B' }}>
                            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60">Esc</kbd> to keep editing
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UnsavedChangesModal;

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Confirm Delete Modal
 * Shows warning when user tries to delete all analyses
 */
const ConfirmDeleteModal = ({ isOpen, analysisCount, onConfirm, onCancel }) => {
    // Handle Escape key
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onCancel();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onCancel]);

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
                    onClick={onCancel}
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
                                    background: 'rgba(239, 68, 68, 0.15)',
                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                }}
                            >
                                <svg
                                    className="w-7 h-7"
                                    style={{ color: '#EF4444' }}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <h3
                            className="text-xl font-bold text-center mb-2"
                            style={{ color: '#F1F5F9', fontFamily: "'Poppins', sans-serif" }}
                        >
                            Delete all analyses?
                        </h3>

                        {/* Message */}
                        <p className="text-center text-sm mb-6" style={{ color: '#94A3B8' }}>
                            You have <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{analysisCount}</span> analysis record{analysisCount !== 1 ? 's' : ''}.
                            This action cannot be undone.
                        </p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <motion.button
                                onClick={onCancel}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#94A3B8',
                                }}
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                onClick={onConfirm}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors"
                                style={{
                                    background: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
                                    color: 'white',
                                }}
                            >
                                Delete All
                            </motion.button>
                        </div>

                        {/* Hint */}
                        <p className="text-center text-xs mt-4" style={{ color: '#64748B' }}>
                            Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60">Esc</kbd> to cancel
                        </p>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmDeleteModal;

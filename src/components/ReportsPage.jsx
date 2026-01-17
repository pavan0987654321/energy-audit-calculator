import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../hooks/useAnalysisHistory';
import { exportToPDF, exportToCSV, exportComparisonToCSV } from '../utils/exportUtils';
import { formatINRCurrency } from '../utils/currencyUtils';
import ConfirmDeleteModal from './ConfirmDeleteModal';

/**
 * Status Badge Component
 */
const StatusBadge = ({ signal }) => {
    if (!signal) return null;

    return (
        <span
            className="px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
                background: `${signal.color}15`,
                color: signal.color,
                border: `1px solid ${signal.color}30`,
            }}
        >
            {signal.text}
        </span>
    );
};

/**
 * Empty State Component
 */
const EmptyState = ({ icon, title, description }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4"
            style={{ background: 'rgba(99, 102, 241, 0.1)' }}
        >
            {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2" style={{ color: '#F1F5F9' }}>
            {title}
        </h3>
        <p className="text-sm max-w-sm" style={{ color: '#64748B' }}>
            {description}
        </p>
    </div>
);

/**
 * Section Header Component
 */
const SectionHeader = ({ icon, title, subtitle, action }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{icon}</span>
                <h3
                    className="text-xl font-bold"
                    style={{ color: '#F1F5F9', fontFamily: "'Poppins', sans-serif" }}
                >
                    {title}
                </h3>
            </div>
            {subtitle && (
                <p className="text-sm" style={{ color: '#64748B' }}>
                    {subtitle}
                </p>
            )}
        </div>
        {action}
    </div>
);

/**
 * Action Menu Component - Dropdown for mobile actions
 */
const ActionMenu = ({ analysis, onView, onExportPDF, onExportCSV, onDelete }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg transition-colors hover:bg-white/[0.05]"
                style={{ color: '#94A3B8' }}
                title="Actions"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 z-50 min-w-[160px] rounded-xl overflow-hidden"
                        style={{
                            background: 'rgba(15, 23, 42, 0.98)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(12px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        }}
                    >
                        <button
                            onClick={() => { onView?.(analysis); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-white/[0.05]"
                            style={{ color: '#F1F5F9' }}
                        >
                            <svg className="w-4 h-4" style={{ color: '#6366F1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View Analysis
                        </button>
                        <button
                            onClick={() => { onExportPDF(analysis); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-white/[0.05]"
                            style={{ color: '#F1F5F9' }}
                        >
                            <svg className="w-4 h-4" style={{ color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download PDF
                        </button>
                        <button
                            onClick={() => { onExportCSV(analysis); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-white/[0.05]"
                            style={{ color: '#F1F5F9' }}
                        >
                            <svg className="w-4 h-4" style={{ color: '#818CF8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download CSV
                        </button>
                        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }} />
                        <button
                            onClick={() => { onDelete?.(analysis.id); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-red-500/10"
                            style={{ color: '#EF4444' }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

/**
 * Analysis Card Component - Mobile-friendly card view
 */
const AnalysisCard = ({ analysis, index, isSelected, isNew, onToggle, onView, onExportPDF, onExportCSV, onDelete }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="rounded-xl p-4 mb-3 relative overflow-hidden"
        style={{
            background: isNew
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)'
                : isSelected
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)'
                    : 'rgba(255, 255, 255, 0.02)',
            border: isNew
                ? '1px solid rgba(16, 185, 129, 0.4)'
                : isSelected
                    ? '1px solid rgba(99, 102, 241, 0.3)'
                    : '1px solid rgba(255, 255, 255, 0.06)',
            boxShadow: isNew ? '0 0 20px rgba(16, 185, 129, 0.15)' : 'none',
        }}
    >
        {/* Glow effect for new analysis */}
        {isNew && (
            <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{
                    background: 'radial-gradient(ellipse at center, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                }}
            />
        )}
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggle}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500 flex-shrink-0"
                />
                <div className="min-w-0">
                    <div className="font-semibold text-sm truncate" style={{ color: '#F1F5F9' }}>
                        {analysis.projectName}
                    </div>
                    <div className="text-xs" style={{ color: '#64748B' }}>
                        {formatDate(analysis.timestamp)}
                    </div>
                </div>
            </div>
            <ActionMenu
                analysis={analysis}
                onView={onView}
                onExportPDF={onExportPDF}
                onExportCSV={onExportCSV}
                onDelete={onDelete}
            />
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>NPV</div>
                <div
                    className="text-xs font-bold truncate"
                    style={{ color: analysis.keyMetrics?.npv >= 0 ? '#10B981' : '#F59E0B' }}
                >
                    {formatINRCurrency(analysis.keyMetrics?.npv, { decimals: 0 }) || 'N/A'}
                </div>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>IRR</div>
                <div className="text-xs font-bold" style={{ color: '#6366F1' }}>
                    {analysis.keyMetrics?.irr?.toFixed(1) || 'N/A'}%
                </div>
            </div>
            <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>Signal</div>
                <StatusBadge signal={analysis.keyMetrics?.investmentSignal} />
            </div>
        </div>
    </motion.div>
);

/**
 * Reports Page - History, Export, and Comparison
 */
const ReportsPage = ({ analyses = [], newAnalysisId, onViewAnalysis, onDeleteAnalysis, onClearHistory, onShowToast }) => {

    const [selectedForComparison, setSelectedForComparison] = useState([]);
    const [showComparisonModal, setShowComparisonModal] = useState(false);
    const [activeTab, setActiveTab] = useState('history');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Handle clear all with confirmation
    const handleClearAllClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        setShowDeleteModal(false);
        onClearHistory?.();
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    // Toggle analysis selection for comparison
    const toggleComparison = (id) => {
        setSelectedForComparison((prev) => {
            if (prev.includes(id)) {
                return prev.filter((i) => i !== id);
            }
            if (prev.length >= 3) {
                // Max 3 for comparison
                return [...prev.slice(1), id];
            }
            return [...prev, id];
        });
    };

    // Get selected analyses for comparison
    const comparisonAnalyses = useMemo(() => {
        return analyses.filter((a) => selectedForComparison.includes(a.id));
    }, [analyses, selectedForComparison]);

    // Handle export actions
    const handleExportPDF = (analysis) => {
        try {
            const filename = exportToPDF(analysis);
            if (onShowToast) {
                onShowToast(`Downloaded: ${filename}`, 3000);
            }
        } catch (error) {
            console.error('Error exporting PDF:', error);
        }
    };

    const handleExportCSV = (analysis) => {
        try {
            const filename = exportToCSV(analysis);
            if (onShowToast) {
                onShowToast(`Downloaded: ${filename}`, 3000);
            }
        } catch (error) {
            console.error('Error exporting CSV:', error);
        }
    };

    const handleExportComparison = () => {
        if (comparisonAnalyses.length > 0) {
            const filename = exportComparisonToCSV(comparisonAnalyses);
            if (onShowToast && filename) {
                onShowToast(`Downloaded: ${filename}`, 3000);
            }
        }
    };

    const tabs = [
        { id: 'history', label: 'Analysis History', icon: '📊' },
        { id: 'comparison', label: 'Comparison Tool', icon: '⚖️' },
    ];

    return (
        <>
            <section id="reports" className="py-12">
                {/* Section Title */}
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: '#6366F1' }} />
                        <span
                            className="text-[10px] font-semibold uppercase tracking-widest"
                            style={{ color: '#64748B' }}
                        >
                            Reports Center
                        </span>
                    </div>
                    <h2
                        className="text-2xl md:text-3xl font-bold"
                        style={{
                            fontFamily: "'Poppins', sans-serif",
                            color: '#F1F5F9',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        Analysis Reports
                    </h2>
                    <p className="text-sm mt-1" style={{ color: '#64748B' }}>
                        View, export, and compare your investment analyses
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
                            style={{
                                background: activeTab === tab.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                                border: `1px solid ${activeTab === tab.id ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
                                color: activeTab === tab.id ? '#818CF8' : '#94A3B8',
                            }}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* History Tab */}
                <AnimatePresence mode="wait">
                    {activeTab === 'history' && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div
                                className="rounded-2xl p-6"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                }}
                            >
                                <SectionHeader
                                    icon="📋"
                                    title="Reports History"
                                    subtitle={`${analyses.length} analysis record${analyses.length !== 1 ? 's' : ''}`}
                                    action={
                                        analyses.length > 0 && (
                                            <button
                                                onClick={handleClearAllClick}
                                                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-red-500/20"
                                                style={{
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    color: '#EF4444',
                                                    border: '1px solid rgba(239, 68, 68, 0.2)',
                                                }}
                                            >
                                                Clear All
                                            </button>
                                        )
                                    }
                                />

                                {/* Success Banner for New Analysis */}
                                <AnimatePresence>
                                    {newAnalysisId && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, y: -10, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="mb-4 px-4 py-3 rounded-xl flex items-center gap-3"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)',
                                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                            }}
                                        >
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ background: 'rgba(16, 185, 129, 0.2)' }}
                                            >
                                                <svg className="w-4 h-4" style={{ color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-sm font-semibold" style={{ color: '#10B981' }}>
                                                    New analysis saved!
                                                </span>
                                                <span className="text-xs ml-2" style={{ color: '#6EE7B7' }}>
                                                    Highlighted below
                                                </span>
                                            </div>
                                            <motion.div
                                                className="w-1 h-1 rounded-full"
                                                style={{ background: '#10B981' }}
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {analyses.length === 0 ? (
                                    <EmptyState
                                        icon="📊"
                                        title="No Analyses Yet"
                                        description="Run your first investment analysis to see reports here. Your analysis history will be saved automatically."
                                    />
                                ) : (
                                    <>
                                        {/* Mobile Card View */}
                                        <div className="block md:hidden">
                                            {analyses.map((analysis, index) => (
                                                <AnalysisCard
                                                    key={analysis.id}
                                                    analysis={analysis}
                                                    index={index}
                                                    isSelected={selectedForComparison.includes(analysis.id)}
                                                    isNew={analysis.id === newAnalysisId}
                                                    onToggle={() => toggleComparison(analysis.id)}
                                                    onView={onViewAnalysis}
                                                    onExportPDF={handleExportPDF}
                                                    onExportCSV={handleExportCSV}
                                                    onDelete={onDeleteAnalysis}
                                                />
                                            ))}
                                        </div>

                                        {/* Desktop Table View */}
                                        <div className="hidden md:block overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                                                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>
                                                            Project
                                                        </th>
                                                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>
                                                            Date
                                                        </th>
                                                        <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: '#64748B' }}>
                                                            NPV
                                                        </th>
                                                        <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider hidden lg:table-cell" style={{ color: '#64748B' }}>
                                                            IRR
                                                        </th>
                                                        <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>
                                                            Signal
                                                        </th>
                                                        <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>
                                                            Actions
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {analyses.map((analysis, index) => (
                                                        <motion.tr
                                                            key={analysis.id}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.05 }}
                                                            className="group hover:bg-white/[0.02] transition-colors relative"
                                                            style={{
                                                                borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                                                                background: analysis.id === newAnalysisId
                                                                    ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 100%)'
                                                                    : 'transparent',
                                                                boxShadow: analysis.id === newAnalysisId
                                                                    ? 'inset 0 0 0 1px rgba(16, 185, 129, 0.2)'
                                                                    : 'none',
                                                            }}
                                                        >
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center gap-3">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedForComparison.includes(analysis.id)}
                                                                        onChange={() => toggleComparison(analysis.id)}
                                                                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-indigo-500 focus:ring-indigo-500"
                                                                    />
                                                                    <div className="font-medium text-sm truncate max-w-[200px]" style={{ color: '#F1F5F9' }}>
                                                                        {analysis.projectName}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <span className="text-sm" style={{ color: '#94A3B8' }}>
                                                                    {formatDate(analysis.timestamp)}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4 text-right hidden lg:table-cell">
                                                                <span
                                                                    className="text-sm font-medium"
                                                                    style={{ color: analysis.keyMetrics?.npv >= 0 ? '#10B981' : '#F59E0B' }}
                                                                >
                                                                    {formatINRCurrency(analysis.keyMetrics?.npv, { decimals: 0 }) || 'N/A'}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4 text-right hidden lg:table-cell">
                                                                <span className="text-sm font-medium" style={{ color: '#6366F1' }}>
                                                                    {analysis.keyMetrics?.irr?.toFixed(1) || 'N/A'}%
                                                                </span>
                                                            </td>
                                                            <td className="py-4 px-4 text-center">
                                                                <StatusBadge signal={analysis.keyMetrics?.investmentSignal} />
                                                            </td>
                                                            <td className="py-4 px-4">
                                                                <div className="flex items-center justify-end">
                                                                    <ActionMenu
                                                                        analysis={analysis}
                                                                        onView={onViewAnalysis}
                                                                        onExportPDF={handleExportPDF}
                                                                        onExportCSV={handleExportCSV}
                                                                        onDelete={onDeleteAnalysis}
                                                                    />
                                                                </div>
                                                            </td>
                                                        </motion.tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                )}

                            </div>
                        </motion.div>
                    )}

                    {/* Comparison Tab */}
                    {activeTab === 'comparison' && (
                        <motion.div
                            key="comparison"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div
                                className="rounded-2xl p-6"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                }}
                            >
                                <SectionHeader
                                    icon="⚖️"
                                    title="Comparison Tool"
                                    subtitle={`${selectedForComparison.length}/3 analyses selected`}
                                    action={
                                        <div className="flex gap-2">
                                            {selectedForComparison.length > 0 && (
                                                <button
                                                    onClick={() => setSelectedForComparison([])}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                                    style={{
                                                        background: 'rgba(239, 68, 68, 0.1)',
                                                        color: '#EF4444',
                                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                                    }}
                                                >
                                                    Clear Selection
                                                </button>
                                            )}
                                            {selectedForComparison.length >= 2 && (
                                                <button
                                                    onClick={handleExportComparison}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
                                                    style={{
                                                        background: 'rgba(99, 102, 241, 0.15)',
                                                        border: '1px solid rgba(99, 102, 241, 0.3)',
                                                        color: '#818CF8',
                                                    }}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Download CSV
                                                </button>
                                            )}
                                        </div>
                                    }
                                />

                                {/* No Analyses Available */}
                                {analyses.length === 0 ? (
                                    <EmptyState
                                        icon="📊"
                                        title="No Analyses Available"
                                        description="Run some investment analyses first to compare them here."
                                    />
                                ) : (
                                    <>
                                        {/* Selection Tip */}
                                        <div
                                            className="mb-4 px-4 py-3 rounded-xl text-sm"
                                            style={{
                                                background: 'rgba(99, 102, 241, 0.08)',
                                                border: '1px solid rgba(99, 102, 241, 0.15)',
                                                color: '#94A3B8'
                                            }}
                                        >
                                            <span style={{ color: '#818CF8' }}>💡 Tip:</span> Select 2-3 analyses below to compare them side by side
                                        </div>

                                        {/* Selectable Analysis Cards */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                            {analyses.map((analysis, index) => {
                                                const isSelected = selectedForComparison.includes(analysis.id);
                                                const isDisabled = !isSelected && selectedForComparison.length >= 3;

                                                return (
                                                    <motion.div
                                                        key={analysis.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        onClick={() => !isDisabled && toggleComparison(analysis.id)}
                                                        className="relative rounded-xl p-4 cursor-pointer transition-all"
                                                        style={{
                                                            background: isSelected
                                                                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)'
                                                                : 'rgba(255, 255, 255, 0.02)',
                                                            border: isSelected
                                                                ? '2px solid rgba(99, 102, 241, 0.5)'
                                                                : '1px solid rgba(255, 255, 255, 0.06)',
                                                            opacity: isDisabled ? 0.5 : 1,
                                                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                                                        }}
                                                        whileHover={!isDisabled ? { scale: 1.02 } : {}}
                                                        whileTap={!isDisabled ? { scale: 0.98 } : {}}
                                                    >
                                                        {/* Checkbox */}
                                                        <div
                                                            className="absolute top-3 right-3 w-5 h-5 rounded flex items-center justify-center"
                                                            style={{
                                                                background: isSelected ? '#6366F1' : 'rgba(255, 255, 255, 0.1)',
                                                                border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                                                            }}
                                                        >
                                                            {isSelected && (
                                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>

                                                        {/* Project Name */}
                                                        <h4 className="font-semibold text-sm mb-2 pr-6" style={{ color: '#F1F5F9' }}>
                                                            {analysis.projectName}
                                                        </h4>

                                                        {/* Date */}
                                                        <p className="text-xs mb-3" style={{ color: '#64748B' }}>
                                                            {formatDate(analysis.timestamp)}
                                                        </p>

                                                        {/* Key Metrics Preview */}
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                                                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>ROI</p>
                                                                <p className="text-sm font-bold" style={{ color: '#10B981' }}>
                                                                    {analysis.keyMetrics?.roi?.toFixed(0) || 'N/A'}%
                                                                </p>
                                                            </div>
                                                            <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
                                                                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>Payback</p>
                                                                <p className="text-sm font-bold" style={{ color: '#6366F1' }}>
                                                                    {analysis.results?.simplePaybackPeriod?.toFixed(1) || 'N/A'} yrs
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Investment Signal */}
                                                        <div className="mt-3 flex justify-center">
                                                            <StatusBadge signal={analysis.keyMetrics?.investmentSignal} />
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>

                                        {/* Selection prompt */}
                                        {selectedForComparison.length < 2 && (
                                            <div className="text-center py-4">
                                                <span
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
                                                    style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818CF8' }}
                                                >
                                                    Select {2 - selectedForComparison.length} more to compare
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Comparison Table - Only when 2+ selected */}
                                {selectedForComparison.length >= 2 && (
                                    <div
                                        className="rounded-xl overflow-hidden mt-6"
                                        style={{
                                            background: 'rgba(0, 0, 0, 0.2)',
                                            border: '1px solid rgba(255, 255, 255, 0.06)',
                                        }}
                                    >
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                                                        <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: '#818CF8' }}>
                                                            Metric
                                                        </th>
                                                        {comparisonAnalyses.map((a) => (
                                                            <th key={a.id} className="text-center py-3 px-4 text-xs font-semibold" style={{ color: '#F1F5F9' }}>
                                                                <div className="truncate max-w-[120px] mx-auto" title={a.projectName}>
                                                                    {a.projectName?.length > 18 ? a.projectName.substring(0, 18) + '...' : a.projectName}
                                                                </div>
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                        { label: 'Baseline Power', key: 'existingPower', suffix: ' kW', source: 'input', higherIsBetter: false },
                                                        { label: 'Target Power', key: 'proposedPower', suffix: ' kW', source: 'input', higherIsBetter: false },
                                                        { label: 'Capital Investment', key: 'initialInvestment', prefix: '₹', source: 'input', format: true, decimals: 0, higherIsBetter: false },
                                                        { label: 'Annual Savings', key: 'annualCostSavings', prefix: '₹', source: 'result', format: true, decimals: 2, higherIsBetter: true },
                                                        { label: 'Payback Period', key: 'simplePaybackPeriod', suffix: ' yrs', source: 'result', decimals: 1, higherIsBetter: false },
                                                        { label: 'NPV', key: 'npv', prefix: '₹', source: 'result', format: true, decimals: 2, higherIsBetter: true },
                                                        { label: 'IRR', key: 'irr', suffix: '%', source: 'result', decimals: 1, higherIsBetter: true },
                                                        { label: 'ROI', key: 'roi', suffix: '%', source: 'keyMetrics', decimals: 0, higherIsBetter: true },
                                                        { label: 'CO₂ Reduction', key: 'co2ReductionTons', suffix: ' t/yr', source: 'result', decimals: 2, higherIsBetter: true },
                                                    ].map((metric) => {
                                                        // Get all values for this metric to find best/worst
                                                        const values = comparisonAnalyses.map(a => {
                                                            if (metric.source === 'input') return a.inputData?.[metric.key];
                                                            if (metric.source === 'keyMetrics') return a.keyMetrics?.[metric.key];
                                                            return a.results?.[metric.key];
                                                        }).filter(v => v != null && !isNaN(v));

                                                        const bestValue = values.length > 0 ? (metric.higherIsBetter
                                                            ? Math.max(...values)
                                                            : Math.min(...values)) : null;
                                                        const worstValue = values.length > 0 ? (metric.higherIsBetter
                                                            ? Math.min(...values)
                                                            : Math.max(...values)) : null;

                                                        return (
                                                            <tr
                                                                key={metric.key}
                                                                className="hover:bg-white/[0.02] transition-colors"
                                                                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}
                                                            >
                                                                <td className="py-3 px-4 text-sm font-medium" style={{ color: '#94A3B8' }}>
                                                                    {metric.label}
                                                                </td>
                                                                {comparisonAnalyses.map((a) => {
                                                                    let value;
                                                                    if (metric.source === 'input') value = a.inputData?.[metric.key];
                                                                    else if (metric.source === 'keyMetrics') value = a.keyMetrics?.[metric.key];
                                                                    else value = a.results?.[metric.key];

                                                                    const formatted = metric.format
                                                                        ? formatINRCurrency(value, { decimals: metric.decimals || 0, showSymbol: false })
                                                                        : metric.decimals != null
                                                                            ? value?.toFixed(metric.decimals)
                                                                            : value;

                                                                    // Determine if this is best or worst
                                                                    const isBest = value != null && value === bestValue && values.length > 1;
                                                                    const isWorst = value != null && value === worstValue && values.length > 1 && bestValue !== worstValue;

                                                                    return (
                                                                        <td
                                                                            key={a.id}
                                                                            className="py-3 px-4 text-center text-sm font-medium"
                                                                            style={{
                                                                                color: isBest ? '#10B981' : isWorst ? '#F59E0B' : '#F1F5F9',
                                                                                background: isBest ? 'rgba(16, 185, 129, 0.08)' : isWorst ? 'rgba(245, 158, 11, 0.08)' : 'transparent'
                                                                            }}
                                                                        >
                                                                            {isBest && <span className="mr-1">🏆</span>}
                                                                            {metric.prefix || ''}{formatted || 'N/A'}{metric.suffix || ''}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        );
                                                    })}
                                                    <tr style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
                                                        <td className="py-3 px-4 text-sm font-semibold" style={{ color: '#818CF8' }}>
                                                            Investment Signal
                                                        </td>
                                                        {comparisonAnalyses.map((a) => (
                                                            <td key={a.id} className="py-3 px-4 text-center">
                                                                <StatusBadge signal={a.keyMetrics?.investmentSignal} />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Legend */}
                                        <div className="px-4 py-3 flex flex-wrap justify-center gap-6 text-xs" style={{ color: '#64748B', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-block w-3 h-3 rounded" style={{ background: 'rgba(16, 185, 129, 0.3)' }}></span>
                                                <span>🏆 Best Value</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="inline-block w-3 h-3 rounded" style={{ background: 'rgba(245, 158, 11, 0.3)' }}></span>
                                                <span>Needs Attention</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Quick Export Section */}
                {analyses.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 rounded-2xl p-6"
                        style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                        }}
                    >
                        <SectionHeader
                            icon="📥"
                            title="Bulk Export"
                            subtitle="Download all analyses in one file"
                        />
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => {
                                    const filename = exportComparisonToCSV(analyses);
                                    if (onShowToast && filename) {
                                        onShowToast(`Downloaded: ${filename}`, 3000);
                                    }
                                }}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                    color: '#818CF8',
                                }}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Download All as CSV
                            </button>
                        </div>
                    </motion.div>
                )}
            </section>

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                analysisCount={analyses.length}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </>
    );
};

export default ReportsPage;

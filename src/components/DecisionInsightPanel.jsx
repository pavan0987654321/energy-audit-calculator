import React from 'react';
import { motion } from 'framer-motion';

/**
 * Decision Insight Panel - Rule-based intelligence layer
 * Generates analyst-style recommendations based on calculated results
 */
const DecisionInsightPanel = ({ results, inputData }) => {
    if (!results || !inputData) return null;

    const { simplePaybackPeriod, irr, annualCostSavings, co2ReductionTons, npv } = results;
    const { initialInvestment, projectLife, equipmentName } = inputData;

    // Calculate benchmark comparisons
    const industryAvgPayback = 4.5; // years
    const paybackPerformance = ((industryAvgPayback - simplePaybackPeriod) / industryAvgPayback * 100).toFixed(0);
    const isAboveBenchmark = simplePaybackPeriod < industryAvgPayback;

    const totalSavings = annualCostSavings * projectLife;
    const roiMultiple = (totalSavings / initialInvestment).toFixed(1);

    const carbonOffset = (co2ReductionTons * projectLife).toFixed(1);
    const treesEquivalent = Math.round(co2ReductionTons * projectLife * 45); // ~45 trees per ton CO2/year

    // Generate dynamic insights
    const generateInsight = () => {
        if (irr > 30 && simplePaybackPeriod < 3) {
            return {
                verdict: 'Strongly Recommended',
                color: '#10B981',
                summary: `This investment demonstrates exceptional capital efficiency with a ${simplePaybackPeriod.toFixed(1)}-year payback and ${irr.toFixed(1)}% IRR. The energy delta between current and proposed systems generates substantial recurring value.`,
                benchmark: isAboveBenchmark
                    ? `Outperforms industrial efficiency benchmarks by ${Math.abs(paybackPerformance)}%.`
                    : `Within industry standard payback parameters.`,
            };
        } else if (irr > 15 && simplePaybackPeriod < 5) {
            return {
                verdict: 'Recommended',
                color: '#6366F1',
                summary: `Based on the operating profile and energy delta, this investment achieves breakeven in ${simplePaybackPeriod.toFixed(1)} years with a ${irr.toFixed(1)}% return rate. Positive NPV indicates long-term value creation.`,
                benchmark: isAboveBenchmark
                    ? `Performance exceeds typical efficiency project benchmarks by ${Math.abs(paybackPerformance)}%.`
                    : `Meets standard investment criteria for energy efficiency.`,
            };
        } else if (irr > 8) {
            return {
                verdict: 'Conditionally Recommended',
                color: '#F59E0B',
                summary: `This investment presents moderate returns with ${simplePaybackPeriod.toFixed(1)}-year payback. Consider operational factors such as maintenance schedules and utilization rates that may affect realized savings.`,
                benchmark: `Recommend reviewing against alternative capital deployment options.`,
            };
        } else {
            return {
                verdict: 'Further Analysis Required',
                color: '#EF4444',
                summary: `Current parameters suggest extended payback timeline. Consider optimizing equipment sizing, negotiating procurement costs, or evaluating higher-efficiency alternatives.`,
                benchmark: `Investment may underperform relative to standard benchmarks.`,
            };
        }
    };

    const insight = generateInsight();
    const analysisDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${insight.color}08 0%, ${insight.color}03 100%)`,
                border: `1px solid ${insight.color}20`,
            }}
        >
            {/* Background accent */}
            <div
                className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ background: `${insight.color}15` }}
            />

            <div className="relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <motion.div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold"
                            style={{
                                background: `${insight.color}15`,
                                border: `2px solid ${insight.color}30`,
                                color: insight.color,
                            }}
                            animate={{ scale: [1, 1.03, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            {insight.verdict.includes('Strongly') ? '✓' : insight.verdict.includes('Required') ? '?' : '○'}
                        </motion.div>
                        <div>
                            <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#64748B' }}>
                                Investment Intelligence
                            </div>
                            <div
                                className="text-xl md:text-2xl font-bold"
                                style={{ fontFamily: "'Poppins', sans-serif", color: insight.color }}
                            >
                                {insight.verdict}
                            </div>
                        </div>
                    </div>

                    {/* Quick metrics */}
                    <div className="flex gap-4">
                        <div className="text-center px-4 py-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                            <div className="text-[10px] uppercase tracking-wide" style={{ color: '#64748B' }}>IRR</div>
                            <div className="text-lg font-bold tabular-nums" style={{ color: '#F1F5F9' }}>{irr.toFixed(1)}%</div>
                        </div>
                        <div className="text-center px-4 py-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                            <div className="text-[10px] uppercase tracking-wide" style={{ color: '#64748B' }}>Payback</div>
                            <div className="text-lg font-bold tabular-nums" style={{ color: '#F1F5F9' }}>{simplePaybackPeriod.toFixed(1)}y</div>
                        </div>
                        <div className="text-center px-4 py-2 rounded-xl" style={{ background: 'rgba(0,0,0,0.2)' }}>
                            <div className="text-[10px] uppercase tracking-wide" style={{ color: '#64748B' }}>ROI</div>
                            <div className="text-lg font-bold tabular-nums" style={{ color: '#F1F5F9' }}>{roiMultiple}x</div>
                        </div>
                    </div>
                </div>

                {/* Analysis Summary */}
                <div
                    className="p-5 rounded-xl mb-6"
                    style={{
                        background: 'rgba(0,0,0,0.15)',
                        borderLeft: `3px solid ${insight.color}`,
                    }}
                >
                    <p className="text-base leading-relaxed mb-3" style={{ color: '#E2E8F0' }}>
                        {insight.summary}
                    </p>
                    <p className="text-sm" style={{ color: '#94A3B8' }}>
                        <strong style={{ color: '#A5B4FC' }}>Benchmark Analysis:</strong> {insight.benchmark}
                    </p>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#64748B' }}>NPV</div>
                        <div className="text-sm font-bold tabular-nums" style={{ color: npv > 0 ? '#10B981' : '#F59E0B' }}>
                            ₹{(npv / 100000).toFixed(2)}L
                        </div>
                    </div>
                    <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#64748B' }}>Total Savings</div>
                        <div className="text-sm font-bold tabular-nums" style={{ color: '#10B981' }}>
                            ₹{(totalSavings / 100000).toFixed(2)}L
                        </div>
                    </div>
                    <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#64748B' }}>Carbon Offset</div>
                        <div className="text-sm font-bold tabular-nums" style={{ color: '#14B8A6' }}>
                            {carbonOffset}t CO₂
                        </div>
                    </div>
                    <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="text-[10px] uppercase tracking-wide mb-1" style={{ color: '#64748B' }}>Tree Equivalent</div>
                        <div className="text-sm font-bold tabular-nums" style={{ color: '#10B981' }}>
                            ~{treesEquivalent.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center gap-4 text-xs" style={{ color: '#64748B' }}>
                        <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Industry-standard emission factors
                        </span>
                        <span>•</span>
                        <span>Grid EF: 0.82 kgCO₂/kWh</span>
                    </div>
                    <div className="text-xs" style={{ color: '#475569' }}>
                        Analysis generated: {analysisDate}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default DecisionInsightPanel;

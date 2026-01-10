import React from 'react';
import { motion } from 'framer-motion';

/**
 * Comparison metric row with animated reveal
 */
const ComparisonRow = ({ label, before, after, unit, reduction, delay }) => {
  const reductionPercent = ((before - after) / before * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay }}
      className="grid grid-cols-4 gap-3 items-center py-4"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div>
        <span className="text-sm font-medium" style={{ color: '#E2E8F0' }}>{label}</span>
      </div>

      <div className="text-center">
        <span className="text-sm tabular-nums" style={{ color: '#F87171' }}>
          {before.toLocaleString('en-IN')} <span className="text-xs" style={{ color: '#64748B' }}>{unit}</span>
        </span>
      </div>

      <div className="text-center">
        <span className="text-sm tabular-nums" style={{ color: '#10B981' }}>
          {after.toLocaleString('en-IN')} <span className="text-xs" style={{ color: '#64748B' }}>{unit}</span>
        </span>
      </div>

      <div className="flex justify-end">
        <motion.span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold tabular-nums"
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10B981',
          }}
          whileHover={{ scale: 1.05 }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          {reductionPercent}%
        </motion.span>
      </div>
    </motion.div>
  );
};

/**
 * Scenario Evaluation - Before/After Comparison
 */
const SystemComparison = ({ results, inputData }) => {
  if (!results || !inputData) return null;

  const {
    existingAnnualConsumption,
    proposedAnnualConsumption,
    annualEnergySavings,
    existingAnnualCost,
    proposedAnnualCost,
    annualCostSavings,
    existingCarbonEmissions,
    proposedCarbonEmissions,
    co2ReductionTons,
  } = results;

  const comparisons = [
    {
      label: 'Energy Consumption',
      before: existingAnnualConsumption,
      after: proposedAnnualConsumption,
      unit: 'kWh/yr',
    },
    {
      label: 'Operating Cost',
      before: existingAnnualCost,
      after: proposedAnnualCost,
      unit: '₹/yr',
    },
    {
      label: 'Carbon Emissions',
      before: existingCarbonEmissions,
      after: proposedCarbonEmissions,
      unit: 't CO₂/yr',
    },
  ];

  const overallReduction = ((existingAnnualConsumption - proposedAnnualConsumption) / existingAnnualConsumption * 100).toFixed(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Decorative gradient */}
      <div
        className="absolute top-0 right-0 w-64 h-64 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16, 185, 129, 0.06) 0%, transparent 60%)' }}
      />

      {/* Header */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#8B5CF6' }} />
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>
              Comparative Analysis
            </span>
          </div>
          <h3
            className="text-xl md:text-2xl font-bold"
            style={{
              fontFamily: "'Poppins', sans-serif",
              color: '#F1F5F9',
              letterSpacing: '-0.02em',
            }}
          >
            Scenario Evaluation
          </h3>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Baseline vs. proposed system performance
          </p>
        </div>

        {/* Overall reduction badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.05) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(16, 185, 129, 0.15)' }}
          >
            <svg className="w-5 h-5" style={{ color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>
              Efficiency Gain
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: '#10B981' }}>
              {overallReduction}%
            </div>
          </div>
        </motion.div>
      </div>

      {/* Comparison Table */}
      <div className="relative">
        {/* Column Headers */}
        <div
          className="grid grid-cols-4 gap-3 pb-3 mb-2"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>
            Metric
          </div>
          <div className="text-center">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider"
              style={{
                background: 'rgba(248, 113, 113, 0.1)',
                color: '#F87171',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#F87171' }} />
              Baseline
            </span>
          </div>
          <div className="text-center">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider"
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                color: '#10B981',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#10B981' }} />
              Proposed
            </span>
          </div>
          <div className="text-right text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>
            Reduction
          </div>
        </div>

        {/* Data Rows */}
        {comparisons.map((comp, index) => (
          <ComparisonRow
            key={comp.label}
            {...comp}
            delay={0.2 + index * 0.1}
          />
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-4 rounded-xl text-center"
          style={{ background: 'rgba(99, 102, 241, 0.06)' }}
        >
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>
            Energy Saved
          </div>
          <div className="text-lg font-bold tabular-nums" style={{ color: '#A5B4FC' }}>
            {annualEnergySavings.toLocaleString('en-IN')} <span className="text-xs font-normal">kWh</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="p-4 rounded-xl text-center"
          style={{ background: 'rgba(16, 185, 129, 0.06)' }}
        >
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>
            Cost Saved
          </div>
          <div className="text-lg font-bold tabular-nums" style={{ color: '#10B981' }}>
            ₹{annualCostSavings.toLocaleString('en-IN')}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 rounded-xl text-center"
          style={{ background: 'rgba(20, 184, 166, 0.06)' }}
        >
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#64748B' }}>
            CO₂ Reduced
          </div>
          <div className="text-lg font-bold tabular-nums" style={{ color: '#14B8A6' }}>
            {co2ReductionTons.toFixed(2)} <span className="text-xs font-normal">t/yr</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SystemComparison;
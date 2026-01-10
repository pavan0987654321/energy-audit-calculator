import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts';

/**
 * Premium glassmorphic tooltip
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl p-4 min-w-[180px]"
      style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>
        Year {label}
      </div>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <span className="text-xs" style={{ color: '#94A3B8' }}>
            {entry.name === 'cumulativeSavings' ? 'Net Position' : entry.name}
          </span>
          <span
            className="text-sm font-bold tabular-nums"
            style={{ color: entry.value >= 0 ? '#10B981' : '#F59E0B' }}
          >
            ₹{(entry.value / 1000).toFixed(1)}K
          </span>
        </div>
      ))}
    </motion.div>
  );
};

/**
 * Capital Recovery Curve - Savings Projection Chart
 */
const SavingsChart = ({ chartData, paybackYear }) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!chartData || chartData.length === 0) return null;

  const totalSavings = chartData[chartData.length - 1]?.cumulativeSavings || 0;
  const peakSavings = Math.max(...chartData.map(d => d.cumulativeSavings));
  const projectLife = chartData.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setIsVisible(true)}
      transition={{ duration: 0.6 }}
      className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Depth layer effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 30%, rgba(16, 185, 129, 0.04) 0%, transparent 50%)',
        }}
      />

      {/* Header */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>
              Financial Projection
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
            Capital Recovery Curve
          </h3>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Cumulative savings trajectory over {projectLife}-year horizon
          </p>
        </div>

        {/* Summary badges */}
        <div className="flex gap-3">
          <div
            className="px-4 py-2 rounded-xl text-center"
            style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.15)' }}
          >
            <div className="text-[9px] uppercase tracking-wider" style={{ color: '#64748B' }}>Breakeven</div>
            <div className="text-sm font-bold tabular-nums" style={{ color: '#10B981' }}>
              Year {Math.ceil(paybackYear)}
            </div>
          </div>
          <div
            className="px-4 py-2 rounded-xl text-center"
            style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)' }}
          >
            <div className="text-[9px] uppercase tracking-wider" style={{ color: '#64748B' }}>Terminal Value</div>
            <div className="text-sm font-bold tabular-nums" style={{ color: '#A5B4FC' }}>
              ₹{(totalSavings / 100000).toFixed(2)}L
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="50%" stopColor="#10B981" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#14B8A6" />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />

            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
              tickFormatter={(value) => `Y${value}`}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 11 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              width={50}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Breakeven reference line */}
            <ReferenceLine
              x={Math.ceil(paybackYear)}
              stroke="#6366F1"
              strokeDasharray="4 4"
              strokeOpacity={0.5}
              label={{
                value: 'Breakeven',
                position: 'top',
                fill: '#6366F1',
                fontSize: 10,
                fontWeight: 600,
              }}
            />

            {/* Zero line */}
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" />

            {/* Area fill */}
            <Area
              type="monotone"
              dataKey="cumulativeSavings"
              fill="url(#savingsGradient)"
              stroke="none"
            />

            {/* Main line with animation */}
            <Line
              type="monotone"
              dataKey="cumulativeSavings"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: '#10B981',
                stroke: '#0D0F14',
                strokeWidth: 2,
              }}
              animationDuration={isVisible ? 2000 : 0}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Footer insights */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#475569' }}>
            Investment Phase
          </div>
          <div className="text-xs font-medium" style={{ color: '#94A3B8' }}>
            Year 0–{Math.ceil(paybackYear)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#475569' }}>
            Returns Phase
          </div>
          <div className="text-xs font-medium" style={{ color: '#94A3B8' }}>
            Year {Math.ceil(paybackYear) + 1}–{projectLife}
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#475569' }}>
            Annual Avg.
          </div>
          <div className="text-xs font-medium" style={{ color: '#10B981' }}>
            ₹{((totalSavings / projectLife) / 1000).toFixed(1)}K/yr
          </div>
        </div>
        <div className="text-center">
          <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#475569' }}>
            Peak Value
          </div>
          <div className="text-xs font-medium" style={{ color: '#A5B4FC' }}>
            ₹{(peakSavings / 100000).toFixed(2)}L
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SavingsChart;

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated counter with count-up effect
 */
const AnimatedValue = ({ value, prefix = '', suffix = '', decimals = 0, duration = 1.5, isPositive = true }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTime = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / (duration * 1000), 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * easeOut);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [value, duration]);

  const formattedValue = typeof value === 'number'
    ? displayValue.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
    : value;

  return (
    <span className="tabular-nums">
      {prefix}{formattedValue}{suffix}
    </span>
  );
};

/**
 * Premium metric card with 3D tilt effect
 */
const MetricCard = ({ icon, label, value, prefix, suffix, decimals, color, delay, isPositive = true }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl p-5 overflow-hidden cursor-default group"
      style={{
        background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.15s ease-out',
      }}
    >
      {/* Shine effect on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(105deg, transparent 40%, ${color}15 45%, transparent 50%)`,
          transform: 'translateX(-100%)',
          animation: 'none',
        }}
      />

      {/* Glow effect for positive values */}
      {isPositive && (
        <div
          className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl"
          style={{ background: `${color}15` }}
        />
      )}

      <div className="relative flex items-start gap-4">
        <motion.div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{
            background: `${color}15`,
            border: `1px solid ${color}25`,
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {icon}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: '#64748B' }}>
            {label}
          </div>
          <div
            className="text-2xl md:text-3xl font-bold truncate"
            style={{
              fontFamily: "'Poppins', sans-serif",
              color: color,
              letterSpacing: '-0.02em',
            }}
          >
            <AnimatedValue
              value={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
              isPositive={isPositive}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Investment Summary - Enterprise Results Display
 */
const ResultsSummary = ({ results, inputData }) => {
  if (!results) return null;

  const {
    annualEnergySavings,
    annualCostSavings,
    simplePaybackPeriod,
    npv,
    irr,
    co2ReductionTons
  } = results;

  // Determine investment verdict
  const getVerdict = () => {
    if (irr > 25 && simplePaybackPeriod < 3) {
      return { text: 'Highly Favorable', color: '#10B981', icon: '✓' };
    } else if (irr > 12 && simplePaybackPeriod < 5) {
      return { text: 'Favorable', color: '#6366F1', icon: '○' };
    } else if (irr > 6) {
      return { text: 'Marginal', color: '#F59E0B', icon: '△' };
    }
    return { text: 'Review Required', color: '#EF4444', icon: '!' };
  };

  const verdict = getVerdict();

  const metrics = [
    {
      icon: '⚡',
      label: 'Energy Delta',
      value: annualEnergySavings,
      suffix: ' kWh',
      decimals: 0,
      color: '#10B981',
    },
    {
      icon: '💰',
      label: 'Annual Savings',
      value: annualCostSavings,
      prefix: '₹',
      decimals: 0,
      color: '#6366F1',
    },
    {
      icon: '🎯',
      label: 'Payback Period',
      value: simplePaybackPeriod,
      suffix: ' yrs',
      decimals: 1,
      color: '#8B5CF6',
    },
    {
      icon: '📈',
      label: 'Net Present Value',
      value: npv,
      prefix: '₹',
      decimals: 0,
      color: npv >= 0 ? '#10B981' : '#F59E0B',
      isPositive: npv >= 0,
    },
    {
      icon: '📊',
      label: 'Internal Rate of Return',
      value: irr,
      suffix: '%',
      decimals: 1,
      color: irr >= 15 ? '#10B981' : irr >= 8 ? '#6366F1' : '#F59E0B',
    },
    {
      icon: '🌍',
      label: 'Carbon Reduction',
      value: co2ReductionTons,
      suffix: ' t/yr',
      decimals: 2,
      color: '#14B8A6',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>
              Analysis Complete
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
            Investment Summary
          </h2>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Financial metrics for {inputData?.equipmentName || 'energy efficiency project'}
          </p>
        </div>

        {/* Investment Verdict Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
          className="flex items-center gap-3 px-5 py-3 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${verdict.color}12 0%, ${verdict.color}06 100%)`,
            border: `1px solid ${verdict.color}25`,
          }}
        >
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
            style={{
              background: `${verdict.color}20`,
              color: verdict.color,
            }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {verdict.icon}
          </motion.div>
          <div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: '#64748B' }}>
              Investment Signal
            </div>
            <div className="text-lg font-bold" style={{ color: verdict.color }}>
              {verdict.text}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            {...metric}
            delay={0.1 + index * 0.08}
          />
        ))}
      </div>

      {/* Accuracy Note */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <svg className="w-3.5 h-3.5" style={{ color: '#475569' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs" style={{ color: '#475569' }}>
          Calculations based on provided parameters. Actual results may vary based on operational conditions.
        </span>
      </div>
    </motion.div>
  );
};

export default ResultsSummary;

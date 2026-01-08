import React from 'react';
import { evaluateInvestmentDecision } from '../utils/calculations';

const ResultsSummary = ({ results }) => {
  const {
    annualEnergySavings,
    annualCostSavings,
    simplePaybackPeriod,
    npv,
    irr,
    co2ReductionKg,
    co2ReductionTons
  } = results;

  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    if (value === Infinity) return '∞';
    return value.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const investmentDecision = evaluateInvestmentDecision(irr, simplePaybackPeriod);

  const stats = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      label: 'Annual Energy Savings',
      value: formatNumber(annualEnergySavings, 0),
      unit: 'kWh / year',
      color: 'text-secondary'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Annual Cost Savings',
      value: `₹ ${formatNumber(annualCostSavings, 0)}`,
      unit: 'per year',
      color: 'text-primary'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Payback Period',
      value: formatNumber(simplePaybackPeriod, 2),
      unit: 'years',
      color: simplePaybackPeriod <= 3 ? 'text-primary' : simplePaybackPeriod <= 5 ? 'text-accent' : 'text-accent'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'CO₂ Emission Reduction',
      value: co2ReductionTons?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      unit: 'tons CO₂ / year',
      color: 'text-primary'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Net Present Value',
      value: `₹ ${formatNumber(npv, 0)}`,
      unit: npv > 0 ? 'Profitable' : 'Loss',
      color: npv > 0 ? 'text-secondary' : 'text-accent'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      label: 'Internal Rate of Return',
      value: `${formatNumber(irr, 2)}%`,
      unit: 'annual return',
      color: irr >= 15 ? 'text-primary' : irr >= 10 ? 'text-accent' : 'text-accent'
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-semibold text-text-primary">
        Investment Analysis Results
      </h2>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className={`${stat.color} mb-4`}>
              {stat.icon}
            </div>
            <div className="text-text-secondary text-xs uppercase tracking-wider font-semibold mb-2">
              {stat.label}
            </div>
            <div className="text-text-primary text-3xl font-heading font-bold mb-1">
              {stat.value}
            </div>
            <div className="text-text-secondary text-sm">
              {stat.unit}
            </div>
          </div>
        ))}
      </div>

      {/* Investment Decision Card */}
      <div className={`glass-card p-6 border-2 ${investmentDecision.label === 'Highly Recommended' ? 'border-primary' :
          investmentDecision.label === 'Recommended' ? 'border-secondary' :
            investmentDecision.label === 'Acceptable' ? 'border-accent' : 'border-accent'
        }`}>
        <div className="text-center">
          <div className="text-text-secondary text-sm uppercase tracking-wider font-semibold mb-3">
            Investment Decision
          </div>
          <div className={`text-3xl font-heading font-bold mb-2 ${investmentDecision.label === 'Highly Recommended' ? 'text-primary' :
              investmentDecision.label === 'Recommended' ? 'text-secondary' :
                investmentDecision.label === 'Acceptable' ? 'text-accent' : 'text-accent'
            }`}>
            {investmentDecision.label}
          </div>
          <div className="text-text-secondary">
            {investmentDecision.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;

import React from 'react';

const SystemComparison = ({ inputData, results }) => {
  if (!inputData || !results) {
    return null;
  }

  const {
    existingPower,
    proposedPower,
    operatingHoursPerDay,
    operatingDaysPerYear,
    electricityCost
  } = inputData;

  const existingAnnualEnergy = existingPower * operatingHoursPerDay * operatingDaysPerYear;
  const existingAnnualCost = existingAnnualEnergy * electricityCost;
  const existingCO2Emissions = existingAnnualEnergy * 0.82 / 1000;

  const proposedAnnualEnergy = proposedPower * operatingHoursPerDay * operatingDaysPerYear;
  const proposedAnnualCost = proposedAnnualEnergy * electricityCost;
  const proposedCO2Emissions = proposedAnnualEnergy * 0.82 / 1000;

  const powerReduction = existingPower - proposedPower;
  const powerReductionPercent = (powerReduction / existingPower) * 100;

  const formatNumber = (value, decimals = 2) => {
    return value.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const comparisonData = [
    {
      label: 'Power Consumption',
      icon: '⚡',
      existing: `${formatNumber(existingPower)} kW`,
      proposed: `${formatNumber(proposedPower)} kW`,
      savings: `${formatNumber(powerReduction)} kW`,
    },
    {
      label: 'Annual Energy Usage',
      icon: '🔋',
      existing: `${formatNumber(existingAnnualEnergy, 0)} kWh`,
      proposed: `${formatNumber(proposedAnnualEnergy, 0)} kWh`,
      savings: `${formatNumber(results.annualEnergySavings, 0)} kWh`,
    },
    {
      label: 'Annual Operating Cost',
      icon: '💰',
      existing: `₹ ${formatNumber(existingAnnualCost, 0)}`,
      proposed: `₹ ${formatNumber(proposedAnnualCost, 0)}`,
      savings: `₹ ${formatNumber(results.annualCostSavings, 0)}`,
    },
    {
      label: 'CO₂ Emissions',
      icon: '🌍',
      existing: `${formatNumber(existingCO2Emissions)} tons/year`,
      proposed: `${formatNumber(proposedCO2Emissions)} tons/year`,
      savings: `${formatNumber(results.co2ReductionTons)} tons/year`,
    },
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-2xl font-semibold text-text-primary">
          System Comparison Analysis
        </h2>
        <div className="bg-primary/20 border border-primary/30 px-4 py-2 rounded-lg">
          <span className="text-primary font-semibold">
            {formatNumber(powerReductionPercent, 1)}% Power Reduction
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-border">
              <th className="text-left py-4 px-4 text-text-secondary font-semibold text-sm uppercase tracking-wider">
                Parameter
              </th>
              <th className="text-center py-4 px-4 text-text-secondary font-semibold text-sm uppercase tracking-wider">
                Existing System
              </th>
              <th className="text-center py-4 px-4 text-text-secondary font-semibold text-sm uppercase tracking-wider">
                Proposed System
              </th>
              <th className="text-center py-4 px-4 text-text-secondary font-semibold text-sm uppercase tracking-wider">
                Savings
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisonData.map((row, index) => (
              <tr key={index} className="border-b border-dark-border/50 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">{row.icon}</span>
                    <span className="text-text-primary font-medium">{row.label}</span>
                  </div>
                </td>
                <td className="text-center py-4 px-4">
                  <span className="text-text-primary font-mono">{row.existing}</span>
                </td>
                <td className="text-center py-4 px-4">
                  <span className="text-text-primary font-mono">{row.proposed}</span>
                </td>
                <td className="text-center py-4 px-4">
                  <span className="text-primary font-semibold font-mono">{row.savings}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-dark-border">
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="text-text-secondary text-sm mb-1">Total Annual Savings</div>
          <div className="text-primary text-2xl font-bold">
            ₹ {formatNumber(results.annualCostSavings, 0)}
          </div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="text-text-secondary text-sm mb-1">CO₂ Reduction</div>
          <div className="text-primary text-2xl font-bold">
            {formatNumber(results.co2ReductionTons)} tons/year
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemComparison;
import React from 'react';
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
  Area,
  Line,
  ComposedChart
} from 'recharts';

const SavingsChart = ({ initialInvestment = 0, annualCostSavings = 0, projectLife = 0 }) => {

  if (!projectLife || projectLife <= 0) {
    return null;
  }

  const generateChartData = () => {
    const data = [];
    let cumulativeSavings = 0;

    for (let year = 0; year <= projectLife; year++) {
      if (year === 0) {
        cumulativeSavings = -initialInvestment;
      } else {
        cumulativeSavings += annualCostSavings;
      }

      data.push({
        year,
        cumulativeSavings
      });
    }
    return data;
  };

  const chartData = generateChartData();
  const paybackYear = chartData.findIndex(d => d.cumulativeSavings >= 0);
  const validPaybackYear = paybackYear > 0 ? paybackYear : null;

  const formatCurrency = (value) => {
    if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white rounded-lg p-4 shadow-xl border-2 border-primary">
          <div className="font-heading font-semibold text-gray-900 mb-1 text-sm">Year {label}</div>
          <div className="text-2xl font-bold text-primary">
            ₹{payload[0].value.toLocaleString('en-IN')}
          </div>
          {validPaybackYear === label && (
            <div className="text-primary text-sm mt-2 font-semibold">
              ✓ Investment Recovered
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <h2 className="font-heading text-2xl font-semibold text-text-primary mb-6">
        Cumulative Savings Analysis
      </h2>

      {validPaybackYear && (
        <div className="bg-primary/20 border border-primary/30 rounded-lg p-4 mb-6">
          <div className="text-text-primary">
            <span className="font-semibold">Investment Recovery:</span> Project breaks even in{" "}
            <span className="font-bold text-primary">{validPaybackYear} year{validPaybackYear > 1 && 's'}</span>
          </div>
        </div>
      )}

      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F766E" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#0F766E" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="year"
            stroke="#9CA3AF"
            style={{ fontSize: '14px' }}
          />
          <YAxis
            tickFormatter={formatCurrency}
            stroke="#9CA3AF"
            style={{ fontSize: '14px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ color: '#E5E7EB' }}
          />

          <ReferenceLine y={0} stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />

          {validPaybackYear && (
            <ReferenceLine
              x={validPaybackYear}
              stroke="#0F766E"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{
                value: `Payback: Year ${validPaybackYear}`,
                position: 'top',
                fill: '#0F766E',
                fontSize: 14,
                fontWeight: 600
              }}
            />
          )}

          <Area
            type="monotone"
            dataKey="cumulativeSavings"
            fill="url(#savingsGradient)"
            stroke="#0F766E"
            strokeWidth={3}
            name="Cumulative Savings (₹)"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-dark-border">
        <div>
          <div className="text-text-secondary text-sm mb-1">Total Investment</div>
          <div className="text-text-primary text-xl font-bold">
            ₹{initialInvestment.toLocaleString('en-IN')}
          </div>
        </div>
        <div>
          <div className="text-text-secondary text-sm mb-1">Final Cumulative Savings</div>
          <div className="text-primary text-xl font-bold">
            ₹{chartData[chartData.length - 1]?.cumulativeSavings.toLocaleString('en-IN')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsChart;

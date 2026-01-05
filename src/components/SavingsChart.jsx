import React from 'react';
import { Card } from 'react-bootstrap';
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

  // 🛡️ SAFETY GUARD
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

  // FIX: prevent -1
  const paybackYear = chartData.findIndex(d => d.cumulativeSavings >= 0);
  const validPaybackYear = paybackYear > 0 ? paybackYear : null;

  const formatCurrency = (value) => {
    if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <Card className="shadow-sm border-primary">
          <Card.Body className="p-3">
            <h6 className="mb-2">Year {label}</h6>
            <p className="mb-0 fw-bold text-primary">
              ₹{payload[0].value.toLocaleString('en-IN')}
            </p>
            {validPaybackYear === label && (
              <p className="mb-0 text-success small mt-2">
                <i className="bi bi-check-circle-fill me-1"></i>
                Investment Recovered
              </p>
            )}
          </Card.Body>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card className="shadow-lg border-0 fade-in">
      <Card.Header className="gradient-teal text-white">
        <h4 className="mb-0">
          <i className="bi bi-graph-up me-2"></i>
          Cumulative Savings Analysis
        </h4>
      </Card.Header>

      <Card.Body className="p-4">

        {validPaybackYear && (
          <div className="alert alert-success mb-4">
            <strong>Investment Recovery:</strong> Project breaks even in{" "}
            <strong>{validPaybackYear} year{validPaybackYear > 1 && 's'}</strong>
          </div>
        )}

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={formatCurrency} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />

            <ReferenceLine
              y={0}
              stroke="#10b981"
              strokeDasharray="5 5"
              label={{ value: 'Break-even', position: 'right' }}
            />

            {validPaybackYear && (
              <ReferenceLine
                x={validPaybackYear}
                stroke="#f59e0b"
                strokeDasharray="5 5"
                label={{ value: `Year ${validPaybackYear}`, position: 'top' }}
              />
            )}

            <Area
              type="monotone"
              dataKey="cumulativeSavings"
              fill="url(#savingsGradient)"
              stroke="none"
            />

            <Line
              type="monotone"
              dataKey="cumulativeSavings"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              name="Cumulative Savings"
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="row mt-4 text-center">
          <div className="col-md-4">
            <strong className="text-danger">
              ₹{initialInvestment.toLocaleString('en-IN')}
            </strong>
            <div className="small">Initial Investment</div>
          </div>

          <div className="col-md-4">
            <strong className="text-success">
              ₹{annualCostSavings.toLocaleString('en-IN')}
            </strong>
            <div className="small">Annual Savings</div>
          </div>

          <div className="col-md-4">
            <strong className="text-primary">
              ₹{chartData[projectLife]?.cumulativeSavings.toLocaleString('en-IN')}
            </strong>
            <div className="small">Total Cumulative</div>
          </div>
        </div>

      </Card.Body>
    </Card>
  );
};

export default SavingsChart;

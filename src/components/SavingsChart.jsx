import React from 'react';
import { Card } from 'react-bootstrap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';

const SavingsChart = ({ initialInvestment, annualCostSavings, projectLife }) => {
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
        cumulativeSavings,
        breakEven: 0
      });
    }
    
    return data;
  };

  const chartData = generateChartData();
  const paybackYear = chartData.findIndex(d => d.cumulativeSavings >= 0);

  const formatCurrency = (value) => {
    if (Math.abs(value) >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Card className="shadow-sm border-primary">
          <Card.Body className="p-3">
            <h6 className="mb-2">Year {label}</h6>
            <p className="mb-0 text-primary fw-bold">
              Cumulative: ₹{payload[0].value.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
            </p>
            {label === paybackYear && (
              <p className="mb-0 text-success small mt-2">
                <i className="bi bi-check-circle-fill me-1"></i>
                Investment Recovered!
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
        {paybackYear > 0 && paybackYear <= projectLife && (
          <div className="alert alert-success d-flex align-items-center mb-4">
            <i className="bi bi-check-circle-fill fs-4 me-3"></i>
            <div>
              <strong>Investment Recovery Point:</strong> Year {paybackYear} — 
              Project breaks even in <strong>{paybackYear} {paybackYear === 1 ? 'year' : 'years'}</strong>
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <defs>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#11998e" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#38ef7d" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="year" 
              label={{ value: 'Year', position: 'insideBottom', offset: -10, style: { fontWeight: 'bold' } }}
              stroke="#666"
            />
            <YAxis 
              tickFormatter={formatCurrency}
              label={{ value: 'Cumulative Savings (₹)', angle: -90, position: 'insideLeft', style: { fontWeight: 'bold' } }}
              stroke="#666"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="top" 
              height={50}
              iconType="line"
              wrapperStyle={{ fontWeight: 600 }}
            />
            <ReferenceLine 
              y={0} 
              stroke="#10b981" 
              strokeDasharray="5 5" 
              strokeWidth={2}
              label={{ value: 'Break-even', position: 'right', fill: '#10b981', fontSize: 12, fontWeight: 'bold' }}
            />
            {paybackYear > 0 && paybackYear <= projectLife && (
              <ReferenceLine 
                x={paybackYear} 
                stroke="#f59e0b" 
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{ value: `Year ${paybackYear}`, position: 'top', fill: '#f59e0b', fontSize: 12, fontWeight: 'bold' }}
              />
            )}
            <Area
              type="monotone"
              dataKey="cumulativeSavings"
              fill="url(#colorSavings)"
              stroke="none"
            />
            <Line 
              type="monotone" 
              dataKey="cumulativeSavings" 
              stroke="#11998e" 
              strokeWidth={3}
              dot={{ fill: '#11998e', r: 4 }}
              activeDot={{ r: 6 }}
              name="Cumulative Savings"
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="row mt-4 g-3">
          <div className="col-md-4">
            <Card className="border-danger">
              <Card.Body className="text-center">
                <i className="bi bi-arrow-down-circle text-danger fs-3"></i>
                <div className="small text-muted mt-2">Initial Investment</div>
                <div className="h5 fw-bold text-danger">₹{initialInvestment.toLocaleString('en-IN')}</div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="border-success">
              <Card.Body className="text-center">
                <i className="bi bi-arrow-up-circle text-success fs-3"></i>
                <div className="small text-muted mt-2">Annual Savings</div>
                <div className="h5 fw-bold text-success">₹{annualCostSavings.toLocaleString('en-IN')}</div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="border-primary">
              <Card.Body className="text-center">
                <i className="bi bi-piggy-bank text-primary fs-3"></i>
                <div className="small text-muted mt-2">Total Cumulative</div>
                <div className="h5 fw-bold text-primary">₹{chartData[projectLife].cumulativeSavings.toLocaleString('en-IN')}</div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SavingsChart;

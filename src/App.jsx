import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EnergyInputForm from './components/EnergyInputForm';
import ResultsSummary from './components/ResultsSummary';
import DecisionInsightPanel from './components/DecisionInsightPanel';
import SavingsChart from './components/SavingsChart';
import SystemComparison from './components/SystemComparison';
import Footer from './components/Footer';

/**
 * Energy Audit Calculations
 */
const calculateResults = (data) => {
  const {
    existingPower,
    proposedPower,
    operatingHoursPerDay,
    operatingDaysPerYear,
    electricityCost,
    initialInvestment,
    projectLife,
    discountRate
  } = data;

  const annualOperatingHours = operatingHoursPerDay * operatingDaysPerYear;

  // Energy Calculations
  const existingAnnualConsumption = existingPower * annualOperatingHours;
  const proposedAnnualConsumption = proposedPower * annualOperatingHours;
  const annualEnergySavings = existingAnnualConsumption - proposedAnnualConsumption;

  // Cost Calculations
  const existingAnnualCost = existingAnnualConsumption * electricityCost;
  const proposedAnnualCost = proposedAnnualConsumption * electricityCost;
  const annualCostSavings = existingAnnualCost - proposedAnnualCost;

  // Financial Metrics
  const simplePaybackPeriod = initialInvestment / annualCostSavings;

  // NPV Calculation
  const r = discountRate / 100;
  let npv = -initialInvestment;
  for (let year = 1; year <= projectLife; year++) {
    npv += annualCostSavings / Math.pow(1 + r, year);
  }

  // IRR Calculation (Newton-Raphson method)
  let irr = 0.1;
  for (let i = 0; i < 100; i++) {
    let npvCalc = -initialInvestment;
    let npvDerivative = 0;
    for (let year = 1; year <= projectLife; year++) {
      npvCalc += annualCostSavings / Math.pow(1 + irr, year);
      npvDerivative -= year * annualCostSavings / Math.pow(1 + irr, year + 1);
    }
    const newIrr = irr - npvCalc / npvDerivative;
    if (Math.abs(newIrr - irr) < 0.0001) break;
    irr = newIrr;
  }

  // Carbon Calculations (Grid Emission Factor: 0.82 kgCO2/kWh for India)
  const gridEmissionFactor = 0.82;
  const existingCarbonEmissions = (existingAnnualConsumption * gridEmissionFactor) / 1000;
  const proposedCarbonEmissions = (proposedAnnualConsumption * gridEmissionFactor) / 1000;
  const co2ReductionTons = existingCarbonEmissions - proposedCarbonEmissions;

  // Chart Data
  const chartData = [];
  let cumulativeSavings = -initialInvestment;
  for (let year = 0; year <= projectLife; year++) {
    if (year === 0) {
      chartData.push({ year, cumulativeSavings: -initialInvestment, annualSavings: 0 });
    } else {
      cumulativeSavings += annualCostSavings;
      chartData.push({ year, cumulativeSavings, annualSavings: annualCostSavings });
    }
  }

  return {
    existingAnnualConsumption,
    proposedAnnualConsumption,
    annualEnergySavings,
    existingAnnualCost,
    proposedAnnualCost,
    annualCostSavings,
    simplePaybackPeriod,
    npv,
    irr: irr * 100,
    existingCarbonEmissions,
    proposedCarbonEmissions,
    co2ReductionTons,
    chartData
  };
};

/**
 * Premium Loading Spinner
 */
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#0D0F14' }}>
    <div className="relative">
      {/* Outer ring */}
      <motion.div
        className="w-16 h-16 rounded-full"
        style={{ border: '2px solid rgba(99, 102, 241, 0.2)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      {/* Inner ring */}
      <motion.div
        className="absolute inset-2 rounded-full"
        style={{
          border: '2px solid transparent',
          borderTopColor: '#6366F1',
          borderRightColor: '#10B981',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
      {/* Center dot */}
      <motion.div
        className="absolute inset-0 m-auto w-2 h-2 rounded-full"
        style={{ background: '#6366F1' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </div>
  </div>
);

/**
 * Main Application - Enterprise Energy Intelligence Platform
 */
function App() {
  const [results, setResults] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setInputData(formData);

    // Simulate processing delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 600));

    const calculatedResults = calculateResults(formData);
    setResults(calculatedResults);
    setIsLoading(false);

    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: '#0D0F14',
        color: '#F1F5F9',
      }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.015,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        {/* Analysis Engine Section */}
        <section id="analysis" className="mb-16">
          <EnergyInputForm onSubmit={handleSubmit} />
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative mb-4">
                <motion.div
                  className="w-12 h-12 rounded-full"
                  style={{ border: '2px solid rgba(99, 102, 241, 0.2)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-1 rounded-full"
                  style={{
                    border: '2px solid transparent',
                    borderTopColor: '#6366F1',
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <span className="text-sm" style={{ color: '#64748B' }}>
                Processing investment analysis...
              </span>
            </motion.div>
          )}

          {!isLoading && results && (
            <motion.div
              id="results-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Investment Summary */}
              <ResultsSummary results={results} inputData={inputData} />

              {/* Decision Intelligence Panel */}
              <DecisionInsightPanel results={results} inputData={inputData} />

              {/* Capital Recovery Curve */}
              <SavingsChart
                chartData={results.chartData}
                paybackYear={results.simplePaybackPeriod}
              />

              {/* Scenario Evaluation */}
              <SystemComparison results={results} inputData={inputData} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

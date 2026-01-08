import React, { useState } from 'react';

import EnergyInputForm from './components/EnergyInputForm';
import ResultsSummary from './components/ResultsSummary';
import SavingsChart from './components/SavingsChart';
import SystemComparison from './components/SystemComparison';

import {
  calculateBasicMetricsWithCO2,
  calculateNPV,
  calculateIRR
} from './utils/calculations';

function App() {
  const [results, setResults] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('calculator');

  const handleFormSubmit = async (formData) => {
    setIsCalculating(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const basicMetrics = calculateBasicMetricsWithCO2(formData);

    const npv = calculateNPV(
      formData.initialInvestment,
      basicMetrics.annualCostSavings,
      formData.discountRate,
      formData.projectLife
    );

    const irr = calculateIRR(
      formData.initialInvestment,
      basicMetrics.annualCostSavings,
      formData.projectLife
    );

    setResults({ ...basicMetrics, npv, irr });
    setInputData(formData);
    setIsCalculating(false);

    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setResults(null);
    setInputData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'calculator', label: 'Energy Calculator' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen">

      {/* ===== GLASSMORPHIC NAVBAR ===== */}
      <nav className="glass-navbar sticky top-0 z-50 no-print">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* 3D ANIMATED LOGO */}
            <div className="flex items-center space-x-3">
              <div className="group relative w-10 h-10 cursor-pointer">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Main logo */}
                <div className="relative w-10 h-10 bg-gradient-to-br from-primary via-secondary to-primary rounded-lg flex items-center justify-center shadow-lg transform transition-all duration-500 group-hover:rotate-[360deg] group-hover:scale-110">
                  {/* Inner glow */}
                  <div className="absolute inset-1 bg-gradient-to-br from-white/20 to-transparent rounded-md"></div>

                  {/* Lightning bolt icon */}
                  <svg className="w-6 h-6 text-white relative z-10 transform transition-transform duration-500 group-hover:scale-125" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                  </svg>

                  {/* Animated ring */}
                  <div className="absolute inset-0 rounded-lg border-2 border-white/30 animate-ping opacity-0 group-hover:opacity-75"></div>
                </div>
              </div>

              <span className="font-heading text-xl font-semibold text-text-primary">
                EnergyROI Pro
              </span>
            </div>

            {/* Navigation Links - IMPROVED */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 ${activeTab === item.id
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                    }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION - IMPROVED SPACING ===== */}
      <div className="relative overflow-hidden no-print">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10"></div>
        <div className="container mx-auto px-6 py-12 relative max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Energy Investment ROI Calculator
            </h1>
            <p className="text-text-secondary text-lg">
              Professional financial analysis for energy efficiency and renewable energy projects
            </p>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT - MAX WIDTH CONTAINER ===== */}
      <div className="container mx-auto px-6 py-8 max-w-7xl">

        <div id="calculator" className="mb-8">
          <EnergyInputForm onSubmit={handleFormSubmit} />
        </div>

        {isCalculating && (
          <div className="glass-card p-12 text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
            <p className="text-text-secondary">Calculating results…</p>
          </div>
        )}

        {results && inputData && !isCalculating && (
          <div id="results-section" className="space-y-8">

            <ResultsSummary results={results} />

            <SystemComparison inputData={inputData} results={results} />

            <SavingsChart
              initialInvestment={inputData.initialInvestment}
              annualCostSavings={results.annualCostSavings}
              projectLife={inputData.projectLife}
            />

            {/* IMPROVED ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 my-8 no-print">
              <button onClick={handleReset} className="btn-primary px-8 py-3 text-base">
                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New Calculation
              </button>
              <button onClick={() => window.print()} className="btn-secondary px-8 py-3 text-base">
                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Results
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===== MINIMAL FOOTER ===== */}
      <footer className="border-t border-dark-border mt-16 no-print">
        <div className="container mx-auto px-6 py-6 max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-text-secondary">
            <div className="mb-4 md:mb-0">
              <p>© {new Date().getFullYear()} EnergyROI Pro. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-6">
              <span>📞 9380452790</span>
              <span>📧 gajulapavan29@gmail.com</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;

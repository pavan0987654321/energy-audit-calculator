import React, { useState, Suspense, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import EnergyInputForm from './components/EnergyInputForm';
import ResultsSummary from './components/ResultsSummary';
import DecisionInsightPanel from './components/DecisionInsightPanel';
import SavingsChart from './components/SavingsChart';
import SystemComparison from './components/SystemComparison';
import ReportsPage from './components/ReportsPage';
import Footer from './components/Footer';
import { ToastContainer, useToast } from './components/Toast';
import { useAnalysisHistory } from './hooks/useAnalysisHistory';
import { exportToPDF, exportToCSV } from './utils/exportUtils';

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
 * Progress Indicator Component
 */
const ProgressIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Configuration', icon: '⚙️' },
    { id: 2, label: 'Analysis', icon: '📊' },
    { id: 3, label: 'Results', icon: '✓' },
  ];

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: currentStep >= step.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${currentStep >= step.id ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.06)'}`,
            }}
          >
            <span className="text-sm">{step.icon}</span>
            <span
              className="text-xs font-medium hidden sm:inline"
              style={{ color: currentStep >= step.id ? '#818CF8' : '#64748B' }}
            >
              {step.label}
            </span>
          </motion.div>
          {index < steps.length - 1 && (
            <div
              className="w-8 h-0.5 rounded-full"
              style={{
                background: currentStep > step.id
                  ? 'linear-gradient(90deg, #6366F1, #10B981)'
                  : 'rgba(255, 255, 255, 0.1)',
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * Recent Analyses Widget
 */
const RecentAnalysesWidget = ({ analyses, onView }) => {
  if (!analyses || analyses.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 rounded-2xl p-5"
      style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg">📋</span>
          <h3 className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>
            Recent Analyses
          </h3>
        </div>
        <a
          href="#reports"
          className="text-xs font-medium transition-colors hover:underline"
          style={{ color: '#6366F1' }}
        >
          View All →
        </a>
      </div>
      <div className="space-y-2">
        {analyses.slice(0, 3).map((analysis) => (
          <button
            key={analysis.id}
            onClick={() => onView(analysis)}
            className="w-full flex items-center justify-between p-3 rounded-xl transition-all hover:bg-white/[0.03] group"
            style={{ border: '1px solid rgba(255, 255, 255, 0.04)' }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{
                  background: `${analysis.keyMetrics?.investmentSignal?.color || '#6366F1'}15`,
                }}
              >
                ⚡
              </div>
              <div className="text-left">
                <div className="text-sm font-medium" style={{ color: '#F1F5F9' }}>
                  {analysis.projectName?.substring(0, 25) || 'Unnamed'}
                </div>
                <div className="text-xs" style={{ color: '#64748B' }}>
                  {new Date(analysis.timestamp).toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>
            <span
              className="text-xs font-medium px-2 py-1 rounded-full"
              style={{
                background: `${analysis.keyMetrics?.investmentSignal?.color || '#6366F1'}15`,
                color: analysis.keyMetrics?.investmentSignal?.color || '#6366F1',
              }}
            >
              {analysis.keyMetrics?.investmentSignal?.text || 'N/A'}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

/**
 * Results Action Buttons
 */
const ResultsActions = ({ onNewAnalysis, onModifyParams, onExportPDF, onExportCSV }) => (
  <div className="flex flex-wrap items-center gap-3 mb-8">
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onNewAnalysis}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        color: '#818CF8',
      }}
    >
      <span>+</span>
      New Analysis
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onModifyParams}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#94A3B8',
      }}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      Modify Parameters
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onExportPDF}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
      style={{
        background: 'rgba(16, 185, 129, 0.1)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        color: '#10B981',
      }}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Download PDF
    </motion.button>
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onExportCSV}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#94A3B8',
      }}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Download CSV
    </motion.button>
  </div>
);

/**
 * Main Application - Enterprise Energy Intelligence Platform
 */
function App() {
  const [results, setResults] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [newAnalysisId, setNewAnalysisId] = useState(null);

  // Analysis history hook
  const {
    analyses,
    saveAnalysis,
    getAnalysis,
    deleteAnalysis,
    clearHistory,
    getRecentAnalyses,
  } = useAnalysisHistory();

  // Toast notifications hook
  const { toasts, dismissToast, clearAllToasts, success: showSuccess, error: showError } = useToast();

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setInputData(formData);
    setCurrentStep(2);

    try {
      // Simulate processing delay for premium feel
      await new Promise(resolve => setTimeout(resolve, 1500));

      const calculatedResults = calculateResults(formData);
      setResults(calculatedResults);
      setIsLoading(false);
      setShowForm(false);
      setCurrentStep(3);

      // Save to history and get the new ID
      const savedId = saveAnalysis(formData, calculatedResults);
      setNewAnalysisId(savedId);

      // Show success toast
      showSuccess('Analysis saved to Reports!', 4000);

      // Smooth scroll to reports section to show saved analysis
      setTimeout(() => {
        document.getElementById('reports')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 500);

      // Clear new analysis highlight after 5 seconds
      setTimeout(() => {
        setNewAnalysisId(null);
      }, 5000);
    } catch (err) {
      setIsLoading(false);
      setCurrentStep(1);
      showError(`Error: ${err.message || 'Analysis failed. Please try again.'}`, 5000);
    }
  };

  const handleNewAnalysis = useCallback(() => {
    setResults(null);
    setInputData(null);
    setShowForm(true);
    setCurrentStep(1);

    setTimeout(() => {
      document.getElementById('analysis')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, []);

  const handleReset = useCallback(() => {
    // Clear analysis results
    setResults(null);
    setInputData(null);

    // Reset loading and step state
    setIsLoading(false);
    setCurrentStep(1);

    // Clear any pending toasts
    clearAllToasts();
  }, [clearAllToasts]);

  const handleModifyParams = useCallback(() => {
    setShowForm(true);
    setTimeout(() => {
      document.getElementById('analysis')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, []);

  const handleViewAnalysis = useCallback((analysis) => {
    setInputData(analysis.inputData);
    setResults(analysis.results);
    setShowForm(false);
    setCurrentStep(3);

    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }, []);

  const handleExportPDF = useCallback(() => {
    if (results && inputData) {
      const analysis = {
        id: `export_${Date.now()}`,
        timestamp: new Date().toISOString(),
        projectName: inputData.equipmentName,
        inputData,
        results,
      };
      exportToPDF(analysis);
    }
  }, [results, inputData]);

  const handleExportCSV = useCallback(() => {
    if (results && inputData) {
      const analysis = {
        id: `export_${Date.now()}`,
        timestamp: new Date().toISOString(),
        projectName: inputData.equipmentName,
        inputData,
        results,
      };
      exportToCSV(analysis);
    }
  }, [results, inputData]);

  const handleDeleteAnalysis = useCallback((id) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      deleteAnalysis(id);
    }
  }, [deleteAnalysis]);

  const handleClearHistory = useCallback(() => {
    clearHistory();
    showSuccess('All analyses deleted', 3000);
  }, [clearHistory, showSuccess]);

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

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 md:px-6 py-12 max-w-5xl">
        {/* Progress Indicator */}
        {(showForm || results) && (
          <ProgressIndicator currentStep={currentStep} />
        )}

        {/* Recent Analyses Widget (show when no results) */}
        {showForm && !results && (
          <RecentAnalysesWidget
            analyses={getRecentAnalyses(3)}
            onView={handleViewAnalysis}
          />
        )}

        {/* Analysis Engine Section */}
        <section id="analysis" className="mb-16">
          <AnimatePresence mode="wait">
            {showForm && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <EnergyInputForm onSubmit={handleSubmit} onReset={handleReset} isLoading={isLoading} />
              </motion.div>
            )}
          </AnimatePresence>
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
              {/* Results Action Buttons */}
              <ResultsActions
                onNewAnalysis={handleNewAnalysis}
                onModifyParams={handleModifyParams}
                onExportPDF={handleExportPDF}
                onExportCSV={handleExportCSV}
              />

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

        {/* Reports Section */}
        <ReportsPage
          analyses={analyses}
          newAnalysisId={newAnalysisId}
          onViewAnalysis={handleViewAnalysis}
          onDeleteAnalysis={handleDeleteAnalysis}
          onClearHistory={handleClearHistory}
          onShowToast={showSuccess}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { Container, Navbar, Nav, Button, Spinner, Card } from 'react-bootstrap';
import EnergyInputForm from './components/EnergyInputForm';
import ResultsSummary from './components/ResultsSummary';
import SavingsChart from './components/SavingsChart';
import { calculateBasicMetrics, calculateNPV, calculateIRR } from './utils/calculations';

function App() {
  const [results, setResults] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleFormSubmit = async (formData) => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Calculate basic metrics
    const basicMetrics = calculateBasicMetrics(formData);
    
    // Calculate NPV
    const npv = calculateNPV(
      formData.initialInvestment,
      basicMetrics.annualCostSavings,
      formData.discountRate,
      formData.projectLife
    );
    
    // Calculate IRR
    const irr = calculateIRR(
      formData.initialInvestment,
      basicMetrics.annualCostSavings,
      formData.projectLife
    );
    
    const calculatedResults = {
      ...basicMetrics,
      npv,
      irr
    };
    
    setResults(calculatedResults);
    setInputData(formData);
    setIsCalculating(false);
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleReset = () => {
    setResults(null);
    setInputData(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-vh-100">
      {/* Navbar */}
      <Navbar bg="white" expand="lg" className="navbar-custom sticky-top no-print">
        <Container>
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-circle p-2 me-2">
              <i className="bi bi-lightning-charge-fill fs-4"></i>
            </div>
            <span className="fw-bold fs-4">Energy Audit Calculator</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#features">
                <i className="bi bi-star-fill me-1"></i>
                Features
              </Nav.Link>
              <Nav.Link href="#calculator">
                <i className="bi bi-calculator-fill me-1"></i>
                Calculator
              </Nav.Link>
              <Nav.Link href="https://github.com" target="_blank">
                <i className="bi bi-github me-1"></i>
                GitHub
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <div className="hero-section no-print">
        <Container>
          <div className="text-center py-5">
            <h1 className="hero-title">
              ⚡ Energy Audit Investment Calculator
            </h1>
            <p className="hero-subtitle mb-4">
              Professional ROI analysis for energy efficiency projects
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <div className="badge bg-light text-dark p-3">
                <i className="bi bi-lightning-fill text-warning me-2"></i>
                Energy Savings
              </div>
              <div className="badge bg-light text-dark p-3">
                <i className="bi bi-currency-rupee text-success me-2"></i>
                Cost Analysis
              </div>
              <div className="badge bg-light text-dark p-3">
                <i className="bi bi-graph-up text-primary me-2"></i>
                NPV & IRR
              </div>
              <div className="badge bg-light text-dark p-3">
                <i className="bi bi-clock-history text-info me-2"></i>
                Payback Period
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-5">
        
        {/* Input Form Section */}
        <div id="calculator" className="mb-5">
          <EnergyInputForm onSubmit={handleFormSubmit} />
        </div>

        {/* Loading State */}
        {isCalculating && (
          <Card className="shadow-lg border-0 mb-5">
            <Card.Body className="text-center py-5">
              <Spinner animation="border" variant="primary" className="spinner-border-custom mb-3" />
              <h5 className="text-primary">Calculating investment returns...</h5>
              <p className="text-muted">Analyzing NPV, IRR, and payback period</p>
            </Card.Body>
          </Card>
        )}

        {/* Results Section */}
        {results && inputData && !isCalculating && (
          <div id="results-section">
            
            {/* Results Summary */}
            <div className="mb-4">
              <ResultsSummary results={results} />
            </div>

            {/* Savings Chart */}
            <div className="mb-4">
              <SavingsChart
                initialInvestment={inputData.initialInvestment}
                annualCostSavings={results.annualCostSavings}
                projectLife={inputData.projectLife}
              />
            </div>

            {/* Project Details Card */}
            <Card className="shadow-lg border-0 mb-4">
              <Card.Header className="gradient-orange text-white">
                <h5 className="mb-0">
                  <i className="bi bi-info-circle-fill me-2"></i>
                  Project Details
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="row g-4">
                  <div className="col-md-3">
                    <div className="border-start border-primary border-4 ps-3">
                      <small className="text-muted d-block">Equipment</small>
                      <strong>{inputData.equipmentName}</strong>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-start border-success border-4 ps-3">
                      <small className="text-muted d-block">Power Reduction</small>
                      <strong>{(inputData.existingPower - inputData.proposedPower).toFixed(2)} kW</strong>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-start border-warning border-4 ps-3">
                      <small className="text-muted d-block">Operating Schedule</small>
                      <strong>{inputData.operatingHoursPerDay}h × {inputData.operatingDaysPerYear}d</strong>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="border-start border-info border-4 ps-3">
                      <small className="text-muted d-block">Electricity Rate</small>
                      <strong>₹{inputData.electricityCost.toFixed(2)}/kWh</strong>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Action Buttons */}
            <div className="text-center mb-5 no-print">
              <Button 
                variant="primary" 
                size="lg" 
                onClick={handleReset}
                className="me-3"
              >
                <i className="bi bi-arrow-left-circle-fill me-2"></i>
                New Calculation
              </Button>
              <Button 
                variant="outline-primary" 
                size="lg"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer-fill me-2"></i>
                Print Results
              </Button>
            </div>
          </div>
        )}

        {/* Instructions - shown when no results */}
        {!results && !isCalculating && (
          <Card className="shadow-lg border-0 fade-in">
            <Card.Body className="p-5">
              <h3 className="text-center mb-4">
                <i className="bi bi-lightbulb-fill text-warning me-2"></i>
                How to Use This Calculator
              </h3>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                        <strong>1</strong>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5>Enter Equipment Details</h5>
                      <p className="text-muted">Provide equipment name and current power consumption specifications</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                        <strong>2</strong>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5>Proposed Improvements</h5>
                      <p className="text-muted">Enter expected power consumption after energy efficiency upgrades</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                        <strong>3</strong>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5>Financial Parameters</h5>
                      <p className="text-muted">Specify investment cost, project life, and discount rate for analysis</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex">
                    <div className="flex-shrink-0">
                      <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                        <strong>4</strong>
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5>View Results</h5>
                      <p className="text-muted">Get comprehensive analysis with NPV, IRR, and payback period</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </Container>

      {/* Footer */}
      <footer className="footer-custom no-print">
        <Container>
          <div className="row">
            <div className="col-md-6 mb-4">
              <h5 className="mb-3">
                <i className="bi bi-lightning-charge-fill me-2"></i>
                Energy Audit Calculator
              </h5>
              <p className="text-light">
                Professional-grade ROI calculator for energy efficiency projects. 
                Built with React, Bootstrap 5, and Recharts.
              </p>
            </div>
            <div className="col-md-3 mb-4">
              <h6 className="mb-3">Quick Links</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#calculator">
                    <i className="bi bi-calculator me-2"></i>
                    Calculator
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#features">
                    <i className="bi bi-star me-2"></i>
                    Features
                  </a>
                </li>
                <li className="mb-2">
                  <a href="https://github.com">
                    <i className="bi bi-github me-2"></i>
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-md-3 mb-4">
              <h6 className="mb-3">Technologies</h6>
              <div className="d-flex flex-wrap gap-2">
                <span className="badge bg-secondary">React 18</span>
                <span className="badge bg-secondary">Bootstrap 5</span>
                <span className="badge bg-secondary">Recharts</span>
              </div>
            </div>
          </div>
          
        </Container>
      </footer>
    </div>
  );
}

export default App;

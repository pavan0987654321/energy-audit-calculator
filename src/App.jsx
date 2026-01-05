import React, { useState } from 'react';
import { Container, Navbar, Nav, Button, Spinner, Card } from 'react-bootstrap';

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

  return (
    <div className="min-vh-100">

      {/* ===== NAVBAR ===== */}
      <Navbar bg="white" expand="lg" className="navbar-custom sticky-top no-print">
        <Container>
          <Navbar.Brand className="fw-bold fs-4 text-primary">
            ⚡ Energy Audit Calculator
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="ms-auto">
              <Nav.Link href="#features">⭐ Features</Nav.Link>
              <Nav.Link href="#calculator">🧮 Calculator</Nav.Link>
              <Nav.Link href="https://github.com" target="_blank">🐙 GitHub</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ===== HERO ===== */}
      <div className="hero-section no-print">
        <Container className="text-center py-5">
          <h1 className="hero-title">⚡ Energy Audit Investment Calculator</h1>
          <p className="hero-subtitle">
            Professional ROI analysis for energy efficiency projects
          </p>
        </Container>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <Container className="py-5">

        <div id="calculator" className="mb-5">
          <EnergyInputForm onSubmit={handleFormSubmit} />
        </div>

        {isCalculating && (
          <Card className="shadow-lg border-0 mb-5">
            <Card.Body className="text-center py-5">
              <Spinner animation="border" />
              <p className="mt-3">Calculating results…</p>
            </Card.Body>
          </Card>
        )}

        {results && inputData && !isCalculating && (
          <div id="results-section">

            <ResultsSummary results={results} />

            <SystemComparison inputData={inputData} results={results} />

            <SavingsChart
              initialInvestment={inputData.initialInvestment}
              annualCostSavings={results.annualCostSavings}
              projectLife={inputData.projectLife}
            />

            <div className="text-center my-5 no-print">
              <Button onClick={handleReset} className="me-3">
                New Calculation
              </Button>
              <Button variant="outline-primary" onClick={() => window.print()}>
                Print Results
              </Button>
            </div>
          </div>
        )}
      </Container>

      {/* ===== FOOTER ===== */}
      <footer className="footer-custom no-print">
        <Container>
          <div className="row">

            <div className="col-md-4 mb-4">
              <h5>⚡ Energy Audit Calculator</h5>
              <p>
                Professional-grade ROI calculator for energy efficiency projects.
                Built with React, Bootstrap 5, and Recharts.
              </p>
            </div>

            <div className="col-md-4 mb-4">
              <h6>Quick Links</h6>
              <ul className="list-unstyled">
                <li>🧮 Calculator</li>
                <li>⭐ Features</li>
                <li>🐙 GitHub</li>
              </ul>
            </div>

            <div className="col-md-4 mb-4">
              <h6>Contact</h6>
              <p>📞 <strong>9380452790</strong></p>
              <p>📧 <strong>gajulapavan29@gmail.com</strong></p>
            </div>

          </div>

          <div className="text-center mt-3 small">
            © {new Date().getFullYear()} Energy Audit Calculator
          </div>
        </Container>
      </footer>

    </div>
  );
}

export default App;

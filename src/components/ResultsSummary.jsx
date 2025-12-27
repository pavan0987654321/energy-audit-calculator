import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';

const ResultsSummary = ({ results }) => {
  const {
    annualEnergySavings,
    annualCostSavings,
    simplePaybackPeriod,
    npv,
    irr
  } = results;

  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined || isNaN(value)) return 'N/A';
    if (value === Infinity) return '∞';
    return value.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const getRecommendation = () => {
    if (npv > 100000 && simplePaybackPeriod <= 3 && irr >= 20) {
      return { text: '✓ Highly Recommended', variant: 'success', class: 'gradient-green' };
    } else if (npv > 50000 && simplePaybackPeriod <= 5 && irr >= 15) {
      return { text: '✓ Recommended', variant: 'success', class: 'gradient-teal' };
    } else if (npv > 0 && simplePaybackPeriod <= 8 && irr >= 10) {
      return { text: '⚠ Consider Carefully', variant: 'warning', class: 'gradient-yellow' };
    } else {
      return { text: '✗ Not Viable', variant: 'danger', class: 'gradient-red' };
    }
  };

  const recommendation = getRecommendation();

  return (
    <div className="fade-in">
      <Card className="shadow-lg border-0 mb-4">
        <Card.Header className="gradient-purple text-white">
          <h4 className="mb-0">
            <i className="bi bi-graph-up-arrow me-2"></i>
            Investment Analysis Results
          </h4>
        </Card.Header>
        <Card.Body className="p-4">
          <Row>
            {/* Annual Energy Savings */}
            <Col lg={4} md={6} className="mb-3">
              <Card className="metric-card gradient-blue text-white h-100">
                <Card.Body className="text-center">
                  <i className="bi bi-lightning-charge display-4 mb-2"></i>
                  <div className="metric-label">Annual Energy Savings</div>
                  <div className="metric-value">{formatNumber(annualEnergySavings, 0)}</div>
                  <div className="metric-unit">kWh/year</div>
                </Card.Body>
              </Card>
            </Col>

            {/* Annual Cost Savings */}
            <Col lg={4} md={6} className="mb-3">
              <Card className="metric-card gradient-green text-white h-100">
                <Card.Body className="text-center">
                  <i className="bi bi-currency-rupee display-4 mb-2"></i>
                  <div className="metric-label">Annual Cost Savings</div>
                  <div className="metric-value">₹ {formatNumber(annualCostSavings, 0)}</div>
                  <div className="metric-unit">per year</div>
                </Card.Body>
              </Card>
            </Col>

            {/* Payback Period */}
            <Col lg={4} md={6} className="mb-3">
              <Card className={`metric-card text-white h-100 ${
                simplePaybackPeriod <= 3 ? 'gradient-teal' :
                simplePaybackPeriod <= 5 ? 'gradient-yellow' : 'gradient-orange'
              }`}>
                <Card.Body className="text-center">
                  <i className="bi bi-clock-history display-4 mb-2"></i>
                  <div className="metric-label">Payback Period</div>
                  <div className="metric-value">{formatNumber(simplePaybackPeriod, 2)}</div>
                  <div className="metric-unit">years</div>
                </Card.Body>
              </Card>
            </Col>

            {/* NPV */}
            <Col lg={4} md={6} className="mb-3">
              <Card className={`metric-card text-white h-100 ${
                npv > 0 ? 'gradient-indigo' : 'gradient-red'
              }`}>
                <Card.Body className="text-center">
                  <i className="bi bi-cash-stack display-4 mb-2"></i>
                  <div className="metric-label">Net Present Value</div>
                  <div className="metric-value">₹ {formatNumber(npv, 0)}</div>
                  <div className="metric-unit">{npv > 0 ? 'Profitable' : 'Loss'}</div>
                </Card.Body>
              </Card>
            </Col>

            {/* IRR */}
            <Col lg={4} md={6} className="mb-3">
              <Card className={`metric-card text-white h-100 ${
                irr >= 15 ? 'gradient-green' :
                irr >= 10 ? 'gradient-yellow' : 'gradient-orange'
              }`}>
                <Card.Body className="text-center">
                  <i className="bi bi-percent display-4 mb-2"></i>
                  <div className="metric-label">Internal Rate of Return</div>
                  <div className="metric-value">{formatNumber(irr, 2)}%</div>
                  <div className="metric-unit">annual return</div>
                </Card.Body>
              </Card>
            </Col>

            {/* Recommendation */}
            <Col lg={4} md={6} className="mb-3">
              <Card className={`metric-card ${recommendation.class} text-white h-100`}>
                <Card.Body className="text-center d-flex flex-column justify-content-center">
                  <i className="bi bi-star-fill display-4 mb-2"></i>
                  <div className="metric-label">Investment Decision</div>
                  <div className="metric-value" style={{fontSize: '2rem'}}>
                    {recommendation.text}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ResultsSummary;

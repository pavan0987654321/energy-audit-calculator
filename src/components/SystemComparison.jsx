import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';

const SystemComparison = ({ inputData, results }) => {
  // Guard clause for missing data
  if (!inputData || !results) {
    return null;
  }

  // Extract input data
  const {
    existingPower,
    proposedPower,
    operatingHoursPerDay,
    operatingDaysPerYear,
    electricityCost
  } = inputData;

  // Calculate existing system metrics
  const existingAnnualEnergy = existingPower * operatingHoursPerDay * operatingDaysPerYear;
  const existingAnnualCost = existingAnnualEnergy * electricityCost;
  const existingCO2Emissions = existingAnnualEnergy * 0.82 / 1000; // tons CO₂/year

  // Calculate proposed system metrics
  const proposedAnnualEnergy = proposedPower * operatingHoursPerDay * operatingDaysPerYear;
  const proposedAnnualCost = proposedAnnualEnergy * electricityCost;
  const proposedCO2Emissions = proposedAnnualEnergy * 0.82 / 1000; // tons CO₂/year

  // Calculate reductions
  const powerReduction = existingPower - proposedPower;
  const powerReductionPercent = (powerReduction / existingPower) * 100;

  // Format number helper
  const formatNumber = (value, decimals = 2) => {
    return value.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  return (
    <Card className="shadow-lg border-0 mb-4">
      <Card.Header className="bg-gradient-to-r from-orange-500 to-pink-500" style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      }}>
        <div className="d-flex justify-content-between align-items-center text-white">
          <h5 className="mb-0">
            <i className="bi bi-arrow-left-right me-2"></i>
            System Comparison Analysis
          </h5>
          <Badge bg="light" text="dark" className="px-3 py-2">
            <i className="bi bi-lightning-charge-fill text-warning me-1"></i>
            {formatNumber(powerReductionPercent, 1)}% Power Reduction
          </Badge>
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        <Table responsive hover className="mb-0">
          <thead className="table-light">
            <tr>
              <th className="py-3 ps-4" style={{ width: '35%' }}>
                <i className="bi bi-list-ul me-2 text-primary"></i>
                Parameter
              </th>
              <th className="py-3 text-center" style={{ width: '32.5%' }}>
                <i className="bi bi-exclamation-triangle-fill me-2 text-warning"></i>
                Existing System
              </th>
              <th className="py-3 text-center" style={{ width: '32.5%' }}>
                <i className="bi bi-check-circle-fill me-2 text-success"></i>
                Proposed System
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Power Consumption Row */}
            <tr>
              <td className="ps-4 py-3">
                <i className="bi bi-lightning-fill me-2 text-primary"></i>
                <strong>Power Consumption</strong>
              </td>
              <td className="text-center py-3">
                <div className="d-flex flex-column align-items-center">
                  <span className="fs-5 fw-bold text-danger">
                    {formatNumber(existingPower)} kW
                  </span>
                  <Badge bg="danger" className="mt-1">
                    Higher Consumption
                  </Badge>
                </div>
              </td>
              <td className="text-center py-3">
                <div className="d-flex flex-column align-items-center">
                  <span className="fs-5 fw-bold text-success">
                    {formatNumber(proposedPower)} kW
                  </span>
                  <Badge bg="success" className="mt-1">
                    <i className="bi bi-arrow-down me-1"></i>
                    Reduced by {formatNumber(powerReduction)} kW
                  </Badge>
                </div>
              </td>
            </tr>

            {/* Annual Energy Consumption Row */}
            <tr className="bg-light">
              <td className="ps-4 py-3">
                <i className="bi bi-calendar-check me-2 text-primary"></i>
                <strong>Annual Energy Consumption</strong>
              </td>
              <td className="text-center py-3">
                <div className="d-flex flex-column align-items-center">
                  <span className="fs-5 fw-bold text-warning">
                    {formatNumber(existingAnnualEnergy, 0)} kWh
                  </span>
                  <small className="text-muted">per year</small>
                </div>
              </td>
              <td className="text-center py-3">
                <div className="d-flex flex-column align-items-center">
                  <span className="fs-5 fw-bold text-success">
                    {formatNumber(proposedAnnualEnergy, 0)} kWh
                  </span>
                  <small className="text-success fw-semibold">
                    <i className="bi bi-arrow-down-circle-fill me-1"></i>
                    Saves {formatNumber(results.annualEnergySavings, 0)} kWh
                  </small>
                </div>
              </td>
            </tr>

            {/* Annual Electricity Cost Row */}
            <tr>
              <td className="ps-4 py-3">
                <i className="bi bi-currency-rupee me-2 text-primary"></i>
                <strong>Annual Electricity Cost</strong>
              </td>
              <td className="text-center py-3">
                <div className="d-flex flex-column align-items-center">
                  <span className="fs-4 fw-bold text-danger">
                    ₹ {formatNumber(existingAnnualCost, 0)}
                  </span>
                  <small className="text-muted">per year</small>
                </div>
              </td>
              <td className="text-center py-3">
                <div className="d-flex flex-column align-items-center">
                  <span className="fs-4 fw-bold text-success">
                    ₹ {formatNumber(proposedAnnualCost, 0)}
                  </span>
                  <small className="text-success fw-semibold">
                    <i className="bi bi-piggy-bank-fill me-1"></i>
                    Saves ₹ {formatNumber(results.annualCostSavings, 0)}
                  </small>
                </div>
              </td>
            </tr>

            {/* CO₂ Emissions Row */}
            <tr className="bg-light">
              <td className="ps-4 py-3">
                <i className="bi bi-cloud-fog2-fill me-2 text-primary"></i>
                <strong>CO₂ Emissions</strong>
                <div>
                  <small className="text-muted">
                    (Grid factor: 0.82 kg CO₂/kWh)
                  </small>
                </div>
              </td>
              <td className="text-center py-3">
                <div className="d-flex flex-column align-items-center">
                  <span className="fs-5 fw-bold text-warning">
                    {formatNumber(existingCO2Emissions)} tons
                  </span>
                  <Badge bg="warning" text="dark" className="mt-1">
                    Higher Emissions
                  </Badge>
                </div>
              </td>
              <td className="text-center py-3">
                <div className="d-flex flex-column align-items-center">
                  <span className="fs-5 fw-bold text-success">
                    {formatNumber(proposedCO2Emissions)} tons
                  </span>
                  <Badge bg="success" className="mt-1">
                    <i className="bi bi-tree-fill me-1"></i>
                    Reduces {formatNumber(results.co2ReductionTons)} tons
                  </Badge>
                </div>
              </td>
            </tr>

            {/* System Status Row */}
            <tr>
              <td className="ps-4 py-3">
                <i className="bi bi-shield-check me-2 text-primary"></i>
                <strong>System Status</strong>
              </td>
              <td className="text-center py-3">
                <div className="d-flex flex-column align-items-center">
                  <Badge 
                    bg="danger" 
                    className="px-3 py-2 fs-6"
                    style={{ minWidth: '180px' }}
                  >
                    <i className="bi bi-x-circle-fill me-2"></i>
                    Less Efficient
                  </Badge>
                  <small className="text-muted mt-2">
                    High energy consumption
                  </small>
                </div>
              </td>
              <td className="text-center py-3">
                <div className="d-flex flex-column align-items-center">
                  <Badge 
                    bg="success" 
                    className="px-3 py-2 fs-6"
                    style={{ minWidth: '180px' }}
                  >
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Energy Efficient
                  </Badge>
                  <small className="text-success mt-2">
                    Optimized performance
                  </small>
                </div>
              </td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>

      {/* Summary Footer */}
      <Card.Footer className="bg-light border-top">
        <div className="row text-center py-2">
          <div className="col-md-4">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-lightning-charge-fill text-primary fs-3 mb-2"></i>
              <small className="text-muted fw-semibold">POWER SAVED</small>
              <span className="fs-5 fw-bold text-primary">
                {formatNumber(powerReduction)} kW
              </span>
            </div>
          </div>
          <div className="col-md-4 border-start border-end">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-currency-rupee text-success fs-3 mb-2"></i>
              <small className="text-muted fw-semibold">ANNUAL SAVINGS</small>
              <span className="fs-5 fw-bold text-success">
                ₹ {formatNumber(results.annualCostSavings, 0)}
              </span>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex flex-column align-items-center">
              <i className="bi bi-tree-fill text-success fs-3 mb-2"></i>
              <small className="text-muted fw-semibold">CO₂ REDUCED</small>
              <span className="fs-5 fw-bold text-success">
                {formatNumber(results.co2ReductionTons)} tons/year
              </span>
            </div>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default SystemComparison;
import React, { useState } from 'react';
import { Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';

const EnergyInputForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    equipmentName: '',
    existingPower: '',
    proposedPower: '',
    operatingHoursPerDay: '',
    operatingDaysPerYear: '',
    electricityCost: '',
    initialInvestment: '',
    projectLife: '',
    discountRate: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.equipmentName.trim()) {
      newErrors.equipmentName = 'Equipment name is required';
    }

    const numericFields = [
      { name: 'existingPower', label: 'Existing power', min: 0.1 },
      { name: 'proposedPower', label: 'Proposed power', min: 0.01 },
      { name: 'operatingHoursPerDay', label: 'Operating hours', min: 0.1, max: 24 },
      { name: 'operatingDaysPerYear', label: 'Operating days', min: 1, max: 365 },
      { name: 'electricityCost', label: 'Electricity cost', min: 0.01 },
      { name: 'initialInvestment', label: 'Initial investment', min: 1 },
      { name: 'projectLife', label: 'Project life', min: 1, max: 50 },
      { name: 'discountRate', label: 'Discount rate', min: 0, max: 100 }
    ];

    numericFields.forEach(field => {
      const value = parseFloat(formData[field.name]);
      if (!formData[field.name] || isNaN(value) || value < field.min) {
        newErrors[field.name] = `${field.label} must be at least ${field.min}`;
      }
      if (field.max && value > field.max) {
        newErrors[field.name] = `${field.label} cannot exceed ${field.max}`;
      }
    });

    if (parseFloat(formData.proposedPower) >= parseFloat(formData.existingPower)) {
      newErrors.proposedPower = 'Proposed power must be less than existing power';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        equipmentName: formData.equipmentName,
        existingPower: parseFloat(formData.existingPower),
        operatingHoursPerDay: parseFloat(formData.operatingHoursPerDay),
        operatingDaysPerYear: parseFloat(formData.operatingDaysPerYear),
        proposedPower: parseFloat(formData.proposedPower),
        electricityCost: parseFloat(formData.electricityCost),
        initialInvestment: parseFloat(formData.initialInvestment),
        projectLife: parseFloat(formData.projectLife),
        discountRate: parseFloat(formData.discountRate)
      });
    }
  };

  const loadDemoData = () => {
    setFormData({
      equipmentName: 'Industrial Motor (50 HP)',
      existingPower: '37.3',
      proposedPower: '29.8',
      operatingHoursPerDay: '16',
      operatingDaysPerYear: '300',
      electricityCost: '7.5',
      initialInvestment: '185000',
      projectLife: '10',
      discountRate: '10'
    });
    setErrors({});
  };

  return (
    <Card className="shadow-lg border-0 fade-in">
      <Card.Header className="gradient-blue text-white">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            <i className="bi bi-lightning-charge-fill me-2"></i>
            Energy Audit Input
          </h4>
          <Button 
            variant="light" 
            size="sm" 
            onClick={loadDemoData}
            className="d-flex align-items-center"
          >
            <i className="bi bi-play-fill me-1"></i>
            Try Demo
          </Button>
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          
          {/* Equipment Name */}
          <Row className="mb-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label><i className="bi bi-gear-fill text-primary me-2"></i>Equipment Name *</Form.Label>
                <Form.Control
                  type="text"
                  name="equipmentName"
                  value={formData.equipmentName}
                  onChange={handleChange}
                  placeholder="e.g., Industrial Motor, LED Lighting System"
                  isInvalid={!!errors.equipmentName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.equipmentName}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Power Consumption Section */}
          <Card className="mb-3 border-primary bg-light">
            <Card.Body>
              <h6 className="text-primary mb-3">
                <i className="bi bi-lightning-fill me-2"></i>
                Power Consumption
              </h6>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Existing Power (kW) *</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="existingPower"
                      value={formData.existingPower}
                      onChange={handleChange}
                      placeholder="0.00"
                      isInvalid={!!errors.existingPower}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.existingPower}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Proposed Power (kW) *</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="proposedPower"
                      value={formData.proposedPower}
                      onChange={handleChange}
                      placeholder="0.00"
                      isInvalid={!!errors.proposedPower}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.proposedPower}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Operating Schedule Section */}
          <Card className="mb-3 border-success bg-light">
            <Card.Body>
              <h6 className="text-success mb-3">
                <i className="bi bi-clock-fill me-2"></i>
                Operating Schedule
              </h6>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Hours per Day *</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      name="operatingHoursPerDay"
                      value={formData.operatingHoursPerDay}
                      onChange={handleChange}
                      placeholder="0.0"
                      isInvalid={!!errors.operatingHoursPerDay}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.operatingHoursPerDay}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Days per Year *</Form.Label>
                    <Form.Control
                      type="number"
                      step="1"
                      name="operatingDaysPerYear"
                      value={formData.operatingDaysPerYear}
                      onChange={handleChange}
                      placeholder="365"
                      isInvalid={!!errors.operatingDaysPerYear}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.operatingDaysPerYear}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Financial Parameters Section */}
          <Card className="mb-3 border-warning bg-light">
            <Card.Body>
              <h6 className="text-warning mb-3">
                <i className="bi bi-currency-rupee me-2"></i>
                Financial Parameters
              </h6>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Electricity Cost (₹/kWh) *</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="electricityCost"
                      value={formData.electricityCost}
                      onChange={handleChange}
                      placeholder="0.00"
                      isInvalid={!!errors.electricityCost}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.electricityCost}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Initial Investment (₹) *</Form.Label>
                    <Form.Control
                      type="number"
                      step="1"
                      name="initialInvestment"
                      value={formData.initialInvestment}
                      onChange={handleChange}
                      placeholder="0"
                      isInvalid={!!errors.initialInvestment}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.initialInvestment}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Project Life (years) *</Form.Label>
                    <Form.Control
                      type="number"
                      step="1"
                      name="projectLife"
                      value={formData.projectLife}
                      onChange={handleChange}
                      placeholder="10"
                      isInvalid={!!errors.projectLife}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.projectLife}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Group>
                    <Form.Label>Discount Rate (%) *</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.1"
                      name="discountRate"
                      value={formData.discountRate}
                      onChange={handleChange}
                      placeholder="10.0"
                      isInvalid={!!errors.discountRate}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.discountRate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Submit Button */}
          <div className="d-grid">
            <Button 
              variant="primary" 
              type="submit" 
              size="lg"
              className="d-flex align-items-center justify-content-center"
            >
              <i className="bi bi-calculator-fill me-2"></i>
              Calculate Investment Returns
              <i className="bi bi-arrow-right-circle-fill ms-2"></i>
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EnergyInputForm;

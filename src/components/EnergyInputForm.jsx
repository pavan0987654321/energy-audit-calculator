import React, { useState } from 'react';

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
    <div className="glass-card p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="font-heading text-2xl font-semibold text-text-primary">
          Energy Audit Input
        </h2>
        {/* PREMIUM TRY DEMO BUTTON */}
        <button
          type="button"
          onClick={loadDemoData}
          className="group relative px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium text-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/50 hover:scale-105 flex items-center gap-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <svg className="w-4 h-4 relative z-10" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
          </svg>
          <span className="relative z-10">Try Demo</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Equipment Name */}
        <div>
          <label className="label-dark">Equipment Name *</label>
          <input
            type="text"
            name="equipmentName"
            value={formData.equipmentName}
            onChange={handleChange}
            placeholder="e.g., Industrial Motor, LED Lighting System"
            className={`input-dark w-full ${errors.equipmentName ? 'border-accent' : ''}`}
          />
          {errors.equipmentName && (
            <p className="text-accent text-sm mt-1">{errors.equipmentName}</p>
          )}
        </div>

        {/* IMPROVED SECTIONS - SUBTLE STYLING */}
        {/* Power Consumption Section */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="font-heading text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Power Consumption
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Existing Power (kW) *</label>
              <input
                type="number"
                step="0.01"
                name="existingPower"
                value={formData.existingPower}
                onChange={handleChange}
                placeholder="0.00"
                className={`input-dark w-full ${errors.existingPower ? 'border-accent' : ''}`}
              />
              {errors.existingPower && (
                <p className="text-accent text-sm mt-1">{errors.existingPower}</p>
              )}
            </div>
            <div>
              <label className="label-dark">Proposed Power (kW) *</label>
              <input
                type="number"
                step="0.01"
                name="proposedPower"
                value={formData.proposedPower}
                onChange={handleChange}
                placeholder="0.00"
                className={`input-dark w-full ${errors.proposedPower ? 'border-accent' : ''}`}
              />
              {errors.proposedPower && (
                <p className="text-accent text-sm mt-1">{errors.proposedPower}</p>
              )}
            </div>
          </div>
        </div>

        {/* Operating Schedule Section */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="font-heading text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Operating Schedule
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Hours per Day *</label>
              <input
                type="number"
                step="0.1"
                name="operatingHoursPerDay"
                value={formData.operatingHoursPerDay}
                onChange={handleChange}
                placeholder="0.0"
                className={`input-dark w-full ${errors.operatingHoursPerDay ? 'border-accent' : ''}`}
              />
              {errors.operatingHoursPerDay && (
                <p className="text-accent text-sm mt-1">{errors.operatingHoursPerDay}</p>
              )}
            </div>
            <div>
              <label className="label-dark">Days per Year *</label>
              <input
                type="number"
                step="1"
                name="operatingDaysPerYear"
                value={formData.operatingDaysPerYear}
                onChange={handleChange}
                placeholder="365"
                className={`input-dark w-full ${errors.operatingDaysPerYear ? 'border-accent' : ''}`}
              />
              {errors.operatingDaysPerYear && (
                <p className="text-accent text-sm mt-1">{errors.operatingDaysPerDay}</p>
              )}
            </div>
          </div>
        </div>

        {/* Financial Parameters Section */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="font-heading text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Financial Parameters
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label-dark">Electricity Cost (₹/kWh) *</label>
              <input
                type="number"
                step="0.01"
                name="electricityCost"
                value={formData.electricityCost}
                onChange={handleChange}
                placeholder="0.00"
                className={`input-dark w-full ${errors.electricityCost ? 'border-accent' : ''}`}
              />
              {errors.electricityCost && (
                <p className="text-accent text-sm mt-1">{errors.electricityCost}</p>
              )}
            </div>
            <div>
              <label className="label-dark">Initial Investment (₹) *</label>
              <input
                type="number"
                step="1"
                name="initialInvestment"
                value={formData.initialInvestment}
                onChange={handleChange}
                placeholder="0"
                className={`input-dark w-full ${errors.initialInvestment ? 'border-accent' : ''}`}
              />
              {errors.initialInvestment && (
                <p className="text-accent text-sm mt-1">{errors.initialInvestment}</p>
              )}
            </div>
            <div>
              <label className="label-dark">Project Life (years) *</label>
              <input
                type="number"
                step="1"
                name="projectLife"
                value={formData.projectLife}
                onChange={handleChange}
                placeholder="10"
                className={`input-dark w-full ${errors.projectLife ? 'border-accent' : ''}`}
              />
              {errors.projectLife && (
                <p className="text-accent text-sm mt-1">{errors.projectLife}</p>
              )}
            </div>
            <div>
              <label className="label-dark">Discount Rate (%) *</label>
              <input
                type="number"
                step="0.1"
                name="discountRate"
                value={formData.discountRate}
                onChange={handleChange}
                placeholder="10.0"
                className={`input-dark w-full ${errors.discountRate ? 'border-accent' : ''}`}
              />
              {errors.discountRate && (
                <p className="text-accent text-sm mt-1">{errors.discountRate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-primary w-full text-lg py-4 font-semibold">
          Calculate Investment Returns
        </button>
      </form>
    </div>
  );
};

export default EnergyInputForm;

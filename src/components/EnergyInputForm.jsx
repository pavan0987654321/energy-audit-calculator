import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { validateField, validateForm, isFormValid } from '../utils/formValidation';
import { useFormDirty } from '../hooks/useFormDirty';
import UnsavedChangesModal from './UnsavedChangesModal';

/**
 * Premium Input Component - DEFINED OUTSIDE to prevent re-mounting
 */
const PremiumInput = ({
  name,
  label,
  unit,
  type = 'text',
  step,
  value,
  onChange,
  onFocus,
  onBlur,
  isFocused,
  hasError,
  errorMessage
}) => {
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <input
        type={type}
        step={step}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={label + (unit ? ` (${unit})` : '')}
        className="w-full px-4 py-3.5 rounded-xl transition-all duration-200 outline-none text-sm"
        style={{
          background: hasError ? 'rgba(245, 158, 11, 0.06)' : 'rgba(255, 255, 255, 0.03)',
          border: `1px solid ${hasError ? 'rgba(245, 158, 11, 0.4)' : isFocused ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
          color: '#F1F5F9',
          boxShadow: isFocused
            ? '0 0 0 3px rgba(99, 102, 241, 0.1), 0 4px 20px rgba(99, 102, 241, 0.1)'
            : 'none',
        }}
      />

      {hasError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold px-2 py-0.5 rounded"
          style={{
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#FBBF24'
          }}
        >
          {errorMessage}
        </motion.div>
      )}
    </motion.div>
  );
};

/**
 * Section Header Component
 */
const SectionHeader = ({ icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-4">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-base"
      style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
      }}
    >
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-semibold" style={{ color: '#F1F5F9' }}>
        {title}
      </h3>
      {subtitle && (
        <p className="text-[10px]" style={{ color: '#64748B' }}>{subtitle}</p>
      )}
    </div>
  </div>
);

/**
 * Energy Input Form - System Configuration
 */
const EnergyInputForm = ({ onSubmit, onReset, isLoading = false }) => {
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
  const [focusedField, setFocusedField] = useState(null);
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [touched, setTouched] = useState({});

  // Track unsaved changes
  const {
    isDirty,
    showModal,
    confirmNavigation,
    cancelNavigation,
    resetDirty,
  } = useFormDirty(formData);

  // Real-time validation on form data changes
  useEffect(() => {
    const formErrors = validateForm(formData);
    setErrors(formErrors);
    setIsSubmitDisabled(!isFormValid(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Mark field as touched on first interaction
    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleFocus = (name) => {
    setFocusedField(name);
  };

  const handleBlur = (name) => {
    setFocusedField(null);
    // Mark field as touched when user leaves the field
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const validate = useCallback(() => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields as touched on submit attempt
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    setShowErrors(true);

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
      // Reset dirty state after successful submission
      resetDirty();
    }
  };

  const loadDemoData = () => {
    setFormData({
      equipmentName: 'Industrial Motor Assembly (50 HP)',
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
    setShowErrors(false);
  };

  const clearForm = () => {
    // Check if form has any data
    const hasData = Object.values(formData).some(value => value !== '');

    // Show confirmation if form has data
    if (hasData) {
      const confirmed = window.confirm('Are you sure you want to reset the form? All entered data will be lost.');
      if (!confirmed) return;
    }

    // Reset all form fields to empty
    setFormData({
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

    // Clear all validation states
    setErrors({});
    setShowErrors(false);
    setTouched({});
    setIsSubmitDisabled(true);
    setFocusedField(null);

    // Call parent reset handler to clear results, toasts, etc.
    if (onReset) {
      onReset();
    }
  };

  // Helper to render input fields
  const renderInput = (name, label, unit, type = 'text', step) => (
    <PremiumInput
      key={name}
      name={name}
      label={label}
      unit={unit}
      type={type}
      step={step}
      value={formData[name]}
      onChange={handleChange}
      onFocus={() => handleFocus(name)}
      onBlur={() => handleBlur(name)}
      isFocused={focusedField === name}
      hasError={(showErrors || touched[name]) && !!errors[name]}
      errorMessage={errors[name]}
    />
  );

  const errorCount = Object.keys(errors).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Subtle gradient mesh background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.04) 0%, transparent 50%)',
        }}
      />

      {/* Header */}
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: '#6366F1' }}
            />
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#64748B' }}>
              Analysis Engine
            </span>
          </div>
          <h2
            className="text-2xl font-bold"
            style={{
              fontFamily: "'Poppins', sans-serif",
              color: '#F1F5F9',
              letterSpacing: '-0.02em'
            }}
          >
            System Configuration
          </h2>
          <p className="text-sm mt-1" style={{ color: '#64748B' }}>
            Define operating parameters for investment analysis
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            type="button"
            onClick={clearForm}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#94A3B8',
            }}
          >
            Reset
          </motion.button>
          <motion.button
            type="button"
            onClick={loadDemoData}
            whileHover={{ scale: 1.02, boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              color: '#A5B4FC',
            }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
            </svg>
            Demo Data
          </motion.button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative">
        {/* Asset Identification */}
        <div>
          <SectionHeader
            icon="🏢"
            title="Asset Identification"
            subtitle="Equipment or system under analysis"
          />
          {renderInput('equipmentName', 'Equipment Name or ID', null, 'text')}
        </div>

        {/* Power Configuration */}
        <div className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.12)' }}>
          <SectionHeader
            icon="⚡"
            title="Power Profile"
            subtitle="Current vs. proposed energy consumption"
          />
          <div className="grid md:grid-cols-2 gap-4">
            {renderInput('existingPower', 'Baseline Power', 'kW', 'number', '0.01')}
            {renderInput('proposedPower', 'Target Power', 'kW', 'number', '0.01')}
          </div>
        </div>

        {/* Operating Schedule */}
        <div className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.12)' }}>
          <SectionHeader
            icon="🕐"
            title="Operating Profile"
            subtitle="Annual utilization parameters"
          />
          <div className="grid md:grid-cols-2 gap-4">
            {renderInput('operatingHoursPerDay', 'Daily Runtime', 'hrs', 'number', '0.1')}
            {renderInput('operatingDaysPerYear', 'Annual Days', 'days', 'number', '1')}
          </div>
        </div>

        {/* Financial Parameters */}
        <div className="p-5 rounded-xl" style={{ background: 'rgba(0,0,0,0.12)' }}>
          <SectionHeader
            icon="💰"
            title="Financial Parameters"
            subtitle="Capital and operating cost inputs"
          />
          <div className="grid md:grid-cols-2 gap-4">
            {renderInput('electricityCost', 'Energy Rate', '₹/kWh', 'number', '0.01')}
            {renderInput('initialInvestment', 'Capital Investment', '₹', 'number', '1')}
            {renderInput('projectLife', 'Asset Life', 'years', 'number', '1')}
            {renderInput('discountRate', 'Discount Rate', '%', 'number', '0.1')}
          </div>
        </div>

        {/* Validation Error Summary */}
        {showErrors && errorCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl flex items-center gap-3"
            style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(245, 158, 11, 0.15)' }}
            >
              <svg className="w-4 h-4" style={{ color: '#FBBF24' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <span className="text-sm font-medium" style={{ color: '#FBBF24' }}>
              Complete all required fields to proceed ({errorCount} remaining)
            </span>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || isSubmitDisabled}
          className="w-full py-4 rounded-xl text-base font-semibold relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: isSubmitDisabled
              ? 'linear-gradient(135deg, #4B5563 0%, #374151 100%)'
              : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            color: 'white',
          }}
          whileHover={(isLoading || isSubmitDisabled) ? {} : {
            scale: 1.01,
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
          }}
          whileTap={(isLoading || isSubmitDisabled) ? {} : { scale: 0.99 }}
        >
          {/* Hover glow effect */}
          {!isLoading && !isSubmitDisabled && (
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(135deg, #818CF8 0%, #A78BFA 100%)' }}
            />
          )}

          <span className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Execute Investment Analysis
              </>
            )}
          </span>
        </motion.button>
      </form>

      {/* Unsaved Changes Warning Modal */}
      <UnsavedChangesModal
        isOpen={showModal}
        onDiscard={confirmNavigation}
        onKeepEditing={cancelNavigation}
      />
    </motion.div>
  );
};

export default EnergyInputForm;

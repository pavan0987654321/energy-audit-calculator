// ============================================
// ENERGY AUDIT CALCULATOR - CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate annual energy consumption in kWh
 */
export const calculateAnnualEnergyConsumption = (powerKW, hoursPerDay, daysPerYear) => {
  return powerKW * hoursPerDay * daysPerYear;
};

/**
 * Calculate annual energy savings in kWh
 */
export const calculateAnnualEnergySavings = (
  existingPowerKW,
  proposedPowerKW,
  hoursPerDay,
  daysPerYear
) => {
  const existingConsumption = calculateAnnualEnergyConsumption(
    existingPowerKW,
    hoursPerDay,
    daysPerYear
  );
  const proposedConsumption = calculateAnnualEnergyConsumption(
    proposedPowerKW,
    hoursPerDay,
    daysPerYear
  );
  return existingConsumption - proposedConsumption;
};

/**
 * Calculate annual cost savings
 */
export const calculateAnnualCostSavings = (annualEnergySavingsKWh, electricityCostPerKWh) => {
  return annualEnergySavingsKWh * electricityCostPerKWh;
};

/**
 * Calculate simple payback period
 */
export const calculateSimplePaybackPeriod = (initialInvestment, annualCostSavings) => {
  if (annualCostSavings <= 0) return Infinity;
  return initialInvestment / annualCostSavings;
};

/**
 * Calculate Net Present Value (NPV)
 */
export const calculateNPV = (initialInvestment, annualCashSavings, discountRate, projectLife) => {
  const r = discountRate / 100;
  let pv = 0;

  for (let year = 1; year <= projectLife; year++) {
    pv += annualCashSavings / Math.pow(1 + r, year);
  }

  return pv - initialInvestment;
};

/**
 * Calculate Internal Rate of Return (IRR)
 */
export const calculateIRR = (
  initialInvestment,
  annualCashSavings,
  projectLife,
  maxIterations = 100,
  tolerance = 0.0001
) => {
  let irr = 0.1;

  for (let i = 0; i < maxIterations; i++) {
    let npv = -initialInvestment;
    let derivative = 0;

    for (let year = 1; year <= projectLife; year++) {
      npv += annualCashSavings / Math.pow(1 + irr, year);
      derivative -= (year * annualCashSavings) / Math.pow(1 + irr, year + 1);
    }

    if (Math.abs(npv) < tolerance) return irr * 100;

    irr = irr - npv / derivative;
  }

  return irr * 100;
};

/**
 * Calculate all basic metrics
 */
export const calculateBasicMetrics = (inputData) => {
  const {
    existingPower,
    proposedPower,
    operatingHoursPerDay,
    operatingDaysPerYear,
    electricityCost,
    initialInvestment
  } = inputData;

  const annualEnergySavings = calculateAnnualEnergySavings(
    existingPower,
    proposedPower,
    operatingHoursPerDay,
    operatingDaysPerYear
  );

  const annualCostSavings = calculateAnnualCostSavings(
    annualEnergySavings,
    electricityCost
  );

  const simplePaybackPeriod = calculateSimplePaybackPeriod(
    initialInvestment,
    annualCostSavings
  );

  return {
    annualEnergySavings,
    annualCostSavings,
    simplePaybackPeriod
  };
};

/**
 * Investment decision logic
 */
export const evaluateInvestmentDecision = (irr, paybackPeriod) => {
  if (irr >= 15 && paybackPeriod <= 3) {
    return {
      label: 'Strongly Recommended',
      bgClass: 'bg-success',
      icon: 'bi-check-circle-fill',
      description: 'Excellent financial returns with quick payback.'
    };
  }

  if (irr >= 10 && paybackPeriod <= 5) {
    return {
      label: 'Marginal – Review Required',
      bgClass: 'bg-warning',
      icon: 'bi-exclamation-triangle-fill',
      description: 'Acceptable returns but needs review.'
    };
  }

  return {
    label: 'Not Recommended',
    bgClass: 'bg-danger',
    icon: 'bi-x-circle-fill',
    description: 'Low financial viability.'
  };
};

/**
 * CO₂ Emission Reduction
 */
export const calculateCO2Reduction = (annualEnergySavingsKWh, emissionFactor = 0.82) => {
  const co2ReductionKg = annualEnergySavingsKWh * emissionFactor;
  const co2ReductionTons = co2ReductionKg / 1000;

  return {
    co2ReductionKg,
    co2ReductionTons
  };
};

/**
 * Basic metrics + CO₂
 */
export const calculateBasicMetricsWithCO2 = (inputData) => {
  const basicMetrics = calculateBasicMetrics(inputData);
  const co2Data = calculateCO2Reduction(basicMetrics.annualEnergySavings);

  return {
    ...basicMetrics,
    ...co2Data
  };
};

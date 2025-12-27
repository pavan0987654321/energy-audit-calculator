// ============================================
// ENERGY AUDIT CALCULATOR - CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate annual energy consumption in kWh
 * @param {number} powerKW - Power consumption in kilowatts
 * @param {number} hoursPerDay - Operating hours per day
 * @param {number} daysPerYear - Operating days per year
 * @returns {number} Annual energy consumption in kWh
 */
export const calculateAnnualEnergyConsumption = (powerKW, hoursPerDay, daysPerYear) => {
  return powerKW * hoursPerDay * daysPerYear;
};

/**
 * Calculate annual energy savings in kWh
 * @param {number} existingPowerKW - Existing power consumption in kW
 * @param {number} proposedPowerKW - Proposed power consumption in kW
 * @param {number} hoursPerDay - Operating hours per day
 * @param {number} daysPerYear - Operating days per year
 * @returns {number} Annual energy savings in kWh
 */
export const calculateAnnualEnergySavings = (existingPowerKW, proposedPowerKW, hoursPerDay, daysPerYear) => {
  const existingConsumption = calculateAnnualEnergyConsumption(existingPowerKW, hoursPerDay, daysPerYear);
  const proposedConsumption = calculateAnnualEnergyConsumption(proposedPowerKW, hoursPerDay, daysPerYear);
  return existingConsumption - proposedConsumption;
};

/**
 * Calculate annual cost savings in rupees
 * @param {number} annualEnergySavingsKWh - Annual energy savings in kWh
 * @param {number} electricityCostPerKWh - Cost per kWh in rupees
 * @returns {number} Annual cost savings in rupees
 */
export const calculateAnnualCostSavings = (annualEnergySavingsKWh, electricityCostPerKWh) => {
  return annualEnergySavingsKWh * electricityCostPerKWh;
};

/**
 * Calculate simple payback period in years
 * @param {number} initialInvestment - Initial investment in rupees
 * @param {number} annualCostSavings - Annual cost savings in rupees
 * @returns {number} Payback period in years
 */
export const calculateSimplePaybackPeriod = (initialInvestment, annualCostSavings) => {
  if (annualCostSavings <= 0) return Infinity;
  return initialInvestment / annualCostSavings;
};

/**
 * Calculate Net Present Value (NPV)
 * @param {number} initialInvestment - Initial investment in rupees
 * @param {number} annualCashSavings - Annual cash savings in rupees
 * @param {number} discountRate - Discount rate as percentage
 * @param {number} projectLife - Project life in years
 * @returns {number} NPV in rupees
 */
export const calculateNPV = (initialInvestment, annualCashSavings, discountRate, projectLife) => {
  const discountRateDecimal = discountRate / 100;
  let presentValueOfSavings = 0;
  
  for (let year = 1; year <= projectLife; year++) {
    const discountFactor = Math.pow(1 + discountRateDecimal, year);
    presentValueOfSavings += annualCashSavings / discountFactor;
  }
  
  return presentValueOfSavings - initialInvestment;
};

/**
 * Calculate Internal Rate of Return (IRR) using Newton-Raphson method
 * @param {number} initialInvestment - Initial investment in rupees
 * @param {number} annualCashSavings - Annual cash savings in rupees
 * @param {number} projectLife - Project life in years
 * @param {number} maxIterations - Maximum iterations for convergence
 * @param {number} tolerance - Tolerance for convergence
 * @returns {number} IRR as percentage
 */
export const calculateIRR = (
  initialInvestment,
  annualCashSavings,
  projectLife,
  maxIterations = 100,
  tolerance = 0.0001
) => {
  let irr = 0.1; // Initial guess: 10%
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let npv = -initialInvestment;
    let derivative = 0;
    
    // Calculate NPV and its derivative at current IRR
    for (let year = 1; year <= projectLife; year++) {
      const discountFactor = Math.pow(1 + irr, year);
      npv += annualCashSavings / discountFactor;
      derivative -= (year * annualCashSavings) / Math.pow(1 + irr, year + 1);
    }
    
    // Check for convergence
    if (Math.abs(npv) < tolerance) {
      return irr * 100; // Convert to percentage
    }
    
    // Newton-Raphson update
    if (derivative !== 0) {
      irr = irr - npv / derivative;
    } else {
      break;
    }
    
    // Prevent unreasonable values
    if (irr < -0.99) irr = -0.99;
    if (irr > 10) irr = 10;
  }
  
  // If Newton-Raphson fails, use bisection method
  return calculateIRRBisection(initialInvestment, annualCashSavings, projectLife);
};

/**
 * Fallback IRR calculation using bisection method
 * @param {number} initialInvestment - Initial investment in rupees
 * @param {number} annualCashSavings - Annual cash savings in rupees
 * @param {number} projectLife - Project life in years
 * @param {number} maxIterations - Maximum iterations
 * @param {number} tolerance - Tolerance for convergence
 * @returns {number} IRR as percentage
 */
const calculateIRRBisection = (
  initialInvestment,
  annualCashSavings,
  projectLife,
  maxIterations = 100,
  tolerance = 0.0001
) => {
  let low = -0.99;
  let high = 5.0;
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const mid = (low + high) / 2;
    let npv = -initialInvestment;
    
    for (let year = 1; year <= projectLife; year++) {
      npv += annualCashSavings / Math.pow(1 + mid, year);
    }
    
    if (Math.abs(npv) < tolerance) {
      return mid * 100; // Convert to percentage
    }
    
    if (npv > 0) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return ((low + high) / 2) * 100;
};

/**
 * Calculate all basic metrics at once
 * @param {Object} inputData - Input data containing all parameters
 * @returns {Object} Object containing all calculated metrics
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

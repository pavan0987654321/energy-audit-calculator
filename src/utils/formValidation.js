/**
 * Form Validation Utility for Energy Investment Analysis
 * Provides comprehensive validation for all 9 input fields
 */

/**
 * Validation rules configuration
 */
const VALIDATION_RULES = {
    equipmentName: {
        label: 'Equipment Name',
        required: true,
        minLength: 3,
    },
    existingPower: {
        label: 'Baseline Power',
        required: true,
        min: 0.01,
        max: 1000,
        unit: 'kW',
    },
    proposedPower: {
        label: 'Target Power',
        required: true,
        min: 0.01,
        max: 1000,
        unit: 'kW',
        lessThanField: 'existingPower',
    },
    operatingHoursPerDay: {
        label: 'Daily Runtime',
        required: true,
        min: 0.01,
        max: 24,
        unit: 'hours',
    },
    operatingDaysPerYear: {
        label: 'Annual Days',
        required: true,
        min: 1,
        max: 365,
        unit: 'days',
    },
    electricityCost: {
        label: 'Energy Rate',
        required: true,
        min: 0.01,
        max: 100,
        unit: '₹/kWh',
    },
    initialInvestment: {
        label: 'Capital Investment',
        required: true,
        min: 1,
        unit: '₹',
    },
    projectLife: {
        label: 'Asset Life',
        required: true,
        min: 1,
        max: 50,
        unit: 'years',
    },
    discountRate: {
        label: 'Discount Rate',
        required: true,
        min: 0,
        max: 50,
        unit: '%',
    },
};

/**
 * Validates a single field value against its rules
 * @param {string} fieldName - The name of the field to validate
 * @param {any} value - The value to validate
 * @param {object} allValues - All form values (for cross-field validation)
 * @returns {string|null} Error message or null if valid
 */
export const validateField = (fieldName, value, allValues = {}) => {
    const rules = VALIDATION_RULES[fieldName];
    if (!rules) return null;

    // Handle equipment name (string validation)
    if (fieldName === 'equipmentName') {
        const trimmedValue = (value || '').trim();

        if (rules.required && !trimmedValue) {
            return 'Required';
        }

        if (rules.minLength && trimmedValue.length < rules.minLength) {
            return `Min ${rules.minLength} characters`;
        }

        return null;
    }

    // Handle numeric fields
    const numValue = parseFloat(value);
    const isEmpty = value === '' || value === null || value === undefined;

    // Required check
    if (rules.required && (isEmpty || isNaN(numValue))) {
        return 'Required';
    }

    if (!isEmpty && !isNaN(numValue)) {
        // Minimum value check
        if (rules.min !== undefined && numValue < rules.min) {
            if (rules.min === 0) {
                return 'Must be ≥ 0';
            }
            return `Must be > ${rules.min > 1 ? rules.min - 1 : 0}`;
        }

        // Maximum value check
        if (rules.max !== undefined && numValue > rules.max) {
            return `Max ${rules.max}${rules.unit ? '' : ''}`;
        }

        // Cross-field validation (proposedPower < existingPower)
        if (rules.lessThanField) {
            const compareValue = parseFloat(allValues[rules.lessThanField]);
            if (!isNaN(compareValue) && numValue >= compareValue) {
                return 'Must be < baseline';
            }
        }
    }

    return null;
};

/**
 * Validates all form fields
 * @param {object} formData - Object containing all form field values
 * @returns {object} Object with field names as keys and error messages as values
 */
export const validateForm = (formData) => {
    const errors = {};

    // Validate each field
    Object.keys(VALIDATION_RULES).forEach((fieldName) => {
        const error = validateField(fieldName, formData[fieldName], formData);
        if (error) {
            errors[fieldName] = error;
        }
    });

    return errors;
};

/**
 * Checks if the form is valid (no errors)
 * @param {object} formData - Object containing all form field values
 * @returns {boolean} True if form is valid, false otherwise
 */
export const isFormValid = (formData) => {
    const errors = validateForm(formData);
    return Object.keys(errors).length === 0;
};

/**
 * Gets the validation rules for a specific field
 * @param {string} fieldName - The name of the field
 * @returns {object|null} Validation rules or null if not found
 */
export const getFieldRules = (fieldName) => {
    return VALIDATION_RULES[fieldName] || null;
};

/**
 * Gets descriptive help text for a field based on its validation rules
 * @param {string} fieldName - The name of the field
 * @returns {string} Help text describing valid input
 */
export const getFieldHelpText = (fieldName) => {
    const rules = VALIDATION_RULES[fieldName];
    if (!rules) return '';

    if (fieldName === 'equipmentName') {
        return `Min ${rules.minLength} characters`;
    }

    const parts = [];
    if (rules.min !== undefined) {
        parts.push(rules.min === 0 ? '≥ 0' : `> ${rules.min > 1 ? rules.min - 1 : 0}`);
    }
    if (rules.max !== undefined) {
        parts.push(`≤ ${rules.max}`);
    }
    if (rules.lessThanField) {
        parts.push('< baseline power');
    }

    return parts.join(', ');
};

export default {
    validateField,
    validateForm,
    isFormValid,
    getFieldRules,
    getFieldHelpText,
    VALIDATION_RULES,
};

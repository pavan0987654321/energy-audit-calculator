/**
 * Currency Formatting Utilities for Indian Rupee (INR)
 * 
 * Provides consistent formatting for financial values using the Indian numbering system.
 * Indian system: 1,00,00,000 (1 crore) vs Western: 10,000,000 (10 million)
 * Uses native Intl.NumberFormat for robustness.
 */

/**
 * Format a number as Indian Rupee currency.
 * 
 * @param {number|null|undefined} value - The number to format
 * @param {Object} options - Formatting options
 * @param {number} options.decimals - Number of decimal places (default: 2)
 * @param {boolean} options.showSymbol - Whether to show ₹ symbol (default: true)
 * @param {boolean} options.compact - Use compact notation like "14.74L" (default: false)
 * @returns {string} Formatted currency string
 */
export function formatINRCurrency(value, options = {}) {
    const {
        decimals = 2,
        showSymbol = true,
        compact = false,
    } = options;

    // Handle edge cases
    if (value === null || value === undefined || isNaN(value)) {
        return showSymbol ? '₹0.00' : '0.00';
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
        return showSymbol ? '₹0.00' : '0.00';
    }

    // Handle compact notation (e.g., 14.74L, 2.5Cr)
    if (compact) {
        return formatCompactINR(numValue, showSymbol);
    }

    try {
        // Use native Intl.NumberFormat for robust Indian formatting
        // en-IN locale ensures 1,00,000 format
        return new Intl.NumberFormat('en-IN', {
            style: showSymbol ? 'currency' : 'decimal',
            currency: 'INR',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(numValue);
    } catch (error) {
        console.error("Formatting error:", error);
        return showSymbol ? `₹${numValue.toFixed(decimals)}` : numValue.toFixed(decimals);
    }
}

/**
 * Format a number for display (no currency symbol, just Indian grouping).
 * 
 * @param {number|null|undefined} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted number string
 */
export function formatIndianNumberDisplay(value, decimals = 0) {
    if (value === null || value === undefined || isNaN(value)) {
        return '0';
    }

    const numValue = Number(value);
    if (isNaN(numValue)) {
        return '0';
    }

    // Use Intl.NumberFormat with decimal style
    return new Intl.NumberFormat('en-IN', {
        style: 'decimal',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(numValue);
}

/**
 * Format large numbers in compact Indian notation (L for Lakh, Cr for Crore).
 * 
 * @param {number} value - The number to format
 * @param {boolean} showSymbol - Whether to show ₹ symbol
 * @returns {string} Compact formatted string
 */
function formatCompactINR(value, showSymbol = true) {
    const isNegative = value < 0;
    const absValue = Math.abs(value);
    const symbol = showSymbol ? '₹' : '';
    const sign = isNegative ? '-' : '';

    if (absValue >= 10000000) {
        // Crores (1 Cr = 10,000,000)
        return `${sign}${symbol}${(absValue / 10000000).toFixed(2)}Cr`;
    } else if (absValue >= 100000) {
        // Lakhs (1 L = 100,000)
        return `${sign}${symbol}${(absValue / 100000).toFixed(2)}L`;
    } else if (absValue >= 1000) {
        // Thousands
        return `${sign}${symbol}${(absValue / 1000).toFixed(2)}K`;
    }

    return `${sign}${symbol}${absValue.toFixed(2)}`;
}

/**
 * Parse a formatted INR string back to a number.
 * 
 * @param {string} formattedValue - The formatted currency string
 * @returns {number} The parsed number
 */
export function parseINRCurrency(formattedValue) {
    if (!formattedValue || typeof formattedValue !== 'string') {
        return 0;
    }

    // Remove currency symbol, commas, and spaces
    const cleaned = formattedValue
        .replace(/₹/g, '')
        .replace(/,/g, '')
        .replace(/\s/g, '')
        .trim();

    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}

export default {
    formatINRCurrency,
    formatIndianNumberDisplay,
    parseINRCurrency,
};

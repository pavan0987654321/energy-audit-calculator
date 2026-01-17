import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'energyroi_analyses';
const MAX_ANALYSES = 10;

/**
 * Generate unique ID for each analysis
 */
const generateId = () => {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Custom hook for managing analysis history in localStorage
 * Provides persistence across sessions and easy access to historical data
 */
export const useAnalysisHistory = () => {
    const [analyses, setAnalyses] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setAnalyses(Array.isArray(parsed) ? parsed : []);
            }
        } catch (error) {
            console.error('Error loading analysis history:', error);
            setAnalyses([]);
        }
        setIsLoaded(true);
    }, []);

    // Persist to localStorage whenever analyses change
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
            } catch (error) {
                console.error('Error saving analysis history:', error);
            }
        }
    }, [analyses, isLoaded]);

    /**
     * Save a new analysis to history
     */
    const saveAnalysis = useCallback((inputData, results, projectName = null) => {
        const newAnalysis = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            projectName: projectName || inputData.equipmentName || 'Unnamed Project',
            inputData: { ...inputData },
            results: { ...results },
            // Compute key metrics for quick display
            keyMetrics: {
                npv: results.npv,
                irr: results.irr,
                paybackPeriod: results.simplePaybackPeriod,
                annualSavings: results.annualCostSavings,
                investmentSignal: getInvestmentSignal(results),
            },
        };

        setAnalyses((prev) => {
            // Prepend new analysis and keep only last MAX_ANALYSES
            const updated = [newAnalysis, ...prev].slice(0, MAX_ANALYSES);
            return updated;
        });

        return newAnalysis.id;
    }, []);

    /**
     * Get a specific analysis by ID
     */
    const getAnalysis = useCallback((id) => {
        return analyses.find((a) => a.id === id) || null;
    }, [analyses]);

    /**
     * Delete an analysis by ID
     */
    const deleteAnalysis = useCallback((id) => {
        setAnalyses((prev) => prev.filter((a) => a.id !== id));
    }, []);

    /**
     * Update an existing analysis (e.g., rename project)
     */
    const updateAnalysis = useCallback((id, updates) => {
        setAnalyses((prev) =>
            prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
        );
    }, []);

    /**
     * Clear all analysis history
     */
    const clearHistory = useCallback(() => {
        setAnalyses([]);
    }, []);

    /**
     * Get recent analyses (default: last 3)
     */
    const getRecentAnalyses = useCallback((count = 3) => {
        return analyses.slice(0, count);
    }, [analyses]);

    return {
        analyses,
        isLoaded,
        saveAnalysis,
        getAnalysis,
        deleteAnalysis,
        updateAnalysis,
        clearHistory,
        getRecentAnalyses,
    };
};

/**
 * Determine investment signal based on results
 */
const getInvestmentSignal = (results) => {
    const { irr, simplePaybackPeriod } = results;

    if (irr > 25 && simplePaybackPeriod < 3) {
        return { text: 'Highly Favorable', color: '#10B981', status: 'excellent' };
    } else if (irr > 12 && simplePaybackPeriod < 5) {
        return { text: 'Favorable', color: '#6366F1', status: 'good' };
    } else if (irr > 6) {
        return { text: 'Marginal', color: '#F59E0B', status: 'marginal' };
    }
    return { text: 'Review Required', color: '#EF4444', status: 'poor' };
};

/**
 * Format date for display
 */
export const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};

export default useAnalysisHistory;

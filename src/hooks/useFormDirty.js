import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * useFormDirty Hook
 * Tracks if form values have changed from initial state
 * Provides warning when navigating away with unsaved changes
 */
export const useFormDirty = (formData, initialData = null) => {
    const [isDirty, setIsDirty] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const initialDataRef = useRef(initialData);
    const pendingNavigationRef = useRef(null);

    // Update initial data reference when it changes
    useEffect(() => {
        if (initialData !== null) {
            initialDataRef.current = initialData;
        }
    }, [initialData]);

    // Check if form is dirty by comparing with initial state
    useEffect(() => {
        const initial = initialDataRef.current || {};
        const hasChanges = Object.keys(formData).some(key => {
            const currentValue = formData[key];
            const initialValue = initial[key] || '';
            return currentValue !== initialValue && currentValue !== '';
        });
        setIsDirty(hasChanges);
    }, [formData]);

    // Handle browser beforeunload event (refresh/close)
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    // Handle hash change navigation
    useEffect(() => {
        const handleHashChange = (e) => {
            if (isDirty) {
                e.preventDefault();
                pendingNavigationRef.current = window.location.hash;
                // Restore the old hash temporarily
                window.history.pushState(null, '', e.oldURL);
                setShowModal(true);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [isDirty]);

    // Confirm navigation - proceed with pending navigation
    const confirmNavigation = useCallback(() => {
        setShowModal(false);
        setIsDirty(false);
        if (pendingNavigationRef.current) {
            window.location.hash = pendingNavigationRef.current;
            pendingNavigationRef.current = null;
        }
    }, []);

    // Cancel navigation - stay on page
    const cancelNavigation = useCallback(() => {
        setShowModal(false);
        pendingNavigationRef.current = null;
    }, []);

    // Reset dirty state (call after successful submission)
    const resetDirty = useCallback(() => {
        setIsDirty(false);
        initialDataRef.current = { ...formData };
    }, [formData]);

    // Check before navigation (for programmatic nav)
    const checkBeforeNavigate = useCallback((targetHash) => {
        if (isDirty) {
            pendingNavigationRef.current = targetHash;
            setShowModal(true);
            return false; // Prevent navigation
        }
        return true; // Allow navigation
    }, [isDirty]);

    return {
        isDirty,
        showModal,
        confirmNavigation,
        cancelNavigation,
        resetDirty,
        checkBeforeNavigate,
    };
};

export default useFormDirty;

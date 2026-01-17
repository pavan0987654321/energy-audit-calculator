import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export utilities for EnergyROI Pro
 * Supports PDF and CSV export of analysis results
 */

/**
 * Format currency for display
 */
const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(value);
};

/**
 * Format number with Indian locale
 */
const formatNumber = (value, decimals = 0) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
};

/**
 * Get investment signal text and color
 */
const getInvestmentSignal = (results) => {
    const { irr, simplePaybackPeriod } = results;

    if (irr > 25 && simplePaybackPeriod < 3) {
        return { text: 'Highly Favorable', status: 'excellent' };
    } else if (irr > 12 && simplePaybackPeriod < 5) {
        return { text: 'Favorable', status: 'good' };
    } else if (irr > 6) {
        return { text: 'Marginal', status: 'marginal' };
    }
    return { text: 'Review Required', status: 'poor' };
};

/**
 * Export analysis results to PDF
 */
export const exportToPDF = (analysis) => {
    const { inputData, results, timestamp, projectName } = analysis;
    const signal = getInvestmentSignal(results);

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Colors
    const primaryColor = [99, 102, 241]; // Indigo
    const textColor = [15, 23, 42];
    const mutedColor = [100, 116, 139];

    // Header with branding
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('EnergyROI Pro', 20, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Enterprise Energy Investment Analysis', 20, 28);

    // Report title
    doc.setTextColor(...textColor);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Investment Analysis Report', 20, 50);

    // Project details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);
    doc.text(`Project: ${projectName || inputData.equipmentName}`, 20, 60);
    doc.text(`Generated: ${new Date(timestamp || Date.now()).toLocaleString('en-IN')}`, 20, 67);

    // Investment Signal Badge
    doc.setFillColor(signal.status === 'excellent' ? 16 : signal.status === 'good' ? 99 : 245,
        signal.status === 'excellent' ? 185 : signal.status === 'good' ? 102 : 158,
        signal.status === 'excellent' ? 129 : signal.status === 'good' ? 241 : 11);
    doc.roundedRect(pageWidth - 70, 45, 50, 20, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(signal.text, pageWidth - 45, 57, { align: 'center' });

    // Equipment Details Section
    doc.setTextColor(...textColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Equipment Details', 20, 85);

    doc.autoTable({
        startY: 90,
        head: [['Parameter', 'Value']],
        body: [
            ['Equipment Name', inputData.equipmentName || 'N/A'],
            ['Baseline Power', `${formatNumber(inputData.existingPower)} kW`],
            ['Target Power', `${formatNumber(inputData.proposedPower)} kW`],
            ['Daily Runtime', `${formatNumber(inputData.operatingHoursPerDay)} hours`],
            ['Annual Operating Days', `${formatNumber(inputData.operatingDaysPerYear)} days`],
            ['Energy Rate', `₹${formatNumber(inputData.electricityCost, 2)}/kWh`],
            ['Capital Investment', formatCurrency(inputData.initialInvestment)],
            ['Asset Life', `${formatNumber(inputData.projectLife)} years`],
            ['Discount Rate', `${formatNumber(inputData.discountRate)}%`],
        ],
        theme: 'striped',
        headStyles: { fillColor: primaryColor },
        margin: { left: 20, right: 20 },
    });

    // Financial Results Section
    const financialY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Financial Results', 20, financialY);

    doc.autoTable({
        startY: financialY + 5,
        head: [['Metric', 'Value']],
        body: [
            ['Annual Energy Savings', `${formatNumber(results.annualEnergySavings)} kWh`],
            ['Annual Cost Savings', formatCurrency(results.annualCostSavings)],
            ['Simple Payback Period', `${formatNumber(results.simplePaybackPeriod, 1)} years`],
            ['Net Present Value (NPV)', formatCurrency(results.npv)],
            ['Internal Rate of Return (IRR)', `${formatNumber(results.irr, 1)}%`],
            ['CO₂ Reduction', `${formatNumber(results.co2ReductionTons, 2)} tonnes/year`],
        ],
        theme: 'striped',
        headStyles: { fillColor: primaryColor },
        margin: { left: 20, right: 20 },
    });

    // Investment Recommendation
    const recY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Investment Recommendation', 20, recY);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...mutedColor);

    const recommendation = signal.status === 'excellent'
        ? 'This investment demonstrates exceptional returns with a rapid payback period. Strong recommendation to proceed.'
        : signal.status === 'good'
            ? 'This investment shows favorable returns. Recommended for implementation with standard due diligence.'
            : signal.status === 'marginal'
                ? 'This investment shows marginal returns. Consider optimization opportunities or alternative solutions.'
                : 'This investment requires further review. Returns may not justify the capital outlay.';

    const splitRec = doc.splitTextToSize(recommendation, pageWidth - 40);
    doc.text(splitRec, 20, recY + 8);

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 15;
    doc.setFontSize(8);
    doc.setTextColor(...mutedColor);
    doc.text('Generated by EnergyROI Pro | Enterprise Energy Investment Analysis Platform', pageWidth / 2, footerY, { align: 'center' });
    doc.text(`Report ID: ${analysis.id || 'N/A'}`, pageWidth / 2, footerY + 5, { align: 'center' });

    // Save the PDF
    const filename = `EnergyROI_${(projectName || inputData.equipmentName || 'Analysis').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);

    return filename;
};

/**
 * Export analysis results to CSV
 */
export const exportToCSV = (analysis) => {
    const { inputData, results, timestamp, projectName } = analysis;
    const signal = getInvestmentSignal(results);

    const rows = [
        ['EnergyROI Pro - Investment Analysis Report'],
        ['Generated', new Date(timestamp || Date.now()).toLocaleString('en-IN')],
        [''],
        ['EQUIPMENT DETAILS'],
        ['Equipment Name', inputData.equipmentName || 'N/A'],
        ['Baseline Power (kW)', inputData.existingPower],
        ['Target Power (kW)', inputData.proposedPower],
        ['Daily Runtime (hours)', inputData.operatingHoursPerDay],
        ['Annual Operating Days', inputData.operatingDaysPerYear],
        ['Energy Rate (₹/kWh)', inputData.electricityCost],
        ['Capital Investment (₹)', inputData.initialInvestment],
        ['Asset Life (years)', inputData.projectLife],
        ['Discount Rate (%)', inputData.discountRate],
        [''],
        ['FINANCIAL RESULTS'],
        ['Annual Energy Savings (kWh)', results.annualEnergySavings],
        ['Annual Cost Savings (₹)', results.annualCostSavings],
        ['Simple Payback Period (years)', results.simplePaybackPeriod.toFixed(2)],
        ['Net Present Value (₹)', results.npv.toFixed(2)],
        ['Internal Rate of Return (%)', results.irr.toFixed(2)],
        ['CO₂ Reduction (tonnes/year)', results.co2ReductionTons.toFixed(2)],
        [''],
        ['INVESTMENT SIGNAL', signal.text],
    ];

    const csvContent = rows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const filename = `EnergyROI_${(projectName || inputData.equipmentName || 'Analysis').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(blob, filename);

    return filename;
};

/**
 * Trigger file download
 */
export const downloadFile = (blob, filename) => {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Export multiple analyses for comparison
 */
export const exportComparisonToCSV = (analyses) => {
    if (!analyses || analyses.length === 0) return null;

    const headers = [
        'Project Name',
        'Date',
        'Equipment',
        'Baseline Power (kW)',
        'Target Power (kW)',
        'Annual Savings (₹)',
        'Payback (years)',
        'NPV (₹)',
        'IRR (%)',
        'CO₂ Reduction (t/yr)',
        'Signal',
    ];

    const rows = analyses.map(a => [
        a.projectName,
        new Date(a.timestamp).toLocaleDateString('en-IN'),
        a.inputData.equipmentName,
        a.inputData.existingPower,
        a.inputData.proposedPower,
        a.results.annualCostSavings.toFixed(0),
        a.results.simplePaybackPeriod.toFixed(2),
        a.results.npv.toFixed(0),
        a.results.irr.toFixed(2),
        a.results.co2ReductionTons.toFixed(2),
        a.keyMetrics?.investmentSignal?.text || 'N/A',
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const filename = `EnergyROI_AllAnalyses_${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(blob, filename);

    return filename;
};

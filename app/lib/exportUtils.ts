import { Analysis } from '@/app/types/analysis';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Papa from 'papaparse';

/**
 * Generates a PDF from an analysis
 */
export async function generatePDF(analysis: Analysis): Promise<Blob> {
  // Create a temporary div to render the analysis
  const container = document.createElement('div');
  container.className = 'p-6 bg-white text-black';
  
  // Add analysis content
  container.innerHTML = `
    <div class="mb-4">
      <h1 class="text-2xl font-bold">${analysis.address}</h1>
      <p class="text-gray-600">${analysis.type.charAt(0).toUpperCase() + analysis.type.slice(1)} Analysis</p>
      <p class="text-gray-600">Created: ${new Date(analysis.createdAt).toLocaleDateString()}</p>
    </div>
    
    <div class="mb-4">
      <h2 class="text-xl font-semibold">Property Details</h2>
      <div class="grid grid-cols-2 gap-2 mt-2">
        ${Object.entries(analysis.data)
          .filter(([key]) => !['_id', 'userId', 'versions'].includes(key))
          .map(([key, value]) => `
            <div class="flex justify-between">
              <span class="font-medium">${key.replace(/([A-Z])/g, ' $1').trim()}:</span>
              <span>${typeof value === 'number' ? value.toLocaleString() : value}</span>
            </div>
          `).join('')}
      </div>
    </div>
    
    ${analysis.autoImproveSuggestions && analysis.autoImproveSuggestions.length > 0 ? `
      <div class="mb-4">
        <h2 class="text-xl font-semibold">AI Insights</h2>
        <ul class="list-disc pl-5 mt-2">
          ${analysis.autoImproveSuggestions.map(suggestion => `
            <li class="mb-1">${suggestion.suggestion}</li>
          `).join('')}
        </ul>
      </div>
    ` : ''}
    
    <div class="mt-8 text-center text-gray-500 text-sm">
      <p>Powered by RoseIntel AI</p>
    </div>
  `;
  
  // Append to document temporarily
  document.body.appendChild(container);
  
  // Generate PDF
  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    logging: false
  });
  
  // Remove temporary element
  document.body.removeChild(container);
  
  // Create PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  const imgData = canvas.toDataURL('image/png');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
  pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
  // Return as blob
  return pdf.output('blob');
}

/**
 * Generates a CSV from an analysis
 */
export function generateCSV(analysis: Analysis): string {
  // Prepare data for CSV
  const csvData = {
    'Property Address': analysis.address,
    'Analysis Type': analysis.type,
    'Created Date': new Date(analysis.createdAt).toLocaleDateString(),
    ...Object.entries(analysis.data)
      .filter(([key]) => !['_id', 'userId', 'versions'].includes(key))
      .reduce((acc, [key, value]) => {
        acc[key.replace(/([A-Z])/g, ' $1').trim()] = value;
        return acc;
      }, {} as Record<string, any>)
  };
  
  // Convert to CSV
  return Papa.unparse([csvData]);
}

/**
 * Generates a combined PDF from multiple analyses
 */
export async function generateCombinedPDF(analyses: Analysis[]): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  let yOffset = 10;
  
  for (let i = 0; i < analyses.length; i++) {
    const analysis = analyses[i];
    
    // Add page break if not first page
    if (i > 0) {
      pdf.addPage();
      yOffset = 10;
    }
    
    // Add title
    pdf.setFontSize(16);
    pdf.text(analysis.address, 10, yOffset);
    yOffset += 10;
    
    // Add analysis type and date
    pdf.setFontSize(12);
    pdf.text(`${analysis.type.charAt(0).toUpperCase() + analysis.type.slice(1)} Analysis`, 10, yOffset);
    yOffset += 5;
    pdf.text(`Created: ${new Date(analysis.createdAt).toLocaleDateString()}`, 10, yOffset);
    yOffset += 10;
    
    // Add property details
    pdf.setFontSize(14);
    pdf.text('Property Details', 10, yOffset);
    yOffset += 7;
    
    pdf.setFontSize(10);
    Object.entries(analysis.data)
      .filter(([key]) => !['_id', 'userId', 'versions'].includes(key))
      .forEach(([key, value]) => {
        const text = `${key.replace(/([A-Z])/g, ' $1').trim()}: ${value}`;
        pdf.text(text, 10, yOffset);
        yOffset += 5;
      });
    
    // Add AI insights if available
    if (analysis.autoImproveSuggestions && analysis.autoImproveSuggestions.length > 0) {
      yOffset += 5;
      pdf.setFontSize(14);
      pdf.text('AI Insights', 10, yOffset);
      yOffset += 7;
      
      pdf.setFontSize(10);
      analysis.autoImproveSuggestions.forEach(suggestion => {
        pdf.text(`• ${suggestion.suggestion}`, 10, yOffset);
        yOffset += 5;
      });
    }
    
    // Add footer
    pdf.setFontSize(8);
    pdf.text('Powered by RoseIntel AI', 10, 287);
  }
  
  return pdf.output('blob');
}

/**
 * Generates a combined CSV from multiple analyses
 */
export function generateCombinedCSV(analyses: Analysis[]): string {
  // Prepare data for CSV
  const csvData = analyses.map(analysis => ({
    'Property Address': analysis.address,
    'Analysis Type': analysis.type,
    'Created Date': new Date(analysis.createdAt).toLocaleDateString(),
    ...Object.entries(analysis.data)
      .filter(([key]) => !['_id', 'userId', 'versions'].includes(key))
      .reduce((acc, [key, value]) => {
        acc[key.replace(/([A-Z])/g, ' $1').trim()] = value;
        return acc;
      }, {} as Record<string, any>)
  }));
  
  // Convert to CSV
  return Papa.unparse(csvData);
} 
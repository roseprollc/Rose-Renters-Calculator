import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import { Analysis } from '@/app/types/analysis';
import { formatCurrency, formatDate } from '@/app/lib/utils';

export async function generatePDF(analysis: Analysis): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Add title
  doc.setFontSize(20);
  doc.text(analysis.propertyAddress, pageWidth / 2, 20, { align: 'center' });
  
  // Add metadata
  doc.setFontSize(12);
  doc.text(`Analysis Type: ${analysis.type}`, 20, 40);
  doc.text(`Created: ${formatDate(analysis.createdAt)}`, 20, 50);
  
  // Add metrics section
  doc.setFontSize(16);
  doc.text('Key Metrics', 20, 70);
  
  doc.setFontSize(12);
  let yPos = 80;
  
  // Add metrics based on analysis type
  switch (analysis.type) {
    case 'mortgage':
      doc.text(`Monthly Payment: ${formatCurrency(analysis.monthlyPayment)}`, 20, yPos);
      yPos += 10;
      doc.text(`Total Cost: ${formatCurrency(analysis.totalCost)}`, 20, yPos);
      yPos += 10;
      doc.text(`ROI: ${analysis.roi?.toFixed(2)}%`, 20, yPos);
      break;
    case 'rental':
      doc.text(`Monthly Cash Flow: ${formatCurrency(analysis.monthlyCashFlow)}`, 20, yPos);
      yPos += 10;
      doc.text(`Cap Rate: ${analysis.capRate?.toFixed(2)}%`, 20, yPos);
      yPos += 10;
      doc.text(`Annual Cash Flow: ${formatCurrency(analysis.annualCashFlow)}`, 20, yPos);
      break;
    case 'wholesale':
      doc.text(`ARV: ${formatCurrency(analysis.arv)}`, 20, yPos);
      yPos += 10;
      doc.text(`Potential Profit: ${formatCurrency(analysis.potentialProfit)}`, 20, yPos);
      yPos += 10;
      doc.text(`Total Investment: ${formatCurrency(analysis.totalInvestment)}`, 20, yPos);
      break;
    case 'airbnb':
      doc.text(`Monthly Revenue: ${formatCurrency(analysis.monthlyRevenue)}`, 20, yPos);
      yPos += 10;
      doc.text(`Monthly Profit: ${formatCurrency(analysis.monthlyProfit)}`, 20, yPos);
      yPos += 10;
      doc.text(`Nightly Rate: ${formatCurrency(analysis.nightlyRate)}`, 20, yPos);
      break;
  }
  
  // Add AI insights if available
  if (analysis.aiInsights) {
    yPos += 20;
    doc.setFontSize(16);
    doc.text('AI Insights', 20, yPos);
    yPos += 10;
    doc.setFontSize(12);
    const insights = doc.splitTextToSize(analysis.aiInsights, pageWidth - 40);
    doc.text(insights, 20, yPos);
  }
  
  // Add footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.text('Powered by RoseIntel AI', pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  return doc.output('blob');
}

export function generateCSV(analysis: Analysis): string {
  const headers = ['Metric', 'Value'];
  const rows: [string, string][] = [];
  
  // Add metadata
  rows.push(['Analysis Type', analysis.type]);
  rows.push(['Property Address', analysis.propertyAddress]);
  rows.push(['Created Date', formatDate(analysis.createdAt)]);
  rows.push(['', '']); // Empty row for spacing
  
  // Add metrics based on analysis type
  switch (analysis.type) {
    case 'mortgage':
      rows.push(['Monthly Payment', formatCurrency(analysis.monthlyPayment)]);
      rows.push(['Total Cost', formatCurrency(analysis.totalCost)]);
      rows.push(['ROI', `${analysis.roi?.toFixed(2)}%`]);
      break;
    case 'rental':
      rows.push(['Monthly Cash Flow', formatCurrency(analysis.monthlyCashFlow)]);
      rows.push(['Cap Rate', `${analysis.capRate?.toFixed(2)}%`]);
      rows.push(['Annual Cash Flow', formatCurrency(analysis.annualCashFlow)]);
      break;
    case 'wholesale':
      rows.push(['ARV', formatCurrency(analysis.arv)]);
      rows.push(['Potential Profit', formatCurrency(analysis.potentialProfit)]);
      rows.push(['Total Investment', formatCurrency(analysis.totalInvestment)]);
      break;
    case 'airbnb':
      rows.push(['Monthly Revenue', formatCurrency(analysis.monthlyRevenue)]);
      rows.push(['Monthly Profit', formatCurrency(analysis.monthlyProfit)]);
      rows.push(['Nightly Rate', formatCurrency(analysis.nightlyRate)]);
      break;
  }
  
  // Add AI insights if available
  if (analysis.aiInsights) {
    rows.push(['', '']); // Empty row for spacing
    rows.push(['AI Insights', analysis.aiInsights]);
  }
  
  return Papa.unparse({
    fields: headers,
    data: rows
  });
}

export function downloadFile(content: Blob | string, filename: string, type: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
} 
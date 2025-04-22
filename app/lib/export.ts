import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';
import { Analysis } from '@/app/types/analysis';
import { formatCurrency, formatDate } from './utils';

export async function exportToPDF(analysis: Analysis): Promise<Blob> {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Analysis Report', 20, 20);
  
  // Add analysis details
  doc.setFontSize(12);
  doc.text(`Type: ${analysis.type}`, 20, 40);
  doc.text(`Date: ${formatDate(analysis.createdAt)}`, 20, 50);
  doc.text(`Address: ${analysis.address}`, 20, 60);
  
  // Add key metrics based on analysis type
  let yPos = 80;
  doc.text('Key Metrics:', 20, yPos);
  yPos += 10;
  
  switch (analysis.type) {
    case 'mortgage':
      doc.text(`Purchase Price: ${formatCurrency(analysis.purchasePrice)}`, 30, yPos);
      yPos += 10;
      doc.text(`Down Payment: ${formatCurrency(analysis.downPayment)}`, 30, yPos);
      yPos += 10;
      doc.text(`Monthly Payment: ${formatCurrency(analysis.monthlyPayment)}`, 30, yPos);
      break;
    case 'rental':
      doc.text(`Monthly Rent: ${formatCurrency(analysis.monthlyRent)}`, 30, yPos);
      yPos += 10;
      doc.text(`Vacancy Rate: ${analysis.vacancyRate}%`, 30, yPos);
      yPos += 10;
      doc.text(`Operating Expenses: ${formatCurrency(analysis.operatingExpenses)}`, 30, yPos);
      break;
    case 'wholesale':
      doc.text(`ARV: ${formatCurrency(analysis.arv)}`, 30, yPos);
      yPos += 10;
      doc.text(`Repair Costs: ${formatCurrency(analysis.repairCosts)}`, 30, yPos);
      yPos += 10;
      doc.text(`Offer Price: ${formatCurrency(analysis.offerPrice)}`, 30, yPos);
      break;
    case 'airbnb':
      doc.text(`Average Daily Rate: ${formatCurrency(analysis.averageDailyRate)}`, 30, yPos);
      yPos += 10;
      doc.text(`Occupancy Rate: ${analysis.occupancyRate}%`, 30, yPos);
      yPos += 10;
      doc.text(`Monthly Revenue: ${formatCurrency(analysis.monthlyRevenue)}`, 30, yPos);
      break;
  }
  
  // Add notes if available
  if (analysis.notes) {
    yPos += 20;
    doc.text('Notes:', 20, yPos);
    yPos += 10;
    const notes = doc.splitTextToSize(analysis.notes, 170);
    doc.text(notes, 30, yPos);
  }
  
  return doc.output('blob');
}

export function exportToCSV(analysis: Analysis): Blob {
  const data = {
    type: analysis.type,
    date: formatDate(analysis.createdAt),
    address: analysis.address,
    ...(analysis.type === 'mortgage' && {
      purchasePrice: formatCurrency(analysis.purchasePrice),
      downPayment: formatCurrency(analysis.downPayment),
      monthlyPayment: formatCurrency(analysis.monthlyPayment),
    }),
    ...(analysis.type === 'rental' && {
      monthlyRent: formatCurrency(analysis.monthlyRent),
      vacancyRate: `${analysis.vacancyRate}%`,
      operatingExpenses: formatCurrency(analysis.operatingExpenses),
    }),
    ...(analysis.type === 'wholesale' && {
      arv: formatCurrency(analysis.arv),
      repairCosts: formatCurrency(analysis.repairCosts),
      offerPrice: formatCurrency(analysis.offerPrice),
    }),
    ...(analysis.type === 'airbnb' && {
      averageDailyRate: formatCurrency(analysis.averageDailyRate),
      occupancyRate: `${analysis.occupancyRate}%`,
      monthlyRevenue: formatCurrency(analysis.monthlyRevenue),
    }),
    notes: analysis.notes || '',
  };
  
  const csv = Papa.unparse([data]);
  return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
} 
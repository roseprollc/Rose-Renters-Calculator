import jsPDF from 'jspdf';
import { Parser } from 'json2csv';

export async function generatePDF(data: any, calculatorType: string): Promise<string> {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text(`${calculatorType.charAt(0).toUpperCase() + calculatorType.slice(1)} Analysis`, 20, 20);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Add data
  doc.setFontSize(14);
  let y = 50;
  
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'number') {
      doc.text(`${key}: $${value.toLocaleString()}`, 20, y);
    } else {
      doc.text(`${key}: ${value}`, 20, y);
    }
    y += 10;
  });
  
  // Save the PDF
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  
  return pdfUrl;
}

export async function generateCSV(data: any): Promise<string> {
  const parser = new Parser();
  const csv = parser.parse(data);
  
  // Create a Blob and URL for the CSV
  const csvBlob = new Blob([csv], { type: 'text/csv' });
  const csvUrl = URL.createObjectURL(csvBlob);
  
  return csvUrl;
} 
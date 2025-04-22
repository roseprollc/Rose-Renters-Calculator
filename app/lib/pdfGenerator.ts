import { Analysis } from '@/app/types/analysis';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

interface DigestPreferences {
  enabled: boolean;
  analysisTypes: string[];
  includeCharts: boolean;
  includeDetails: boolean;
}

export async function generatePDF(analyses: Analysis[], preferences: DigestPreferences): Promise<Buffer> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  let currentPage = pdfDoc.addPage();
  const { width, height } = currentPage.getSize();
  
  // Load fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set up initial position
  let y = height - 50;
  const margin = 50;
  const lineHeight = 20;
  
  // Add title
  currentPage.drawText('Weekly Analysis Digest', {
    x: margin,
    y,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  y -= lineHeight * 2;
  
  // Add date
  const today = new Date().toLocaleDateString();
  currentPage.drawText(`Generated on ${today}`, {
    x: margin,
    y,
    size: 12,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  y -= lineHeight * 2;
  
  // Add each analysis
  for (const analysis of analyses) {
    // Add analysis title
    currentPage.drawText(analysis.address || 'Untitled Analysis', {
      x: margin,
      y,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    y -= lineHeight;
    
    // Add analysis details
    if (preferences.includeDetails) {
      const details = [
        `Price: $${analysis.data?.price?.toLocaleString() || 'N/A'}`,
        `Beds: ${analysis.data?.beds || 'N/A'}`,
        `Baths: ${analysis.data?.baths || 'N/A'}`,
        `Square Feet: ${analysis.data?.squareFeet?.toLocaleString() || 'N/A'}`,
      ];
      
      for (const detail of details) {
        currentPage.drawText(detail, {
          x: margin + 20,
          y,
          size: 12,
          font,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;
      }
    }
    
    y -= lineHeight;
    
    // Check if we need a new page
    if (y < margin) {
      currentPage = pdfDoc.addPage();
      y = height - margin;
    }
  }
  
  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
} 
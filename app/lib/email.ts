import nodemailer from 'nodemailer';
import { DigestPreferences } from '@/app/types/analysis';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  attachments?: {
    filename: string;
    content: Buffer;
  }[];
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(options: EmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      ...options,
    });
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }
}

export function generateEmailContent(
  analyses: any[],
  preferences: DigestPreferences
) {
  const analysisTypeLabels = {
    mortgage: 'Mortgage Analysis',
    rental: 'Rental Property',
    wholesale: 'Wholesale Deal',
    airbnb: 'Airbnb Property',
  };

  const content = analyses.map(analysis => `
    ${analysisTypeLabels[analysis.type as keyof typeof analysisTypeLabels]}
    Address: ${analysis.address}
    Created: ${new Date(analysis.createdAt).toLocaleDateString()}
    ${analysis.notes ? `Notes: ${analysis.notes}` : ''}
  `).join('\n');

  return `
    Weekly Analysis Digest
    ---------------------
    
    Here's a summary of your saved analyses from the past week:
    
    ${content}
    
    View the full report in the attached PDF.
  `;
} 
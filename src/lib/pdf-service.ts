import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

// Types for PDF generation
export interface PDFOptions {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  pageSize?: 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface TraineeRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContact?: string;
  trainingSet?: string;
  completedForms: string[];
  registrationDate: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  verificationMethod?: string;
  verificationDate?: string;
  isOIM?: boolean;
}

export interface TrainingCertificate {
  traineeId: string;
  traineeName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  certificateNumber: string;
  validUntil?: string;
  achievements?: string[];
}

export interface MedicalReport {
  traineeId: string;
  traineeName: string;
  examDate: string;
  examiner: string;
  status: 'Fit' | 'Unfit' | 'Temporarily Unfit';
  notes?: string;
  restrictions?: string[];
  followUpDate?: string;
}

export interface YouSeeUActReport {
  id: string;
  submittedBy: string;
  date: string;
  location: string;
  type: 'Safe Act' | 'Unsafe Act' | 'Safe Condition' | 'Unsafe Condition';
  category: string;
  description: string;
  actions?: string;
  status: 'Open' | 'In Progress' | 'Closed';
  assignedTo?: string;
  closedDate?: string;
}

// Default PDF options
const defaultOptions: PDFOptions = {
  pageSize: 'a4',
  orientation: 'portrait',
  margins: {
    top: 15,
    right: 15,
    bottom: 15,
    left: 15,
  },
};

/**
 * Creates a new PDF document with the specified options
 */
export const createPDF = (options: PDFOptions = {}): jsPDF => {
  const mergedOptions = { ...defaultOptions, ...options };
  const doc = new jsPDF({
    orientation: mergedOptions.orientation,
    unit: 'mm',
    format: mergedOptions.pageSize,
  });

  // Set document properties
  if (mergedOptions.title) doc.setProperties({ title: mergedOptions.title });
  if (mergedOptions.author) doc.setProperties({ author: mergedOptions.author });
  if (mergedOptions.subject) doc.setProperties({ subject: mergedOptions.subject });
  if (mergedOptions.keywords) doc.setProperties({ keywords: mergedOptions.keywords });
  if (mergedOptions.creator) doc.setProperties({ creator: mergedOptions.creator });

  return doc;
};

/**
 * Adds the Alpatech header to the PDF document
 */
export const addHeader = (doc: jsPDF, pageTitle: string): void => {
  // Add logo (placeholder - would need to be replaced with actual logo)
  // doc.addImage(logoBase64, 'PNG', 15, 15, 30, 10);
  
  // Add company name
  doc.setFontSize(18);
  doc.setTextColor(0, 48, 87); // Dark blue
  doc.text('ALPATECH', 15, 15);
  
  // Add page title
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(pageTitle, 15, 25);
  
  // Add date
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${format(new Date(), 'PPP')}`, 15, 30);
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(15, 32, doc.internal.pageSize.width - 15, 32);
};

/**
 * Adds a footer to the PDF document
 */
export const addFooter = (doc: jsPDF): void => {
  const pageCount = doc.internal.getNumberOfPages();
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Add horizontal line
    doc.setDrawColor(200, 200, 200);
    doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
    
    // Add page number
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    
    // Add copyright
    doc.text('© Alpatech Onboard Hub', 15, pageHeight - 10);
  }
};

/**
 * Generates a PDF from a trainee record
 */
export const generateTraineeRecordPDF = (trainee: TraineeRecord): jsPDF => {
  const doc = createPDF({
    title: `Trainee Record - ${trainee.name}`,
    author: 'Alpatech Onboard Hub',
    subject: 'Trainee Record',
  });
  
  // Add header
  addHeader(doc, 'TRAINEE RECORD');
  
  // Add trainee information
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Trainee Information', 15, 40);
  
  doc.setFontSize(10);
  doc.text(`Name: ${trainee.name}`, 15, 50);
  doc.text(`Email: ${trainee.email}`, 15, 55);
  doc.text(`Registration Date: ${trainee.registrationDate}`, 15, 60);
  
  if (trainee.phone) {
    doc.text(`Phone: ${trainee.phone}`, 15, 65);
  }
  
  if (trainee.dateOfBirth) {
    doc.text(`Date of Birth: ${trainee.dateOfBirth}`, 15, 70);
  }
  
  if (trainee.address) {
    doc.text(`Address: ${trainee.address}`, 15, 75);
  }
  
  if (trainee.emergencyContact) {
    doc.text(`Emergency Contact: ${trainee.emergencyContact}`, 15, 80);
  }
  
  // Add training information
  doc.setFontSize(12);
  doc.text('Training Information', 15, 90);
  
  doc.setFontSize(10);
  doc.text(`Training Set: ${trainee.trainingSet || 'Not Assigned'}`, 15, 100);
  
  if (trainee.isOIM) {
    doc.text('Designated as Officer In Charge of the Mission (OIM)', 15, 105);
  }
  
  // Add verification information
  doc.setFontSize(12);
  doc.text('Verification Status', 15, 115);
  
  doc.setFontSize(10);
  doc.text(`Status: ${trainee.verificationStatus}`, 15, 125);
  if (trainee.verificationMethod) {
    doc.text(`Method: ${trainee.verificationMethod}`, 15, 130);
  }
  if (trainee.verificationDate) {
    doc.text(`Date: ${trainee.verificationDate}`, 15, 135);
  }
  
  // Add completed forms
  doc.setFontSize(12);
  doc.text('Completed Forms', 15, 145);
  
  doc.setFontSize(10);
  if (trainee.completedForms.length > 0) {
    trainee.completedForms.forEach((form, index) => {
      doc.text(`• ${form}`, 15, 155 + (index * 5));
    });
  } else {
    doc.text('No forms completed', 15, 155);
  }
  
  // Add footer
  addFooter(doc);
  
  return doc;
};

/**
 * Generates a PDF from a training completion certificate
 */
export const generateTrainingCertificatePDF = (certificate: TrainingCertificate): jsPDF => {
  const doc = createPDF({
    title: `Training Certificate - ${certificate.traineeName}`,
    author: 'Alpatech Onboard Hub',
    subject: 'Training Certificate',
    pageSize: 'a4',
    orientation: 'landscape',
  });
  
  // Set background color
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');
  
  // Add border
  doc.setDrawColor(0, 48, 87); // Dark blue
  doc.setLineWidth(1);
  doc.rect(10, 10, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 20, 'S');
  
  // Add decorative inner border
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.rect(15, 15, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 30, 'S');
  
  // Add title
  doc.setFontSize(24);
  doc.setTextColor(0, 48, 87); // Dark blue
  doc.text('CERTIFICATE OF COMPLETION', doc.internal.pageSize.width / 2, 40, { align: 'center' });
  
  // Add content
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('This is to certify that', doc.internal.pageSize.width / 2, 60, { align: 'center' });
  
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text(certificate.traineeName, doc.internal.pageSize.width / 2, 75, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text('has successfully completed the course', doc.internal.pageSize.width / 2, 90, { align: 'center' });
  
  doc.setFontSize(18);
  doc.setTextColor(0, 48, 87); // Dark blue
  doc.text(certificate.courseName, doc.internal.pageSize.width / 2, 105, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Completed on: ${certificate.completionDate}`, doc.internal.pageSize.width / 2, 120, { align: 'center' });
  
  // Add certificate number
  doc.setFontSize(10);
  doc.text(`Certificate Number: ${certificate.certificateNumber}`, doc.internal.pageSize.width / 2, 130, { align: 'center' });
  
  if (certificate.validUntil) {
    doc.text(`Valid Until: ${certificate.validUntil}`, doc.internal.pageSize.width / 2, 140, { align: 'center' });
  }
  
  // Add achievements if any
  if (certificate.achievements && certificate.achievements.length > 0) {
    doc.setFontSize(12);
    doc.text('Achievements:', doc.internal.pageSize.width / 2, 155, { align: 'center' });
    
    certificate.achievements.forEach((achievement, index) => {
      doc.setFontSize(10);
      doc.text(achievement, doc.internal.pageSize.width / 2, 165 + (index * 7), { align: 'center' });
    });
  }
  
  // Add signature line
  doc.setDrawColor(0, 0, 0);
  doc.line(doc.internal.pageSize.width / 2 - 50, 180, doc.internal.pageSize.width / 2 + 50, 180);
  
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(certificate.instructorName, doc.internal.pageSize.width / 2, 190, { align: 'center' });
  doc.text('Instructor', doc.internal.pageSize.width / 2, 195, { align: 'center' });
  
  return doc;
};

/**
 * Generates a PDF from an HTML element
 */
export const generatePDFFromHTML = async (element: HTMLElement, options: PDFOptions = {}): Promise<jsPDF> => {
  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL('image/png');
  
  const doc = createPDF(options);
  const imgWidth = doc.internal.pageSize.getWidth() - 30;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
  doc.addImage(imgData, 'PNG', 15, 15, imgWidth, imgHeight);
  
  return doc;
};

/**
 * Generates a medical screening report PDF
 */
export const generateMedicalReportPDF = (report: MedicalReport): jsPDF => {
  const doc = createPDF({
    title: `Medical Screening Report - ${report.traineeName}`,
    author: 'Alpatech Onboard Hub',
    subject: 'Medical Screening Report',
  });
  
  // Add header
  addHeader(doc, 'MEDICAL SCREENING REPORT');
  
  // Add trainee information
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Trainee Information', 15, 40);
  
  doc.setFontSize(10);
  doc.text(`Name: ${report.traineeName}`, 15, 50);
  doc.text(`ID: ${report.traineeId}`, 15, 55);
  doc.text(`Examination Date: ${report.examDate}`, 15, 60);
  doc.text(`Examiner: ${report.examiner}`, 15, 65);
  
  // Add medical status
  doc.setFontSize(12);
  doc.text('Medical Status', 15, 75);
  
  doc.setFontSize(10);
  
  // Set color based on status
  if (report.status === 'Fit') {
    doc.setTextColor(0, 128, 0); // Green
  } else if (report.status === 'Temporarily Unfit') {
    doc.setTextColor(255, 128, 0); // Orange
  } else {
    doc.setTextColor(255, 0, 0); // Red
  }
  
  doc.text(`Status: ${report.status}`, 15, 85);
  doc.setTextColor(0, 0, 0); // Reset to black
  
  // Add notes if any
  if (report.notes) {
    doc.setFontSize(12);
    doc.text('Notes', 15, 95);
    
    doc.setFontSize(10);
    const splitNotes = doc.splitTextToSize(report.notes, 180);
    doc.text(splitNotes, 15, 105);
  }
  
  // Add restrictions if any
  if (report.restrictions && report.restrictions.length > 0) {
    doc.setFontSize(12);
    doc.text('Restrictions', 15, 125);
    
    doc.setFontSize(10);
    report.restrictions.forEach((restriction, index) => {
      doc.text(`• ${restriction}`, 15, 135 + (index * 5));
    });
  }
  
  // Add follow-up date if any
  if (report.followUpDate) {
    doc.setFontSize(12);
    doc.text('Follow-up', 15, 155);
    
    doc.setFontSize(10);
    doc.text(`Follow-up Date: ${report.followUpDate}`, 15, 165);
  }
  
  // Add footer
  addFooter(doc);
  
  return doc;
};

/**
 * Generates a You See U Act report PDF
 */
export const generateYouSeeUActPDF = (report: YouSeeUActReport): jsPDF => {
  const doc = createPDF({
    title: 'You See U Act Report',
    author: 'Alpatech Onboard Hub',
    subject: 'Safety Observation Report',
  });
  
  // Add header
  addHeader(doc, 'YOU SEE U ACT REPORT');
  
  // Add report information
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Report Information', 15, 40);
  
  doc.setFontSize(10);
  doc.text(`Report ID: ${report.id}`, 15, 50);
  doc.text(`Submitted By: ${report.submittedBy}`, 15, 55);
  doc.text(`Date: ${report.date}`, 15, 60);
  doc.text(`Location: ${report.location}`, 15, 65);
  
  // Add observation details
  doc.setFontSize(12);
  doc.text('Observation Details', 15, 75);
  
  doc.setFontSize(10);
  doc.text(`Type: ${report.type}`, 15, 85);
  doc.text(`Category: ${report.category}`, 15, 90);
  
  // Add description with word wrapping
  doc.setFontSize(12);
  doc.text('Description', 15, 100);
  
  doc.setFontSize(10);
  const splitDescription = doc.splitTextToSize(report.description, 180);
  doc.text(splitDescription, 15, 110);
  
  // Add actions taken if any
  if (report.actions) {
    doc.setFontSize(12);
    doc.text('Actions Taken', 15, 130);
    
    doc.setFontSize(10);
    const splitActions = doc.splitTextToSize(report.actions, 180);
    doc.text(splitActions, 15, 140);
  }
  
  // Add status information
  doc.setFontSize(12);
  doc.text('Status Information', 15, 160);
  
  doc.setFontSize(10);
  doc.text(`Status: ${report.status}`, 15, 170);
  
  if (report.assignedTo) {
    doc.text(`Assigned To: ${report.assignedTo}`, 15, 175);
  }
  
  if (report.closedDate) {
    doc.text(`Closed Date: ${report.closedDate}`, 15, 180);
  }
  
  // Add footer
  addFooter(doc);
  
  return doc;
};

/**
 * Saves a PDF document with the specified filename
 */
export const savePDF = (doc: jsPDF, filename: string): void => {
  doc.save(filename);
};

/**
 * Opens a PDF document in a new tab
 */
export const openPDF = (doc: jsPDF): void => {
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, '_blank');
};
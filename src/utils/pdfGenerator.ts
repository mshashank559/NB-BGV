import { jsPDF } from 'jspdf';
import type { BGVRequest } from '../types';

export const downloadSentEmailPDF = (request: BGVRequest) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner with Netbounce Blue
  doc.setFillColor(37, 99, 235); // #2563eb
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('NETBOUNCE PLACEMENT & VERIFICATION SERVICES', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL SENT EMAIL RECORD', pageWidth - 14, 15, { align: 'right' });

  // Metadata Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 30, pageWidth - 28, 40, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Request ID:', 18, 38);
  doc.text('Date & Time:', 18, 45);
  doc.text('From:', 18, 52);
  doc.text('To:', 18, 59);
  doc.text('CC:', 18, 66);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(request.id, 45, 38);
  doc.text(request.sentAt || request.createdAt, 45, 45);
  doc.text('Netbounce HR Operations <hr@netbounceplacement.com>', 45, 52);
  doc.text(request.emailDetails?.to || request.previousEmail, 45, 59);
  doc.text((request.emailDetails?.cc || ['hr@netbounceplacement.com']).join(', '), 45, 66);

  // Email Subject
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text(`Subject: ${request.emailDetails?.subject || `Employment Verification Request for ${request.candidateName}`}`, 14, 80);

  // Email Body Container
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.rect(14, 86, pageWidth - 28, 160);

  // Inside Email Body: Brand Banner
  doc.setFillColor(238, 242, 255);
  doc.rect(15, 87, pageWidth - 30, 16, 'F');
  doc.setTextColor(37, 99, 235);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('EMPLOYMENT VERIFICATION REQUEST', pageWidth / 2, 97, { align: 'center' });

  // Salutation & Intro
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Dear HR Team,', 20, 112);
  doc.text(
    `The following candidate has declared prior employment with your organization and is being evaluated for`,
    20,
    119
  );
  doc.text(
    `a role at Netbounce. Kindly confirm their employment details by accessing the secure form below.`,
    20,
    125
  );

  // Candidate Details Table in Email
  let y = 135;
  const fields = [
    ['Candidate / Employee Name', request.candidateName],
    ['Position Offered at Netbounce', request.positionOffered || 'N/A'],
    ['Department', request.department],
    ['Previous Employer (Declared)', request.previousEmployer],
    ['Declared Tenure', `${request.employmentStartDate} to ${request.employmentEndDate}`],
    ['Declared Designation', request.designation],
  ];

  fields.forEach(([label, val]) => {
    doc.setFillColor(y % 2 === 0 ? 255 : 248, 250, 252);
    doc.rect(20, y, pageWidth - 40, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text(label, 24, y + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(val), 100, y + 5.5);
    y += 8;
  });

  // Call to Action Simulation
  y += 6;
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(pageWidth / 2 - 40, y, 80, 10, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Confirm Employment Details', pageWidth / 2, y + 6.5, { align: 'center' });

  // Direct Unique Link
  y += 18;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Or copy and paste this unique link into your browser:', 20, y);
  doc.setTextColor(37, 99, 235);
  doc.text(`https://netbounceplacement.com/public/verify-employer/${request.token}`, 20, y + 5);

  // Footer / Confidentiality
  y += 16;
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Notice: Link is valid for 30 days. This communication contains privileged and confidential information.', 20, y);
  doc.text('Automated verification record sent on behalf of Netbounce HR Verification Team.', 20, y + 4);

  // Page Bottom Watermark
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated on ${new Date().toLocaleString()} | Netbounce BGV System`, 14, 285);

  // Save File
  const safeName = request.candidateName.replace(/\s+/g, '_');
  doc.save(`BGV_${safeName}_${request.id}_email.pdf`);
};

export const downloadResponsePDF = (request: BGVRequest) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header Banner with Green/Blue gradient accent
  doc.setFillColor(16, 185, 129); // #10b981
  doc.rect(0, 0, pageWidth, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('NETBOUNCE BGV - EMPLOYMENT VERIFICATION REPORT', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('VERIFIED RECORD', pageWidth - 14, 15, { align: 'right' });

  // Status Badge
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(187, 247, 208);
  doc.roundedRect(14, 30, pageWidth - 28, 20, 2, 2, 'FD');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(21, 128, 61);
  const isConfirmed = request.responseDetails?.confirmed ?? true;
  doc.text(isConfirmed ? '✔ EMPLOYMENT STATUS: CONFIRMED' : '✖ EMPLOYMENT STATUS: CANNOT CONFIRM', 20, 42);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Submitted on: ${request.responseDetails?.submittedAt || request.respondedAt || 'N/A'}`, pageWidth - 20, 42, { align: 'right' });

  // Section 1: Candidate Declared Information
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('1. Candidate & Position Details', 14, 58);

  let y = 62;
  const candDetails = [
    ['Candidate Name', request.candidateName],
    ['Position Offered', request.positionOffered],
    ['Department', request.department],
    ['Previous Employer', request.previousEmployer],
    ['Declared Tenure', `${request.employmentStartDate} to ${request.employmentEndDate}`],
    ['Declared CTC / Salary', request.ctc || 'Not Disclosed'],
    ['Notice Period', request.noticePeriod || 'Served'],
  ];

  candDetails.forEach(([k, v]) => {
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y, pageWidth - 28, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(k, 18, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(v), 90, y + 5);
    y += 7.5;
  });

  // Section 2: Employer Verification Response
  y += 5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('2. Employer Verified Response & Remarks', 14, y);

  y += 4;
  const resp = request.responseDetails;
  const empDetails = [
    ['Employment Confirmation', resp?.confirmed ? 'Yes, Confirmed' : 'No, Cannot Confirm'],
    ['Rehire Eligibility', resp?.rehireEligibility || 'Eligible'],
    ['Remarks / Performance & Conduct', resp?.remarks || 'No adverse records. Recommended.'],
  ];

  empDetails.forEach(([k, v]) => {
    doc.setFillColor(241, 245, 249);
    doc.rect(14, y, pageWidth - 28, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(k, 18, y + 5.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(v), 90, y + 5.5);
    y += 8.5;
  });

  // Section 2.5: Behavioural Reference Evaluation (if present)
  if (resp?.behaviouralRatings) {
    y += 4;
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    const avgText = resp.behaviouralRatings.averageScore ? ` (Average: ${resp.behaviouralRatings.averageScore}/5.0)` : '';
    doc.text(`3. Behavioural Competency Reference${avgText}`, 14, y);

    y += 4;
    const bRatings = [
      ['Performance Under Pressure', resp.behaviouralRatings.q1PerformanceUnderPressure ? `${resp.behaviouralRatings.q1PerformanceUnderPressure}/5 Stars` : 'Not Observed'],
      ['Problem-Solving & Critical Action', resp.behaviouralRatings.q2ProblemSolving ? `${resp.behaviouralRatings.q2ProblemSolving}/5 Stars` : 'Not Observed'],
      ['Teamwork & Communication', resp.behaviouralRatings.q3TeamworkCommunication ? `${resp.behaviouralRatings.q3TeamworkCommunication}/5 Stars` : 'Not Observed'],
      ['Receiving Feedback & Growth', resp.behaviouralRatings.q4ReceivingFeedback ? `${resp.behaviouralRatings.q4ReceivingFeedback}/5 Stars` : 'Not Observed'],
      ['Ownership & Reliability', resp.behaviouralRatings.q5OwnershipReliability ? `${resp.behaviouralRatings.q5OwnershipReliability}/5 Stars` : 'Not Observed'],
    ];

    if (resp.behaviouralRatings.comment) {
      bRatings.push(['Situational Example (STAR Note)', resp.behaviouralRatings.comment]);
    }

    bRatings.forEach(([k, v]) => {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, pageWidth - 28, 7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(k, 18, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(15, 23, 42);
      doc.text(String(v).substring(0, 60), 90, y + 5);
      y += 7.5;
    });
  }

  // Section 4: Verifier Identity Details
  y += 5;
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('4. Verifier Information & Sign-off', 14, y);

  y += 4;
  const verifierInfo = [
    ['Verifier Name', resp?.verifierName || 'Authorized Employer Representative'],
    ['Official Designation', resp?.verifierDesignation || 'HR Manager'],
    ['Official Contact Email', resp?.verifierEmail || request.previousEmail],
    ['Contact Phone', resp?.verifierPhone || '+91 98000 00000'],
  ];

  verifierInfo.forEach(([k, v]) => {
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y, pageWidth - 28, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(k, 18, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(String(v), 90, y + 5);
    y += 7.5;
  });

  // Verification Seal Box
  y += 6;
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 22, 2, 2);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Legal Disclaimer: This verification record is digitally generated by Netbounce BGV based on submissions',
    18,
    y + 6
  );
  doc.text(
    'provided directly by the designated employer representative via unique authenticated cryptographic token.',
    18,
    y + 11
  );
  doc.text(`Request Reference ID: ${request.id} | Token: ${request.token.substring(0, 24)}...`, 18, y + 16);

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Official Record Generated: ${new Date().toLocaleString()} | Netbounce HR Systems`, 14, 285);

  const safeName = request.candidateName.replace(/\s+/g, '_');
  doc.save(`BGV_${safeName}_${request.id}_response.pdf`);
};

export const generateExperienceLetterDoc = (request: BGVRequest): jsPDF => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const employerName = (request.previousEmployer || 'Organization').toUpperCase();

  // Top Accent Bar
  doc.setFillColor(30, 41, 59); // slate-800
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Letterhead Header
  doc.setTextColor(15, 23, 42); // slate-900
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(employerName, 20, 24);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text('CORPORATE HEADQUARTERS • HUMAN RESOURCES & PEOPLE TALENT OPERATIONS', 20, 30);
  doc.text('Registered Office: Tech Park, Cyber City, Sector 44 • Official Record Center', 20, 34);

  // Decorative Horizontal Divider
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.8);
  doc.line(20, 38, pageWidth - 20, 38);

  // Reference & Date Box
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Reference: ${employerName.slice(0, 4)}/REL/${request.id.replace('NB-BGV-', '')}/${new Date().getFullYear()}`, 20, 47);
  doc.text(`Date of Issue: ${request.employmentEndDate || 'November 15, 2024'}`, pageWidth - 20, 47, { align: 'right' });

  // Certificate Title
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(pageWidth / 2 - 60, 56, 120, 11, 2, 2, 'FD');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('EXPERIENCE & RELIEVING CERTIFICATE', pageWidth / 2, 63.5, { align: 'center' });

  // Addressed To
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('TO WHOMSOEVER IT MAY CONCERN', 20, 78);

  // Main Certificate Body
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);

  const textLines = [
    `This is to certify that ${request.candidateName} was in bonafide, full-time employment with ${request.previousEmployer} from ${request.employmentStartDate} to ${request.employmentEndDate}.`,
    `During their association with our organization, they served with professional diligence in the capacity of ${request.designation} within the ${request.department || 'Design & Engineering'} division.`,
    `At the time of their separation, their declared gross annual compensation stood at ${request.ctc || 'Rs. 11,00,000/- per annum'}.`,
    `Throughout their tenure, their professional conduct, domain aptitude, and peer collaboration were found to be exemplary and of superior standard. They successfully delivered upon all allocated key performance objectives.`,
    `We further confirm that ${request.candidateName} has formally served their agreed notice period (${request.noticePeriod || 'Served'}) and handed over all organizational assets and operational deliverables in full compliance with corporate exit protocol.`,
    `Consequently, they were officially relieved of all duties and responsibilities at the close of business hours on ${request.employmentEndDate}.`,
    `We take this opportunity to thank them for their valued contributions and wish them every success in their prospective career engagements.`,
  ];

  let currentY = 88;
  textLines.forEach((para) => {
    const split = doc.splitTextToSize(para, pageWidth - 40);
    doc.text(split, 20, currentY);
    currentY += split.length * 5.5 + 4;
  });

  // Summary Information Grid
  currentY += 2;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(20, currentY, pageWidth - 40, 28, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Candidate Name:', 25, currentY + 7);
  doc.text('Designation at Exit:', 25, currentY + 14);
  doc.text('Period of Employment:', 25, currentY + 21);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(request.candidateName, 68, currentY + 7);
  doc.text(request.designation, 68, currentY + 14);
  doc.text(`${request.employmentStartDate} to ${request.employmentEndDate}`, 68, currentY + 21);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Employee ID Ref:', 125, currentY + 7);
  doc.text('Reason for Exit:', 125, currentY + 14);
  doc.text('Relieving Status:', 125, currentY + 21);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`EMP-${request.id.replace('NB-BGV-', '')}`, 160, currentY + 7);
  doc.text(request.reasonForLeaving || 'Career Advancement', 160, currentY + 14);
  doc.setTextColor(16, 185, 129); // green
  doc.setFont('helvetica', 'bold');
  doc.text('Honorably Relieved', 160, currentY + 21);

  // Signatory Stamp Section
  currentY += 38;
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`For ${employerName}`, pageWidth - 20, currentY, { align: 'right' });

  // Official Seal Badge
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(148, 163, 184);
  doc.roundedRect(25, currentY - 6, 62, 22, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL HR SEAL & RECORD', 30, currentY);
  doc.setFont('helvetica', 'normal');
  doc.text(`Doc: ${request.experienceLetterName || `${request.candidateName}_Relieving.pdf`}`, 30, currentY + 5);
  doc.text('Verified Authentic via Netbounce BGV', 30, currentY + 10);

  currentY += 16;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'bold');
  doc.text('Authorized Human Resources Signatory', pageWidth - 20, currentY, { align: 'right' });
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('People Operations & Talent Governance', pageWidth - 20, currentY + 5, { align: 'right' });

  // Bottom Security Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(20, 276, pageWidth - 20, 276);
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('This document is confidential and issued without prejudice for verification purposes.', 20, 281);
  doc.text(`Netbounce BGV Ledger Token: ${request.token.slice(0, 32)}...`, pageWidth - 20, 281, { align: 'right' });

  return doc;
};

export const generateExperienceLetterBlobUrl = (request: BGVRequest): string => {
  const doc = generateExperienceLetterDoc(request);
  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
};

export const downloadExperienceLetterPDF = (request: BGVRequest) => {
  const doc = generateExperienceLetterDoc(request);
  const fileName = request.experienceLetterName || `${request.candidateName.replace(/\s+/g, '_')}_Relieving.pdf`;
  doc.save(fileName);
};

import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE === 'false' ? false : true,
  auth: {
    user: process.env.SMTP_USER || 'bgv@netbounceplacement.com',
    pass: (process.env.SMTP_PASS || 'lqlkzjseumkpstcu').replace(/\s+/g, ''),
  },
});

export interface SendVerificationEmailParams {
  to: string;
  cc?: string[];
  subject: string;
  candidateName: string;
  positionOffered?: string;
  department: string;
  previousEmployer: string;
  tenure: string;
  designation: string;
  verificationLink: string;
  personalNote?: string;
}

export async function sendVerificationEmail({
  to,
  cc,
  subject,
  candidateName,
  positionOffered,
  department,
  previousEmployer,
  tenure,
  designation,
  verificationLink,
  personalNote,
}: SendVerificationEmailParams) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Employment Verification Request</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #0b1329;
      margin: 0;
      padding: 30px 16px;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      max-width: 620px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(59, 130, 246, 0.2);
    }
    .header-dark {
      background: #3876ba url('https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1200&auto=format&fit=crop&q=80') center center / cover no-repeat;
      padding: 38px 24px;
      text-align: center;
      border-bottom: 3px solid #8cbfe8;
      border-radius: 24px 24px 0 0;
    }
    .logo-container {
      margin-bottom: 16px;
      text-align: center;
    }
    .logo-img {
      height: 50px;
      max-width: 320px;
      width: auto;
      display: inline-block;
      vertical-align: middle;
      filter: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.2));
    }
    .badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(255, 255, 255, 0.22);
      border: 1px solid rgba(255, 255, 255, 0.45);
      border-radius: 20px;
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #ffffff;
      text-transform: uppercase;
      margin-top: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    }
    .body-content {
      padding: 36px 32px;
      background: #ffffff;
    }
    .salutation {
      font-size: 17px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 12px;
    }
    .intro-p {
      font-size: 13.5px;
      line-height: 1.65;
      color: #475569;
      margin-bottom: 24px;
    }
    .memo-card {
      background: #f8fafc;
      border-left: 4px solid #2563eb;
      border-radius: 0 14px 14px 0;
      padding: 16px 20px;
      margin-bottom: 28px;
      border-top: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
    }
    .memo-title {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #1e3a8a;
      margin-bottom: 6px;
    }
    .memo-text {
      font-size: 12.5px;
      font-style: italic;
      color: #334155;
      line-height: 1.5;
    }
    .table-box {
      border: 1px solid #cbd5e1;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 32px;
      background: #ffffff;
    }
    .table-header {
      background: #0f172a;
      color: #ffffff;
      padding: 12px 18px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
    }
    tr.alt {
      background-color: #f8fafc;
    }
    td {
      padding: 11px 16px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    td.lbl {
      font-weight: 600;
      color: #64748b;
      width: 42%;
    }
    td.val {
      font-weight: 800;
      color: #0f172a;
    }
    .action-container {
      text-align: center;
      margin: 32px 0;
    }
    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 15px 36px;
      font-size: 13.5px;
      font-weight: 800;
      border-radius: 14px;
      box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
      letter-spacing: 0.02em;
    }
    .link-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 16px;
      font-size: 11px;
      color: #64748b;
      word-break: break-all;
      margin-top: 24px;
    }
    .link-box strong {
      color: #334155;
      display: block;
      margin-bottom: 4px;
    }
    .footer-dark {
      background: #f1f5f9;
      padding: 22px 24px;
      text-align: center;
      font-size: 11px;
      line-height: 1.6;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header-dark" style="background-color: #3876ba; background-image: url('https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1200&auto=format&fit=crop&q=80'); background-size: cover; background-position: center; padding: 38px 24px; text-align: center; border-bottom: 3px solid #8cbfe8; border-radius: 24px 24px 0 0;">
      <div class="logo-container" style="margin-bottom: 16px; text-align: center;">
        <img src="https://bgv.netbounceplacement.com/netbounce-logo.png" alt="NETBOUNCE PLACEMENT LLC" class="logo-img" style="height: 52px; max-width: 320px; width: auto; display: inline-block; vertical-align: middle; filter: drop-shadow(0 6px 18px rgba(0, 0, 0, 0.45));" />
      </div>
      <div>
        <span class="badge" style="display: inline-block; padding: 7px 18px; background: rgba(255, 255, 255, 0.28); border: 1.5px solid rgba(255, 255, 255, 0.65); border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 0.08em; color: #ffffff; text-transform: uppercase; text-shadow: 0 1px 4px rgba(0, 0, 0, 0.35); box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);">Official Employment Verification Request</span>
      </div>
    </div>

    <div class="body-content">
      <div class="salutation">Dear HR Operations Team,</div>
      <div class="intro-p">
        The candidate named below has declared prior employment with your organization and has been offered an appointment at <strong>Netbounce Placement LLC</strong>. As part of our mandatory compliance and background check procedure, kindly verify their employment details.
      </div>

      ${
        personalNote
          ? `
      <div class="memo-card">
        <div class="memo-title">Netbounce HR Memorandum Note</div>
        <div class="memo-text">"${personalNote}"</div>
      </div>
      `
          : ''
      }

      <div class="table-box">
        <div class="table-header">Declared Employment Credentials</div>
        <table>
          <tr class="alt">
            <td class="lbl">Candidate Full Name</td>
            <td class="val">${candidateName}</td>
          </tr>
          <tr>
            <td class="lbl">Position Offered (Netbounce)</td>
            <td class="val" style="color: #1d4ed8;">${positionOffered || 'N/A'}</td>
          </tr>
          <tr class="alt">
            <td class="lbl">Department</td>
            <td class="val">${department}</td>
          </tr>
          <tr>
            <td class="lbl">Previous Organization</td>
            <td class="val">${previousEmployer}</td>
          </tr>
          <tr class="alt">
            <td class="lbl">Declared Designation</td>
            <td class="val">${designation}</td>
          </tr>
          <tr>
            <td class="lbl">Declared Employment Tenure</td>
            <td class="val" style="font-family: monospace;">${tenure}</td>
          </tr>
        </table>
      </div>

      <div class="action-container">
        <p style="font-size: 12.5px; color: #475569; font-weight: 600; margin-bottom: 12px;">
          Click the secure button below to complete the verification in under two minutes:
        </p>
        <a href="${verificationLink}" class="cta-btn" target="_blank">Confirm Employment Details</a>
      </div>

      <div class="link-box">
        <strong>Direct browser fallback link:</strong>
        <a href="${verificationLink}" style="color: #2563eb; text-decoration: underline;">${verificationLink}</a>
      </div>
    </div>

    <div class="footer-dark">
      Dispatched via Netbounce Automated BGV Engine from <strong>bgv@netbounceplacement.com</strong>.<br>
      Confidentiality Note: This communication is confidential and intended solely for the recipient's HR verification desk.<br>
      &copy; ${new Date().getFullYear()} Netbounce Placement LLC. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;

  const fromEmail = process.env.SMTP_USER || 'bgv@netbounceplacement.com';
  const mailOptions: SendMailOptions = {
    from: `"Netbounce BGV Operations" <${fromEmail}>`,
    to,
    cc: cc && cc.length ? cc : undefined,
    subject,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
}

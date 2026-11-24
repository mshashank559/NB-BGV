import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mail, ShieldCheck, Sparkles, Quote, Lock, ExternalLink } from 'lucide-react';
import type { BGVRequest } from '../types';

interface EmailComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData: Partial<BGVRequest> | null;
  onConfirmSend: (emailPayload: {
    to: string;
    cc: string[];
    subject: string;
    personalNote: string;
  }) => void;
}

export const EmailComposerModal: React.FC<EmailComposerModalProps> = ({
  isOpen,
  onClose,
  requestData,
  onConfirmSend,
}) => {
  if (!isOpen || !requestData) return null;

  const defaultSubject = `Employment Verification Request – ${requestData.candidateName || 'Candidate'} – Netbounce Placement LLC`;
  const [toAddress, setToAddress] = useState(requestData.previousEmail || '');
  const [ccAddresses, setCcAddresses] = useState('bgv@netbounceplacement.com');
  const [subject, setSubject] = useState(defaultSubject);
  const [personalNote, setPersonalNote] = useState(
    'Candidate has been offered a role and onboarding is scheduled for next Monday. Kindly expedite verification at your earliest convenience.'
  );

  const handleSend = () => {
    if (!toAddress) {
      alert('Recipient email (To) is required.');
      return;
    }
    const ccList = ccAddresses.split(',').map((s) => s.trim()).filter(Boolean);
    onConfirmSend({
      to: toAddress,
      cc: ccList,
      subject,
      personalNote,
    });
  };

  const previewToken = requestData.token || '8f4c29a1e0b53d7199c824ba014ef9c5d8a23e1b7c4d5f6a9e0b1c2d3e4f5a6b';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/45 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-4xl max-h-[92vh] bg-gradient-to-b from-[#0f2e6e]/95 via-[#133d8c]/92 to-[#0c2457]/95 backdrop-blur-3xl rounded-[32px] shadow-[0_24px_90px_rgba(37,99,235,0.35)] border border-sky-400/40 text-white flex flex-col overflow-hidden relative"
        >
          {/* Ambient Light Blue Glows inside Modal */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* 1. Fixed Header (Pinned at Top) */}
          <div className="shrink-0 px-6 sm:px-8 py-5 border-b border-sky-400/30 bg-[#0c275f]/90 backdrop-blur-2xl flex items-center justify-between z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 border border-white/30">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black tracking-tight text-white">Email Composer & Mailbox Preview</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-400/25 text-sky-200 border border-sky-300/40 uppercase tracking-wider">
                    Apple Liquid UI
                  </span>
                </div>
                <p className="text-xs font-medium text-sky-200/75 mt-0.5">
                  Official Netbounce verification template dispatched via verified SMTP gateway
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sky-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Internal Scrollable Body with Smooth Scroller */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6 z-10">
            {/* SMTP Controls Strip (Vibrant Light-Blue Frosted Glass) */}
            <div className="bg-[#153f8a]/60 backdrop-blur-xl p-5 rounded-3xl border border-sky-400/35 space-y-3 shadow-inner">
              <div className="flex items-center justify-between pb-2 border-b border-sky-400/25">
                <span className="text-[11px] font-black text-sky-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-sky-300" />
                  Verified SMTP Gateway Dispatch Settings
                </span>
                <span className="text-[10px] font-mono text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/40">
                  From: bgv@netbounceplacement.com
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-sky-100 mb-1">
                    To (Employer Official HR Email) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={toAddress}
                    onChange={(e) => setToAddress(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-sky-400/40 text-xs bg-[#0b214f]/80 text-white font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-300 placeholder-sky-300/40"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-sky-100 mb-1">
                    CC (Internal Audit & Compliance)
                  </label>
                  <input
                    type="text"
                    value={ccAddresses}
                    onChange={(e) => setCcAddresses(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-sky-400/40 text-xs bg-[#0b214f]/80 text-white font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-300 placeholder-sky-300/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-sky-100 mb-1">
                  Subject Line
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-sky-400/40 text-xs bg-[#0b214f]/80 text-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-sky-100 mb-1 flex items-center justify-between">
                  <span>Executive Note to Employer Verifier</span>
                  <span className="text-[10px] text-sky-200/80 font-normal">Rendered in executive memo box</span>
                </label>
                <textarea
                  rows={2}
                  value={personalNote}
                  onChange={(e) => setPersonalNote(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-sky-400/40 text-xs bg-[#0b214f]/80 text-white font-medium focus:outline-none focus:ring-2 focus:ring-sky-400/50 focus:border-sky-300"
                />
              </div>
            </div>

            {/* THE MAILBOX UI/UX - VIBRANT ROYAL & LIGHT BLUE APPLE LIQUID GLASS CANVAS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-black text-sky-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                  Live Recipient Mailbox Rendering Preview
                </span>
                <span className="text-[10px] text-sky-200/80 font-medium">As shown in recipient inbox</span>
              </div>

              {/* The Actual Email Letterhead Container */}
              <div className="rounded-[28px] overflow-hidden shadow-2xl border border-white/20 bg-white text-slate-900 font-sans">
                
                {/* 1. Realistic Blue Sky & Floating Clouds Header */}
                <div className="relative bg-[#3876ba] bg-[url('https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1200&auto=format&fit=crop&q=80')] bg-cover bg-center px-6 sm:px-8 py-7 text-white border-b-2 border-sky-300 overflow-hidden">
                  {/* Specular Top Glow & Radial Light Diffusion */}
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/80 to-transparent z-1" />
                  
                  {/* Floating Sky & Clouds Effect (Drifting from Left to Right Slowly) */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    {/* Cloud Formation 1 - Upper Luminous Mist (Drifting Left to Right) */}
                    <motion.div
                      initial={{ x: '-35%', opacity: 0.65 }}
                      animate={{ x: '125%', opacity: [0.35, 0.75, 0.35] }}
                      transition={{ repeat: Infinity, duration: 26, ease: 'linear' }}
                      className="absolute top-1/4 -translate-y-1/2 flex items-center pointer-events-none"
                    >
                      <div className="w-56 h-20 bg-white/35 rounded-full blur-xl" />
                      <div className="w-40 h-28 bg-sky-100/40 rounded-full blur-2xl -ml-16" />
                      <div className="w-64 h-24 bg-white/30 rounded-full blur-xl -ml-20" />
                      <div className="w-36 h-16 bg-white/25 rounded-full blur-lg -ml-10" />
                    </motion.div>

                    {/* Cloud Formation 2 - Lower Drifting Wisps (Slower Parallax Drift) */}
                    <motion.div
                      initial={{ x: '-55%', opacity: 0.5 }}
                      animate={{ x: '135%', opacity: [0.25, 0.65, 0.25] }}
                      transition={{ repeat: Infinity, duration: 40, ease: 'linear', delay: 6 }}
                      className="absolute -bottom-2 flex items-center pointer-events-none"
                    >
                      <div className="w-72 h-24 bg-white/25 rounded-full blur-2xl" />
                      <div className="w-52 h-20 bg-sky-200/35 rounded-full blur-xl -ml-14" />
                      <div className="w-80 h-24 bg-white/30 rounded-full blur-2xl -ml-20" />
                    </motion.div>

                    {/* Cloud Formation 3 - Gentle Foreground Clouds */}
                    <motion.div
                      initial={{ x: '-20%', opacity: 0.7 }}
                      animate={{ x: '140%', opacity: [0.4, 0.8, 0.4] }}
                      transition={{ repeat: Infinity, duration: 32, ease: 'linear', delay: 14 }}
                      className="absolute top-1 flex items-center pointer-events-none"
                    >
                      <div className="w-44 h-16 bg-white/30 rounded-full blur-lg" />
                      <div className="w-56 h-20 bg-sky-100/35 rounded-full blur-xl -ml-12" />
                      <div className="w-36 h-14 bg-white/25 rounded-full blur-md -ml-8" />
                    </motion.div>

                    {/* Shimmering Ethereal Sky Wave */}
                    <motion.div
                      animate={{
                        x: ['-50%', '50%'],
                      }}
                      transition={{ repeat: Infinity, duration: 20, ease: 'easeInOut', repeatType: 'reverse' }}
                      className="absolute -inset-y-10 -inset-x-20 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl pointer-events-none mix-blend-overlay"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    {/* The Official Logo: NETBOUNCE PLACEMENT LLC (Clean Transparent, Floating on Sky) */}
                    <div className="flex items-center">
                      <img
                        src="/netbounce-logo.png"
                        alt="NETBOUNCE PLACEMENT LLC"
                        className="h-10 sm:h-12 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
                      />
                    </div>

                    {/* REDESIGNED & POLISHED VERIFICATION BADGE & REF CHIP */}
                    <div className="flex flex-col sm:items-end gap-1.5">
                      {/* Premium Official Verification Notice Pill */}
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-xl border border-white/40 shadow-sm shadow-black/10">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                        <ShieldCheck className="w-4 h-4 text-white" />
                        <span className="text-[11px] font-black tracking-wider text-white uppercase drop-shadow-xs">
                          Official Verification Notice
                        </span>
                      </div>

                      {/* Clean Reference Chip */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/25 backdrop-blur-md border border-white/20 shadow-xs">
                        <span className="text-[10px] font-bold text-sky-200 uppercase tracking-wider">REF ID</span>
                        <span className="text-[11px] font-mono font-black text-white tracking-wider">
                          {requestData.id || 'NB-BGV-1001'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Email Body Content in Crisp Pure White with Dark Blue Typography */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* Salutation & Authority Statement */}
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">
                      Dear HR Operations Team,
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      The candidate below has declared prior employment with your organization and has been offered an appointment at <strong>Netbounce</strong>. As part of our mandatory background verification compliance, please confirm their previous tenure and designation details.
                    </p>
                  </div>

                  {/* Professional Executive Memorandum Note */}
                  {personalNote && (
                    <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-white border-l-4 border-blue-600 border-y border-r border-blue-100/80 shadow-xs">
                      <div className="flex items-center gap-2 mb-2">
                        <Quote className="w-4 h-4 text-blue-600" />
                        <span className="text-[11px] font-black text-blue-950 uppercase tracking-wider">
                          Netbounce HR Memorandum Note
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 italic leading-relaxed pl-6">
                        "{personalNote}"
                      </p>
                    </div>
                  )}

                  {/* Declared Candidate Credentials Table */}
                  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between text-white">
                      <span className="text-[11px] font-black tracking-wider uppercase">
                        Declared Employment Credentials
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Verification Target</span>
                    </div>

                    <table className="w-full text-left text-xs border-collapse">
                      <tbody className="divide-y divide-slate-100">
                        <tr className="bg-slate-50/60">
                          <td className="py-2.5 px-4 font-bold text-slate-500 w-2/5">Candidate Full Name</td>
                          <td className="py-2.5 px-4 font-black text-slate-900 text-sm">{requestData.candidateName}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-bold text-slate-500">Position Offered (Netbounce)</td>
                          <td className="py-2.5 px-4 font-bold text-blue-700">{requestData.positionOffered || 'N/A'}</td>
                        </tr>
                        <tr className="bg-slate-50/60">
                          <td className="py-2.5 px-4 font-bold text-slate-500">Department</td>
                          <td className="py-2.5 px-4 font-semibold text-slate-800">{requestData.department}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-bold text-slate-500">Previous Organization</td>
                          <td className="py-2.5 px-4 font-extrabold text-slate-900">{requestData.previousEmployer}</td>
                        </tr>
                        <tr className="bg-slate-50/60">
                          <td className="py-2.5 px-4 font-bold text-slate-500">Declared Designation</td>
                          <td className="py-2.5 px-4 font-bold text-slate-800">{requestData.designation}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-bold text-slate-500">Declared Employment Tenure</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-800">
                            {requestData.employmentStartDate} to {requestData.employmentEndDate}
                          </td>
                        </tr>
                        {requestData.ctc && (
                          <tr className="bg-slate-50/60">
                            <td className="py-2.5 px-4 font-bold text-slate-500">Declared Last CTC</td>
                            <td className="py-2.5 px-4 font-mono font-bold text-slate-800">{requestData.ctc}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Big Apple Liquid Blue Button (Action Call - Opens Standalone Verification Page) */}
                  <div className="text-center py-3">
                    <p className="text-xs text-slate-500 font-semibold mb-3">
                      Please click below to verify or correct the candidate's employment details (takes &lt; 2 minutes):
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`${window.location.origin}/?token=${previewToken}`, '_blank');
                      }}
                      title="Open verification form in a new tab"
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-black text-xs shadow-xl shadow-blue-600/35 border border-white/25 hover:brightness-110 transition-all cursor-pointer active:scale-95 group"
                    >
                      <span>Confirm Employment Details</span>
                      <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <span className="block text-[10.5px] text-blue-600 font-semibold mt-1.5">
                      ↗ Opens public verification link in a separate window
                    </span>
                  </div>

                  {/* Fallback Direct Link Box */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                    <p className="font-bold text-slate-700 mb-0.5">Or copy and paste this verification URL into your browser:</p>
                    <button
                      type="button"
                      onClick={() => {
                        window.open(`${window.location.origin}/?token=${previewToken}`, '_blank');
                      }}
                      className="font-mono text-blue-600 hover:underline break-all text-[10.5px] text-left cursor-pointer"
                    >
                      {`${window.location.origin}/?token=${previewToken}`}
                    </button>
                  </div>

                  {/* Footer Disclaimer */}
                  <div className="pt-4 border-t border-slate-200 text-center text-[10.5px] text-slate-400 font-medium space-y-1">
                    <p>This is an automated background verification request dispatched on behalf of Netbounce Placement LLC.</p>
                    <p className="font-mono text-[9.5px]">© {new Date().getFullYear()} Netbounce Placement LLC. All rights reserved.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Fixed Footer Actions (Pinned at Bottom, ALWAYS Visible) */}
          <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-sky-400/30 bg-[#0c275f]/95 backdrop-blur-2xl flex items-center justify-between z-20">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-sky-100 hover:text-white hover:bg-white/15 transition-all cursor-pointer border border-sky-300/30"
            >
              Back to Edit
            </button>
            <button
              onClick={handleSend}
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-black shadow-lg shadow-sky-500/30 flex items-center gap-2 transition-all cursor-pointer active:scale-95 border border-white/30"
            >
              <Send className="w-4 h-4" />
              <span>Confirm & Dispatch Official Email</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

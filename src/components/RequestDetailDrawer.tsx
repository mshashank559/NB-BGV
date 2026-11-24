import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Send, Eye, CheckCircle, FileText, Download, ShieldCheck, Star } from 'lucide-react';
import type { BGVRequest } from '../types';

interface RequestDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  request: BGVRequest | null;
  onDownloadEmailPDF: (request: BGVRequest) => void;
  onDownloadResponsePDF: (request: BGVRequest) => void;
}

export const RequestDetailDrawer: React.FC<RequestDetailDrawerProps> = ({
  isOpen,
  onClose,
  request,
  onDownloadEmailPDF,
  onDownloadResponsePDF,
}) => {
  if (!isOpen || !request) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden text-slate-800"
        >
          {/* 1. Fixed Header (Pinned at Top) */}
          <div className="shrink-0 px-6 sm:px-8 py-5 border-b border-slate-200 bg-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                {request.id}
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">{request.candidateName}</h2>
              <p className="text-xs font-semibold text-slate-500">{request.positionOffered} • {request.department}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Scrollable Body with Internal Scroller */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
            {/* Timeline Lifecycle (PRD Step-by-Step Audit) */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
                Verification Lifecycle Timeline
              </h3>
              <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                {/* Created */}
                <div className="flex items-start gap-3 relative">
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 z-10 border border-slate-300">
                    <Clock className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Draft Request Created</p>
                    <p className="text-[11px] font-medium text-slate-500">{request.createdAt}</p>
                  </div>
                </div>

                {/* Sent */}
                <div className="flex items-start gap-3 relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    request.sentAt ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}>
                    <Send className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Verification Email Dispatched</p>
                    <p className="text-[11px] font-medium text-slate-500">{request.sentAt || 'Pending Send'}</p>
                    {request.sentAt && (
                      <p className="text-[10.5px] font-mono text-slate-400 mt-0.5">Sent to: {request.previousEmail}</p>
                    )}
                  </div>
                </div>

                {/* Opened */}
                <div className="flex items-start gap-3 relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    request.openedAt ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}>
                    <Eye className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Link Opened by Verifier</p>
                    <p className="text-[11px] font-medium text-slate-500">{request.openedAt || 'Not opened yet'}</p>
                  </div>
                </div>

                {/* Responded */}
                <div className="flex items-start gap-3 relative">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    request.respondedAt ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30' : 'bg-slate-100 text-slate-400 border border-slate-300'
                  }`}>
                    <CheckCircle className="w-3 h-3" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Employer Verified & Submitted</p>
                    <p className="text-[11px] font-medium text-slate-500">{request.respondedAt || 'Awaiting response'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate & Employment Details */}
            <div className="space-y-4 pt-4 border-t border-slate-200 text-xs">
              <h3 className="font-black text-slate-400 uppercase tracking-wider text-[11px]">
                Declared Employment Record
              </h3>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Previous Employer</span>
                  <span className="font-bold text-slate-800">{request.previousEmployer}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Previous Designation</span>
                  <span className="font-bold text-slate-800">{request.designation}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Tenure Declared</span>
                  <span className="font-mono font-bold text-slate-800">{request.employmentStartDate} to {request.employmentEndDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Notice Period</span>
                  <span className="font-bold text-slate-800">{request.noticePeriod}</span>
                </div>
              </div>
            </div>

            {/* Official Employer Response Section (if Responded) */}
            {request.responseDetails && (
              <div className="space-y-4 pt-4 border-t border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-emerald-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Employer Verified Response
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Official Record
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-600">Details Confirmation:</span>
                    <span className={`font-bold ${request.responseDetails.confirmed ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {request.responseDetails.confirmed ? '✓ Confirmed Accurate' : '⚠ Discrepancy Flagged'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-600">Rehire Eligibility:</span>
                    <span className="font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                      {request.responseDetails.rehireEligibility}
                    </span>
                  </div>

                  <div>
                    <span className="font-bold text-slate-600 block mb-1">Employer Remarks:</span>
                    <p className="text-slate-700 bg-white/80 p-2.5 rounded-xl border border-emerald-200/60 italic">
                      "{request.responseDetails.remarks}"
                    </p>
                  </div>

                  {/* Behavioural Competency Ratings */}
                  {request.responseDetails.behaviouralRatings && (
                    <div className="pt-3 border-t border-emerald-200/60 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-blue-950 uppercase text-[10.5px] tracking-wider flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          Behavioural Competency Evaluation
                        </span>
                        {request.responseDetails.behaviouralRatings.averageScore !== null && (
                          <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-extrabold text-[10px] shadow-xs">
                            ★ {request.responseDetails.behaviouralRatings.averageScore} / 5.0
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-[11px]">
                        {[
                          { label: 'Pressure Handling', score: request.responseDetails.behaviouralRatings.q1PerformanceUnderPressure },
                          { label: 'Problem Solving', score: request.responseDetails.behaviouralRatings.q2ProblemSolving },
                          { label: 'Teamwork & Comm', score: request.responseDetails.behaviouralRatings.q3TeamworkCommunication },
                          { label: 'Feedback Response', score: request.responseDetails.behaviouralRatings.q4ReceivingFeedback },
                          { label: 'Ownership & Reliability', score: request.responseDetails.behaviouralRatings.q5OwnershipReliability },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-white/80 border border-emerald-100">
                            <span className="font-semibold text-slate-700">{item.label}</span>
                            <div className="flex items-center gap-1">
                              {item.score !== null ? (
                                <>
                                  <div className="flex items-center">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <Star
                                        key={s}
                                        className={`w-3 h-3 ${
                                          s <= item.score! ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="font-bold text-slate-800 ml-1 text-[10px]">({item.score}/5)</span>
                                </>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Not Observed</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {request.responseDetails.behaviouralRatings.comment && (
                        <div className="bg-white/90 p-2.5 rounded-xl border border-emerald-100 mt-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Situational Example (STAR Note):
                          </span>
                          <p className="text-slate-800 italic text-[11px] leading-relaxed">
                            "{request.responseDetails.behaviouralRatings.comment}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-emerald-200/60 text-[11px] space-y-1">
                    <p><strong>Verifier:</strong> {request.responseDetails.verifierName} ({request.responseDetails.verifierDesignation})</p>
                    <p><strong>Contact:</strong> {request.responseDetails.verifierEmail} | {request.responseDetails.verifierPhone}</p>
                    <p className="text-slate-500 font-mono text-[10px]">Submitted at: {request.responseDetails.submittedAt}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Fixed Footer Actions (Pinned at Bottom, ALWAYS Visible) */}
          <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
            {request.status !== 'Draft' && (
              <button
                onClick={() => onDownloadEmailPDF(request)}
                className="flex-1 py-2.5 px-3 rounded-xl border border-blue-200 text-blue-700 bg-blue-50/80 hover:bg-blue-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Sent Email PDF</span>
              </button>
            )}

            {request.status === 'Responded' && (
              <button
                onClick={() => onDownloadResponsePDF(request)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Response PDF</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

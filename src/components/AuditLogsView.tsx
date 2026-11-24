import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import type { BGVRequest } from '../types';

interface AuditLogsViewProps {
  requests: BGVRequest[];
  onSelectRequest: (request: BGVRequest) => void;
  onDownloadEmailPDF: (request: BGVRequest) => void;
  onDownloadResponsePDF: (request: BGVRequest) => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  requests,
  onSelectRequest,
  onDownloadEmailPDF,
  onDownloadResponsePDF,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Compliance & Verification Audit Logs
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Complete cryptographic audit trail of candidate records, email dispatches, and employer confirmations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            SOC-2 Type II & GDPR Compliant
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="liquid-glass-card p-10 flex flex-col items-center justify-center text-center min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-sky-400 border border-white/15 mb-3 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-white mb-1">
              No Audit Logs Yet
            </h3>
            <p className="text-xs font-semibold text-slate-300 max-w-md">
              Complete cryptographic audit trails of candidate records, email dispatches, and employer confirmations will appear here as verification requests are initiated.
            </p>
          </motion.div>
        ) : (
          requests.map((req, idx) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="liquid-glass-card p-5 hover:bg-white/10 transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-sky-300 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-400/30">
                  {req.candidateName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">{req.candidateName}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/10 text-slate-300 border border-white/15">
                      {req.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'Responded'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : req.status === 'Sent'
                          ? 'bg-blue-500/20 text-sky-300 border border-blue-400/30'
                          : req.status === 'Opened'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                          : 'bg-white/10 text-slate-300 border border-white/15'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {req.positionOffered} • {req.department} • Previous: <strong className="text-white">{req.previousEmployer}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectRequest(req)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 transition-all cursor-pointer"
                >
                  Inspect Trail
                </button>
                {req.status !== 'Draft' && (
                  <button
                    onClick={() => onDownloadEmailPDF(req)}
                    className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-sky-300 text-xs font-semibold border border-blue-400/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Sent Email PDF
                  </button>
                )}
                {req.status === 'Responded' && (
                  <button
                    onClick={() => onDownloadResponsePDF(req)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold border border-emerald-400/30 transition-all cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Response PDF
                  </button>
                )}
              </div>
            </div>

            {/* Step-by-Step 7-Stage Audit Timeline Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center font-bold text-[10px] border border-white/15">
                  1
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Created</p>
                  <p className="font-semibold text-white">{req.createdAt.split(' ')[0]}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  req.sentAt ? 'bg-blue-500/20 text-sky-300 border border-blue-400/30' : 'bg-white/10 text-slate-400 border border-white/15'
                }`}>
                  2
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Dispatched</p>
                  <p className="font-semibold text-white">{req.sentAt || 'Pending'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  req.openedAt ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30' : 'bg-white/10 text-slate-400 border border-white/15'
                }`}>
                  3
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Link Opened</p>
                  <p className="font-semibold text-white">{req.openedAt || 'Pending'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                  req.respondedAt ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-white/10 text-slate-400 border border-white/15'
                }`}>
                  4
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Submitted</p>
                  <p className="font-semibold text-white">{req.respondedAt || 'Pending'}</p>
                </div>
              </div>
            </div>

            {/* Token & Security Info */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="truncate max-w-md text-slate-300">Token: https://netbounceplacement.com/public/verify-employer/{req.token.slice(0, 20)}...</span>
              <span className="shrink-0 text-slate-400">Sent to: {req.previousEmail}</span>
            </div>
          </motion.div>
        )))}
      </div>
    </motion.div>
  );
};

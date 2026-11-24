import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import type { BGVRequest } from '../types';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  request: BGVRequest | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  request,
  isDeleting,
  onClose,
  onConfirmDelete,
}) => {
  if (!isOpen || !request) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !isDeleting && onClose()}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md bg-slate-900/95 border border-slate-700/70 rounded-3xl p-6 text-white shadow-2xl overflow-hidden backdrop-blur-xl z-10"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon Header */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 shadow-lg shadow-rose-950/40 shrink-0">
              <Trash2 className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Delete Verification Request</h3>
              <p className="text-xs text-rose-400/90 font-medium flex items-center gap-1.5 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Permanent Database Deletion
              </p>
            </div>
          </div>

          {/* Candidate Card Summary */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-4 my-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Candidate</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/70 text-slate-300 font-mono">
                {request.id}
              </span>
            </div>
            <div className="text-base font-semibold text-white">
              {request.candidateName}
            </div>
            <div className="text-xs text-slate-400 flex items-center justify-between pt-1.5 border-t border-slate-700/40">
              <span>Employer: <strong className="text-slate-200">{request.previousEmployer || 'N/A'}</strong></span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${
                request.status === 'Responded' ? 'bg-emerald-500/20 text-emerald-300' :
                request.status === 'Sent' ? 'bg-blue-500/20 text-blue-300' :
                'bg-slate-700 text-slate-300'
              }`}>
                {request.status}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Are you sure you want to permanently delete this verification request? This will remove the candidate from the live dashboard and erase the record from the Supabase database.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-sm transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={onConfirmDelete}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold text-sm shadow-lg shadow-rose-950/50 hover:shadow-rose-900/60 transition flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Permanently</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

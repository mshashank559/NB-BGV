import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Check, Shield, Loader2 } from 'lucide-react';
import type { BGVRequest } from '../types';
import { uploadExperienceLetterToSupabase } from '../utils/storage';

interface AddRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDraft: (data: Partial<BGVRequest>) => void;
  onProceedToSend: (data: Partial<BGVRequest>) => void;
  initialData?: Partial<BGVRequest> | null;
}

export const AddRequestModal: React.FC<AddRequestModalProps> = ({
  isOpen,
  onClose,
  onSaveDraft,
  onProceedToSend,
  initialData,
}) => {
  const [candidateName, setCandidateName] = useState('');
  const [positionOffered, setPositionOffered] = useState('N/A');
  const [department, setDepartment] = useState('Business Development');
  const [previousEmployer, setPreviousEmployer] = useState('');
  const [previousEmail, setPreviousEmail] = useState('');

  // Part B
  const [employmentStartDate, setEmploymentStartDate] = useState('');
  const [employmentEndDate, setEmploymentEndDate] = useState('');
  const [designation, setDesignation] = useState('');
  const [ctc, setCtc] = useState('');
  const [reasonForLeaving, setReasonForLeaving] = useState('Resigned');
  const [noticePeriod, setNoticePeriod] = useState<'Served' | 'Not served'>('Served');

  // File upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCandidateName(initialData.candidateName || '');
      setPositionOffered(initialData.positionOffered || 'N/A');
      setDepartment(initialData.department || 'Business Development');
      setPreviousEmployer(initialData.previousEmployer || '');
      setPreviousEmail(initialData.previousEmail || '');
      setEmploymentStartDate(initialData.employmentStartDate || '');
      setEmploymentEndDate(initialData.employmentEndDate || '');
      setDesignation(initialData.designation || '');
      setCtc(initialData.ctc || '');
      setReasonForLeaving(initialData.reasonForLeaving || 'Resigned');
      setNoticePeriod((initialData.noticePeriod as 'Served' | 'Not served') || 'Served');
    } else {
      setCandidateName('');
      setPositionOffered('N/A');
      setDepartment('Business Development');
      setPreviousEmployer('');
      setPreviousEmail('');
      setEmploymentStartDate('');
      setEmploymentEndDate('');
      setDesignation('');
      setCtc('');
      setReasonForLeaving('Resigned');
      setNoticePeriod('Served');
      setUploadedFile(null);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const getFormData = (fileUrl?: string): Partial<BGVRequest> => ({
    ...(initialData?.id ? { id: initialData.id } : {}),
    ...(initialData?.token ? { token: initialData.token } : {}),
    ...(initialData?.status ? { status: initialData.status } : {}),
    ...(initialData?.createdAt ? { createdAt: initialData.createdAt } : {}),
    ...(initialData?.sentAt ? { sentAt: initialData.sentAt } : {}),
    candidateName,
    positionOffered,
    department,
    previousEmployer,
    previousEmail,
    employmentStartDate,
    employmentEndDate,
    designation,
    ctc,
    reasonForLeaving,
    noticePeriod,
    experienceLetterName: uploadedFile ? uploadedFile.name : initialData?.experienceLetterName,
    experienceLetterUrl: fileUrl || initialData?.experienceLetterUrl,
  });

  const handleSendClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !previousEmployer || !previousEmail || !employmentStartDate || !employmentEndDate || !designation) {
      alert('Please fill all required fields before proceeding to send.');
      return;
    }

    let publicUrl: string | undefined = undefined;
    if (uploadedFile) {
      setIsUploading(true);
      const url = await uploadExperienceLetterToSupabase(uploadedFile);
      if (url) publicUrl = url;
      setIsUploading(false);
    }

    onProceedToSend(getFormData(publicUrl));
  };

  const handleSaveDraftClick = async () => {
    if (!candidateName) {
      alert('Please enter at least the candidate name to save a draft.');
      return;
    }

    let publicUrl: string | undefined = undefined;
    if (uploadedFile) {
      setIsUploading(true);
      const url = await uploadExperienceLetterToSupabase(uploadedFile);
      if (url) publicUrl = url;
      setIsUploading(false);
    }

    onSaveDraft(getFormData(publicUrl));
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl max-h-[90vh] bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 text-slate-800 flex flex-col overflow-hidden"
        >
          {/* 1. Fixed Header (Pinned at Top) */}
          <div className="shrink-0 px-6 sm:px-8 py-5 border-b border-slate-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-200 shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {initialData?.id ? 'Edit BGV Verification Request' : 'Add BGV Verification Request'}
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {initialData?.id
                    ? `Update candidate details for ${initialData.candidateName || initialData.id} without duplication`
                    : 'Fill candidate and previous employer details to initiate verification'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Internal Scrollable Body with Smooth Internal Scroller */}
          <form id="add-request-form" onSubmit={handleSendClick} className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
            {/* PART A: Candidate Details */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-wider">
                  Part A: Candidate Details
                </h3>
                <span className="text-[10px] font-bold text-slate-400">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Candidate Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sundaram"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Position Offered (Netbounce)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Business Analyst"
                    value={positionOffered}
                    onChange={(e) => setPositionOffered(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Department <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Inside Sales Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Previous Employer Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tata Consultancy Services"
                    value={previousEmployer}
                    onChange={(e) => setPreviousEmployer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Previous Employer Verification Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. hr.verification@tcs.com"
                  value={previousEmail}
                  onChange={(e) => setPreviousEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                />
                <p className="text-[11px] font-medium text-slate-400 mt-1">
                  Official HR / verification department contact where unique verification link will be sent
                </p>
              </div>
            </div>

            {/* PART B: Previous Employment Tenure & Role */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-blue-100">
                <h3 className="text-xs font-black text-blue-600 uppercase tracking-wider">
                  Part B: Previous Employment Tenure & Role
                </h3>
                <span className="text-[10px] font-bold text-slate-400">Step 2 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Start Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={employmentStartDate}
                    onChange={(e) => setEmploymentStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    End Date <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={employmentEndDate}
                    onChange={(e) => setEmploymentEndDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Designation at Previous Org <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Associate Consultant"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Last Drawn Salary / CTC (INR)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹9,50,000"
                    value={ctc}
                    onChange={(e) => setCtc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reason for Leaving
                  </label>
                  <select
                    value={reasonForLeaving}
                    onChange={(e) => setReasonForLeaving(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Resigned">Resigned (Voluntary)</option>
                    <option value="Better Career Opportunity">Better Career Opportunity</option>
                    <option value="Higher Studies">Higher Studies</option>
                    <option value="Relocation">Relocation</option>
                    <option value="End of Contract">End of Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Notice Period
                  </label>
                  <select
                    value={noticePeriod}
                    onChange={(e) => setNoticePeriod(e.target.value as 'Served' | 'Not served')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="Served">Served Notice Period</option>
                    <option value="Not served">Not Served / Buyout</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Optional Experience Letter Upload */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Upload Experience Letter (Optional - PDF, JPG, PNG, Max 5MB)
              </label>
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-slate-300 rounded-2xl hover:border-blue-500 transition-colors bg-slate-50/60">
                <div className="text-center">
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-2 text-emerald-700 font-bold text-xs">
                      <FileText className="w-5 h-5 text-emerald-600" />
                      <span>{uploadedFile.name} (Attached)</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-7 w-7 text-slate-400" />
                      <div className="flex text-xs text-slate-600 mt-2 font-semibold">
                        <label className="relative cursor-pointer rounded-md text-blue-600 hover:text-blue-500">
                          <span>Upload a document</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => e.target.files && setUploadedFile(e.target.files[0])}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">PDF or image up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </form>

          {/* 3. Fixed Footer Actions (Pinned at Bottom, ALWAYS Visible) */}
          <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-slate-200/80 bg-slate-50/95 backdrop-blur-md flex items-center justify-between">
            <button
              type="button"
              onClick={handleSaveDraftClick}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-black text-slate-700 hover:bg-white transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              Save as Draft
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="add-request-form"
                disabled={isUploading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 disabled:opacity-60 text-white text-xs font-black shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading Letter...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Proceed to Send</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

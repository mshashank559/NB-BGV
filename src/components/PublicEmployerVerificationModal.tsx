import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, FileCheck, Building2, User, Star, Sparkles } from 'lucide-react';
import type { BGVRequest } from '../types';
import confetti from 'canvas-confetti';

interface PublicEmployerVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: BGVRequest | null;
  onSubmitResponse: (
    requestId: string,
    responseData: NonNullable<BGVRequest['responseDetails']>
  ) => void;
}

const StarRatingRow: React.FC<{
  qNum: number;
  title: string;
  question: string;
  value: number | null;
  onChange: (val: number | null) => void;
}> = ({ qNum, title, question, value, onChange }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const getLabel = (score: number | null) => {
    if (score === null) return 'Not Observed';
    if (score === 5) return 'Highly Satisfied';
    if (score === 4) return 'Satisfied';
    if (score === 3) return 'Neutral';
    if (score === 2) return 'Dissatisfied';
    return 'Highly Dissatisfied';
  };

  const activeRating = hovered ?? value;

  return (
    <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-300 transition-all space-y-2 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <span className="text-[11px] font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black">
            {qNum}
          </span>
          {title}
        </span>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border self-start sm:self-auto ${
            value === null
              ? 'bg-slate-100 text-slate-500 border-slate-200'
              : value >= 4
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : value === 3
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}
        >
          {getLabel(value)} {value !== null ? `(${value}/5)` : ''}
        </span>
      </div>

      <p className="text-xs text-slate-600 font-medium leading-relaxed">
        {question}
      </p>

      {/* Interactive Stars & Not Observed Button */}
      <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = activeRating !== null && star <= activeRating;
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onChange(star)}
                className="p-1 rounded-lg hover:scale-115 transition-transform cursor-pointer focus:outline-none"
              >
                <Star
                  className={`w-5 h-5 transition-colors ${
                    isFilled
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]'
                      : 'text-slate-300 hover:text-amber-200'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onChange(value === null ? 5 : null)}
          className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
            value === null
              ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
          }`}
        >
          {value === null ? '✓ Marked Not Observed' : 'Mark Not Observed'}
        </button>
      </div>
    </div>
  );
};

export const PublicEmployerVerificationModal: React.FC<PublicEmployerVerificationModalProps> = ({
  isOpen,
  onClose,
  request,
  onSubmitResponse,
}) => {
  if (!isOpen || !request) return null;

  const [confirmed, setConfirmed] = useState<boolean>(true);
  const [rehireEligibility, setRehireEligibility] = useState<'Eligible' | 'Not eligible' | 'Not sure'>('Eligible');
  const [remarks, setRemarks] = useState('');

  // 5 Behavioural Questions (Star rating scale 1 to 5, or null for Not Observed)
  const [q1, setQ1] = useState<number | null>(5);
  const [q2, setQ2] = useState<number | null>(4);
  const [q3, setQ3] = useState<number | null>(5);
  const [q4, setQ4] = useState<number | null>(4);
  const [q5, setQ5] = useState<number | null>(5);
  const [behaviouralComment, setBehaviouralComment] = useState(
    'Demonstrated high ownership on tight deliverable deadlines and managed stakeholder expectations effectively.'
  );

  const [verifierName, setVerifierName] = useState('Pooja Kulkarni');
  const [verifierDesignation, setVerifierDesignation] = useState('Lead HR Operations');
  const [verifierEmail, setVerifierEmail] = useState(request.previousEmail);
  const [verifierPhone, setVerifierPhone] = useState('+91 98201 54321');
  const [consentChecked, setConsentChecked] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Compute live average score across answered questions (ignoring Not Observed)
  const validScores = [q1, q2, q3, q4, q5].filter((s): s is number => typeof s === 'number');
  const averageScore =
    validScores.length > 0
      ? Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1))
      : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifierName || !verifierDesignation || !verifierEmail) {
      alert('Please fill all verifier identification fields.');
      return;
    }
    if (!consentChecked) {
      alert('Please confirm the authorization declaration checkbox.');
      return;
    }

    const now = new Date();
    const timeFormatted =
      now.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    onSubmitResponse(request.id, {
      confirmed,
      rehireEligibility,
      remarks: remarks || (confirmed ? 'Employment details verified as accurate.' : 'Discrepancy noted in records.'),
      verifierName,
      verifierDesignation,
      verifierEmail,
      verifierPhone,
      submittedAt: timeFormatted,
      behaviouralRatings: {
        q1PerformanceUnderPressure: q1,
        q2ProblemSolving: q2,
        q3TeamworkCommunication: q3,
        q4ReceivingFeedback: q4,
        q5OwnershipReliability: q5,
        comment: behaviouralComment,
        averageScore,
      },
    });

    setIsSubmitted(true);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-2xl max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200 text-slate-800 flex flex-col overflow-hidden"
        >
          {/* 1. Fixed Pinned Header (Always Visible at Top) */}
          <div className="shrink-0 px-6 sm:px-8 py-4 border-b border-slate-200 bg-white/95 backdrop-blur-md flex items-center justify-between z-10">
            <div className="flex items-center gap-3.5">
              <img
                src="/netbounce-logo-dark.png"
                alt="NETBOUNCE PLACEMENT LLC"
                className="h-8 sm:h-9 w-auto object-contain"
              />
              <div>
                <h2 className="text-base font-black text-slate-900 leading-tight">
                  Background Verification Form
                </h2>
                <span className="text-[10px] text-blue-600 font-extrabold tracking-wider uppercase block mt-0.5">
                  Confidential Employer Verification Portal (No Login Required)
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 2. Internal Scrollable Body with Smooth Scroller */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6">
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-black text-slate-900">Verification Submitted!</h3>
                <p className="text-xs font-medium text-slate-500 max-w-md mx-auto">
                  Thank you for verifying employment records for <strong>{request.candidateName}</strong>. Your official response has been cryptographically recorded on Netbounce BGV.
                </p>
                <div className="pt-4">
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <form id="public-verify-form" onSubmit={handleSubmit} className="space-y-6">
                {/* BLOCK 1: CANDIDATE SUMMARY */}
                <div className="bg-blue-50/60 rounded-2xl p-4 border border-blue-200/80 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-200/60">
                    <span className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      Block 1: Candidate Summary
                    </span>
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                      REF: {request.id}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Candidate Full Name</span>
                      <strong className="text-slate-900 text-sm">{request.candidateName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Offered Position at Netbounce</span>
                      <strong className="text-slate-900">{request.positionOffered || 'N/A'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Target Department</span>
                      <strong className="text-slate-800">{request.department}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">Previous Employer Name</span>
                      <strong className="text-slate-800">{request.previousEmployer}</strong>
                    </div>
                  </div>
                </div>

                {/* BLOCK 2: TENURE & DESIGNATION RECORDS */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      Block 2: Tenure & Designation Records
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">Declared by Candidate</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Declared Tenure</span>
                      <strong className="text-slate-800 font-mono text-[11px]">
                        {request.employmentStartDate} to {request.employmentEndDate}
                      </strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Designation</span>
                      <strong className="text-slate-800">{request.designation}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Last Drawn CTC</span>
                      <strong className="text-slate-800 font-mono">{request.ctc || 'Not Disclosed'}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Notice Period</span>
                      <strong className="text-slate-800">{request.noticePeriod}</strong>
                    </div>
                  </div>
                </div>

                {/* BLOCK 3: VERIFICATION RESPONSE */}
                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                      Block 3: Verification Response
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Employer Verdict</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Do you confirm this candidate was employed with your organization? <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setConfirmed(true)}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          confirmed
                            ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>✓ Yes, Confirmed</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmed(false)}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          !confirmed
                            ? 'border-rose-500 bg-rose-500 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-500/20'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>⚠ No, Cannot Confirm</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-2">
                      Rehire Eligibility <span className="text-rose-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {(['Eligible', 'Not eligible', 'Not sure'] as const).map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setRehireEligibility(opt)}
                          className={`py-2 px-3 rounded-xl border font-bold transition-all cursor-pointer text-center ${
                            rehireEligibility === opt
                              ? 'border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-500/25'
                              : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Verification Remarks / Conduct
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Enter performance feedback, disciplinary notes, or confirm conduct..."
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 bg-white"
                    />
                  </div>
                </div>

                {/* BLOCK 4: BEHAVIOURAL REFERENCE QUESTIONS (STAR RATING) */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Block 4: Behavioural Reference Evaluation
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        5-Star Rating
                      </span>
                    </div>
                    {averageScore !== null && (
                      <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                        Avg: ★ {averageScore} / 5.0
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Rate <strong>{request.candidateName}</strong> on the 5 satisfaction competencies below. If you did not observe the candidate in a situation, click <em>Mark Not Observed</em>.
                  </p>

                  <div className="space-y-3">
                    <StarRatingRow
                      qNum={1}
                      title="Performance Under Pressure"
                      question={`How satisfied were you with how ${request.candidateName} handled tight deadlines and targets, and delivered the expected result?`}
                      value={q1}
                      onChange={setQ1}
                    />

                    <StarRatingRow
                      qNum={2}
                      title="Problem-Solving & Critical Action"
                      question={`How satisfied were you with how ${request.candidateName} took on difficult problems or unexpected situations, and the actions they took to solve them?`}
                      value={q2}
                      onChange={setQ2}
                    />

                    <StarRatingRow
                      qNum={3}
                      title="Teamwork & Communication"
                      question={`How satisfied were you with ${request.candidateName}'s teamwork and communication with colleagues, clients and other teams to reach shared goals?`}
                      value={q3}
                      onChange={setQ3}
                    />

                    <StarRatingRow
                      qNum={4}
                      title="Receiving Feedback & Growth"
                      question={`How satisfied were you with how ${request.candidateName} responded to feedback or disagreements, and improved afterwards?`}
                      value={q4}
                      onChange={setQ4}
                    />

                    <StarRatingRow
                      qNum={5}
                      title="Ownership & Reliability"
                      question={`How satisfied were you with ${request.candidateName}'s ownership and reliability in completing tasks, including those beyond their regular duties?`}
                      value={q5}
                      onChange={setQ5}
                    />
                  </div>

                  {/* Optional STAR Method Situational Example Box */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>Situational Example / STAR Reference</span>
                        <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <span className="text-[10px] font-mono font-semibold text-slate-400">
                        {behaviouralComment.length} / 1000 characters
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 italic">
                      "Please share a short example (what the situation was, what the candidate did, and the result) for any answer you wish to explain."
                    </p>
                    <textarea
                      rows={3}
                      maxLength={1000}
                      value={behaviouralComment}
                      onChange={(e) => setBehaviouralComment(e.target.value)}
                      placeholder="e.g. Handled a client escalation in March 2026 on a short deadline and resolved it within a day..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                {/* BLOCK 5: VERIFIER IDENTITY & CONTACT */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <span className="text-xs font-black text-blue-600 uppercase tracking-wider">
                      Block 5: Verifier Identity & Contact
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Official Sign-off</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Verifier Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pooja Kulkarni"
                        value={verifierName}
                        onChange={(e) => setVerifierName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Official Designation <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Lead HR Operations"
                        value={verifierDesignation}
                        onChange={(e) => setVerifierDesignation(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Official Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={verifierEmail}
                        onChange={(e) => setVerifierEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">
                        Contact Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98201 54321"
                        value={verifierPhone}
                        onChange={(e) => setVerifierPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold bg-white"
                      />
                    </div>
                  </div>

                  {/* Authorization Consent Checkbox */}
                  <label
                    onClick={() => setConsentChecked(!consentChecked)}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 leading-snug select-none">
                      I confirm the information above is true to the best of my knowledge and authorized on behalf of the employer.
                    </span>
                  </label>
                </div>
              </form>
            )}
          </div>

          {/* 3. Fixed Pinned Footer (Always Visible at Bottom) */}
          {!isSubmitted && (
            <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-slate-200 bg-slate-50/95 backdrop-blur-md flex items-center justify-between z-10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="public-verify-form"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <FileCheck className="w-4 h-4" />
                <span>Submit Verification</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

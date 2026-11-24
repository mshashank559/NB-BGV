import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  AlertCircle,
  Building2,
  User,
  Star,
  Sparkles,
  ExternalLink,
  Clock,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
  Download,
  FileText,
} from 'lucide-react';
import type { BGVRequest } from '../types';
import confetti from 'canvas-confetti';
import { CloudShader } from '@/components/ui/cloud-shader';
import {
  generateExperienceLetterBlobUrl,
  downloadExperienceLetterPDF,
} from '../utils/pdfGenerator';
import {
  fetchRequestByToken,
  markRequestAsOpened,
  submitVerificationResponse,
} from '../utils/storage';

interface PublicVerificationPageProps {
  token: string;
  requests: BGVRequest[];
  onSubmitResponse: (
    requestId: string,
    responseData: NonNullable<BGVRequest['responseDetails']>
  ) => void;
}

// 5-Star Rating Row for Transparent White Glass Theme
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
    <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/15 hover:border-white/30 transition-all space-y-2 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
        <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2 drop-shadow-sm">
          <span className="w-5 h-5 rounded-full bg-white/15 text-white border border-white/25 flex items-center justify-center text-[10px] font-black shrink-0">
            {qNum}
          </span>
          {title}
        </span>
        <span
          className={`text-[9.5px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto backdrop-blur-sm ${
            value === null
              ? 'bg-white/10 text-white/90 border-white/20'
              : value >= 4
              ? 'bg-emerald-500/35 text-emerald-200 border-emerald-400/60 shadow-[0_0_10px_rgba(16,185,129,0.35)]'
              : value === 3
              ? 'bg-amber-500/35 text-amber-200 border-amber-400/60'
              : 'bg-rose-500/35 text-rose-200 border-rose-400/60'
          }`}
        >
          {getLabel(value)} {value !== null ? `(${value}/5)` : ''}
        </span>
      </div>

      <p className="text-[11.5px] text-slate-200 font-medium leading-relaxed">
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
                className="p-1 rounded-lg hover:scale-125 transition-transform cursor-pointer focus:outline-none"
              >
                <Star
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-all ${
                    isFilled
                      ? 'fill-amber-300 text-amber-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.85)]'
                      : 'text-white/35 hover:text-amber-200'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => onChange(value === null ? 5 : null)}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
            value === null
              ? 'bg-white text-slate-900 border-white shadow-sm'
              : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
          }`}
        >
          {value === null ? '✓ Not Observed' : 'Mark Not Observed'}
        </button>
      </div>
    </div>
  );
};

const stepVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.14, ease: 'easeIn' as const } },
};

export const PublicVerificationPage: React.FC<PublicVerificationPageProps> = ({
  token,
  requests,
  onSubmitResponse,
}) => {
  // Local state for matched request fetched from Supabase DB or props
  const [activeRequest, setActiveRequest] = useState<BGVRequest | null>(() => {
    return (
      requests.find((r) => r.token === token) ||
      requests.find((r) => r.status === 'Sent' || r.status === 'Opened') ||
      requests[0] ||
      null
    );
  });

  // Always fetch fresh state from Supabase by token and mark as 'Opened' in real-time
  useEffect(() => {
    let isMounted = true;
    const syncFromDB = async () => {
      if (token) {
        const dbReq = await fetchRequestByToken(token);
        if (isMounted && dbReq) {
          setActiveRequest(dbReq);
          // If status is still 'Sent', update DB to 'Opened'
          if (dbReq.status === 'Sent') {
            const opened = await markRequestAsOpened(token);
            if (isMounted && opened) {
              setActiveRequest(opened);
            }
          }
        }
      }
    };
    syncFromDB();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Sync if requests prop updates
  useEffect(() => {
    if (!activeRequest && requests.length > 0) {
      const match = requests.find((r) => r.token === token) || requests[0];
      if (match) setActiveRequest(match);
    }
  }, [requests, activeRequest, token]);

  const matchedRequest =
    activeRequest ||
    requests.find((r) => r.token === token) ||
    requests.find((r) => r.status === 'Sent' || r.status === 'Opened') ||
    requests[0];

  // Stepped Form Navigator:
  // Step 0: Welcome / Overview Card
  // Step 1: Declared Profile & Tenure Details
  // Step 2: Verification Verdict
  // Step 3: Behavioural Competency Reference
  // Step 4: Verifier Official Sign-off
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Intro Splash Animation State: starts with logo centered on screen, then glides to top as form card fades in
  const [introState, setIntroState] = useState<'splash' | 'ready'>('splash');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroState('ready');
    }, 1100);
    return () => clearTimeout(timer);
  }, []);

  // Form States
  const [confirmed, setConfirmed] = useState<boolean>(true);
  const [rehireEligibility, setRehireEligibility] = useState<'Eligible' | 'Not eligible' | 'Not sure'>('Eligible');
  const [remarks, setRemarks] = useState('');

  // 5 Behavioural Questions (Scores 1-5 or null)
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
  const [verifierEmail, setVerifierEmail] = useState(matchedRequest?.previousEmail || '');
  const [verifierPhone, setVerifierPhone] = useState('+91 98201 54321');
  const [consentChecked, setConsentChecked] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(matchedRequest?.status === 'Responded');

  // Document PDF Viewer State
  const [isViewingDoc, setIsViewingDoc] = useState(false);
  const [docPdfUrl, setDocPdfUrl] = useState<string | null>(null);

  const handleViewDocument = () => {
    if (!matchedRequest) return;
    const url = docPdfUrl || generateExperienceLetterBlobUrl(matchedRequest);
    if (!docPdfUrl) {
      setDocPdfUrl(url);
    }
    setIsViewingDoc(true);
    // Also open in new browser tab for direct native PDF viewing experience
    try {
      window.open(url, '_blank');
    } catch {
      // In-app viewer handles popup-blocked cases seamlessly
    }
  };

  useEffect(() => {
    if (matchedRequest?.previousEmail && !verifierEmail) {
      setVerifierEmail(matchedRequest.previousEmail);
    }
  }, [matchedRequest]);

  const resetForm = () => {
    setCurrentStep(0);
  };

  // Compute live average score
  const validScores = [q1, q2, q3, q4, q5].filter((s): s is number => typeof s === 'number');
  const averageScore =
    validScores.length > 0
      ? Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1))
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchedRequest) return;
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

    const responsePayload: NonNullable<BGVRequest['responseDetails']> = {
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
    };

    // 1. Submit directly to Supabase DB in real time
    await submitVerificationResponse(matchedRequest.id, responsePayload);

    // 2. Notify parent listener & update local state
    onSubmitResponse(matchedRequest.id, responsePayload);
    setActiveRequest((prev) =>
      prev
        ? {
            ...prev,
            status: 'Responded',
            respondedAt: timeFormatted,
            responseDetails: responsePayload,
          }
        : null
    );

    setIsSubmitted(true);
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
    });
  };

  // If token is invalid or no request matched
  if (!matchedRequest) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
        <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <CloudShader
            className="w-full h-full"
            speed={0.9}
            count={6}
            cloudColor="#fbf8f2"
            skyTopColor="#3876ba"
            skyBottomColor="#8cbfe8"
          />
        </div>
        <div className="relative z-10 max-w-md w-full backdrop-blur-2xl bg-white/20 rounded-3xl p-8 shadow-2xl border border-white/30 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center justify-center mx-auto shadow-md">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">Verification Link Not Found</h2>
          <p className="text-xs text-white/80 leading-relaxed">
            This verification link may have expired or is not recognized in our system. If you believe this is an error, please contact Netbounce HR Operations.
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-mono text-white/70 block bg-white/10 p-2.5 rounded-xl border border-white/20 break-all">
              Token: {token || 'None provided'}
            </span>
          </div>
          <div className="pt-2 text-xs font-bold text-sky-300">
            Support: hr@netbounceplacement.com
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full font-sans text-white overflow-x-hidden selection:bg-white/30">
      
      {/* ----------------------------------------------------------- */}
      {/* 1. DYNAMIC CLOUD SHADER BACKGROUND (ACETERNITY UI) */}
      {/* ----------------------------------------------------------- */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <CloudShader
          className="w-full h-full"
          speed={0.9}
          count={6}
          cloudColor="#fbf8f2"
          skyTopColor="#3876ba"
          skyBottomColor="#8cbfe8"
        />
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 2. STEP-BY-STEP FORM CARD (CENTERED & FROSTED TRANSPARENT WHITE GLASS) */}
      {/* ----------------------------------------------------------- */}
      <div
        className={`fixed inset-0 z-20 flex flex-col justify-center items-center px-4 py-2 pointer-events-auto transition-all duration-700 ease-out ${
          introState === 'ready' ? '-translate-y-2 sm:-translate-y-4' : 'translate-y-0'
        }`}
      >
        {/* Top Middle Logo - Starts centered, then smoothly glides to top */}
        <motion.div
          layout
          transition={{
            layout: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
            opacity: { duration: 0.65, ease: 'easeOut' },
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{
            opacity: 1,
            scale: introState === 'splash' ? 1.25 : 1,
          }}
          className="mb-3 sm:mb-4 shrink-0 z-30"
        >
          <button
            type="button"
            onClick={resetForm}
            title="Netbounce Placement LLC"
            className="focus:outline-none hover:scale-105 transition-transform cursor-pointer"
          >
            <img
              src="/netbounce-logo.png"
              alt="NETBOUNCE PLACEMENT LLC"
              className="h-14 sm:h-16 md:h-20 w-auto object-contain drop-shadow-[0_8px_30px_rgba(0,0,0,0.85)]"
            />
          </button>
        </motion.div>

        {/* Stepped Box - Transparent Slate Grey Frosted Glass */}
        {introState === 'ready' && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            className="w-full max-w-lg sm:max-w-xl max-h-[76vh] flex flex-col backdrop-blur-3xl bg-slate-900/65 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden"
          >
          
          {/* Step Progress Bar */}
          {currentStep > 0 && !isSubmitted && (
            <div className="w-full bg-white/10 h-1 shrink-0 flex">
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-blue-500 to-amber-300 transition-all duration-500 shadow-[0_0_8px_rgba(255,255,255,0.6)]"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          )}

          {/* CARD CONTENT */}
          <div className="p-5 sm:p-6 overflow-y-auto max-h-[74vh] custom-scrollbar text-white">
            <AnimatePresence mode="wait" initial={false}>
              {/* SUCCESS STATE */}
              {isSubmitted && (
                <motion.div
                  key="submitted"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="py-4 text-center space-y-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/30 text-emerald-200 border border-emerald-400/50 mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)] animate-bounce backdrop-blur-md">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-white drop-shadow-md">
                    Verification Successfully Submitted!
                  </h2>
                  <p className="text-[11.5px] font-medium text-slate-200 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{verifierName || 'Representative'}</strong>. Your official verification response for <strong className="text-white">{matchedRequest.candidateName}</strong> has been securely logged on the Netbounce BGV ledger.
                  </p>

                  <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-white/[0.08] border border-white/15 text-left text-xs space-y-1.5 backdrop-blur-md">
                    <div className="flex justify-between pb-1 border-b border-white/10">
                      <span className="text-slate-300 font-bold text-[11px]">Request Reference:</span>
                      <span className="font-mono font-bold text-white text-[11px]">{matchedRequest.id}</span>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-white/10">
                      <span className="text-slate-300 font-bold text-[11px]">Candidate:</span>
                      <span className="font-bold text-white text-[11px]">{matchedRequest.candidateName}</span>
                    </div>
                    <div className="flex justify-between pb-1 border-b border-white/10">
                      <span className="text-slate-300 font-bold text-[11px]">Confirmation Verdict:</span>
                      <span className="font-extrabold text-emerald-300 flex items-center gap-1 text-[11px] drop-shadow-xs">
                        <CheckCircle className="w-3 h-3" />
                        {confirmed ? 'Confirmed Accurate' : 'Discrepancy Flagged'}
                      </span>
                    </div>
                    {averageScore !== null && (
                      <div className="flex justify-between pb-1 border-b border-white/10">
                        <span className="text-slate-300 font-bold text-[11px]">Average Behavioural Score:</span>
                        <span className="font-extrabold text-amber-300 text-[11px] drop-shadow-xs">
                          ★ {averageScore} / 5.0
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-300 font-bold text-[11px]">Submitted At:</span>
                      <span className="font-mono text-slate-200 text-[11px]">
                        {matchedRequest.respondedAt || new Date().toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1 text-[10.5px] text-slate-400">
                    You may safely close this window. A copy has been delivered to Netbounce HR Operations.
                  </div>
                </motion.div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* STEP 0: WELCOME / INTRO CARD */}
              {/* ------------------------------------------------------------- */}
              {!isSubmitted && currentStep === 0 && (
                <motion.div
                  key="step-0"
                  variants={stepVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="space-y-4"
                >
                    
                    {/* Pill Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-bold backdrop-blur-md shadow-xs">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>Candidate Employment Verification</span>
                    </div>

                    {/* Main Title */}
                    <div className="space-y-1.5">
                      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug drop-shadow-md">
                        Your feedback empowers excellence.
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                        Netbounce partners with verified employers to validate candidate experience. Please take a moment to confirm <strong>{matchedRequest.candidateName}</strong>'s declared employment details and share your behavioural feedback.
                      </p>
                    </div>

                    {/* Candidate Quick Highlight */}
                    <div className="p-3 rounded-2xl bg-white/[0.08] border border-white/15 flex items-center justify-between text-xs backdrop-blur-md">
                      <div>
                        <span className="text-[10px] text-slate-300 uppercase font-bold block">Candidate</span>
                        <strong className="text-white text-sm font-black">{matchedRequest.candidateName}</strong>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-300 uppercase font-bold block">Offered Role</span>
                        <span className="text-sky-300 font-bold">{matchedRequest.positionOffered || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Meta Tags */}
                    <div className="flex items-center gap-4 text-[11px] text-slate-300 pt-0.5 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-300" />
                        <span>Takes ~2 minutes</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-emerald-300" />
                        <span>100% Confidential</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                        <span>Direct HR Compliance</span>
                      </span>
                    </div>

                    {/* Big CTA Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-white hover:bg-white/90 text-slate-900 font-black text-xs shadow-xl shadow-black/30 border border-white/40 transition-all cursor-pointer active:scale-95 group hover:shadow-2xl"
                      >
                        <span>Start BGV Verification</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-600" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 1: CANDIDATE PROFILE & TENURE DETAILS */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                    transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4 step-fade-in"
                  >
                    
                    <div className="flex items-center justify-between pb-2 border-b border-white/15">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-sky-300" />
                        <h2 className="text-sm font-black uppercase tracking-wider text-white drop-shadow-sm">
                          Step 1: Declared Profile & Tenure
                        </h2>
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 font-bold">1 of 4</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-white/[0.08] border border-white/15 backdrop-blur-md">
                        <span className="text-[10px] text-slate-300 uppercase font-bold block">Candidate Full Name</span>
                        <strong className="text-white text-sm font-black">{matchedRequest.candidateName}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.08] border border-white/15 backdrop-blur-md">
                        <span className="text-[10px] text-slate-300 uppercase font-bold block">Offered Role</span>
                        <strong className="text-sky-300 font-bold">{matchedRequest.positionOffered || 'N/A'}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.08] border border-white/15 backdrop-blur-md">
                        <span className="text-[10px] text-slate-300 uppercase font-bold block">Employment Start Date</span>
                        <strong className="text-amber-300 font-mono font-bold">{matchedRequest.employmentStartDate}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.08] border border-white/15 backdrop-blur-md">
                        <span className="text-[10px] text-slate-300 uppercase font-bold block">Employment End Date</span>
                        <strong className="text-amber-300 font-mono font-bold">{matchedRequest.employmentEndDate}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.08] border border-white/15 backdrop-blur-md">
                        <span className="text-[10px] text-slate-300 uppercase font-bold block">Designation at Your Org</span>
                        <strong className="text-white font-semibold">{matchedRequest.designation}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/[0.08] border border-white/15 backdrop-blur-md">
                        <span className="text-[10px] text-slate-300 uppercase font-bold block">Declared CTC</span>
                        <strong className="text-white/95 font-mono">{matchedRequest.ctc || 'Not Disclosed'}</strong>
                      </div>
                    </div>

                    {matchedRequest.experienceLetterName && (
                      <div className="p-2.5 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-between text-xs backdrop-blur-md">
                        <span className="text-white flex items-center gap-1.5 font-semibold">
                          <FileCheck className="w-3.5 h-3.5 text-sky-300" />
                          Letter: {matchedRequest.experienceLetterName}
                        </span>
                        <button
                          type="button"
                          onClick={handleViewDocument}
                          className="px-3 py-1 rounded-lg bg-white text-slate-900 text-[10.5px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-white/90 shadow-sm active:scale-95 transition-all"
                          title="Open PDF document in viewer"
                        >
                          <span>View PDF</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/15">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(0)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-6 py-2.5 rounded-xl bg-white hover:bg-white/90 text-slate-900 font-black text-xs shadow-md border border-white/40 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Proceed to Verdict</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 2: VERIFICATION VERDICT */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                    transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4 step-fade-in"
                  >
                    
                    <div className="flex items-center justify-between pb-2 border-b border-white/15">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-sky-300" />
                        <h2 className="text-sm font-black uppercase tracking-wider text-white drop-shadow-sm">
                          Step 2: Verification Verdict
                        </h2>
                      </div>
                      <span className="text-[10px] font-mono text-slate-300 font-bold">2 of 4</span>
                    </div>

                    {/* Confirm Employment Buttons */}
                    <div>
                      <label className="block text-xs font-bold text-white mb-2 drop-shadow-xs">
                        Do you confirm this candidate was employed with your organization? <span className="text-amber-300">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => setConfirmed(true)}
                          className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
                            confirmed
                              ? 'border-emerald-400 bg-emerald-500/90 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)] ring-2 ring-emerald-300/40'
                              : 'border-white/15 bg-white/[0.08] text-slate-200 hover:bg-white/15'
                          }`}
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>✓ Yes, Confirmed Accurate</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmed(false)}
                          className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-md ${
                            !confirmed
                              ? 'border-rose-400 bg-rose-500/90 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] ring-2 ring-rose-300/40'
                              : 'border-white/15 bg-white/[0.08] text-slate-200 hover:bg-white/15'
                          }`}
                        >
                          <AlertCircle className="w-4 h-4" />
                          <span>⚠ No, Cannot Confirm</span>
                        </button>
                      </div>
                    </div>

                    {/* Rehire Eligibility */}
                    <div>
                      <label className="block text-xs font-bold text-white mb-2 drop-shadow-xs">
                        Rehire Eligibility <span className="text-amber-300">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {(['Eligible', 'Not eligible', 'Not sure'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setRehireEligibility(opt)}
                            className={`py-2 px-2.5 rounded-xl border font-bold transition-all cursor-pointer text-center backdrop-blur-md ${
                              rehireEligibility === opt
                                ? 'border-white bg-white text-slate-900 shadow-lg'
                                : 'border-white/15 bg-white/[0.08] text-slate-200 hover:bg-white/15'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Verification Remarks */}
                    <div>
                      <label className="block text-xs font-bold text-white mb-1.5 drop-shadow-xs">
                        Verification Remarks / Conduct Notes
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Confirm conduct, tenure alignment, or add notes..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs text-white bg-black/40 backdrop-blur-md focus:ring-2 focus:ring-white/40 focus:border-white placeholder-slate-400"
                      />
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/15">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        className="px-6 py-2.5 rounded-xl bg-white hover:bg-white/90 text-slate-900 font-black text-xs shadow-md border border-white/40 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next: Behavioural Reference</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 3: BEHAVIOURAL COMPETENCIES (5 STARS + STAR EXAMPLE) */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                    transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-3.5 step-fade-in"
                  >
                    
                    <div className="flex items-center justify-between pb-2 border-b border-white/20">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <h2 className="text-sm font-black uppercase tracking-wider text-white drop-shadow-sm">
                          Step 3: Behavioural Competency Reference
                        </h2>
                      </div>
                      {averageScore !== null && (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-white text-slate-900 shadow-sm">
                          ★ {averageScore} / 5.0
                        </span>
                      )}
                    </div>

                    <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
                      <StarRatingRow
                        qNum={1}
                        title="Performance Under Pressure"
                        question={`How satisfied were you with how ${matchedRequest.candidateName} handled tight deadlines and delivered expected results?`}
                        value={q1}
                        onChange={setQ1}
                      />

                      <StarRatingRow
                        qNum={2}
                        title="Problem-Solving & Critical Action"
                        question={`How satisfied were you with how ${matchedRequest.candidateName} tackled difficult problems and unexpected situations?`}
                        value={q2}
                        onChange={setQ2}
                      />

                      <StarRatingRow
                        qNum={3}
                        title="Teamwork & Communication"
                        question={`How satisfied were you with ${matchedRequest.candidateName}'s communication and collaboration across teams?`}
                        value={q3}
                        onChange={setQ3}
                      />

                      <StarRatingRow
                        qNum={4}
                        title="Receiving Feedback & Growth"
                        question={`How satisfied were you with how ${matchedRequest.candidateName} responded to feedback and demonstrated improvement?`}
                        value={q4}
                        onChange={setQ4}
                      />

                      <StarRatingRow
                        qNum={5}
                        title="Ownership & Reliability"
                        question={`How satisfied were you with ${matchedRequest.candidateName}'s ownership in completing critical tasks?`}
                        value={q5}
                        onChange={setQ5}
                      />

                      {/* Situational Example textarea */}
                      <div className="bg-white/[0.08] p-3 rounded-xl border border-white/15 space-y-1.5 backdrop-blur-md">
                        <label className="text-[11px] font-bold text-white flex items-center justify-between">
                          <span>Situational Example / STAR Reference</span>
                          <span className="text-[9.5px] text-slate-300 font-normal">Optional</span>
                        </label>
                        <textarea
                          rows={2}
                          maxLength={1000}
                          value={behaviouralComment}
                          onChange={(e) => setBehaviouralComment(e.target.value)}
                          placeholder="e.g. Handled high-priority escalation and resolved within 24h..."
                          className="w-full px-3 py-2 rounded-lg border border-white/20 text-xs text-white bg-black/40 placeholder-slate-400 focus:ring-2 focus:ring-white/40 focus:border-white"
                        />
                      </div>
                    </div>

                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/15">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="px-6 py-2.5 rounded-xl bg-white hover:bg-white/90 text-slate-900 font-black text-xs shadow-md border border-white/40 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next: Sign-off & Submit</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ------------------------------------------------------------- */}
                {/* STEP 4: VERIFIER OFFICIAL SIGN-OFF */}
                {/* ------------------------------------------------------------- */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                    transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                    className="step-fade-in"
                  >
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                      <div className="flex items-center justify-between pb-2 border-b border-white/15">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-sky-300" />
                          <h2 className="text-sm font-black uppercase tracking-wider text-white drop-shadow-sm">
                            Step 4: Official Verifier Sign-off
                          </h2>
                        </div>
                        <span className="text-[10px] font-mono text-slate-300 font-bold">4 of 4</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-200 mb-1">
                            Verifier Full Name <span className="text-amber-300">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Pooja Kulkarni"
                            value={verifierName}
                            onChange={(e) => setVerifierName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs font-semibold bg-black/40 text-white focus:border-white focus:ring-2 focus:ring-white/30 backdrop-blur-md placeholder-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-200 mb-1">
                            Official Designation <span className="text-amber-300">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Lead HR Operations"
                            value={verifierDesignation}
                            onChange={(e) => setVerifierDesignation(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs font-semibold bg-black/40 text-white focus:border-white focus:ring-2 focus:ring-white/30 backdrop-blur-md placeholder-slate-400"
                          />
                        </div>
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-200 mb-1">
                            Official Email <span className="text-amber-300">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            value={verifierEmail}
                            onChange={(e) => setVerifierEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs font-mono font-semibold bg-black/40 text-white focus:border-white focus:ring-2 focus:ring-white/30 backdrop-blur-md"
                          />
                        </div>
                        <div>
                          <label className="block text-[10.5px] font-bold text-slate-200 mb-1">
                            Contact Phone <span className="text-amber-300">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98201 54321"
                            value={verifierPhone}
                            onChange={(e) => setVerifierPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs font-mono font-semibold bg-black/40 text-white focus:border-white focus:ring-2 focus:ring-white/30 backdrop-blur-md placeholder-slate-400"
                          />
                        </div>
                      </div>

                      {/* Declaration */}
                      <label
                        onClick={() => setConsentChecked(!consentChecked)}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.08] border border-white/15 cursor-pointer hover:bg-white/[0.14] transition-colors backdrop-blur-md"
                      >
                        <input
                          type="checkbox"
                          checked={consentChecked}
                          onChange={(e) => setConsentChecked(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-sky-400 rounded border-white/40 bg-black/40 focus:ring-sky-400 cursor-pointer"
                        />
                        <span className="text-[11px] text-slate-200 leading-snug select-none">
                          I confirm the information above is true to the best of my knowledge and authorized on behalf of <strong className="text-white">{matchedRequest.previousEmployer}</strong>.
                        </span>
                      </label>

                      {/* Navigation & Submit button */}
                      <div className="flex items-center justify-between pt-2 border-t border-white/15">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Back</span>
                        </button>

                        <button
                          type="submit"
                          className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-400 hover:to-sky-400 text-white text-xs font-black shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center gap-2 transition-all cursor-pointer border border-white/40 active:scale-95"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>Submit Official Response</span>
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
      </div>

      {/* ----------------------------------------------------------- */}
      {/* 3. DEDICATED PDF DOCUMENT VIEWER OVERLAY */}
      {/* ----------------------------------------------------------- */}
      <AnimatePresence>
        {isViewingDoc && docPdfUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed inset-0 z-50 flex flex-col bg-slate-950/85 backdrop-blur-2xl text-white p-3 sm:p-5"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-white/15 gap-2 flex-wrap shrink-0">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsViewingDoc(false)}
                  className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md active:scale-95 shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Verification Form</span>
                </button>

                <div className="hidden sm:block">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-black text-white truncate max-w-xs md:max-w-md">
                      {matchedRequest.experienceLetterName || `${matchedRequest.candidateName}_Relieving.pdf`}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-300 block">
                    {matchedRequest.candidateName} • {matchedRequest.previousEmployer}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadExperienceLetterPDF(matchedRequest)}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                  title="Download PDF"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.open(docPdfUrl, '_blank')}
                  className="px-3.5 py-2 rounded-xl bg-white text-slate-900 font-black text-xs flex items-center gap-1.5 hover:bg-white/90 transition-all cursor-pointer shadow-md active:scale-95"
                  title="Open PDF in dedicated browser tab"
                >
                  <span>Open in New Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document PDF Embed Area */}
            <div className="flex-1 w-full pt-3 overflow-hidden">
              <iframe
                src={`${docPdfUrl}#toolbar=1&navpanes=0`}
                title="Relieving & Experience Certificate PDF"
                className="w-full h-full rounded-2xl border border-white/20 bg-slate-900/90 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

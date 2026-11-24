export type BGVStatus = 'Draft' | 'Sent' | 'Opened' | 'Responded' | 'Expired' | 'Cancelled';

export interface BehaviouralRatings {
  q1PerformanceUnderPressure?: number | null; // 1 to 5, null for Not Observed
  q2ProblemSolving?: number | null;
  q3TeamworkCommunication?: number | null;
  q4ReceivingFeedback?: number | null;
  q5OwnershipReliability?: number | null;
  comment?: string;
  averageScore?: number | null;
}

export interface BGVRequest {
  id: string;
  token: string;
  candidateName: string;
  positionOffered: string;
  department: string;
  previousEmployer: string;
  previousEmail: string;
  employmentStartDate: string;
  employmentEndDate: string;
  designation: string;
  ctc: string;
  reasonForLeaving: string;
  noticePeriod: 'Served' | 'Not served';
  experienceLetterName?: string;
  experienceLetterUrl?: string;
  status: BGVStatus;
  createdAt: string;
  sentAt?: string;
  openedAt?: string;
  respondedAt?: string;
  emailDetails?: {
    to: string;
    cc: string[];
    subject: string;
    sentDate: string;
    personalNote?: string;
  };
  responseDetails?: {
    confirmed: boolean;
    rehireEligibility: 'Eligible' | 'Not eligible' | 'Not sure';
    remarks: string;
    verifierName: string;
    verifierDesignation: string;
    verifierEmail: string;
    verifierPhone: string;
    submittedAt: string;
    behaviouralRatings?: BehaviouralRatings;
  };
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'HR Admin' | 'HR Specialist' | 'Verifier Lead';
  status: 'Active' | 'Inactive';
  avatar: string;
  createdAt: string;
}

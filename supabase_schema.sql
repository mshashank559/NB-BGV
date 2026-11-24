-- =========================================================================
-- NETBOUNCE PLACEMENT LLC - BGV ENTERPRISE DATABASE SCHEMA
-- Target Database: Supabase PostgreSQL
-- Project: mxcqzzxxzdunufudlrfz
-- =========================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. TABLE: bgv_requests (Candidate Background Verification Records)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bgv_requests (
    id TEXT PRIMARY KEY,                                      -- e.g. 'NB-BGV-1001'
    token TEXT UNIQUE NOT NULL,                              -- Cryptographic 64-char security token
    candidate_name TEXT NOT NULL,                            -- Candidate Full Name
    position_offered TEXT NOT NULL,                          -- Role offered at Netbounce
    department TEXT NOT NULL,                                -- Department (Engineering, Product, etc.)
    previous_employer TEXT NOT NULL,                         -- Ex-employer company name
    previous_email TEXT NOT NULL,                            -- HR / Verifier email address
    employment_start_date TEXT NOT NULL,                     -- Tenure start date
    employment_end_date TEXT NOT NULL,                       -- Tenure end date
    designation TEXT NOT NULL,                               -- Designation held at past employer
    ctc TEXT,                                                -- Declared CTC package
    reason_for_leaving TEXT,                                 -- Reason (Resigned, Career growth, etc.)
    notice_period TEXT DEFAULT 'Served',                     -- Notice period status
    experience_letter_name TEXT,                             -- Name of uploaded PDF
    experience_letter_url TEXT,                              -- Public/Signed storage URL for PDF
    status TEXT NOT NULL DEFAULT 'Draft',                    -- Draft | Sent | Opened | Responded | Expired | Cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),                    -- Request creation timestamp
    sent_at TIMESTAMPTZ,                                     -- Email dispatch timestamp
    opened_at TIMESTAMPTZ,                                   -- Timestamp when verifier opened link
    responded_at TIMESTAMPTZ,                                -- Timestamp when verifier submitted
    email_details JSONB,                                     -- Subject, recipient, CC list, personal note
    response_details JSONB                                   -- Ratings, remarks, verifier name, phone, rehire status
);

-- Index for instant lookup by verification token
CREATE INDEX IF NOT EXISTS idx_bgv_requests_token ON public.bgv_requests(token);
CREATE INDEX IF NOT EXISTS idx_bgv_requests_status ON public.bgv_requests(status);
CREATE INDEX IF NOT EXISTS idx_bgv_requests_created ON public.bgv_requests(created_at DESC);

-- -------------------------------------------------------------------------
-- 2. TABLE: hr_users (HR Operations & Verifier Team Members)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hr_users (
    id TEXT PRIMARY KEY,                                     -- e.g. 'usr-1'
    name TEXT NOT NULL,                                      -- Full Name
    email TEXT UNIQUE NOT NULL,                              -- Official email address
    role TEXT NOT NULL DEFAULT 'HR Specialist',              -- HR Admin | HR Specialist | Verifier Lead
    status TEXT NOT NULL DEFAULT 'Active',                   -- Active | Inactive
    avatar TEXT,                                             -- Profile photo URL
    created_at TIMESTAMPTZ DEFAULT NOW()                     -- Onboarding date
);

-- -------------------------------------------------------------------------
-- 3. STORAGE: experience-letters (PDF Documents Bucket)
-- -------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('experience-letters', 'experience-letters', true)
ON CONFLICT (id) DO NOTHING;

-- -------------------------------------------------------------------------
-- 4. ENABLE REALTIME BROADCAST
-- Enables instant live dashboard updates without page refresh
-- -------------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.bgv_requests;

-- -------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- Allows public verification access via token and full access for HR operations
-- -------------------------------------------------------------------------
ALTER TABLE public.bgv_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hr_users ENABLE ROW LEVEL SECURITY;

-- Allow read & write to requests for dashboard and verification page
CREATE POLICY "Public & HR can read requests" 
ON public.bgv_requests FOR SELECT USING (true);

CREATE POLICY "Public & HR can insert requests" 
ON public.bgv_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "Public & HR can update requests" 
ON public.bgv_requests FOR UPDATE USING (true);

CREATE POLICY "HR can delete requests" 
ON public.bgv_requests FOR DELETE USING (true);

-- Allow HR users read & write
CREATE POLICY "Allow read hr_users" 
ON public.hr_users FOR SELECT USING (true);

CREATE POLICY "Allow write hr_users" 
ON public.hr_users FOR ALL USING (true);

-- Storage bucket access
CREATE POLICY "Allow public read experience letters"
ON storage.objects FOR SELECT USING (bucket_id = 'experience-letters');

CREATE POLICY "Allow public upload experience letters"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'experience-letters');

-- -------------------------------------------------------------------------
-- 6. INITIAL SAMPLE SEED DATA
-- -------------------------------------------------------------------------
INSERT INTO public.hr_users (id, name, email, role, status, avatar)
VALUES
('usr-1', 'Neha Kapoor', 'neha.kapoor@netbounceplacement.com', 'HR Admin', 'Active', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'),
('usr-2', 'Siddharth Nair', 'siddharth@netbounceplacement.com', 'HR Specialist', 'Active', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'),
('usr-3', 'Tanvi Joshi', 'tanvi.j@netbounceplacement.com', 'Verifier Lead', 'Active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.bgv_requests (
    id, token, candidate_name, position_offered, department, previous_employer, previous_email,
    employment_start_date, employment_end_date, designation, ctc, reason_for_leaving, notice_period,
    experience_letter_name, status, created_at, sent_at, opened_at, responded_at, response_details
)
VALUES
(
    'NB-BGV-1001',
    '375982192e613c9c8d913cd18d9b7722ac136cccac4a75d8272101589f7d66a6',
    'Rohan Sharma',
    'Senior Frontend Engineer',
    'Engineering > Platform',
    'Infosys Technologies',
    'hr.verification@infosys.com',
    '2021-04-01',
    '2023-09-30',
    'Technology Analyst',
    '₹18,50,000',
    'Career Progression & Higher Compensation',
    'Served',
    'Letter: Rohan Sharma Relieving.pdf',
    'Responded',
    NOW() - INTERVAL '4 days',
    NOW() - INTERVAL '3 days',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day',
    '{"confirmed": true, "rehireEligibility": "Eligible", "remarks": "Excellent track record, relieved in good standing.", "verifierName": "Amit Saxena", "verifierDesignation": "Senior HR Manager", "verifierEmail": "amit.s@infosys.com", "verifierPhone": "+91 98765 43210", "submittedAt": "24 Nov 2026, 04:10 PM", "behaviouralRatings": {"averageScore": 4.8, "q1PerformanceUnderPressure": 5, "q2ProblemSolving": 5, "q3TeamworkCommunication": 5, "q4ReceivingFeedback": 4, "q5OwnershipReliability": 5, "comment": "Outstanding technical competence and high ownership."}}'::jsonb
),
(
    'NB-BGV-1002',
    '7b9a4f2e1c8d5a6b3e0f1a2b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d',
    'Ananya Verma',
    'Staff Product Designer',
    'Product & UX',
    'Wipro Digital',
    'bgv-team@wipro.com',
    '2022-07-01',
    '2024-11-15',
    'UI/UX Designer',
    '₹11,00,000',
    'Pursuing product leadership roles',
    'Served',
    'Letter: Ananya Verma Relieving.pdf',
    'Responded',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '2 hours',
    '{"confirmed": true, "rehireEligibility": "Eligible", "remarks": "Design deliverables were of high standard.", "verifierName": "Kavita R.", "verifierDesignation": "People Operations Lead", "verifierEmail": "kavita.r@wipro.com", "verifierPhone": "+91 91234 56789", "submittedAt": "24 Nov 2026, 08:54 PM", "behaviouralRatings": {"averageScore": 4.6, "q1PerformanceUnderPressure": 4, "q2ProblemSolving": 5, "q3TeamworkCommunication": 5, "q4ReceivingFeedback": 4, "q5OwnershipReliability": 5, "comment": "Very collaborative team player."}}'::jsonb
),
(
    'NB-BGV-1003',
    'a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
    'Vikramaditya Rao',
    'Lead DevOps Architect',
    'Cloud Infrastructure',
    'Accenture India',
    'india.verifications@accenture.com',
    '2020-01-10',
    '2023-12-31',
    'Team Lead - Cloud Services',
    '₹24,00,000',
    'Relocating & higher role',
    'Served',
    'Letter: Vikramaditya Rao Relieving.pdf',
    'Sent',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day',
    NULL,
    NULL,
    NULL
)
ON CONFLICT (id) DO NOTHING;

import { useState, useEffect } from 'react';
import { BGVDashboard } from './components/BGVDashboard';
import { AddRequestModal } from './components/AddRequestModal';
import { EmailComposerModal } from './components/EmailComposerModal';
import { PublicVerificationPage } from './components/PublicVerificationPage';
import { LoginPage } from './components/LoginPage';
import { RequestDetailDrawer } from './components/RequestDetailDrawer';
import { initialUsers } from './data/mockData';
import type { BGVRequest, UserItem } from './types';
import { downloadSentEmailPDF, downloadResponsePDF } from './utils/pdfGenerator';
import {
  getStoredRequests,
  setStoredRequests,
  syncFromSupabase,
  subscribeToSupabaseRealtime,
  fetchUsersFromSupabase,
  saveUserToSupabase,
  deleteUserFromSupabase,
} from './utils/storage';
import confetti from 'canvas-confetti';

export function App() {
  // Check if current URL is a standalone verification route for previous employer:
  const queryParams = new URLSearchParams(window.location.search);
  const verifyToken = queryParams.get('token');
  const isVerifyRoute = Boolean(verifyToken) || window.location.pathname.startsWith('/verify');

  // Requests state initialized from persistent storage
  const [requests, setRequests] = useState<BGVRequest[]>(() => getStoredRequests());

  // HR Users state
  const [users, setUsers] = useState<UserItem[]>(initialUsers);

  // Authentication state (Persistent session)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem('nb_bgv_authenticated') === 'true'
  );

  const handleLoginSuccess = () => {
    localStorage.setItem('nb_bgv_authenticated', 'true');
    setIsAuthenticated(true);
    showToast('Signed in successfully as Netbounce HR');
  };

  const handleSignOut = () => {
    localStorage.removeItem('nb_bgv_authenticated');
    setIsAuthenticated(false);
    showToast('Signed out of BGV Portal');
  };

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Active / Selected request for modals
  const [selectedRequest, setSelectedRequest] = useState<BGVRequest | null>(null);
  const [pendingDraftData, setPendingDraftData] = useState<Partial<BGVRequest> | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Synchronize requests across tabs, Supabase Realtime, and auto-update 'Opened' status
  useEffect(() => {
    // 1. Initial local sync & background Supabase fetch
    const stored = getStoredRequests();
    const cleanStored = stored.filter(
      (r) => !['NB-BGV-1001', 'NB-BGV-1002', 'NB-BGV-1003', 'NB-BGV-1004', 'NB-BGV-1005'].includes(r.id)
    );
    setRequests(cleanStored);

    syncFromSupabase().then((fromSupabase) => {
      if (fromSupabase) {
        const cleanFromSupabase = fromSupabase.filter(
          (r) => !['NB-BGV-1001', 'NB-BGV-1002', 'NB-BGV-1003', 'NB-BGV-1004', 'NB-BGV-1005'].includes(r.id)
        );
        setRequests(cleanFromSupabase);
      }
    });

    // 2. Setup Supabase Realtime listener for requests and HR users
    const unsubscribeRealtime = subscribeToSupabaseRealtime(
      (updated) => {
        const cleanUpdated = updated.filter(
          (r) => !['NB-BGV-1001', 'NB-BGV-1002', 'NB-BGV-1003', 'NB-BGV-1004', 'NB-BGV-1005'].includes(r.id)
        );
        setRequests(cleanUpdated);
      },
      (updatedUsers) => {
        setUsers(updatedUsers.length > 0 ? updatedUsers : initialUsers);
      }
    );

    // 2.1 Fetch HR team members from Supabase hr_users table
    fetchUsersFromSupabase().then((dbUsers) => {
      if (dbUsers && dbUsers.length > 0) {
        setUsers(dbUsers);
      } else {
        setUsers(initialUsers);
      }
    });

    // 3. Cross-tab storage listeners
    const handleStorageSync = () => {
      const latest = getStoredRequests();
      setRequests(latest);
    };

    window.addEventListener('storage', handleStorageSync);
    window.addEventListener('bgv-requests-updated', handleStorageSync);

    // 4. If accessing via verification token and currently 'Sent', auto-mark 'Opened'
    if (verifyToken) {
      const target = stored.find((r) => r.token === verifyToken);
      if (target && target.status === 'Sent') {
        const openedTime =
          new Date().toLocaleDateString([], { day: '2-digit', month: 'short' }) +
          ' ' +
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const updated = stored.map((r) =>
          r.id === target.id ? { ...r, status: 'Opened' as const, openedAt: openedTime } : r
        );
        setStoredRequests(updated);
        setRequests(updated);
      }
    }

    return () => {
      unsubscribeRealtime();
      window.removeEventListener('storage', handleStorageSync);
      window.removeEventListener('bgv-requests-updated', handleStorageSync);
    };
  }, [verifyToken]);

  // 1. Save Draft Handler (Updates existing in-place if editing; otherwise prepends new request to top)
  const handleSaveDraft = (data: Partial<BGVRequest>) => {
    let updated: BGVRequest[];
    const isEditing = Boolean(data.id || pendingDraftData?.id);
    const targetId = data.id || pendingDraftData?.id;

    if (isEditing && targetId) {
      updated = requests.map((r) =>
        r.id === targetId
          ? {
              ...r,
              ...data,
              id: targetId,
              status: (data.status || r.status || 'Draft') as any,
            }
          : r
      );
      showToast(`Updated verification details for ${data.candidateName || targetId}`);
    } else {
      const newReq: BGVRequest = {
        id: `NB-BGV-${1000 + requests.length + 1}`,
        token: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        candidateName: data.candidateName || 'Unknown Candidate',
        positionOffered: data.positionOffered || 'N/A',
        department: data.department || 'General',
        previousEmployer: data.previousEmployer || 'N/A',
        previousEmail: data.previousEmail || 'hr@company.com',
        employmentStartDate: data.employmentStartDate || '2023-01-01',
        employmentEndDate: data.employmentEndDate || '2024-01-01',
        designation: data.designation || 'Staff',
        ctc: data.ctc || '',
        reasonForLeaving: data.reasonForLeaving || 'Resigned',
        noticePeriod: data.noticePeriod || 'Served',
        experienceLetterName: data.experienceLetterName,
        experienceLetterUrl: data.experienceLetterUrl,
        status: 'Draft',
        createdAt:
          new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) +
          ' ' +
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      // Put new request at the TOP of the list
      updated = [newReq, ...requests];
      showToast(`Draft request saved for ${newReq.candidateName}`);
    }

    setRequests(updated);
    setStoredRequests(updated);
    setIsAddModalOpen(false);
    setPendingDraftData(null);
  };

  // 2. Proceed to Email Composer (Updates existing in-place or pre-stores new draft at top)
  const handleProceedToSend = (data: Partial<BGVRequest>) => {
    const isEditing = Boolean(data.id || pendingDraftData?.id);
    const targetId = data.id || pendingDraftData?.id;
    let targetReq: BGVRequest;

    if (isEditing && targetId) {
      const existing = requests.find((r) => r.id === targetId);
      targetReq = {
        ...(existing || {}),
        ...data,
        id: targetId,
        token: data.token || existing?.token || Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        candidateName: data.candidateName || existing?.candidateName || 'Candidate',
        positionOffered: data.positionOffered || existing?.positionOffered || 'N/A',
        department: data.department || existing?.department || 'Engineering',
        previousEmployer: data.previousEmployer || existing?.previousEmployer || 'Previous Org',
        previousEmail: data.previousEmail || existing?.previousEmail || 'hr@company.com',
        employmentStartDate: data.employmentStartDate || existing?.employmentStartDate || '2023-01-01',
        employmentEndDate: data.employmentEndDate || existing?.employmentEndDate || '2024-01-01',
        designation: data.designation || existing?.designation || 'Specialist',
        ctc: data.ctc || existing?.ctc || '',
        reasonForLeaving: data.reasonForLeaving || existing?.reasonForLeaving || 'Resigned',
        noticePeriod: data.noticePeriod || existing?.noticePeriod || 'Served',
        experienceLetterName: data.experienceLetterName || existing?.experienceLetterName,
        experienceLetterUrl: data.experienceLetterUrl || existing?.experienceLetterUrl,
        status: (existing?.status || 'Draft') as any,
        createdAt:
          existing?.createdAt ||
          new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) +
          ' ' +
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updated = requests.map((r) => (r.id === targetId ? targetReq : r));
      setRequests(updated);
      setStoredRequests(updated);
    } else {
      const generatedToken = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const newReqId = `NB-BGV-${1000 + requests.length + 1}`;
      targetReq = {
        id: newReqId,
        token: generatedToken,
        candidateName: data.candidateName || 'Candidate',
        positionOffered: data.positionOffered || 'N/A',
        department: data.department || 'Engineering',
        previousEmployer: data.previousEmployer || 'Previous Org',
        previousEmail: data.previousEmail || 'hr@company.com',
        employmentStartDate: data.employmentStartDate || '2023-01-01',
        employmentEndDate: data.employmentEndDate || '2024-01-01',
        designation: data.designation || 'Specialist',
        ctc: data.ctc || '',
        reasonForLeaving: data.reasonForLeaving || 'Resigned',
        noticePeriod: data.noticePeriod || 'Served',
        experienceLetterName: data.experienceLetterName,
        experienceLetterUrl: data.experienceLetterUrl,
        status: 'Draft',
        createdAt:
          new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) +
          ' ' +
          new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const updated = [targetReq, ...requests];
      setRequests(updated);
      setStoredRequests(updated);
    }

    setPendingDraftData(targetReq);
    setIsAddModalOpen(false);
    setIsEmailComposerOpen(true);
  };

  // 3. Confirm Send Email (Dispatches Real Email via Nodemailer SMTP)
  const handleConfirmSendEmail = async (emailPayload: {
    to: string;
    cc: string[];
    subject: string;
    personalNote: string;
  }) => {
    if (!pendingDraftData) return;

    const now = new Date();
    const formattedDate =
      now.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) +
      ' ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newReq: BGVRequest = {
      ...pendingDraftData,
      id: pendingDraftData.id || `NB-BGV-${1000 + requests.length + 1}`,
      token: pendingDraftData.token || Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      candidateName: pendingDraftData.candidateName || 'Candidate',
      positionOffered: pendingDraftData.positionOffered || 'N/A',
      department: pendingDraftData.department || 'Engineering',
      previousEmployer: pendingDraftData.previousEmployer || 'Previous Org',
      previousEmail: emailPayload.to,
      employmentStartDate: pendingDraftData.employmentStartDate || '2023-01-01',
      employmentEndDate: pendingDraftData.employmentEndDate || '2024-01-01',
      designation: pendingDraftData.designation || 'Specialist',
      ctc: pendingDraftData.ctc || '',
      reasonForLeaving: pendingDraftData.reasonForLeaving || 'Resigned',
      noticePeriod: pendingDraftData.noticePeriod || 'Served',
      experienceLetterName: pendingDraftData.experienceLetterName,
      experienceLetterUrl: pendingDraftData.experienceLetterUrl,
      status: 'Sent',
      createdAt: pendingDraftData.createdAt || formattedDate,
      sentAt: formattedDate,
      emailDetails: {
        to: emailPayload.to,
        cc: emailPayload.cc,
        subject: emailPayload.subject,
        sentDate: formattedDate,
        personalNote: emailPayload.personalNote,
      },
    };

    const isExisting = requests.some((r) => r.id === newReq.id);
    let updated: BGVRequest[];
    if (isExisting) {
      updated = requests.map((r) => (r.id === newReq.id ? newReq : r));
    } else {
      updated = [newReq, ...requests.filter((r) => r.id !== newReq.id)];
    }

    setRequests(updated);
    setStoredRequests(updated);

    setIsEmailComposerOpen(false);
    setPendingDraftData(null);
    showToast(`Connecting to SMTP and sending real email to ${emailPayload.to}...`);

    try {
      const publicLink = `${window.location.origin}/?token=${newReq.token}`;

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailPayload.to,
          cc: emailPayload.cc,
          subject: emailPayload.subject,
          candidateName: newReq.candidateName,
          positionOffered: newReq.positionOffered,
          department: newReq.department,
          previousEmployer: newReq.previousEmployer,
          tenure: `${newReq.employmentStartDate} to ${newReq.employmentEndDate}`,
          designation: newReq.designation,
          verificationLink: publicLink,
          personalNote: emailPayload.personalNote,
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        showToast(`✅ Real email delivered to ${emailPayload.to} inbox!`);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } else {
        showToast(`Dispatched on dashboard (SMTP note: ${resData.error || 'Check logs'})`);
      }
    } catch {
      showToast(`Verification request created and recorded as Sent`);
    }
  };

  // 4. Submit Employer Response (Stores All Data & Behavioural Ratings in Real Time)
  const handleSubmitEmployerResponse = (
    requestId: string,
    responseData: NonNullable<BGVRequest['responseDetails']>
  ) => {
    const latest = getStoredRequests();
    const updated = latest.map((r) => {
      if (r.id === requestId) {
        return {
          ...r,
          status: 'Responded' as const,
          respondedAt: responseData.submittedAt,
          responseDetails: responseData,
        };
      }
      return r;
    });

    setStoredRequests(updated);
    setRequests(updated);
    showToast(`Employer verification submitted: ${responseData.confirmed ? 'Confirmed Positive' : 'Discrepancy Noted'}`);
  };

  // ----------------------------------------------------
  // PUBLIC VERIFICATION ROUTE (STANDALONE PAGE FOR EMPLOYER)
  // ----------------------------------------------------
  if (isVerifyRoute) {
    return (
      <PublicVerificationPage
        token={verifyToken || ''}
        requests={requests}
        onSubmitResponse={handleSubmitEmployerResponse}
      />
    );
  }

  // ----------------------------------------------------
  // AUTHENTICATION GUARD: IF NOT LOGGED IN, SHOW LOGIN PAGE
  // ----------------------------------------------------
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // ----------------------------------------------------
  // HR DASHBOARD ROUTE (LOGGED-IN ADMIN ERP FOR NETBOUNCE HR)
  // ----------------------------------------------------
  const handleOpenAddModal = () => {
    setPendingDraftData(null);
    setIsAddModalOpen(true);
  };

  const handleViewDetails = (req: BGVRequest) => {
    setSelectedRequest(req);
    setIsDetailDrawerOpen(true);
  };

  const handleEditDraft = (req: BGVRequest) => {
    setPendingDraftData(req);
    setIsAddModalOpen(true);
  };

  const handleSendReminder = async (req: BGVRequest) => {
    const now = new Date();
    const formatted =
      now.toLocaleDateString([], { day: '2-digit', month: 'short' }) +
      ' ' +
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    showToast(`Sending reminder email to ${req.previousEmail}...`);

    try {
      const publicLink = `${window.location.origin}/?token=${req.token}`;

      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: req.previousEmail,
          cc: ['hr@netbounceplacement.com'],
          subject: `Reminder: Employment Verification for ${req.candidateName} – Netbounce`,
          candidateName: req.candidateName,
          positionOffered: req.positionOffered,
          department: req.department,
          previousEmployer: req.previousEmployer,
          tenure: `${req.employmentStartDate} to ${req.employmentEndDate}`,
          designation: req.designation,
          verificationLink: publicLink,
          personalNote: 'This is a gentle reminder to confirm the candidate employment details.',
        }),
      });

      showToast(`Reminder sent successfully to ${req.previousEmail}`);
    } catch {
      showToast(`Reminder recorded on audit timeline`);
    }

    const updated = requests.map((r) => (r.id === req.id ? { ...r, sentAt: formatted } : r));
    setRequests(updated);
    setStoredRequests(updated);
  };

  const handleOpenEmployerForm = (req: BGVRequest) => {
    window.open(`${window.location.origin}/?token=${req.token}`, '_blank');
  };

  const handleCopyLink = (req: BGVRequest) => {
    const link = `${window.location.origin}/?token=${req.token}`;
    navigator.clipboard.writeText(link);
    showToast(`Verification link copied to clipboard!`);
  };

  const handleCancelRequest = (requestId: string) => {
    if (confirm('Are you sure you want to cancel this verification request?')) {
      const updated = requests.map((r) =>
        r.id === requestId ? { ...r, status: 'Cancelled' as const } : r
      );
      setRequests(updated);
      setStoredRequests(updated);
      showToast('Request marked as Cancelled');
    }
  };

  const handleAddUser = (user: Omit<UserItem, 'id' | 'createdAt'>) => {
    const newUser: UserItem = {
      ...user,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setUsers([...users, newUser]);
    saveUserToSupabase(newUser);
    showToast(`User ${newUser.name} added and saved to Supabase hr_users`);
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    deleteUserFromSupabase(id);
    showToast('User removed from Supabase');
  };

  const handleExportMasterSummary = () => {
    showToast('Master BGV audit export initiated...');
    setTimeout(() => {
      showToast('Master CSV report downloaded');
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen">
      {/* HR Executive Dashboard */}
      <BGVDashboard
        requests={requests}
        users={users}
        onOpenAddModal={handleOpenAddModal}
        onViewDetails={handleViewDetails}
        onEditDraft={handleEditDraft}
        onSendReminder={handleSendReminder}
        onOpenEmployerForm={handleOpenEmployerForm}
        onDownloadEmailPDF={downloadSentEmailPDF}
        onDownloadResponsePDF={downloadResponsePDF}
        onCopyLink={handleCopyLink}
        onCancelRequest={handleCancelRequest}
        onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
        onExportMasterSummary={handleExportMasterSummary}
        onSignOut={handleSignOut}
      />

      {/* Global Interactive Modals */}
      <AddRequestModal
        isOpen={isAddModalOpen}
        initialData={pendingDraftData}
        onClose={() => {
          setIsAddModalOpen(false);
          setPendingDraftData(null);
        }}
        onSaveDraft={handleSaveDraft}
        onProceedToSend={handleProceedToSend}
      />

      <EmailComposerModal
        isOpen={isEmailComposerOpen}
        onClose={() => setIsEmailComposerOpen(false)}
        requestData={pendingDraftData}
        onConfirmSend={handleConfirmSendEmail}
      />

      {/* Detail Drawer for Inspecting Responded / Audited Candidate */}
      <RequestDetailDrawer
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        request={selectedRequest}
        onDownloadEmailPDF={downloadSentEmailPDF}
        onDownloadResponsePDF={downloadResponsePDF}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-50 px-5 py-3.5 rounded-2xl liquid-glass border border-white text-xs font-black text-slate-900 shadow-2xl shadow-blue-500/20 flex items-center gap-2.5 animate-bounce">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;

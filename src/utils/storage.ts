import type { BGVRequest, UserItem } from '../types';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'netbounce_bgv_requests';

// Convert DB snake_case row to frontend BGVRequest
function rowToRequest(row: any): BGVRequest {
  return {
    id: row.id,
    token: row.token,
    candidateName: row.candidate_name,
    positionOffered: row.position_offered,
    department: row.department,
    previousEmployer: row.previous_employer,
    previousEmail: row.previous_email,
    employmentStartDate: row.employment_start_date,
    employmentEndDate: row.employment_end_date,
    designation: row.designation,
    ctc: row.ctc || '',
    reasonForLeaving: row.reason_for_leaving || '',
    noticePeriod: row.notice_period || 'Served',
    experienceLetterName: row.experience_letter_name,
    experienceLetterUrl: row.experience_letter_url,
    status: row.status,
    createdAt: row.created_at,
    sentAt: row.sent_at,
    openedAt: row.opened_at,
    respondedAt: row.responded_at,
    emailDetails: row.email_details,
    responseDetails: row.response_details,
  };
}

// Convert frontend BGVRequest to DB snake_case row
function requestToRow(req: BGVRequest) {
  return {
    id: req.id,
    token: req.token,
    candidate_name: req.candidateName,
    position_offered: req.positionOffered ?? null,
    department: req.department ?? null,
    previous_employer: req.previousEmployer ?? null,
    previous_email: req.previousEmail ?? null,
    employment_start_date: req.employmentStartDate ?? null,
    employment_end_date: req.employmentEndDate ?? null,
    designation: req.designation ?? null,
    ctc: req.ctc ?? '',
    reason_for_leaving: req.reasonForLeaving ?? '',
    notice_period: req.noticePeriod ?? 'Served',
    experience_letter_name: req.experienceLetterName ?? null,
    experience_letter_url: req.experienceLetterUrl ?? null,
    status: req.status || 'Draft',
    created_at: req.createdAt ?? new Date().toISOString(),
    sent_at: req.sentAt ?? null,
    opened_at: req.openedAt ?? null,
    responded_at: req.respondedAt ?? null,
    email_details: req.emailDetails ?? null,
    response_details: req.responseDetails ?? null,
  };
}

export function getStoredRequests(): BGVRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse stored requests:', e);
  }
  return [];
}

export function setStoredRequests(requests: BGVRequest[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    window.dispatchEvent(new Event('bgv-requests-updated'));

    // 1. Sync with server local file fallback (only during local Vite dev)
    if (import.meta.env.DEV) {
      fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requests),
      }).catch(() => {});
    }

    // 2. Sync with Supabase PostgreSQL in background
    if (requests.length > 0) {
      const rows = requests.map(requestToRow);
      Promise.resolve(supabase.from('bgv_requests').upsert(rows, { onConflict: 'id' }))
        .then((res: any) => {
          if (res?.error) {
            console.warn('Supabase sync note:', res.error.message);
          }
        })
        .catch(() => {});
    }
  } catch (e) {
    console.error('Failed to store requests:', e);
  }
}

// Fetch latest requests directly from Supabase and sync local storage
export async function syncFromSupabase(): Promise<BGVRequest[] | null> {
  try {
    const { data, error } = await supabase
      .from('bgv_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const converted = data.map(rowToRequest);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(converted));
      window.dispatchEvent(new Event('bgv-requests-updated'));
      return converted;
    }
  } catch (err) {
    console.warn('Could not reach Supabase yet (check table creation):', err);
  }
  return null;
}

// Setup Supabase Realtime Listener for Live Updates
export function subscribeToSupabaseRealtime(
  onRequestUpdate?: (requests: BGVRequest[]) => void,
  onUserUpdate?: (users: UserItem[]) => void
) {
  // Requests channel
  const reqChannel = supabase
    .channel('public:bgv_requests')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bgv_requests' },
      async () => {
        const updated = await syncFromSupabase();
        if (updated && onRequestUpdate) {
          onRequestUpdate(updated);
        }
      }
    )
    .subscribe();

  // HR Users channel
  const userChannel = supabase
    .channel('public:hr_users')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'hr_users' },
      async () => {
        const updatedUsers = await fetchUsersFromSupabase();
        if (updatedUsers && onUserUpdate) {
          onUserUpdate(updatedUsers);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(reqChannel);
    supabase.removeChannel(userChannel);
  };
}

// ---------------------------------------------------------
// HR USERS SYNC FUNCTIONS (Supabase 'hr_users' Table)
// ---------------------------------------------------------
export async function fetchUsersFromSupabase(): Promise<UserItem[] | null> {
  try {
    const { data, error } = await supabase
      .from('hr_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      return data.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        status: u.status,
        avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        createdAt: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      }));
    }
  } catch (err) {
    console.warn('Error fetching users from Supabase:', err);
  }
  return null;
}

export async function saveUserToSupabase(user: UserItem): Promise<boolean> {
  try {
    const { error } = await supabase.from('hr_users').upsert({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      created_at: user.createdAt,
    }, { onConflict: 'id' });
    return !error;
  } catch (err) {
    console.warn('Error saving user to Supabase:', err);
    return false;
  }
}

export async function deleteUserFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('hr_users').delete().eq('id', id);
    return !error;
  } catch (err) {
    console.warn('Error deleting user from Supabase:', err);
    return false;
  }
}

export async function deleteRequestFromSupabase(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('bgv_requests').delete().eq('id', id);
    if (error) {
      console.warn('Error deleting request from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Exception deleting request from Supabase:', err);
    return false;
  }
}

export async function deleteStoredRequest(requestId: string): Promise<BGVRequest[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let updated: BGVRequest[] = [];
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        updated = parsed.filter((r) => r.id !== requestId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event('bgv-requests-updated'));
      }
    }
    // Delete from Supabase PostgreSQL
    await deleteRequestFromSupabase(requestId);
    return updated;
  } catch (err) {
    console.error('Failed to delete stored request:', err);
    return [];
  }
}

// ---------------------------------------------------------
// STORAGE: Upload Experience Letter to 'experience-letters' bucket
// ---------------------------------------------------------
export async function uploadExperienceLetterToSupabase(file: File): Promise<string | null> {
  try {
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `letters/${Date.now()}_${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('experience-letters')
      .upload(filePath, file, { cacheControl: '3600', upsert: true });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError.message);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from('experience-letters')
      .getPublicUrl(filePath);

    return urlData?.publicUrl || null;
  } catch (err) {
    console.warn('File upload exception:', err);
    return null;
  }
}

import type { BGVRequest, UserItem } from '../types';

// Mock requests cleared as requested
export const initialRequests: BGVRequest[] = [];

// Only official BGV Administrator in HR Team as requested ("hr team meh bas bgv wala hi rahe")
export const initialUsers: UserItem[] = [
  {
    id: 'USR-BGV',
    name: 'BGV Administrator',
    email: 'bgv@netbounceplacement.com',
    role: 'HR Admin',
    status: 'Active',
    avatar: '',
    createdAt: '2026-01-01',
  },
];

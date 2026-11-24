import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Mail, Shield, CheckCircle } from 'lucide-react';
import type { UserItem } from '../types';

interface UserManagementViewProps {
  users: UserItem[];
  onAddUser: (user: Omit<UserItem, 'id' | 'createdAt'>) => void;
  onDeleteUser: (id: string) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onAddUser,
  onDeleteUser,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserItem['role']>('HR Specialist');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    onAddUser({
      name,
      email,
      role,
      status: 'Active',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80`,
    });

    setName('');
    setEmail('');
    setShowAddForm(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">User Management</h2>
          <p className="text-xs text-slate-300 mt-1">
            Manage HR administrators, specialists, and verifier leads with access to Netbounce BGV
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="liquid-glass-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Add New Team Member</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Vikramaditya Sen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs bg-black/30 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. vikram@netbounceplacement.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs bg-black/30 text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserItem['role'])}
                className="w-full px-3 py-2 rounded-xl border border-white/20 text-xs bg-slate-900 text-white"
              >
                <option value="HR Admin">HR Admin</option>
                <option value="HR Specialist">HR Specialist</option>
                <option value="Verifier Lead">Verifier Lead</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white text-xs font-bold"
            >
              Save Member
            </button>
          </div>
        </form>
      )}

      {/* Users List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {users.map((usr) => (
          <div key={usr.id} className="liquid-glass-card p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {usr.avatar ? (
                <img
                  src={usr.avatar}
                  alt={usr.name}
                  className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-blue-400 text-white font-black text-base flex items-center justify-center ring-2 ring-white/25 shadow-sm shrink-0">
                  {usr.name.charAt(0) || 'B'}
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">{usr.name}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-300 mt-0.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span className="font-mono truncate max-w-[150px]">{usr.email}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-sky-300 border border-blue-400/30">
                    <Shield className="w-3 h-3" /> {usr.role}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <CheckCircle className="w-2.5 h-2.5" /> {usr.status}
                  </span>
                </div>
              </div>
            </div>

            {usr.email !== 'bgv@netbounceplacement.com' ? (
              <button
                onClick={() => onDeleteUser(usr.id)}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                title="Remove User"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-[10px] font-mono font-bold text-sky-300 bg-sky-500/15 px-2.5 py-1 rounded-xl border border-sky-400/30 shrink-0">
                Primary Admin
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

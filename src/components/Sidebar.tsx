import React from 'react';
import { LayoutGrid, Users, UserCheck, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  currentTab: 'dashboard' | 'requests' | 'teams' | 'users';
  setCurrentTab: (tab: 'dashboard' | 'requests' | 'teams' | 'users') => void;
  requestsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab, requestsCount }) => {
  return (
    <aside className="w-64 min-h-screen bg-white/70 backdrop-blur-2xl border-r border-white/80 p-6 flex flex-col justify-between shrink-0 shadow-[4px_0_24px_rgba(37,99,235,0.03)]">
      <div>
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            {/* Minimalist diagonal arrow from the axis logo */}
            <span className="font-bold text-lg leading-none transform -rotate-45">↑</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">axis</h1>
            <p className="text-[11px] font-medium text-blue-600 mt-1 uppercase tracking-wider">Netbounce BGV</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {/* Dashboard */}
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-300 ${
              currentTab === 'dashboard'
                ? 'liquid-blue-pill text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <LayoutGrid className="w-5 h-5 shrink-0" />
            <span>Dashboard</span>
          </button>

          {/* BGV Requests / Employees */}
          <button
            onClick={() => setCurrentTab('requests')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-300 ${
              currentTab === 'requests'
                ? 'liquid-blue-pill text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 shrink-0" />
              <span>Employees</span>
            </div>
            {requestsCount > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                currentTab === 'requests' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                {requestsCount}
              </span>
            )}
          </button>

          {/* Teams */}
          <button
            onClick={() => setCurrentTab('teams')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-300 ${
              currentTab === 'teams'
                ? 'liquid-blue-pill text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <Users className="w-5 h-5 shrink-0" />
            <span>Teams</span>
          </button>

          {/* User Management */}
          <button
            onClick={() => setCurrentTab('users')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-300 ${
              currentTab === 'users'
                ? 'liquid-blue-pill text-white shadow-lg shadow-blue-600/25'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>Mana</span>
            </div>
            <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
              3
            </span>
          </button>
        </nav>
      </div>

      {/* User Session Footer */}
      <div className="pt-6 border-t border-slate-200/60">
        <div className="flex items-center gap-3 px-2 py-2 rounded-2xl bg-slate-50/80 border border-slate-200/50">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
            alt="HR User"
            className="w-9 h-9 rounded-xl object-cover ring-2 ring-blue-500/20"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">Neha Kapoor</p>
            <p className="text-[10px] text-slate-500 truncate">HR Operations Head</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

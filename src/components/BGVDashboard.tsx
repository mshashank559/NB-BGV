import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ListChecks,
  Users,
  Clock3,
  Plus,
  Search,
  Download,
  Sparkles,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import type { BGVRequest, BGVStatus, UserItem } from '../types';
import { BGVMetricCards } from './BGVMetricCards';
import { BGVVerificationVolumeChart } from './BGVVerificationVolumeChart';
import { BGVRequestsTable } from './BGVRequestsTable';
import { UserManagementView } from './UserManagementView';
import { AuditLogsView } from './AuditLogsView';
import { CloudShader } from '@/components/ui/cloud-shader';

interface BGVDashboardProps {
  requests: BGVRequest[];
  users: UserItem[];
  onOpenAddModal: () => void;
  onViewDetails: (request: BGVRequest) => void;
  onEditDraft?: (request: BGVRequest) => void;
  onSendReminder: (request: BGVRequest) => void;
  onOpenEmployerForm: (request: BGVRequest) => void;
  onDownloadEmailPDF: (request: BGVRequest) => void;
  onDownloadResponsePDF: (request: BGVRequest) => void;
  onCopyLink: (request: BGVRequest) => void;
  onCancelRequest: (requestId: string) => void;
  onAddUser: (user: Omit<UserItem, 'id' | 'createdAt'>) => void;
  onDeleteUser: (id: string) => void;
  onExportMasterSummary: () => void;
  onSignOut?: () => void;
}

export const BGVDashboard: React.FC<BGVDashboardProps> = ({
  requests,
  users,
  onOpenAddModal,
  onViewDetails,
  onEditDraft,
  onSendReminder,
  onOpenEmployerForm,
  onDownloadEmailPDF,
  onDownloadResponsePDF,
  onCopyLink,
  onCancelRequest,
  onAddUser,
  onDeleteUser,
  onExportMasterSummary,
  onSignOut,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'requests' | 'users' | 'audit'>('dashboard');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | BGVStatus>('All');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dynamically filter requests by search term so KPIs and charts sync in real time
  const searchFilteredRequests = requests.filter((req) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      req.candidateName.toLowerCase().includes(q) ||
      req.previousEmployer.toLowerCase().includes(q) ||
      req.department.toLowerCase().includes(q) ||
      req.id.toLowerCase().includes(q) ||
      req.previousEmail.toLowerCase().includes(q)
    );
  });

  const navigationItems = [
    { id: 'dashboard' as const, label: 'Executive Dashboard', short: 'Dashboard', icon: LayoutDashboard },
    { id: 'requests' as const, label: 'All BGV Requests', short: 'All Requests', icon: ListChecks, badge: requests.length },
    { id: 'users' as const, label: 'User Management', short: 'HR Team', icon: Users, badge: users.length },
    { id: 'audit' as const, label: 'Compliance & Audit', short: 'Audit Logs', icon: Clock3 },
  ];

  return (
    <div className="min-h-screen w-full relative text-white font-sans selection:bg-blue-500/25">
      {/* 1. Dynamic Cloud Shader Background (Blue & White Sky Theme) */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <CloudShader
          className="w-full h-full"
          speed={0.8}
          count={6}
          cloudColor="#fbf8f2"
          skyTopColor="#3876ba"
          skyBottomColor="#8cbfe8"
        />
      </div>

      {/* Main Page Layout Wrapper */}
      <div className="relative z-10 w-full min-h-screen flex flex-col p-3 sm:p-5 lg:p-7 pb-28">
        
        {/* 2. Top Floating Glass Header Pill */}
        <header className="liquid-glass relative z-50 rounded-3xl p-3 sm:px-6 mb-5 flex items-center justify-between gap-4 shadow-[0_12px_36px_rgba(22,60,130,0.12)]">
          {/* Brand Mark with Official Netbounce Placement LLC Logo */}
          <div className="flex items-center gap-3.5 shrink-0 pl-1">
            <img
              src="/netbounce-logo.png"
              alt="NETBOUNCE PLACEMENT LLC"
              className="h-8 sm:h-9 w-auto object-contain transition-transform hover:scale-102 drop-shadow-md"
            />
          </div>

          {/* Center Search Pill with Glowing Blue Sphere (Synced with KPIs & Table) */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 shadow-sm shadow-blue-500/50 flex items-center justify-center">
                <Search className="w-2.5 h-2.5 text-white" />
              </div>
              <input
                type="text"
                placeholder="Search candidates, employer, ID (syncs KPIs)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-semibold text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-white transition-all shadow-xs backdrop-blur-md"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold p-0.5 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Export PDF Button */}
            <button
              onClick={onExportMasterSummary}
              title="Download Master BGV Summary PDF"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all shadow-xs cursor-pointer active:scale-95 backdrop-blur-md"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-xs font-extrabold shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Verification Request</span>
            </button>

            {/* User Profile Pill with Sign Out Dropdown */}
            <div className="relative pl-2 border-l border-white/20">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group select-none text-left"
                aria-label="User Profile"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-blue-400 text-white font-black text-xs flex items-center justify-center ring-2 ring-white/50 shadow-sm group-hover:ring-sky-400 transition-all">
                  B
                </div>
                <div className="hidden xl:block">
                  <p className="text-xs font-bold text-white leading-none">BGV Admin</p>
                  <p className="text-[10px] text-slate-300 font-medium mt-0.5">HR Operations</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Popover */}
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsProfileMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 mt-3 w-64 p-3 rounded-2xl bg-slate-900/95 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-3xl z-50 text-white space-y-3"
                    >
                      <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-blue-400 text-white font-black text-sm flex items-center justify-center ring-2 ring-sky-400/50 shadow-sm shrink-0">
                          B
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white truncate">BGV Administrator</p>
                          <p className="text-[10.5px] text-sky-300 font-semibold truncate">bgv@netbounceplacement.com</p>
                          <span className="text-[9.5px] font-mono text-slate-400">HR Operations Lead</span>
                        </div>
                      </div>

                      <div className="pt-1 border-t border-white/10">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            onSignOut?.();
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-300 hover:text-white hover:bg-rose-500/20 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer group"
                        >
                          <span className="flex items-center gap-2">
                            <LogOut className="w-4 h-4 text-rose-400 group-hover:text-rose-300" />
                            <span>Sign Out</span>
                          </span>
                          <span className="text-[10px] text-rose-400/80 font-mono">End Session</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* 3. Main Glass Stage (Transparent Slate Grey Frosted Glass) */}
        <main className="liquid-glass-stage flex-1 p-5 sm:p-7 lg:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Executive Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                      Executive Dashboard
                    </h1>
                    <p className="text-xs font-medium text-slate-300 mt-1">
                      Overview of candidate background verification requests, SLA timelines, and employer confirmations.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-2xl bg-white/10 text-sky-300 border border-white/20 shadow-xs backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                      Live BGV Engine v1.0
                    </span>
                  </div>
                </div>

                {/* 5 PRD KPI Metric Cards (Synced live with Search & Real-time State) */}
                <BGVMetricCards
                  requests={searchFilteredRequests}
                  selectedStatus={selectedStatusFilter}
                  onSelectStatus={(st) => {
                    setSelectedStatusFilter(st);
                    setActiveTab('requests');
                  }}
                />

                {/* Middle Section: Full-Width Verification Volume Chart (Dynamic Real-Time Data) */}
                <div className="w-full">
                  <BGVVerificationVolumeChart requests={searchFilteredRequests} />
                </div>
              </motion.div>
            )}

            {activeTab === 'requests' && (
              <motion.div
                key="requests"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                      All Verification Requests
                    </h1>
                    <p className="text-xs font-medium text-slate-300 mt-1">
                      Manage and inspect all {requests.length} employment background checks with full lifecycle tracking.
                    </p>
                  </div>
                  <button
                    onClick={onOpenAddModal}
                    className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Request</span>
                  </button>
                </div>

                <BGVRequestsTable
                  requests={requests}
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedStatus={selectedStatusFilter}
                  onSelectStatus={setSelectedStatusFilter}
                  onViewDetails={onViewDetails}
                  onEditDraft={onEditDraft}
                  onSendReminder={onSendReminder}
                  onOpenEmployerForm={onOpenEmployerForm}
                  onDownloadEmailPDF={onDownloadEmailPDF}
                  onDownloadResponsePDF={onDownloadResponsePDF}
                  onCopyLink={onCopyLink}
                  onCancelRequest={onCancelRequest}
                />
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <UserManagementView
                  users={users}
                  onAddUser={onAddUser}
                  onDeleteUser={onDeleteUser}
                />
              </motion.div>
            )}

            {activeTab === 'audit' && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <AuditLogsView
                  requests={requests}
                  onSelectRequest={onViewDetails}
                  onDownloadEmailPDF={onDownloadEmailPDF}
                  onDownloadResponsePDF={onDownloadResponsePDF}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* 4. Floating Bottom Liquid Glass Dock - Refined Capsule Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-[95vw]">
        <nav
          aria-label="Navigation Dock"
          className="relative flex items-center gap-1.5 sm:gap-2 p-2 rounded-full backdrop-blur-3xl bg-slate-900/80 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)]"
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex items-center gap-2.5 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 cursor-pointer select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-white shadow-[0_4px_18px_rgba(37,99,235,0.45)] ring-1 ring-white/30 scale-102'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="tracking-wide whitespace-nowrap">{item.short}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-extrabold leading-none ${
                      isActive
                        ? 'bg-white/25 text-white ring-1 ring-white/30'
                        : 'bg-white/10 text-slate-300 border border-white/15'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="w-[1px] h-6 bg-white/20 mx-1 hidden sm:block shrink-0" />

          {/* Quick Add Request Pill in Dock */}
          <button
            onClick={onOpenAddModal}
            title="Create New Verification Request"
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 hover:border-white/35 transition-all cursor-pointer shadow-sm active:scale-95 whitespace-nowrap backdrop-blur-md shrink-0"
          >
            <Plus className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="whitespace-nowrap">New Request</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

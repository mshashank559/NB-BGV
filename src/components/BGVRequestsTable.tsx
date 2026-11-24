import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Eye,
  FileText,
  Send,
  Download,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  Trash2,
  Edit,
  Building2,
  Filter,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import type { BGVRequest, BGVStatus } from '../types';

interface BGVRequestsTableProps {
  requests: BGVRequest[];
  selectedStatus?: 'All' | BGVStatus;
  searchTerm?: string;
  onSearchChange?: (term: string) => void;
  onSelectStatus?: (status: 'All' | BGVStatus) => void;
  onViewDetails: (request: BGVRequest) => void;
  onEditDraft?: (request: BGVRequest) => void;
  onSendReminder: (request: BGVRequest) => void;
  onOpenEmployerForm: (request: BGVRequest) => void;
  onDownloadEmailPDF: (request: BGVRequest) => void;
  onDownloadResponsePDF: (request: BGVRequest) => void;
  onCopyLink: (request: BGVRequest) => void;
  onCancelRequest: (requestId: string) => void;
}

export const BGVRequestsTable: React.FC<BGVRequestsTableProps> = ({
  requests,
  selectedStatus = 'All',
  searchTerm: controlledSearch,
  onSearchChange,
  onSelectStatus,
  onViewDetails,
  onEditDraft,
  onSendReminder,
  onOpenEmployerForm,
  onDownloadEmailPDF,
  onDownloadResponsePDF,
  onCopyLink,
  onCancelRequest,
}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [localStatus, setLocalStatus] = useState<'All' | BGVStatus>(selectedStatus);
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Last 7 Days' | 'Last 30 Days' | 'Custom'>('All');
  const [customDate, setCustomDate] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const searchTerm = controlledSearch !== undefined ? controlledSearch : internalSearchTerm;
  const handleSearchChange = (term: string) => {
    if (onSearchChange) {
      onSearchChange(term);
    } else {
      setInternalSearchTerm(term);
    }
  };

  const activeStatus = onSelectStatus ? selectedStatus : localStatus;
  const handleStatusChange = (st: 'All' | BGVStatus) => {
    if (onSelectStatus) {
      onSelectStatus(st);
    } else {
      setLocalStatus(st);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.previousEmployer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = activeStatus === 'All' || req.status === activeStatus;

    let matchesDate = true;
    if (dateFilter === 'Custom' && customDate) {
      matchesDate =
        req.createdAt.includes(customDate) ||
        (req.sentAt ? req.sentAt.includes(customDate) : false);
    } else if (dateFilter === 'Today') {
      const todayStr = new Date().toISOString().split('T')[0];
      matchesDate =
        req.createdAt.includes(todayStr) ||
        (req.sentAt ? req.sentAt.includes(todayStr) : false);
    } else if (dateFilter === 'Last 7 Days' || dateFilter === 'Last 30 Days') {
      const days = dateFilter === 'Last 7 Days' ? 7 : 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      const parsed = new Date(req.createdAt);
      if (!isNaN(parsed.getTime())) {
        matchesDate = parsed >= cutoff;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Sort so newly added tasks are ALWAYS at the top as requested
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const idA = parseInt(a.id.replace(/\D/g, '') || '0', 10);
    const idB = parseInt(b.id.replace(/\D/g, '') || '0', 10);
    if (idA && idB && idA !== idB) return idB - idA;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  // Reset to page 1 whenever search, status filter, or date filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeStatus, dateFilter, customDate]);

  const totalPages = Math.ceil(sortedRequests.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedRequests = sortedRequests.slice(startIndex, startIndex + pageSize);

  const getStatusBadge = (status: BGVStatus) => {
    switch (status) {
      case 'Draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-slate-100/90 text-slate-600 border border-slate-300 shadow-2xs">
            <Clock className="w-3 h-3 text-slate-500" />
            Draft
          </span>
        );
      case 'Sent':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-blue-50/90 text-blue-700 border border-blue-200 shadow-2xs shadow-blue-500/10">
            <Send className="w-3 h-3 text-blue-600" />
            Sent
          </span>
        );
      case 'Opened':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-amber-50/90 text-amber-700 border border-amber-200 shadow-2xs shadow-amber-500/10">
            <Eye className="w-3 h-3 text-amber-600" />
            Opened
          </span>
        );
      case 'Responded':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-emerald-50/90 text-emerald-700 border border-emerald-200 shadow-2xs shadow-emerald-500/10">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Responded
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-rose-50/90 text-rose-700 border border-rose-200 shadow-2xs shadow-rose-500/10">
            <AlertTriangle className="w-3 h-3 text-rose-600" />
            Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-black bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="liquid-glass-card p-6"
    >
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-white tracking-tight">
              Employment Verification Tracker
            </h3>
            <span className="text-xs font-black text-white font-mono bg-white/15 px-2.5 py-0.5 rounded-full border border-white/20 shadow-2xs">
              {filteredRequests.length} of {requests.length} Requests
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-300 mt-0.5">
            Real-time status of candidate employment verifications across previous employers
          </p>
        </div>

        {/* Search, Calendar & Filter pills */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search candidate, employer, ID..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-black/30 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40 focus:border-white transition-all font-semibold shadow-2xs backdrop-blur-md"
            />
          </div>

          {/* Calendar Date Filter Popover */}
          <div className="relative">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer shadow-xs active:scale-95 backdrop-blur-md ${
                dateFilter !== 'All' || customDate
                  ? 'bg-blue-600/30 border-sky-400/50 text-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>
                {dateFilter === 'Custom' && customDate
                  ? customDate
                  : dateFilter === 'All'
                  ? 'Filter by Date'
                  : dateFilter}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCalendarOpen && (
              <div className="absolute right-0 mt-2 w-64 p-3.5 rounded-2xl bg-slate-900/95 border border-white/20 shadow-2xl backdrop-blur-2xl z-50 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <span className="text-xs font-black text-white">Date Range Filter</span>
                  <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {(['All', 'Today', 'Last 7 Days', 'Last 30 Days'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setDateFilter(opt);
                        setCustomDate('');
                        setIsCalendarOpen(false);
                      }}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                        dateFilter === opt && !customDate
                          ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-sm'
                          : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white'
                      }`}
                    >
                      {opt === 'All' ? 'All Dates' : opt}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-white/10 space-y-1.5">
                  <label className="text-[10.5px] font-bold text-slate-300 block">Custom Calendar Date</label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => {
                      setCustomDate(e.target.value);
                      setDateFilter('Custom');
                      setIsCalendarOpen(false);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
                  />
                </div>

                {(dateFilter !== 'All' || customDate) && (
                  <button
                    onClick={() => {
                      setDateFilter('All');
                      setCustomDate('');
                      setIsCalendarOpen(false);
                    }}
                    className="w-full text-center text-xs text-rose-300 hover:text-rose-200 font-bold py-1 cursor-pointer"
                  >
                    Reset Date Filter
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
            {(['All', 'Draft', 'Sent', 'Expired'] as const).map((st) => (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeStatus === st
                    ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-white font-extrabold shadow-md shadow-blue-500/35 border border-sky-400/40 scale-102'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 text-[11px] font-black text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-3">Candidate Name</th>
              <th className="py-3.5 px-3">Previous Employer</th>
              <th className="py-3.5 px-3">Department</th>
              <th className="py-3.5 px-3">Request Date</th>
              <th className="py-3.5 px-3">Sent To (Email)</th>
              <th className="py-3.5 px-3">Live Status</th>
              <th className="py-3.5 px-3">Response Date</th>
              <th className="py-3.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/90 text-xs">
            {paginatedRequests.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-14 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Filter className="w-8 h-8 text-slate-300" />
                    <p className="font-bold text-slate-700">No verification requests found</p>
                    <p className="text-xs text-slate-400">
                      Try adjusting filters or search terms
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRequests.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-blue-500/8 transition-colors group"
                >
                  {/* Candidate Name & ID */}
                  <td className="py-4 px-3">
                    <div className="font-extrabold text-white">{req.candidateName}</div>
                    <div className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{req.id}</div>
                  </td>

                  {/* Previous Employer & Designation */}
                  <td className="py-4 px-3">
                    <div className="flex items-center gap-1.5 font-bold text-slate-100">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{req.previousEmployer}</span>
                    </div>
                    <span className="block text-[11px] font-medium text-slate-300 pl-5">
                      {req.designation}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="py-4 px-3 text-slate-200 font-semibold">
                    {req.department}
                  </td>

                  {/* Request Date */}
                  <td className="py-4 px-3 text-slate-300 font-mono font-medium text-[11px]">
                    {req.createdAt.split(' ')[0]}
                  </td>

                  {/* Sent To */}
                  <td className="py-4 px-3 text-slate-300">
                    <span className="truncate max-w-[160px] block font-mono text-[11px] text-slate-200 font-medium">
                      {req.previousEmail}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-3">
                    {getStatusBadge(req.status)}
                  </td>

                  {/* Response Date */}
                  <td className="py-4 px-3 font-mono text-[11px]">
                    {req.respondedAt ? (
                      <span className="text-emerald-700 font-black">{req.respondedAt}</span>
                    ) : (
                      <span className="text-slate-400 italic font-medium">Pending</span>
                    )}
                  </td>

                  {/* Row Actions */}
                  <td className="py-4 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* View Details Drawer */}
                      <button
                        onClick={() => onViewDetails(req)}
                        title="View Full Lifecycle Timeline & Audit"
                        className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/15 transition-all cursor-pointer active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Verify as Employer */}
                      <button
                        onClick={() => onOpenEmployerForm(req)}
                        title="Open Employer Verification Public Form"
                        className="p-2 rounded-xl text-slate-300 hover:text-sky-300 hover:bg-white/15 transition-all cursor-pointer active:scale-95"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>

                      {/* Copy Link */}
                      <button
                        onClick={() => onCopyLink(req)}
                        title="Copy Public Employer Link"
                        className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/15 transition-all cursor-pointer active:scale-95"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit candidate details without creating duplicates */}
                      {onEditDraft && (
                        <button
                          onClick={() => onEditDraft(req)}
                          title="Edit Candidate Verification Details"
                          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/15 transition-all cursor-pointer active:scale-95"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Download Sent Email PDF */}
                      {req.status !== 'Draft' && (
                        <button
                          onClick={() => onDownloadEmailPDF(req)}
                          title="1-Click Download Sent Email PDF"
                          className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-all cursor-pointer active:scale-95"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Download Response PDF */}
                      {req.status === 'Responded' && (
                        <button
                          onClick={() => onDownloadResponsePDF(req)}
                          title="1-Click Download Employer Response PDF"
                          className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 transition-all cursor-pointer active:scale-95"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Send Reminder */}
                      {(req.status === 'Sent' || req.status === 'Opened') && (
                        <button
                          onClick={() => onSendReminder(req)}
                          title="Send Email Reminder to Verifier"
                          className="p-2 rounded-xl text-amber-600 hover:bg-amber-50 transition-all cursor-pointer active:scale-95"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Cancel / Delete Request */}
                      <button
                        onClick={() => onCancelRequest(req.id)}
                        title="Cancel / Delete Request"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer active:scale-95"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {sortedRequests.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-3 border-t border-white/10 text-xs">
          <div className="text-slate-300 font-semibold">
            Showing <span className="font-extrabold text-white">{startIndex + 1}</span> to{' '}
            <span className="font-extrabold text-white">
              {Math.min(startIndex + pageSize, sortedRequests.length)}
            </span>{' '}
            of <span className="font-extrabold text-white">{sortedRequests.length}</span> requests
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-7 h-7 rounded-xl font-black text-xs transition-all cursor-pointer ${
                    currentPage === pg
                      ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {pg}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1 active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { Send, Eye, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import type { BGVRequest } from '../types';

interface BGVActivityFeedProps {
  requests: BGVRequest[];
  onSelectRequest: (request: BGVRequest) => void;
}

export const BGVActivityFeed: React.FC<BGVActivityFeedProps> = ({
  requests,
  onSelectRequest,
}) => {
  const activities = requests.slice(0, 5).map((req) => {
    if (req.status === 'Responded') {
      return {
        id: `${req.id}-resp`,
        request: req,
        icon: CheckCircle2,
        iconColor: 'text-emerald-700 bg-emerald-500/15 border-emerald-400/40 shadow-xs shadow-emerald-500/20',
        title: `${req.candidateName} verified`,
        employer: req.previousEmployer,
        subtitle: `Employer: ${req.responseDetails?.rehireEligibility || 'Eligible'} for rehire`,
        time: req.respondedAt || 'Recently',
        badge: 'Responded',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      };
    }
    if (req.status === 'Opened') {
      return {
        id: `${req.id}-open`,
        request: req,
        icon: Eye,
        iconColor: 'text-amber-700 bg-amber-500/15 border-amber-400/40 shadow-xs shadow-amber-500/20',
        title: `Link opened for ${req.candidateName}`,
        employer: req.previousEmployer,
        subtitle: `Opened by verifier from ${req.previousEmployer}`,
        time: req.openedAt || '1h ago',
        badge: 'Opened',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
      };
    }
    if (req.status === 'Sent') {
      return {
        id: `${req.id}-sent`,
        request: req,
        icon: Send,
        iconColor: 'text-blue-700 bg-blue-500/15 border-blue-400/40 shadow-xs shadow-blue-500/20',
        title: `Dispatched to ${req.previousEmployer}`,
        employer: req.previousEmployer,
        subtitle: `Sent to ${req.previousEmail}`,
        time: req.sentAt || req.createdAt,
        badge: 'Sent',
        badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
      };
    }
    return {
      id: `${req.id}-draft`,
      request: req,
      icon: Clock,
      iconColor: 'text-slate-600 bg-slate-500/15 border-slate-300 shadow-xs',
      title: `Draft saved for ${req.candidateName}`,
      employer: req.previousEmployer,
      subtitle: `Target: ${req.previousEmployer}`,
      time: req.createdAt,
      badge: 'Draft',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="liquid-glass-card p-6 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-black text-white tracking-tight">
              Live Verification Stream
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <p className="text-xs font-semibold text-slate-300 mt-0.5">
            Audit feed of emails, link views & verifier submissions
          </p>
        </div>
      </div>

      <div className="divide-y divide-white/10 my-3">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onSelectRequest(item.request)}
              className="py-3 flex items-start gap-3 hover:bg-white/10 p-2.5 rounded-2xl transition-all cursor-pointer group"
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${item.iconColor}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs font-extrabold text-white truncate group-hover:text-sky-300 transition-colors">
                    {item.title}
                  </p>
                  <span className="text-[10px] font-mono font-bold text-slate-400 shrink-0">
                    {item.time}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-300 truncate mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
        <span className="flex items-center gap-1.5 font-semibold text-sky-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Click any event to open lifecycle timeline</span>
        </span>
      </div>
    </motion.div>
  );
};

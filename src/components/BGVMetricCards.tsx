import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Send, Clock, AlertTriangle } from 'lucide-react';
import type { BGVRequest, BGVStatus } from '../types';

interface BGVMetricCardsProps {
  requests: BGVRequest[];
  selectedStatus: 'All' | BGVStatus;
  onSelectStatus: (status: 'All' | BGVStatus) => void;
}

export const BGVMetricCards: React.FC<BGVMetricCardsProps> = ({
  requests,
  selectedStatus,
  onSelectStatus,
}) => {
  const total = requests.length;
  const draft = requests.filter((r) => r.status === 'Draft').length;
  const sent = requests.filter((r) => r.status === 'Sent').length;
  const expired = requests.filter((r) => r.status === 'Expired').length;

  const cards = [
    {
      id: 'All' as const,
      label: 'TOTAL REQUESTS',
      count: total,
      subtext: '100% Tracked',
      icon: FileText,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-500/10 border-blue-500/25',
      glow: 'from-blue-500/20 via-sky-500/10',
      accentTag: '+14% MoM',
      accentTagColor: 'text-blue-700 bg-blue-100/70 border-blue-200/80',
    },
    {
      id: 'Draft' as const,
      label: 'DRAFT',
      count: draft,
      subtext: 'Pending HR Dispatch',
      icon: Clock,
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-500/10 border-slate-400/25',
      glow: 'from-slate-400/20 via-slate-300/10',
      accentTag: 'Unsent',
      accentTagColor: 'text-slate-600 bg-slate-100 border-slate-200',
    },
    {
      id: 'Sent' as const,
      label: 'SENT',
      count: sent,
      subtext: 'Awaiting Employer Click',
      icon: Send,
      iconColor: 'text-sky-600',
      iconBg: 'bg-sky-500/10 border-sky-500/25',
      glow: 'from-sky-500/20 via-blue-500/10',
      accentTag: 'In Flight',
      accentTagColor: 'text-sky-700 bg-sky-100/70 border-sky-200/80',
    },
    {
      id: 'Expired' as const,
      label: 'EXPIRED',
      count: expired,
      subtext: 'SLA Overdue (>5 Days)',
      icon: AlertTriangle,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-500/10 border-rose-500/25',
      glow: 'from-rose-500/25 via-red-500/10',
      accentTag: 'Urgent',
      accentTagColor: 'text-rose-700 bg-rose-100/70 border-rose-200/80',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isSelected = selectedStatus === card.id;

        return (
          <motion.button
            key={card.id}
            onClick={() => onSelectStatus(card.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -3, transition: { duration: 0.18 } }}
            className={`liquid-glass-card p-4 text-left relative overflow-hidden transition-all cursor-pointer group ${
              isSelected
                ? 'ring-2 ring-blue-500/80 shadow-[0_16px_36px_rgba(37,99,235,0.18)] scale-[1.02]'
                : 'hover:scale-[1.01]'
            }`}
          >
            {/* Luminous Specular Light Refraction Orb */}
            <div
              className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${card.glow} to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
            />

            {/* Top row: Label & Icon */}
            <div className="flex items-center justify-between mb-3 relative z-10">
              <span className="text-[10px] font-black text-slate-300 tracking-wider">
                {card.label}
              </span>
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center border shadow-xs ${card.iconBg} ${card.iconColor}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Number Count with tabular digits */}
            <div className="flex items-baseline gap-2 relative z-10">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono drop-shadow-sm">
                {card.count}
              </span>
              <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-md border ${card.accentTagColor}`}>
                {card.accentTag}
              </span>
            </div>

            {/* Subtext description */}
            <p className="text-[10.5px] font-semibold text-slate-300 mt-1.5 truncate relative z-10">
              {card.subtext}
            </p>

            {/* Specular bottom accent line */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-transparent via-blue-500 to-transparent ${
                isSelected ? 'opacity-100' : ''
              }`}
            />
          </motion.button>
        );
      })}
    </div>
  );
};

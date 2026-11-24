import React from 'react';
import { motion } from 'framer-motion';

export const EmployeesByGradeChart: React.FC = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Heights for 3 stacked segments for each month
  const barData = [
    { bot: 20, mid: 30, top: 22 }, // Jan
    { bot: 35, mid: 45, top: 26 }, // Feb
    { bot: 22, mid: 38, top: 20 }, // Mar
    { bot: 25, mid: 40, top: 24 }, // Apr
    { bot: 30, mid: 48, top: 25 }, // May
    { bot: 40, mid: 52, top: 28 }, // Jun
    { bot: 36, mid: 44, top: 24 }, // Jul
    { bot: 32, mid: 40, top: 22 }, // Aug
    { bot: 42, mid: 50, top: 28 }, // Sep
    { bot: 45, mid: 54, top: 30 }, // Oct
    { bot: 34, mid: 42, top: 26 }, // Nov
    { bot: 30, mid: 38, top: 24 }, // Dec
  ];

  const gradeBreakdown = [
    { label: 'Junior', count: 33, pct: '6%', color: '#38bdf8' },
    { label: 'Middle', count: 367, pct: '63%', color: '#2563eb' },
    { label: 'Senior', count: 22, pct: '4%', color: '#1d4ed8' },
    { label: 'Lead', count: 72, pct: '12%', color: '#0f224a' },
    { label: 'Head', count: 62, pct: '11%', color: '#60a5fa' },
  ];

  // Donut SVG circumference calculation
  // Radius = 54, circumference = 2 * PI * 54 = 339.29
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  // Segments for donut chart
  // Middle: 63%, Lead: 12%, Head: 11%, Junior: 6%, Senior: 4%
  const segments = [
    { pct: 0.63, color: '#2563eb' },
    { pct: 0.12, color: '#0f224a' },
    { pct: 0.11, color: '#60a5fa' },
    { pct: 0.06, color: '#38bdf8' },
    { pct: 0.04, color: '#1d4ed8' },
  ];

  let currentOffset = 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="liquid-glass-card p-6 flex flex-col justify-between"
    >
      <div>
        <h3 className="text-base font-semibold text-slate-900 tracking-tight mb-6">
          Employees by Grade
        </h3>

        {/* 12-Month Stacked Column Bar Chart */}
        <div className="h-40 flex items-end justify-between gap-1.5 px-2 pb-2">
          {months.map((month, idx) => {
            const data = barData[idx];
            return (
              <div key={month} className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full max-w-[22px] flex flex-col justify-end h-full">
                  {/* Top segment */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${data.top}%` }}
                    transition={{ duration: 0.8, delay: 0.05 * idx, ease: 'easeOut' }}
                    className="w-full bg-[#38bdf8] rounded-t-md opacity-95 group-hover:brightness-110 transition-all"
                  />
                  {/* Middle segment */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${data.mid}%` }}
                    transition={{ duration: 0.8, delay: 0.05 * idx + 0.1, ease: 'easeOut' }}
                    className="w-full bg-[#2563eb] opacity-90 group-hover:brightness-110 transition-all"
                  />
                  {/* Bottom segment */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${data.bot}%` }}
                    transition={{ duration: 0.8, delay: 0.05 * idx + 0.2, ease: 'easeOut' }}
                    className="w-full bg-[#0f224a] rounded-b-xs opacity-95 group-hover:brightness-110 transition-all"
                  />
                </div>
                <span className="text-[11px] font-medium text-slate-500 mt-2">
                  {month}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Donut Chart & Legend Section */}
      <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-around gap-6">
        {/* Animated SVG Donut Chart */}
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
            {segments.map((seg, i) => {
              const strokeDasharray = `${seg.pct * circumference} ${circumference}`;
              const strokeDashoffset = -currentOffset;
              currentOffset += seg.pct * circumference;

              return (
                <circle
                  key={i}
                  cx="70"
                  cy="70"
                  r={radius}
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="18"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-700 ease-out hover:opacity-90 cursor-pointer"
                />
              );
            })}
          </svg>
          <div className="absolute text-center pointer-events-none">
            <span className="text-xl font-bold text-slate-900 block leading-tight">556</span>
            <span className="text-[11px] font-medium text-slate-500 block">employees</span>
          </div>
        </div>

        {/* Legend Breakdown */}
        <div className="space-y-2.5 min-w-[190px]">
          {gradeBreakdown.map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-slate-700 font-medium">{item.label}:</span>
              <span className="text-slate-900 font-semibold">{item.count}</span>
              <span className="text-slate-500">({item.pct})</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

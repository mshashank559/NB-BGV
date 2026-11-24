import React from 'react';
import { motion } from 'framer-motion';

export const EmployeesByProjectsChart: React.FC = () => {
  const projects = [
    { name: 'Akma', begin: 275, end: 320 },
    { name: 'Doto', begin: 215, end: 275 },
    { name: 'HR Dev', begin: 135, end: 175 },
    { name: 'Admin', begin: 115, end: 190 },
  ];

  const maxVal = 350;
  const yAxisTicks = [350, 300, 250, 200, 150, 100, 50, 0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="liquid-glass-card p-6 flex flex-col justify-between"
    >
      <div>
        <h3 className="text-base font-semibold text-slate-900 tracking-tight mb-6">
          Employees by Projects
        </h3>

        {/* Chart area with gridlines */}
        <div className="relative h-64 flex items-end">
          {/* Horizontal gridlines and Y-axis numbers */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {yAxisTicks.map((val) => (
              <div key={val} className="flex items-center w-full">
                <span className="text-[11px] font-medium text-slate-400 w-8 text-right pr-2">
                  {val}
                </span>
                <div className="flex-1 border-b border-slate-200/50" />
              </div>
            ))}
          </div>

          {/* Grouped Comparison Bars */}
          <div className="relative z-10 w-full pl-10 pr-4 flex items-end justify-around h-full pb-1">
            {projects.map((proj, idx) => (
              <div key={proj.name} className="flex flex-col items-center group">
                <div className="flex items-end gap-2.5 h-52">
                  {/* Beginning of Year Bar */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(proj.begin / maxVal) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.1 * idx, ease: 'easeOut' }}
                      className="w-6 sm:w-8 bg-[#0f224a] rounded-t-xl group-hover:brightness-110 transition-all shadow-sm"
                      title={`${proj.name} (Beginning): ${proj.begin}`}
                    />
                  </div>

                  {/* End of Year Bar */}
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(proj.end / maxVal) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.1 * idx + 0.1, ease: 'easeOut' }}
                      className="w-6 sm:w-8 bg-[#0284c7] rounded-t-xl group-hover:brightness-110 transition-all shadow-sm"
                      title={`${proj.name} (End): ${proj.end}`}
                    />
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-700 mt-3">
                  {proj.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Legend */}
      <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0f224a]" />
          <span className="text-xs font-medium text-slate-600">Beginning of the year</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
          <span className="text-xs font-medium text-slate-600">End of the year</span>
        </div>
      </div>
    </motion.div>
  );
};

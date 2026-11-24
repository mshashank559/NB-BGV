import React from 'react';
import { Calendar, Plus, Download } from 'lucide-react';

interface TopHeaderProps {
  onOpenAddModal: () => void;
  onExportReport: () => void;
  selectedRange: string;
  setSelectedRange: (range: string) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenAddModal,
  onExportReport,
  selectedRange,
  setSelectedRange,
}) => {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Date Filter Pill Button */}
        <div className="relative">
          <button
            onClick={() => setSelectedRange(selectedRange === 'Last year' ? 'This month' : 'Last year')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl liquid-glass text-slate-700 text-sm font-medium hover:bg-white transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{selectedRange}</span>
          </button>
        </div>

        {/* Primary Plus Button (Add Verification Request) */}
        <button
          onClick={onOpenAddModal}
          title="Add New Verification Request"
          className="w-11 h-11 rounded-2xl liquid-glass hover:bg-white text-slate-800 flex items-center justify-center transition-all shadow-sm active:scale-95 group cursor-pointer"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-700" />
        </button>

        {/* Download Action Button */}
        <button
          onClick={onExportReport}
          title="Export Verification Summary"
          className="w-11 h-11 rounded-2xl liquid-glass hover:bg-white text-slate-800 flex items-center justify-center transition-all shadow-sm active:scale-95 group cursor-pointer"
        >
          <Download className="w-5 h-5 group-hover:scale-110 transition-transform text-slate-700" />
        </button>
      </div>
    </header>
  );
};

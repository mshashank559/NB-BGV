import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MetricProps {
  label: string;
  targetValue: number;
  percentage: string;
  isPositive: boolean;
  delay: number;
}

const MetricCardItem: React.FC<MetricProps> = ({
  label,
  targetValue,
  percentage,
  isPositive,
  delay,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = targetValue / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetValue) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="liquid-glass-card p-6 flex flex-col justify-between relative overflow-hidden group"
    >
      {/* Soft Ambient Corner Light Refraction */}
      <div className="absolute top-0 right-0 w-28 h-28 bg-gradient-to-br from-blue-400/10 via-indigo-300/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      <div>
        <p className="text-sm font-medium text-slate-600 tracking-wide">{label}</p>
      </div>

      <div className="flex items-baseline justify-between mt-4">
        <span className="text-4xl font-bold tracking-tight text-slate-900">
          {count}
        </span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositive
              ? 'text-emerald-600 bg-emerald-50/80'
              : 'text-rose-600 bg-rose-50/80'
          }`}
        >
          {percentage}
        </span>
      </div>
    </motion.div>
  );
};

export const MetricCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      <MetricCardItem
        label="Total Employees"
        targetValue={556}
        percentage="+6.4%"
        isPositive={true}
        delay={0.05}
      />
      <MetricCardItem
        label="New Employees"
        targetValue={110}
        percentage="+2%"
        isPositive={true}
        delay={0.1}
      />
      <MetricCardItem
        label="Resigned Employees"
        targetValue={90}
        percentage="-4.8%"
        isPositive={false}
        delay={0.15}
      />
      <MetricCardItem
        label="Vacancies"
        targetValue={114}
        percentage="+1%"
        isPositive={true}
        delay={0.2}
      />
    </div>
  );
};

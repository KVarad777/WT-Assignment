import React from 'react';
import { Clock, Calendar } from 'lucide-react';

export default function DigitalClock({ time, is24Hour, onToggleFormat }) {
  const pad = (num) => String(num).padStart(2, '0');

  let hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  if (!is24Hour) {
    hours = hours % 12 || 12;
  }

  const dateFormatted = time.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="h-full flex flex-col justify-between p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Clock className="w-4 h-4" /> Primary Display
        </div>
        <button
          onClick={onToggleFormat}
          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-mono text-xs font-semibold border border-slate-300 dark:border-slate-700 transition"
        >
          {is24Hour ? '12-Hour Mode' : '24-Hour Mode'}
        </button>
      </div>

      {/* Hero Display Digits */}
      <div className="my-6 text-center sm:text-left">
        <div className="flex items-baseline justify-center sm:justify-start gap-2 font-mono">
          <span className="text-6xl sm:text-7xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {pad(hours)}:{pad(minutes)}
          </span>
          <div className="flex flex-col items-start">
            <span className="text-2xl sm:text-3xl font-bold text-teal-600 dark:text-teal-400">
              :{pad(seconds)}
            </span>
            {!is24Hour && (
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mt-1">
                {ampm}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Date Readout */}
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium pt-4 border-t border-slate-200 dark:border-slate-800">
        <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <span>{dateFormatted}</span>
      </div>
    </div>
  );
}
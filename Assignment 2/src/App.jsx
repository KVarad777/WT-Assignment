import React, { useState, useEffect } from 'react';
import DigitalClock from './components/DigitalClock';
import AnalogClock from './components/AnalogClock';
import WorldClock from './components/WorldClock';
import AlarmSystem from './components/AlarmSystem';
import { Sun, Moon, ShieldCheck } from 'lucide-react';

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [is24HourFormat, setIs24HourFormat] = useState(false);
  const [theme, setTheme] = useState('dark');

  // Keep main application clock ticking every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update root element class so entire document switches background seamlessly
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 font-sans p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Navigation / Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-600 text-white shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-widest uppercase">
                  ChronoSync
                </h1>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Global time dashboard with alarms and world clocks
                </p>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400 font-semibold border border-teal-500/20">
                  SYSTEM v3.2
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Precision Synchronized Time Operations
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-mono text-xs font-bold transition"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </header>

        {/* Top Hero Grid: Large Digital Readout + Analog Dial */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DigitalClock
              time={currentTime}
              is24Hour={is24HourFormat}
              onToggleFormat={() => setIs24HourFormat(!is24HourFormat)}
            />
          </div>
          <div>
            <AnalogClock time={currentTime} label="Local Terminal" />
          </div>
        </div>

        {/* Lower Grid: Custom World Clock + Alarm Manager */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WorldClock time={currentTime} />
          </div>
          <div>
            <AlarmSystem currentTime={currentTime} />
          </div>
        </div>

      </div>
    </div>
  );
}
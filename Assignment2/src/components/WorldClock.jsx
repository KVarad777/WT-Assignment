import React, { useState } from 'react';
import { Globe, Plus, Trash2 } from 'lucide-react';

export default function WorldClock({ time }) {
  const [locations, setLocations] = useState([
    { id: 1, cityName: 'New York', code: 'NYC', timezone: 'America/New_York' },
    { id: 2, cityName: 'London', code: 'LON', timezone: 'Europe/London' },
    { id: 3, cityName: 'Tokyo', code: 'TYO', timezone: 'Asia/Tokyo' },
  ]);

  const [cityName, setCityName] = useState('');
  const [code, setCode] = useState('');
  const [timezone, setTimezone] = useState('');

  const handleAddLocation = (e) => {
    e.preventDefault();
    if (!cityName.trim() || !code.trim() || !timezone.trim()) return;

    const newLoc = {
      id: Date.now(),
      cityName: cityName.trim(),
      code: code.trim().toUpperCase(),
      timezone: timezone.trim(),
    };

    setLocations([...locations, newLoc]);
    setCityName('');
    setCode('');
    setTimezone('');
  };

  const handleRemove = (id) => {
    setLocations(locations.filter((loc) => loc.id !== id));
  };

  const getFormattedTime = (tz) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(time);
    } catch (err) {
      return 'Invalid TZ';
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        <h3 className="text-sm font-mono font-bold text-slate-800 dark:text-slate-200 uppercase">
          World Clock Stations
        </h3>
      </div>

      {/* Custom Zone Creator Form */}
      <form onSubmit={handleAddLocation} className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-6">
        <input
          type="text"
          placeholder="City Name (e.g. Mumbai)"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
          className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-teal-500"
        />
        <input
          type="text"
          placeholder="Code (e.g. BOM)"
          maxLength={4}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono uppercase focus:outline-none focus:border-teal-500"
        />
        <input
          type="text"
          placeholder="Timezone (e.g. Asia/Kolkata)"
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono focus:outline-none focus:border-teal-500"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-1 bg-teal-600 hover:bg-teal-700 text-white font-mono text-xs font-bold p-2 rounded-xl transition"
        >
          <Plus className="w-4 h-4" /> Add Station
        </button>
      </form>

      {/* Custom Timezones Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800"
          >
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 font-mono text-xs font-bold text-slate-700 dark:text-slate-200">
                {loc.code}
              </span>
              <div>
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  {loc.cityName}
                </p>
                <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {loc.timezone}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-bold text-teal-600 dark:text-teal-400">
                {getFormattedTime(loc.timezone)}
              </span>
              <button
                onClick={() => handleRemove(loc.id)}
                className="text-slate-400 hover:text-red-500 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}